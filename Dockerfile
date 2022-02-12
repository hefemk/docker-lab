FROM node as build
WORKDIR /app
ADD . .
RUN yarn

FROM node:12-slim
COPY --from=build /app /
RUN apt-get update \
    && apt-get install -y stress-ng
EXPOSE 3000
CMD [ "index.js" ]
