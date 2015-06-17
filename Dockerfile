FROM    centos:centos6

# Enable EPEL for Node.js
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# Install Node.js and npm
RUN     yum install -y npm

# Install app dependencies
RUN npm install mongodb

# Bundle app source
COPY ./src /src
COPY ./src/package.json /src/package.json
COPY ./src/index.js /src/index.js
WORKDIR /src 
RUN npm install -d

EXPOSE  8080
CMD ["node", "/src/index.js"]
