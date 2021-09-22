# Nodejs image
FROM node

# Expose ports
EXPOSE 50052
EXPOSE 50053

# Create working directory
WORKDIR /app/cummare

# Update node
RUN npm install -g npm@latest

# Install Global dependendencies
RUN npm install -g typescript && npm install -g grpc-tools

# Install local dependencies
COPY package*.json /app/cummare/
RUN npm install

# Create node_modules volume to avoid problems on run npm install
VOLUME [ "/app/cummare", "/app/cummare/node_modules" ]

# Uncomment if you want to use docker run/build directly.
# CMD is already in docker-compose
# CMD [ "npm", "run", "serve" ]