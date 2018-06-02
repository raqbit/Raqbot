FROM node:9-alpine

ENV HOME "/home/raqbot"

WORKDIR ${HOME}

RUN apk add --no-cache --virtual build-dependencies g++ make git python && \
        mkdir -p "${HOME}" && \
        git clone https://github.com/raqbit/raqbot ${HOME} && \
        yarn && \
        yarn build && \
        rm -r $HOME/src && \
        apk del build-dependencies

VOLUME "${HOME}"

ENTRYPOINT ["yarn", "start:prod"]