FROM node

RUN mkdir /home/ogriner && \
    git clone

RUN cd /home/ogriner && \
    npm i

WORKDIR /home/ogriner

ENTRYPOINT ["npm","run","start"]