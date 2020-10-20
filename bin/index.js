#!/usr/bin/env node

const {Cli, Map} = require('cli.util'),
	Node = require('./images/node.js'),
	Daemon = require('./images/daemon.js');

const builds = {
	'banano:nightly': [null, 'nightly', Node],
	'banano:nightly-daemon': [null, 'nightly', Daemon],
	'banano:18': ['4c370527441282bb5945fb3c83ca19a660b9f209', '18', Node],
	'banano:18-daemon': [null, '18', Daemon],
	'banano:20': ['67006cbffa1434da027db2daaf6e38a32006d3e2', '20', Node],
	'banano:20-daemon': [null, '20', Daemon]
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
			let a = new v[2](v[0], v[1], false);
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
