FROM centos:centos6

# Enable EPEL for Node.js
RUN rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

# Install
RUN yum install -y cronie npm git supervisor postfix


RUN git clone https://github.com/BBC-News-Labs/datastringer.git /datastringer
WORKDIR /datastringer
# install application's dependencies
RUN npm install

EXPOSE 3000

# Add supervisord.conf to manage processes
# running in this container.
COPY supervisord.conf /etc/supervisord.conf

#setup cron to trigger datastringer
RUN (crontab -l ; echo "0 12 * * * node datastringer/datastringer.js") 2>&1 | sed "s/no crontab for $(whoami)//" | sort | uniq | crontab -

VOLUME ["/datastringer/assets", "/var/log"]
# replace this with your main "server" script file
CMD ["/usr/bin/supervisord"]
