
### `Intro`
These are docker images for the Banano node pushed to be as small as possible. The image is 5mb having only the Banano binary on alpine.

#### `Install`
``` bash
git clone --recurse-submodules -j8 git://github.com/anzerr/banano.docker.git
git submodule update --init --recursive

npm run update
node bin/index.js --name banano:nightly
```

### `Example`
Can be use as a ci or the base image/layer to build larger project
``` javascript
docker run --rm anzerr/banano:nightly --version
// Version 18.0
```