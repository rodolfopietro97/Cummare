# Nodejs image
FROM node

# Expose ports
EXPOSE 50052
EXPOSE 50053

# Create working directory
WORKDIR /app/cummare/p2p-pubsub-protocol

# Update node
RUN npm install -g npm@latest

# Install Global dependendencies
RUN npm install -g typescript && npm install -g grpc-tools

# Install local dependencies
COPY package*.json /app/cummare/
RUN npm install

# Create volumes for development purposes. 
# 1) If we modify files is not needed to run new time docker-compose build
# 2) Create node_modules volume to avoid problems on run npm install
# 3) Volume for configuration files
VOLUME [ "/app/cummare/p2p-pubsub-protocol", "/app/cummare/p2p-pubsub-protocol/node_modules", "/app/cummare/Configurations" ]

# Uncomment if you want to use docker run/build directly.
# CMD is already in docker-compose
# CMD [ "npm", "run", "serve" ]