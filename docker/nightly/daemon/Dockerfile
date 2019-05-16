FROM anzerr/banano:nightly
RUN mkdir -p /root/BananoData/log && mkdir -p /node/config
COPY ./docker/nightly/daemon/entry.sh /node/
COPY ./docker/nightly/daemon/config /node/config
RUN chmod +x /node/entry.sh
ENTRYPOINT ["sh", "/node/entry.sh"]