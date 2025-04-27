#!/bin/bash

usage() {
  echo "Usage: $0 --first_admin_email=<admin_email>"
  exit 1
}

for arg in "$@"; do
  case $arg in
    --first_admin_email=*)
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
  echo "Error: --first_admin_email is required."
  usage
fi

export ADMIN_EMAIL="$ADMIN_EMAIL"

echo "Starting Docker Compose with ADMIN_EMAIL=$ADMIN_EMAIL"

# Note: add --build if images need to be rebuilt, e.g. when changes are made,
# or run docker compose up --build beforehand.
docker compose up