#!/bin/bash

# Shortcut to access the MySQL database inside the Docker container

container_id=$(docker ps -q --filter "name=our-db")

if [ -z "$container_id" ]; then
  echo "No MySQL container running"
  exit 1
fi

# Connect to MySQL and run 'USE forum;'
docker exec -it "$container_id" mysql -u root -proot forum