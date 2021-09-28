#!/bin/sh

if [ -n "$*" -a "$1" = "down-all" ]; then
docker-compose -p test-rent-car -f docker-compose.yml down --rmi all --remove-orphans -v
elif [ -n "$*" -a "$1" = "down" ]; then
docker-compose -p test-rent-car -f docker-compose.yml down --rmi local --remove-orphans -v
else
docker-compose -p test-rent-car -f docker-compose.yml up -d
fi
