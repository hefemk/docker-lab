FROM node
EXPOSE 3000

WORKDIR /app
ADD . .

RUN apt-get update && apt-get install -y stress-ng && yarn

CMD [ "yarn", "start" ]
