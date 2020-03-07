/* Module for handling specific requests/routes for stock data */
const stockController = require('./stock-controller.js');
// return daily price data
const handlePriceData = (stocks, app) => {
    app.route('/stock/hourly/:symbol')
    .get( (req,resp) => {
    stockController.findPrices(stocks,req,resp);
    }
    );
}
// return just the requested stock
const handleSingleSymbol = (stocks, app) => {
    app.route('/stock/:symbol')
    // if it is a GET request then return specified stock
    .get( (req,resp) => {
        stockController.findSymbol(stocks,req,resp);
    })
    // if it is a PUT request then update specified stock
    .put( (req,resp) => {
        stockController.updateSymbol(stocks,req,resp);
    })
    // if it is a POST request then insert new stock
    .post( (req,resp) => {
        stockController.insertSymbol(stocks,req,resp);
    })
    // if it is a DELETE request then delete specified stock
    .delete( (req,resp) => {
        stockController.deleteSymbol(stocks,req,resp);
    });
};
// return all the stocks whose name contains the supplied text
const handleNameSearch = (stocks, app) => {
// return all the stocks whose name contains the supplied text
    app.get('/stock/name/:substring', (req,resp) => {
    // change user supplied substring to lower case
    stockController.findName(stocks,req,resp);
    });
};
module.exports = {
 handleSingleSymbol,
 handleNameSearch,
 handlePriceData
};