#!/usr/bin/env node

const {Cli, Map} = require('cli.util'),
	Node = require('./images/node.js'),
	Daemon = require('./images/daemon.js');

const BOOST = {
	VERSION_69: {
		BOOST_BASENAME: 'boost_1_69_0',
		BOOST_ARCHIVE: 'boost_1_69_0.tar.bz2',
		BOOST_URL: 'https://github.com/anzerr/boost.libary/blob/master/boost_1_69_0.tar.bz2?raw=true',
		BOOST_ARCHIVE_SHA256: '8f32d4617390d1c2d16f26a27ab60d97807b35440d45891fa340fc2648b04406',
		BOOST_LIB: 'thread,log,filesystem,program_options'
	},
	VERSION_70: {
		BOOST_BASENAME: 'boost_1_70_0',
		BOOST_ARCHIVE: 'boost_1_70_0.tar.bz2',
		BOOST_URL: 'https://github.com/anzerr/boost.libary/blob/master/boost_1_70_0.tar.bz2?raw=true',
		BOOST_ARCHIVE_SHA256: '430ae8354789de4fd19ee52f3b1f739e1fba576f0aded0897c3c2bc00fb38778',
		BOOST_LIB: 'filesystem,log,program_options,system,thread'
	},
	VERSION_70_22: {
		BOOST_BASENAME: 'boost_1_70_0',
		BOOST_ARCHIVE: 'boost_1_70_0.tar.bz2',
		BOOST_URL: 'https://github.com/anzerr/boost.libary/blob/master/boost_1_70_0.tar.bz2?raw=true',
		BOOST_ARCHIVE_SHA256: '430ae8354789de4fd19ee52f3b1f739e1fba576f0aded0897c3c2bc00fb38778',
		BOOST_LIB: 'filesystem,log,program_options,system,thread',
		cmake: [
			'cmake /tmp/src -DCI_BUILD=OFF -DACTIVE_NETWORK=nano_live_network',
			'-DNANO_ROCKSDB=ON -DNANO_POW_SERVER=ON -DROCKSDB_LIBRARIES=/usr/local/rocksdb/lib/librocksdb.a',
			'-DROCKSDB_INCLUDE_DIRS=/usr/local/rocksdb/include &&',
			'make bananode -j$(nproc) &&',
			'make banano_rpc -j$(nproc) &&',
			'make nano_pow_server -j$(nproc)'
		].join(' ').trim()
	}
}

const builds = {
	'banano:nightly': [null, 'nightly', Node],
	'banano:nightly-daemon': [null, 'nightly', Daemon],
	'banano:18': ['4c370527441282bb5945fb3c83ca19a660b9f209', '18', Node, BOOST.VERSION_69],
	'banano:18-daemon': [null, '18', Daemon],
	'banano:20': ['67006cbffa1434da027db2daaf6e38a32006d3e2', '20', Node, BOOST.VERSION_70],
	'banano:20-daemon': [null, '20', Daemon],
	'banano:22': ['ad1f47eba648cef463210aaed9f762b763ba7795', '22', Node, BOOST.VERSION_70_22],
	'banano:22-daemon': [null, '22', Daemon]
};

let cli = new Cli(process.argv, [
	new Map('name')
		.alias(['n', 'N']).arg()
], 1);

if (!cli.get('name')) {
	let wait = [];
	for (let i in builds) {
		((k, v) => {
			console.log('update', k, v);
			let a = new v[2](v[0], v[1], false, v[3] || {});
			wait.push(a.toFile());
		})(i, builds[i]);
	}
	Promise.all(wait).then(() => console.log('done'));
} else {
	let v = builds[cli.get('name') || ''];
	if (v) {
		new v[2](v[0], v[1], true).run().then(() => {
			console.log('Server started');
		});
	} else {
		throw new Error('not a valid name given');
	}
}
