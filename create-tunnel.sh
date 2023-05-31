#!/bin/bash


export $(grep -v '^#' .env | xargs)

killall ssh
ssh -i ${SSH_KEY_PATH} -L 8081:www.phonearena.com:443 ${SSH_USER}@${SSH_HOST} 

