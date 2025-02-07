#!/usr/bin/env bash

set -e

TIMEOUT=15
STRICT=0
HOST=""
PORT=""
CMD=""
QUIET=0

echoerr() {
  if [[ "$QUIET" -ne 1 ]]; then echo "$@" 1>&2; fi
}

usage() {
  exitcode="$1"
  cat << USAGE >&2
Usage:
  $0 host:port [-s] [-t timeout] [-- command args]
  -q | --quiet                        Do not output any status messages
  -s | --strict                       Only execute subcommand if the test succeeds
  -t TIMEOUT | --timeout=timeout      Timeout in seconds, zero for no timeout
  -- COMMAND ARGS                     Execute command with args after the test finishes
USAGE
  exit "$exitcode"
}

wait_for() {
  if [[ -z "${HOST}" || -z "${PORT}" ]]; then
    echoerr "Error: you need to provide a host and port to test."
    usage 2
  fi

  echoerr "Waiting for $HOST:$PORT to be available..."

  for i in $(seq 1 $TIMEOUT); do
    if nc -z -w1 "$HOST" "$PORT" > /dev/null 2>&1; then
      echoerr "$HOST:$PORT is available!"
      if [[ -n "$CMD" ]]; then
        exec $CMD
      fi
      exit 0
    fi
    sleep 1
  done

  echoerr "Timeout: $HOST:$PORT is not available after ${TIMEOUT} seconds"
  exit 1
}

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    *:* )
      HOST=$(echo "$1" | cut -d : -f 1)
      PORT=$(echo "$1" | cut -d : -f 2)
      shift
      ;;
    -q | --quiet)
      QUIET=1
      shift
      ;;
    -s | --strict)
      STRICT=1
      shift
      ;;
    -t)
      TIMEOUT="$2"
      if [[ -z "$TIMEOUT" ]]; then break; fi
      shift 2
      ;;
    --timeout=*)
      TIMEOUT="${1#*=}"
      shift
      ;;
    --)
      shift
      CMD="$@"
      break
      ;;
    --help)
      usage 0
      ;;
    *)
      echoerr "Unknown argument: $1"
      usage 1
      ;;
  esac
done

if [[ "$STRICT" -eq 1 ]]; then
  wait_for
else
  wait_for "$@" &
  wait $!
fi
