#!/usr/bin/env bash

URL="http://localhost:3000/session/start/whatsapp"
API_KEY="jangandikasitau"

curl -X GET "$URL" \
  -H "x-api-key: $API_KEY"
