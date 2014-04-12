#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

set -e
trap 'kill $(jobs -p)' SIGINT SIGTERM EXIT

export TRAVIS=1
export DOCKER_HOST="unix:///var/run/docker.sock"

sudo docker -d &
sleep 2 
sudo chmod +rw /var/run/docker.sock 
sudo docker ps -a
sudo docker images

(cd $DIR && sudo npm test)
