FROM alpine:3.9
ENV BOOST_ROOT=/tmp/boost_install
ENV REPO=https://github.com/BananoCoin/banano.git
ENV NETWORK=live
ENV BOOST_BASENAME=boost_1_70_0
ENV BOOST_ARCHIVE=boost_1_70_0.tar.bz2
ENV BOOST_URL=https://github.com/anzerr/boost.libary/blob/master/boost_1_70_0.tar.bz2?raw=true
ENV BOOST_ARCHIVE_SHA256=430ae8354789de4fd19ee52f3b1f739e1fba576f0aded0897c3c2bc00fb38778
ENV BOOST_LIB=filesystem,log,program_options,system,thread
RUN apk update && \
	apk upgrade && \
	apk --update add --no-cache --virtual .source-tools git cmake ninja alpine-sdk linux-headers binutils openssl openssl-dev boost-dev curl-dev
RUN wget --quiet -O "${BOOST_ARCHIVE}.new" "${BOOST_URL}" && \
	echo "${BOOST_ARCHIVE_SHA256}  ${BOOST_ARCHIVE}.new" | sha256sum -c && \
	mv "${BOOST_ARCHIVE}.new" "${BOOST_ARCHIVE}" && \
	rm -rf "${BOOST_BASENAME}" && \
	tar xf "${BOOST_ARCHIVE}" && \
	cd "${BOOST_BASENAME}" && \
	./bootstrap.sh --show-libraries && \
	./bootstrap.sh --with-libraries=filesystem,log,program_options,system,thread && \
	./b2 -d1 --prefix="${BOOST_ROOT}" link=static install && \
	echo "boost build done"
RUN git clone --recurse-submodules -j8 https://github.com/BananoCoin/banano.git /tmp/src && cd /tmp/src && git reset --hard 67006cbffa1434da027db2daaf6e38a32006d3e2 && \
	mkdir -p /tmp/build && \
	cd /tmp/build && \
	cmake /tmp/src -DBOOST_ROOT=/tmp/boost_install -DBOOST_LIBRARYDIR=undefined -DACTIVE_NETWORK=nano_live_network && \
	echo "cmake DONE" && \
	make bananode && \
	strip /tmp/build/bananode

FROM alpine:3.9
COPY --from=0 /tmp/build/bananode /usr/bin
ENTRYPOINT ["bananode"]