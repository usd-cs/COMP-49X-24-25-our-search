#!/bin/bash

usage() {
  echo "Usage: $0 --new_admin=<admin_email>"
  echo "Creates a new admin user on startup by passing the email to the backend."
  exit 1
}

for arg in "$@"; do
  case $arg in
    --new_admin=*)
    ADMIN_EMAIL="${arg#*=}"
    shift
    ;;
  *)
    echo "Invalid argument: $arg"
    usage
    ;;
  esac
done

# Set environment variable ADMIN_EMAIL only if provided in the script argument
if [ -n "$ADMIN_EMAIL" ]; then
  export ADMIN_EMAIL="$ADMIN_EMAIL"
  echo "A new admin will be created with the email: $ADMIN_EMAIL"
else
  echo "No admin email provided. Skipping admin creation."
fi

echo "Starting Docker Compose..."
# Note: add --build if images need to be rebuilt, or run 'docker compose up --build' outside the script beforehand.
docker compose up