FROM node:9-alpine

ARG HOME="/home/raqbot"

WORKDIR ${HOME}
# Install common text editors, git and delete caches
RUN apk add --no-cache --virtual build-dependencies g++ make git python && \
        mkdir -p "${HOME}" && \
        git clone https://github.com/raqbit/raqbot ${HOME} && \
        npm install && \
        npm install bufferutil uws && \
        apk del build-dependencies

COPY settings.json ${HOME}/settings.json

COPY priv ${HOME}/priv

ENTRYPOINT ["npm", "run", "start"]