
const util = require('dockerfile.util'),
	mkdir = require('fs.mkdirp'),
	path = require('path'),
	fs = require('fs.promisify');

const ENUM = {BUILD: 0, FINAL: 1};

class Node extends util.Build {

	constructor(hash, version, build) {
		super();
		this.dockerfile.push(new util.Dockerfile());
		this.author = 'anzerr';
		this.version = version;
		if (!build) {
			this.path = `docker/${this.version}`;
		} else {
			this.dockerName = 'Buildfile';
		}
		this.hash = hash;
		this.cache = true;
		this.env = {
			BOOST_ROOT: '/tmp/boost_install',
			NETWORK: 'live',
			REPO: 'https://github.com/BananoCoin/banano.git',
			BOOST_BASENAME: 'boost_1_69_0',
			BOOST_ARCHIVE: 'boost_1_69_0.tar.bz2',
			BOOST_URL: 'https://downloads.sourceforge.net/project/boost/boost/1.69.0/boost_1_69_0.tar.bz2',
			BOOST_ARCHIVE_SHA256: '8f32d4617390d1c2d16f26a27ab60d97807b35440d45891fa340fc2648b04406'
		};
	}

	build() {
		return super.build().then(() => {
			this.dockerfile[ENUM.BUILD]
				.from('alpine:3.9')
				.env(this.env);
			if (!this.hash) {
				this.dockerfile[ENUM.BUILD].copy('./banano /tmp/src');
			}
			this.dockerfile[ENUM.BUILD].run([ // get dep
				'apk update',
				'apk upgrade',
				'apk --update add --no-cache --virtual .source-tools ' + [
					'git', 'cmake', 'ninja', 'alpine-sdk',
					'linux-headers', 'binutils',
					'bash', 'apache2', 'apache2-ssl', 'alpine-sdk', 'openssl', 'openssl-dev', 'boost-dev', 'curl-dev'
				].join(' '),
			]).run([ // build boost
				'wget --quiet -O "${BOOST_ARCHIVE}.new" "${BOOST_URL}"',
				'echo "${BOOST_ARCHIVE_SHA256}  ${BOOST_ARCHIVE}.new" | sha256sum -c',
				'mv "${BOOST_ARCHIVE}.new" "${BOOST_ARCHIVE}"',
				'rm -rf "${BOOST_BASENAME}"',
				'tar xf "${BOOST_ARCHIVE}"',

				'cd "${BOOST_BASENAME}"',
				'./bootstrap.sh --show-libraries',
				'./bootstrap.sh --with-libraries=thread,log,filesystem,program_options',
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
				`cmake /tmp/src -DBOOST_ROOT=${this.env.BOOST_ROOT} -DBOOST_LIBRARYDIR=${this.env.BOOST_LIBRARYDIR} -DACTIVE_NETWORK=nano_${this.env.NETWORK}_network`,
				'echo "cmake DONE"',
				'make bananode',
				'cd ..',
				'echo ${NETWORK} > /etc/nano-network',
				'strip /tmp/build/bananode'
			]);
			this.dockerfile[ENUM.FINAL]
				.from('alpine:3.9')
				.copy('--from=0 /tmp/build/bananode /usr/bin')
				.copy('--from=0 /etc/nano-network /etc')
				.cmd('["bananode"]');
		});
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

module.exports = Node;
