# Redis image
FROM redis

# Copy redis configuration
COPY redis.conf /usr/local/etc/redis/redis.conf

# Port
EXPOSE 6379

# Uncomment if you want to use docker run/build directly.
# CMD is already in docker-compose
# CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]