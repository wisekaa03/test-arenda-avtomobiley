#!/bin/sh

export NODE=`which node`
export NODE_ENV=${NODE_ENV:=production}
# export NODE_OPTIONS=--max_old_space_size=1024
# export NODE_PG_FORCE_NATIVE=true

if [ -n "$*" -a "$1" = "start" ]; then
  $NODE dist/main.js

fi
