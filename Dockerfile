FROM node:9-alpine

ENV HOME "/home/raqbot"

WORKDIR ${HOME}

RUN apk add --no-cache --virtual build-dependencies g++ make git python && \
        mkdir -p "${HOME}" && \
        git clone https://github.com/raqbit/raqbot ${HOME} && \
        yarn install --no-lockfile && \
        yarn build && \
        rm -r node_modules && \
        yarn install --production --no-lockfile && \
        yarn cache clean && \
        rm -r node_modules/grpc/ && \
        rm -r $HOME/src && \
        apk del build-dependencies

VOLUME "${HOME}"

ENTRYPOINT ["yarn", "start:prod"]