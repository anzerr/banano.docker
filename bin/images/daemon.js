
class Daemon extends require('../base.js') {

	constructor(hash, version, build) {
		super();
		this.from = version;
		this.version = `${version}-daemon`;
		if (!build) {
			this.path = `docker/${this.from}/daemon`;
		} else {
			this.dockerName = 'Buildfile';
		}
	}

	build() {
		return super.build().then(() => {
			this.dockerfile[0]
				.from(`anzerr/banano:${this.from}`)
				.run('mkdir -p /root/BananoData/log && mkdir -p /node/config')
				.copy(`./docker/${this.from}/daemon/entry.sh /node/`)
				.copy(`./docker/${this.from}/daemon/config /node/config`)
				.run('chmod +x /node/entry.sh')
				.entrypoint('["sh", "/node/entry.sh"]');
		});
	}


}

module.exports = Daemon;
