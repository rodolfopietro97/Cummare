# Nodejs image
FROM node

# Create working directory
WORKDIR /app/cummare

# Install Global dependendencies
RUN npm install -g typescript

# Install local dependencies
COPY package*.json /app/cummare/
RUN npm install

# Create node_modules volume to avoid problems on run npm install
VOLUME [ "/app/cummare", "/app/cummare/node_modules" ]

# Uncomment if you want to use docker run/build directly.
# CMD is already in docker-compose
# CMD [ "npm", "run", "serve" ]