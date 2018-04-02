var mongoose = require('mongoose');
var Tax = mongoose.model('TaxRate');

var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.taxRatesList = function (req, res) {
  Tax
    .find({})
    .sort({to: 'desc'})
    .exec(
      function (err, taxRates) {
        if (err) {
          sendJsonResponse(res, 400, err);
        } else {
          sendJsonResponse(res, 200, taxRates);
        }
      }
    );
};
