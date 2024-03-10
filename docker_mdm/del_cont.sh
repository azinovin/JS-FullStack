#!/bin/bash
docker ps -a
docker rm $(docker ps -a -q -f status=exited)
