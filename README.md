
[logo]: https://banano.cc/assets/bananologo.svg "BANANO"
![alt text][logo]

### `Intro`
These are Docker images for the Banano node optimised to be as small as possible. The image is 5mb having only the Banano binary on an alpine base.

#### `Usage`
This Can be use as a ci or the base image/layer to build larger project
``` bash
docker pull anzerr/banano:18
docker run --rm anzerr/banano:18 --version
#  Version 18.0
```
or in a Dockerfile
``` Dockerfile
FROM anzerr/banano:18
...
```

#### `Build`
``` bash
# clone project
git clone --recurse-submodules -j8 git://github.com/anzerr/banano.docker.git
git submodule update --init --recursive

npm run update # update docker images
node bin/index.js --name banano:nightly # run the build for an image
```
