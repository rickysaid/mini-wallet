mini wallet Wallet

https://documenter.getpostman.com/view/8411283/SVfMSqA3?version=latest#cd25ab7d-76ac-4c45-93b2-812e35c99935

Developed on node v18.12.1.

A mini wallet made with node & expressjs, using SQLite.
to run on windows, just run wallet.exe.

for another OS, you can run it after installing node. download / clone this code, and then run

npm install

node index.js

you can access the API on http://localhost:8080/. There will be message "Hi there, welcome to this mini wallet" indicating app successfully run.

Things to be improved:

1. Token expiration, and create another token when token expired.
2. Refactor some function marked as TODO.
3. Unit test for all API.
