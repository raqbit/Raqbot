FROM node:9-alpine

ARG HOME="/home/raqbot"

WORKDIR ${HOME}

RUN apk add --no-cache --virtual build-dependencies g++ make git python && \
        mkdir -p "${HOME}" && \
        git clone https://github.com/raqbit/raqbot ${HOME} && \
        yarn && \
        yarn build && \
        apk del build-dependencies

COPY settings.json ${HOME}/settings.json

COPY priv ${HOME}/priv

USER raqbot

ENTRYPOINT ["yarn", "start"]