FROM node

RUN cd /home && \
    git clone "https://github.com/EpicKiwi/Ogriner.git"

RUN cd /home/Ogriner/src && \
    npm i

WORKDIR /home/Ogriner/src

ENTRYPOINT ["npm","run","start"]