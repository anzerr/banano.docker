FROM anzerr/banano:22
RUN mkdir -p /root/BananoData/log && mkdir -p /node/config
COPY ./docker/22/daemon/entry.sh /node/
COPY ./docker/22/daemon/config /node/config
RUN chmod +x /node/entry.sh
ENTRYPOINT ["sh", "/node/entry.sh"]