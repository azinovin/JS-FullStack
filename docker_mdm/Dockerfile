FROM centos:7


MAINTAINER Alexander Zinovin <aleksander.zinovin@unidata-platform.ru>

ENV container docker
ENV JAVA_HOME /usr/lib/jvm/jre
ENV LANG en_US.UTF-8
ENV TERM xterm-256color
ENV RABBITMQ_NODENAME rabbit@unidata

ADD https://raw.githubusercontent.com/maci0/docker-systemd-unpriv/master/dbus.service /etc/systemd/system/dbus.service
COPY docker/ /opt/
#COPY docker/systemctl.py /usr/bin/systemctl
WORKDIR /opt/
RUN chmod +x /opt/*.sh
RUN cp /opt/*.repo /etc/yum.repos.d/
#RUN chmod +x /usr/bin/systemctl
#password for root
RUN echo "Docker!" | passwd --stdin root 
RUN echo "export LANG=en_US.UTF-8" >> /root/.bash_profile && echo "export TRM=xterm-256color" >> /root/.bash_profile && echo "export RABBITMQ_NODENAME=rabbit@unidata" >> /root/.bash_profile

RUN echo $(grep $(hostname) /etc/hosts | cut -f1) unidata >> /etc/hosts && \
    yum -y install systemd systemd-libs dbus && \
    systemctl mask dev-mqueue.mount dev-hugepages.mount systemd-remount-fs.service sys-kernel-config.mount \
        sys-kernel-debug.mount sys-fs-fuse-connections.mount display-manager.service graphical.target systemd-logind.service && \
    yum -y install tomcat tomcat-native && \
        systemctl enable tomcat && chown -R tomcat:tomcat /usr/share/tomcat && \
            sed -i 's#<Connector port="8080" protocol="HTTP/1.1"#<Connector port="8080" protocol="HTTP/1.1" URIEncoding="UTF-8"#' /etc/tomcat/server.xml && \
            sed -i 's#After=.*#After=syslog.target network.target postgresql-9.4.service#' /usr/lib/systemd/system/tomcat.service && \
    yum -y install epel-release && \
#    yum -y update && \
    yum -y install mc pwgen logrotate nss_wrapper gettext wget && \
#   RabbitMQ installation
	wget -N https://packages.erlang-solutions.com/erlang-solutions-1.0-1.noarch.rpm && yum -y install erlang-solutions-1.0-1.noarch.rpm && yum -y install erlang && \
        rpm --import https://www.rabbitmq.com/rabbitmq-release-signing-key.asc && \
#        yum -y install rabbitmq-server-*.noarch.rpm && \
        yum -y install rabbitmq-server && \
        systemctl enable rabbitmq-server.service && \
#   Postgres 9.4 installation
	wget -N https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-x86_64/pgdg-redhat-repo-latest.noarch.rpm && \
	yum -y install pgdg-redhat-repo-latest.noarch.rpm && \
	yum -y install postgresql94-server postgresql94-contrib postgresql94-devel sudo && \
	su -l postgres -c "/usr/pgsql-9.4/bin/initdb -D /var/lib/pgsql/9.4/data" && \
        systemctl enable postgresql-9.4.service && \
#   ElasticSearch 5.x and Logstash installation
	yum -y install elasticsearch-5.6.15.rpm && /usr/share/elasticsearch/bin/elasticsearch-plugin install file:///opt/elasticsearch-analysis-morphology-5.6.15.zip && \
	yum -y install logstash && systemctl enable elasticsearch && systemctl enable logstash && \
        systemctl enable dbus.service && \
            chmod 0644 /etc/systemd/system/dbus.service && \
    yum clean all
RUN echo $(grep $(hostname) /etc/hosts | cut -f1) unidata >> /etc/hosts && \/opt/config_unidata.sh

VOLUME ["/sys/fs/cgroup"]
VOLUME ["/run"]
VOLUME [/ud-volume]

EXPOSE 5672 15672 8080 9200
CMD ["/usr/sbin/init"]
