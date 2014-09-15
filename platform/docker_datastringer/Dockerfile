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
EXPOSE 25

# Add supervisord.conf to manage processes
# running in this container.
ADD supervisord.conf /etc/supervisord.conf

# Setup postfix
ADD postfix/main.cf /etc/postfix/main.cf
ADD postfix/master.cf /etc/postfix/master.cf

#setup cron to trigger datastringer
RUN (crontab -l ; echo "0 12 * * * node datastringer/datastringer.js") 2>&1 | sed "s/no crontab for $(whoami)//" | sort | uniq | crontab -

#Setup home and env variables
RUN mkdir -p /home/ds/
ENV HOME /home/ds

#Add here you prefered stringers :)
ADD custom_stringers/ /datastringer/custom_stringers/

#Err, can we uniformize this ? like all assets in $HOME/.local/share/datastringer ?
ADD assets/stringers_use_cases.json /datastringer/assets/stringers_use_cases.json
ADD assets/ /home/ds/.local/share/datastringer/

# replace this with your main "server" script file
CMD ["/usr/bin/supervisord"]
