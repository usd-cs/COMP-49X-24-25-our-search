#!/bin/bash

usage() {
  echo "Usage: $0 --new_admin=<admin_email> --google_id=<client_id> --google_secret=<client_secret>"
  echo "Creates a new admin user and starts Docker Compose with required Google OAuth credentials."
  exit 1
}

for arg in "$@"; do
  case $arg in
    --new_admin=*)
    ADMIN_EMAIL="${arg#*=}"
    shift
    ;;
    --google_id=*)
    GOOGLE_CLIENT_ID="${arg#*=}"
    shift
    ;;
    --google_secret=*)
    GOOGLE_CLIENT_SECRET="${arg#*=}"
    shift
    ;;
    *)
    echo "Invalid argument: $arg"
    usage
    ;;
  esac
done

# Validate required args
if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
  echo "Error: Both --google_id and --google_secret must be provided."
  usage
fi

# Set environment variable ADMIN_EMAIL only if provided in the script argument
if [ -n "$ADMIN_EMAIL" ]; then
  export ADMIN_EMAIL="$ADMIN_EMAIL"
  echo "A new admin will be created with the email: $ADMIN_EMAIL"
else
  echo "No admin email provided. Skipping admin creation."
fi

export GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID"
export GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET"

echo "Starting Docker Compose..."
# Note: add --build if images need to be rebuilt, or run 'docker compose up --build' outside the script beforehand.
docker compose up --build