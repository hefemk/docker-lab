FROM node as build
WORKDIR /app
ADD . .
RUN yarn

FROM node:12-slim
COPY --from=build /app /
RUN apt-get update \
    && apt-get install -y openssh-server \
    && mkdir /var/run/sshd \
    && sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd \
    && echo "export VISIBLE=now" >> /etc/profile \
    && sed 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' -i /etc/ssh/sshd_config \
    && echo 'root:1qaz@WSX3edc' | chpasswd
EXPOSE 3000 22
CMD ["./start.sh"]
