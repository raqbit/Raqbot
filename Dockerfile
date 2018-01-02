FROM node:6

ARG HOME="/home/raqbot"

WORKDIR ${HOME}
# Install common text editors, git and delete caches
RUN apt-get update && \
	    apt-get install -y vim nano git && \
	    apt-get clean && \
	    rm -rf /var/lib/apt/lists/*

RUN mkdir -p "${HOME}"

RUN git clone https://github.com/raqbit/raqbot ${HOME} && \
	npm install bufferutil uws && \
	npm install

COPY settings.ts ${HOME}/settings.ts

COPY priv ${HOME}/priv

ENTRYPOINT ["npm", "run", "start"]