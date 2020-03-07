/* Module for handling specific requests/routes for stock data */
// node at this point doesn't support native JS fetch
const fetch = require('node-fetch');
// the lodash module has many powerful and helpful array functions
const _ = require('lodash');
// error messages need to be returned in JSON format
const jsonMessage = (msg) => {
    return { message : msg };
   };
async function retrievePriceData(symbol, resp) {
    const url =
   `http://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symb
   ol=${symbol}`;
    // retrieve the response then the json
    const response = await fetch(url);
    const prices = await response.json();
    // return the retrieved price data
    resp.json(prices);
}
// return daily price data
const handlePriceData = (stocks, app) => {
    app.get('/stock/daily/:symbol', (req,resp) => {
    // change user supplied symbol to upper case
    const symbolToFind = req.params.symbol.toUpperCase();
    // search the array of objects for a match
    const stock = stocks.filter(obj => symbolToFind === obj.symbol);
    // now get the daily price data
    if (stock.length > 0) {
    retrievePriceData(symbolToFind, resp);
    } else {
    resp.json(jsonMessage(`Symbol ${symbolToFind} not found`));
    }
    });
   }
// return just the requested stock
const handleSingleSymbol = (stocks, app) => {
    // return just the requested stock
    app.get('/stock/:symbol', (req,resp) => {
    // change user supplied symbol to upper case
    const symbolToFind = req.params.symbol.toUpperCase();
    // search the array of objects for a match
    const stock =
    stocks.filter(obj => symbolToFind === obj.symbol);
    // return the matching stock
    if (stock.length > 0) {
        resp.json(stock);
    } else {
        resp.json(jsonMessage(`Symbol ${symbolToFind} not found`));
    }
   });
};
// return all the stocks whose name contains the supplied text
const handleNameSearch = (stocks, app) => {
// return all the stocks whose name contains the supplied text
    app.get('/stock/name/:substring', (req,resp) => {
    // change user supplied substring to lower case
    const substring = req.params.substring.toLowerCase();
    // search the array of objects for a match
    const matches = stocks.filter( (obj) =>
    obj.name.toLowerCase().includes(substring) );
   // return the matching stocks
    if (matches.length > 0) {
        resp.json(matches);
    } else {
        resp.json(jsonMessage(
        `No symbol matches found for ${substring}`));
    }
    });
};
module.exports = {
 handleSingleSymbol,
 handleNameSearch,
 handlePriceData
};