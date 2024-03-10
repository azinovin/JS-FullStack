export udVersion; version=$(ls unidata-r*.gz| sed "s/unidata-r\([0-9]*\.[0-9]*\.[0-9]*\)-.*/\1/")
export udTarname; Tarname=$(ls unidata-r*.gz)
export postgres_server=localhost
export elastic_cluster=dit-unidata


SYSTEMCTL_COPY ()
{
\cp -r /usr/bin/systemctl /usr/bin/systemctl.bak
\cp -r /opt/systemctl.py /usr/bin/systemctl && chmod +x /usr/bin/systemctl
}
export -f SYSTEMCTL_COPY

SYSTEMCTL_RESTORE ()
{
\cp -r /usr/bin/systemctl.bak /usr/bin/systemctl && chmod +x /usr/bin/systemctl
}
export -f SYSTEMCTL_RESTORE

 # Функция установки Postgres
func_install_postgresql()
{
echo "Настраиваем postgres"
echo "export PATH=/usr/pgsql-9.4/bin:\$PATH" >> /var/lib/pgsql/.pgsql_profile
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/
        s/max_connections = 100/max_connections = 200/
        s/shared_buffers = 128MB/shared_buffers = 4GB/
        s/#effective_cache_size = 4GB/effective_cache_size = 12GB/
        s/#work_mem = 4MB/work_mem = 21970kB/
        s/#maintenance_work_mem = 64MB/maintenance_work_mem = 1024MB/
        s/#wal_buffers = -1/wal_buffers = 32MB/
        s/#checkpoint_segments = 3/checkpoint_segments = 64/
        s/#checkpoint_completion_target = 0.5/checkpoint_completion_target = 0.9/
        s/#default_statistics_target = 100/default_statistics_target = 100/
        s/#log_min_duration_statement = -1/log_min_duration_statement = 3000/
        s/#log_checkpoints = off/log_checkpoints = on/
        s/#log_connections = off/log_connections = on/
        s/#log_disconnections = off/log_disconnections = on/
        s/log_line_prefix = '< %m >'/log_line_prefix = '%t [%p]: [%l-1]'/
        s/#log_lock_waits = off/log_lock_waits = on/
        s/#log_temp_files = -1/log_temp_files = 0/
        s/#log_autovacuum_min_duration = -1/log_autovacuum_min_duration = 0/
        s/lc_messages = 'ru_RU.UTF-8'/lc_messages = 'C'/
        s/#log_statement = 'none'/log_statement = 'none'/
        s/#log_min_messages = warning/log_min_messages = info/
        s/#log_error_verbosity = default/log_error_verbosity = verbose/
        s/#autovacuum_vacuum_scale_factor = 0.2/autovacuum_vacuum_scale_factor = 0.5/" /var/lib/pgsql/9.4/data/postgresql.conf
sed -i "s/local   all             all                                     peer/local   all             all                                     trust/" /var/lib/pgsql/9.4/data/pg_hba.conf
sed -i "s/host    all             all             127.0.0.1\/32            trust/host    all             all             127.0.0.1\/32            md5/" /var/lib/pgsql/9.4/data/pg_hba.conf
sed -i "s/#host    replication     postgres        ::1\/128                 trust/host    replication     postgres        ::1\/128                 trust/" /var/lib/pgsql/9.4/data/pg_hba.conf
echo "host    all             all             0.0.0.0/0            password" >> /var/lib/pgsql/9.4/data/pg_hba.conf 
echo -e "postgres\npostgres\n" | passwd postgres
echo -e "ALTER USER postgres WITH PASSWORD 'postgres';" | psql -U postgres
}
export -f func_install_postgresql

func_install_rabbitmq ()
{
echo "Настраиваем RabbitMQ"
	rabbitmq-plugins enable rabbitmq_management
        wget -N http://localhost:15672/cli/rabbitmqadmin
	chmod +x rabbitmqadmin
#	chown -R rabbitmq:rabbitmq /var/lib/rabbitmq/
	/opt/config_rabbitmq.sh

	systemctl restart rabbitmq-server

	mkdir -p /etc/systemd/system/rabbitmq-server.service.d/
	cp -r /opt/conf/rabbitmq/limits.conf /etc/systemd/system/rabbitmq-server.service.d/limits.conf
	systemctl --system daemon-reload
}
export -f func_install_rabbitmq


# Функция установки базы UD
func_install_database_unidata ()
{

echo "Создаем БД unidata"
su -l postgres -c "/usr/pgsql-9.4/bin/dropdb unidata"
echo -e "create database unidata;" | psql -U postgres
cp -r /opt/unidata-r$version/database /opt/unidata/
sed -i "s/export JAVA_HOME=\/usr\/lib\/jvm\/jre/#export JAVA_HOME=\/usr\/lib\/jvm\/jre/" /opt/unidata/init_env.sh
cd /opt/unidata && chmod +x update_database.sh && ./update_database.sh 
# Set password for admin to 1q2w3e4r
psql -U postgres -c "update s_password set created_by='admin', updated_by='admin', password_text = '\$2a\$10\$NjspvTx4eFZhv2k4WfJE2.1ydSXSn6VL9rJbsLatIKNo.M81rPSVy';" unidata
}
export -f func_install_database_unidata


