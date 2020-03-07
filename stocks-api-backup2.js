// first reference required modules
const path = require('path');
const parser = require('body-parser');
const express = require('express');
// reference our own modules
const stocks = require('./scripts/data-provider.js');
const stockRouter = require('./scripts/stock-router.js');
// create an express app
const app = express();
// tell node to use json and HTTP header features in body-parser
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
// handle other requests for stocks
stockRouter.handleSingleSymbol(stocks, app);
stockRouter.handleNameSearch(stocks, app);
stockRouter.handlePriceData(stocks, app);
// return all the stocks when a root request arrives
app.get('/', (req,resp) => { resp.json(stocks) } );


// handle requests for static resources
app.use('/static', express.static(path.join(__dirname,'public')));
// Use express to listen to port
let port = 8080;
app.listen(port, () => {
 console.log("Server running at port= " + port);
});