FROM anzerr/banano:18
RUN mkdir -p /root/BananoData/log && mkdir -p /node/config
COPY ./docker/18/daemon/entry.sh /node/
COPY ./docker/18/daemon/config /node/config
RUN chmod +x /node/entry.sh
ENTRYPOINT ["sh", "/node/entry.sh"]