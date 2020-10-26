cd /root
cd cleeser
git pull
cd server
npm i
cd ../client
npm i
ng build --prod
pm2 restart 0
