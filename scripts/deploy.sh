#!/bin/bash

echo "Start deploy"
cd ~/app/bot
git pull
npm i
npm run tsc 
pm2 stop .build/main.js
pm2 start .build/main.js
echo "Deploy end"