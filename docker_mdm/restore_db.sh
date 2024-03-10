#!/bin/bash
docker exec -t -i ud /bin/bash -c "/opt/restore_db.sh $1"
