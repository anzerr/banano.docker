#!/usr/bin/env node

const {Cli, Map} = require('cli.util'),
	Node = require('./node.js');

const builds = {
	'banano:nightly': [null, 'nightly'],
	'banano:18': ['4c370527441282bb5945fb3c83ca19a660b9f209', '18'],
	'banano:15.2': ['4909c463374733962b1ee557fc0b9dc651cb79d9', '15.2']
};

let cli = new Cli(process.argv, [
	new Map('name')
		.alias(['n', 'N']).arg()
], 1);

if (!cli.get('name')) {
	let wait = [];
	for (let i in builds) {
		((v) => {
			let a = new Node(v[0], v[1], false);
			wait.push(a.toFile());
		})(builds[i]);
	}
	Promise.all(wait).then(() => console.log('done'));
} else {
	let v = builds[cli.get('name') || ''];
	if (v) {
		new Node(v[0], v[1], true).run().then(() => {
			console.log('Server started');
		});
	} else {
		throw new Error('not a valid name given');
	}
}
