# tax-estimation-calculator
Use this simple calculator to find out your estimated tax and net from a given income.
## Functions
* Scrapping tax rates from external website.
* Calculate tax and net amount based on gross, gross + sup and sup rate.
* Show search records for registered users only.
* Delete search records for registered users only.
* User authentication.
## Built With
* [MongoDB](https://www.mongodb.com/) - Cross-platform document-oriented database program.
* [Express](https://expressjs.com/) - Node.js web application framework
* [AngularJS](https://angularjs.org/) - JavaScript-based front-end web application framework.
* [Node.js](https://nodejs.org/en/) - Cross-platform JavaScript run-time environment.
## Installing
Change to tax-estimation-calculator directory.
```
cd tax-estimation-calculator/
```
Install package dependencies.
```
npm install
```
Create .env file.
```
vim .env
```
Enter jwt secret in the .env file.
```
JWT_SECRET=thisIsSecret
```
Save .env file.
```
:wq
```
Start development mode.
```
npm start
```
Or start production mode.
```
NODE_ENV=production MONGOLAB_URI=yourExternalMongoDatabase npm start
```
