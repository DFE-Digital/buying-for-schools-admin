#!/usr/bin/env bash

DATE=`date '+%F-%T'`
DUMPPATH="./backup/$DATE"
mkdir $DUMPPATH

mongodump --uri "$S107D01_MONGO_01_READONLY" --out $DUMPPATH
mongorestore --uri "$S107T01_MONGO_01" -d s107t01-mongo-01 "$DUMPPATH/s107d01-mongo-01"
