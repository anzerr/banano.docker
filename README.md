
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
or in a Dockerfile images can be found on [hub.docker.com](https://hub.docker.com/r/anzerr/banano)
``` Dockerfile
FROM anzerr/banano:18
...
```
To run a node
``` bash
 # in memory test
docker run --name node --tmpfs /root:rw -p 7072:7072 -e "BAN_NETWORK=live" anzerr/banano:20-daemon

# run node
docker run -d -p 54000:54000/udp -p 54000:54000 -p [::1]:55000:55000 -p 7072:7072 -v ~:/root -e "BAN_NETWORK=live" --name node --restart=unless-stopped anzerr/banano:20-daemon
```

#### `Build`
``` bash
# clone project
git clone --recurse-submodules -j8 git://github.com/anzerr/banano.docker.git
git submodule update --init --recursive

npm run update # update docker images
node bin/index.js --name banano:nightly # run the build for an image
```

#### `Versions`
| Version        					| Description 									|
| ------------- 					| -----------------								|
| anzerr/banano:nightly      		| node binary on built from the latest commit 	|
| anzerr/banano:18      			| node binary on built from tag "v18.0" 		|
| anzerr/banano:nightly-daemon    	| nightly binary started as a daemon 			|
| anzerr/banano:18-daemon      		| v18.0 binary started as a daemon 				|
