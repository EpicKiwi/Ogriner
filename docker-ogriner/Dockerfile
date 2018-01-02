FROM node

RUN mkdir /home/ogriner

COPY "phantomjs" "/usr/bin/phantomjs"

VOLUME /home/ogriner

WORKDIR /home/ogriner

ENTRYPOINT ["npm","run","start"]