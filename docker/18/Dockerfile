FROM alpine:3.9
ENV BOOST_ROOT=/tmp/boost_install
ENV REPO=https://github.com/BananoCoin/banano.git
ENV BOOST_BASENAME=boost_1_69_0
ENV BOOST_ARCHIVE=boost_1_69_0.tar.bz2
ENV BOOST_URL=https://github.com/anzerr/boost.libary/blob/master/boost_1_69_0.tar.bz2?raw=true
ENV BOOST_ARCHIVE_SHA256=8f32d4617390d1c2d16f26a27ab60d97807b35440d45891fa340fc2648b04406
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
	./bootstrap.sh --with-libraries=thread,log,filesystem,program_options && \
	./b2 -d1 --prefix="${BOOST_ROOT}" link=static install && \
	echo "boost build done"
RUN git clone --recurse-submodules -j8 https://github.com/BananoCoin/banano.git /tmp/src && cd /tmp/src && git reset --hard 4c370527441282bb5945fb3c83ca19a660b9f209 && \
	mkdir -p /tmp/build && \
	cd /tmp/build && \
	cmake /tmp/src -DBOOST_ROOT=/tmp/boost_install -DBOOST_LIBRARYDIR=undefined -DACTIVE_NETWORK=nano_undefined_network && \
	echo "cmake DONE" && \
	make bananode && \
	strip /tmp/build/bananode

FROM alpine:3.9
COPY --from=0 /tmp/build/bananode /usr/bin
ENTRYPOINT ["bananode"]