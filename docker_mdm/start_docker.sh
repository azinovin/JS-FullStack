#!/bin/bash
docker run --privileged --cap-add SYS_ADMIN -d -v /opt/dit-volume:/ud-volume -v /sys/fs/cgroup:/sys/fs/cgroup:ro --tmpfs /run -p 9080:8080 -h unidata --name ud azinovin/unidata-dit-4.8.8:last
#docker attach ud
#./del_cont.sh