
const util = require('dockerfile.util'),
	mkdir = require('fs.mkdirp'),
	path = require('path'),
	fs = require('fs.promisify');

class Base extends util.Build {

	constructor() {
		super();
		this.author = 'anzerr';
		this.cache = true;
	}

	package() {
		return fs.readFile(path.join(__dirname, '../package.json')).then((res) => {
			return JSON.parse(res.toString());
		});
	}

	toFile() {
		return mkdir(this.path).then(() => {
			return super.toFile();
		});
	}

}

module.exports = Base;
