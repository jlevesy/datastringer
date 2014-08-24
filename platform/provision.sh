#!/bin/sh

# Local build, can be avoided using docker registery.
# Can be long.
docker build -t datastringer /vagrant/docker_datastringer

docker run -d -p 3000:3000 -t datastringer
