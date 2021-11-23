
const util = require('dockerfile.util');

const ENUM = {BUILD: 0, FINAL: 1};

class Node extends require('../base.js') {

	constructor(hash, version, build, env) {
		super();
		this.dockerfile.push(new util.Dockerfile());
		this.version = version;
		if (!build) {
			this.path = `docker/${this.version}`;
		} else {
			this.dockerName = 'Buildfile';
		}
		this.hash = hash;
		this.env = {
			BOOST_ROOT: '/tmp/boost_install',
			REPO: 'https://github.com/BananoCoin/banano.git',
			NETWORK: 'live',
			BOOST_BASENAME: 'boost_1_69_0',
			BOOST_ARCHIVE: 'boost_1_69_0.tar.bz2',
			// BOOST_URL: 'https://downloads.sourceforge.net/project/boost/boost/1.69.0/boost_1_69_0.tar.bz2',
			BOOST_URL: 'https://github.com/anzerr/boost.libary/blob/master/boost_1_69_0.tar.bz2?raw=true',
			BOOST_ARCHIVE_SHA256: '8f32d4617390d1c2d16f26a27ab60d97807b35440d45891fa340fc2648b04406',
			BOOST_LIB: 'thread,log,filesystem,program_options'
		};
		for (const i in this.env) {
			if (env[i]) {
				this.env[i] = env[i];
			}
		}
		console.log(this.version, this.env);
	}

	build() {
		return super.build().then(() => {
			this.dockerfile[ENUM.BUILD]
				.from('alpine:3.11.6')
				.env(this.env);
			if (!this.hash) {
				this.dockerfile[ENUM.BUILD].copy('./banano /tmp/src');
			}
			this.dockerfile[ENUM.BUILD].run([ // get dep
				'apk update',
				'apk upgrade',
				'apk --update add --no-cache --virtual .source-tools ' + [
					'git', 'cmake', 'ninja', 'alpine-sdk',
					'linux-headers', 'binutils', 'openssl', 'openssl-dev', 'boost-dev', 'curl-dev'
				].join(' '),
			]).run([ // build boost
				'wget --quiet -O "${BOOST_ARCHIVE}.new" "${BOOST_URL}"',
				'echo "${BOOST_ARCHIVE_SHA256}  ${BOOST_ARCHIVE}.new" | sha256sum -c',
				'mv "${BOOST_ARCHIVE}.new" "${BOOST_ARCHIVE}"',
				'rm -rf "${BOOST_BASENAME}"',
				'tar xf "${BOOST_ARCHIVE}"',

				'cd "${BOOST_BASENAME}"',
				'./bootstrap.sh --show-libraries',
				`./bootstrap.sh --with-libraries=${this.env.BOOST_LIB}`,
				'./b2 -d1 --prefix="${BOOST_ROOT}" link=static install',
				'echo "boost build done"',
			]).run([ // build node
				(this.hash) ? [
					`git clone --recurse-submodules -j8 ${this.env.REPO} /tmp/src`,
					'cd /tmp/src',
					`git reset --hard ${this.hash}`
				].join(' && ') : '',
				'mkdir -p /tmp/build',
				'cd /tmp/build',
				this.env.cmake ? this.env.cmake : `cmake /tmp/src -DBOOST_ROOT=${this.env.BOOST_ROOT} -DBOOST_LIBRARYDIR=${this.env.BOOST_LIBRARYDIR} -DACTIVE_NETWORK=nano_${this.env.NETWORK}_network`,
				'echo "cmake DONE"',
				'make bananode',
				'strip /tmp/build/bananode'
			]);
			this.dockerfile[ENUM.FINAL]
				.from('alpine:3.9')
				.copy('--from=0 /tmp/build/bananode /usr/bin')
				.entrypoint('["bananode"]');
		});
	}

}

module.exports = Node;
