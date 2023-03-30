FROM node:19.8.1
RUN apt-get update && apt-get install -y iputils-ping git
WORKDIR /app
CMD [ "npm","run","start" ]