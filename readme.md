#Find your vaccine!
---
A basic vaccine slot finder web app made using node js and express js at thebackend and uses Co-Win public API to fetch data.

##Requirements
---
- Node js
- npm

##Common setup
---
Clone the repo and install the dependencies
```shell
git clone https://github.com/devadathanmb/find-your-vaccine.git
```
```shell
npm install
```
##Steps to access the website
----
To start the express server, run the following in the cloned directory.
```shell
node app.js
```
Open [https://localhost:3000] and there you go!

NOTE : It has to be noted that CoWin API responses may not be realtime and also has a restriction of 100 API calls per 5 minutes per IP.
Also note that it is geo restricted and can only be accessed from India. So in case if you are using a VPN, try turning it off.
