#!/usr/bin/env bash
set -e

HOST=${1:-http://localhost:3000}
TIMEOUT=${2:-30}

end=$((SECONDS+TIMEOUT))
while ! curl -sSf "$HOST" >/dev/null 2>&1; do
  sleep 1
  if [ $SECONDS -ge $end ]; then
    echo "{\"smoke\":\"FAILED\",\"reason\":\"timeout waiting for $HOST\"}" > smoke-result.json
    exit 1
  fi
done

if curl -s "$HOST" | grep -q "React"; then
  echo "{\"smoke\":\"PASSED\"}" > smoke-result.json
  echo "SMOKE PASSED"
  exit 0
else
  echo "{\"smoke\":\"FAILED\",\"reason\":\"content mismatch\"}" > smoke-result.json
  echo "SMOKE FAILED"
  exit 2
fi
