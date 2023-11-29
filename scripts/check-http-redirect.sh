#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Usage: $0 <domain>"
  exit 1
fi

DOMAIN="$1"
URL="http://$DOMAIN"
FINAL_URL=$(curl -s -o /dev/null -w "%{url_effective}" -L "$URL")

if [[ "$FINAL_URL" == "https://$DOMAIN"* ]] || [[ "$FINAL_URL" == "https://www.$DOMAIN"* ]]; then
  echo "HTTP to HTTPS redirection for $DOMAIN: SUCCESS"
  exit 0
else
  echo "HTTP to HTTPS redirection for $DOMAIN: FAILED (final URL: $FINAL_URL)"
  exit 1
fi
