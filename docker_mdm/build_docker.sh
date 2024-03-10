#!/bin/bash

cd /opt
#docker build --rm --no-cache -t azinovin/unidata-dit-4.8.8:initial .
docker build --rm --no-cache --add-host unidata:127.0.0.1 -t azinovin/unidata-dit-4.8.8:initial .
#docker network create ud

#docker push azinovin/unidata-dit-4.8.8
