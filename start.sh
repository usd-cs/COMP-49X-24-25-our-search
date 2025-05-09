#!/bin/bash

usage() {
  echo "Usage: $0 --new_admin=<admin_email> --google_id=<client_id> --google_secret=<client_secret> --sendgrid_secret=<your_secret> --sendgrid_key=<your_key> --domain=<your_domain>"
  echo "Starting app with Google OAuth and SendGrid."
  exit 1
}

BUILD=false
DETACH=false

for arg in "$@"; do
  case $arg in
    --build)
    BUILD=true
    shift
    ;;
    -d)
    DETACH=true
    shift
    ;;
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
    --sendgrid_key=*)
    SENDGRID_API_KEY="${arg#*=}"
    shift
    ;;
    --sendgrid_email=*)
    SENDGRID_FROM_EMAIL="${arg#*=}"
    shift
    ;;
    --domain=*)
    DOMAIN="${arg#*=}"
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

if [ -z "$DOMAIN" ]; then
  echo "Error: --domain must be provided. For example, https://oursearch.io or http://localhost"
  usage
fi

if [ -z "$SENDGRID_API_KEY" ] || [ -z "$SENDGRID_FROM_EMAIL" ]; then
  echo "Warning: SendGrid credentials not provided. Defaults from secrets.properties may be used."
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
export SENDGRID_API_KEY="$SENDGRID_API_KEY"
export SENDGRID_FROM_EMAIL="$SENDGRID_FROM_EMAIL"
export DOMAIN="$DOMAIN"

if [ "$BUILD" = true ]; then
  echo "Building Docker images..."
  docker compose build
fi

echo "Starting Docker Compose..."
if [ "$DETACH" = true ]; then
  docker compose up -d
else
  docker compose up
fi