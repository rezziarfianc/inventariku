#!/usr/bin/env bash

BASE_URL="http://localhost:3000"
API_KEY="jangandikasitau"
SESSION_ID="whatsapp"

CHAT_ID="6289601871947@c.us"
MESSAGE="Test Message"

curl -X POST "$BASE_URL/client/sendMessage/$SESSION_ID" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "'"$CHAT_ID"'",
    "contentType": "string",
    "content": "'"$MESSAGE"'"
  }'
