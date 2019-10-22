#!/bin/bash

echo Start deploy
echo "export NODE_ENV=production" >> $BASH_ENV
echo "export AWS_APPSYNC_APIKEY=$AWS_APPSYNC_APIKEY" >> $BASH_ENV
echo "export AWS_APPSYNC_GRAPHQLENDPOINT=$AWS_APPSYNC_GRAPHQLENDPOINT" >> $BASH_ENV
echo "export AWS_APPSYNC_REGION=$AWS_APPSYNC_REGION" >> $BASH_ENV
echo "export DISCORD_BOT_TOKEN=$DISCORD_BOT_TOKEN" >> $BASH_ENV
echo "export TENOR_API_KEY=$TENOR_API_KEY" >> $BASH_ENV 
printenv
cd ~/app/bot/tehbot
echo git pull
git checkout develop
git pull
echo install dependencies
npm install
echo compile typescript
npm run tsc 
echo start pm2
pm2 stop main
pm2 start .build/main.js
echo Deploy end