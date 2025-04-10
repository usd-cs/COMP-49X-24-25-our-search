#!/bin/bash

# This is an executable used to shortcut entering the db container.

container_id=$(docker ps -q --filter "name=our-db")

# Check if the container is found
if [ -z "$container_id" ]; then
  echo "No MySQL container running"
  exit 1
fi

docker exec -it "$container_id" bash -c "mysql -u root -p"