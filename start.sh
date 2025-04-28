#!/bin/bash

usage() {
  echo "Usage: $0 --new_admin=<admin_email>"
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

if [ -z "$ADMIN_EMAIL" ]; then
  echo "Error: --new_admin is required."
  usage
fi

export ADMIN_EMAIL="$ADMIN_EMAIL"

echo "Starting Docker Compose with ADMIN_EMAIL=$ADMIN_EMAIL"

# Note: add --build if images need to be rebuilt, e.g. when changes are made,
# or run docker compose up --build beforehand.
docker compose up