func_restore_database_unidata ()
{
su -l postgres -c "/usr/pgsql-9.4/bin/pg_ctl stop -m fast -D /var/lib/pgsql/9.4/data"
sleep 3
su -l postgres -c "/usr/pgsql-9.4/bin/pg_ctl start -D /var/lib/pgsql/9.4/data"
sleep 3
su -l postgres -c "/usr/pgsql-9.4/bin/dropdb unidata"
su -l postgres -c "/usr/pgsql-9.4/bin/createdb unidata"
su -l postgres -c "/usr/pgsql-9.4/bin/pg_restore -d unidata /opt/dumps/dict_unidata_29032019.dump"
#pg_dump -Fc unidata > /pgdump/dict_unidata_29032019.dump
}
export -f func_restore_database_unidata

func_install_elastic ()
{
echo "Настраиваем elastic"
sed -i "s/#cluster.name:.*/cluster.name: $elastic_cluster/
	s/#network.host:.*/network.host: 0.0.0.0/
	s/#http.port:.*/http.port: 9200/" /etc/elasticsearch/elasticsearch.yml
echo transport.tcp.port: 9300 >> /etc/elasticsearch/elasticsearch.yml
systemctl restart elasticsearch
}
export -f func_install_elastic

func_install_unidata_server ()
{
echo "Настраиваем Tomcat"
cp /opt/unidata-r$version/Tomcat/conf/Catalina/localhost/unidata-backend.xml /usr/share/tomcat/conf/Catalina/localhost/
mkdir /usr/share/tomcat/conf/unidata
cp /opt/unidata-r$version/Tomcat/conf/unidata/* /usr/share/tomcat/conf/unidata/
cp /opt/unidata-r$version/Tomcat/lib/* /usr/share/tomcat/lib/
cp /opt/unidata-r$version/Tomcat/webapps/* /usr/share/tomcat/webapps/
cp /opt/license.bin /usr/share/tomcat/conf/license.bin

# копируем готовые настройки для ДИТ
cp -r /opt/conf/unidata/* /usr/share/tomcat/conf/unidata/
cp -r /opt/conf/tomcat/tomcat.conf /usr/share/tomcat/conf
# Получаем последние версии сборки ДИТ
cd /opt/unidata-integration
/opt/download_artifacts.sh libs-snapshots com/unidata/mdm/dit/service dit-services
/opt/download_artifacts.sh libs-snapshots com/unidata/mdm/dit/model dit-model

#wget -N --http-user=git_deployer --http-password=gitArtifactoryPass http://92.53.101.223:8700/artifactory/libs-release/com/unidata/mdm/dit/model/dit-model/1.0/dit-model-1.0.jar
#wget -N --http-user=git_deployer --http-password=gitArtifactoryPass http://92.53.101.223:8700/artifactory/libs-release/com/unidata/mdm/dit/service/dit-services/1.0/dit-services-1.0.jar
mkdir -p /usr/share/tomcat/unidata-integration
cp -r /opt/unidata-integration/* /usr/share/tomcat/unidata-integration/
cd /opt

sed -i "s/unidata.search.cluster.name.*/unidata.search.cluster.name=$elastic_cluster/
		s/unidata.dump.target.format.*/unidata.dump.target.format=PROTOSTUFF/
		s/unidata.licensing.gpg.license.file.*/unidata.licensing.gpg.license.file=\/usr\/share\/tomcat\/conf\/license.bin/" /usr/share/tomcat/conf/unidata/backend.properties
sed -i "s/= FINE/= INFO/g" /usr/share/tomcat/conf/logging.properties
#sed -i "s/localhost/$postgres_server/" /usr/share/tomcat/conf/Catalina/localhost/unidata-backend.xml
chown -R tomcat:tomcat /usr/share/tomcat/
systemctl restart tomcat
}
export -f func_install_unidata_server

# Правим для curl
sed "/::1/d" /etc/hosts > hosts && \cp -r hosts /etc/hosts

cd /opt && tar -zxvf $Tarname


# Запускаем сервисы
echo "Запускаем сервисы"

SYSTEMCTL_COPY
#systemctl start postgresql-9.4.service
su -l postgres -c "/usr/pgsql-9.4/bin/postgres -D /var/lib/pgsql/9.4/data -p 5432" &
mkdir -p /var/run/postgresql && chmod a+w /var/run/postgresql && chown -R postgres:postgres /var/run/postgresql
systemctl start rabbitmq-server.service
systemctl start elasticsearch
systemctl start logstash
systemctl start tomcat


# Настройка компонентов
echo "Настройка компонентов"
func_install_rabbitmq
func_install_elastic
func_install_postgresql
func_install_database_unidata
func_install_unidata_server

SYSTEMCTL_RESTORE