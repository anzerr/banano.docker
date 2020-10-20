FROM anzerr/banano:20
RUN mkdir -p /root/BananoData/log && mkdir -p /node/config
COPY ./docker/20/daemon/entry.sh /node/
COPY ./docker/20/daemon/config /node/config
RUN chmod +x /node/entry.sh
ENTRYPOINT ["sh", "/node/entry.sh"]