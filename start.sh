#!/bin/bash

node index.js &
/usr/sbin/sshd -D &
wait -n
exit $?
