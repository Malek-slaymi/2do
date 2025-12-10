#!/usr/bin/env bash
set -e
HOST=${1:-http://localhost:3000}
for i in {1..20}; do
  if curl -s --fail "$HOST" >/dev/null; then
    break
  fi
  sleep 1
done

HTTP_STATUS=$(curl -s -o /tmp/smoke_out.html -w "%{http_code}" "$HOST")
if [ "$HTTP_STATUS" != "200" ]; then
  echo "Smoke failed: status $HTTP_STATUS"
  exit 1
fi
if grep -q "React" /tmp/smoke_out.html; then
  echo "Smoke OK"
  exit 0
else
  echo "Smoke failed: expected 'React' in page"
  exit 1
fi
