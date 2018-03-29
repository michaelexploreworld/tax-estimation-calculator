var mongoose = require('mongoose');
var Ptr = mongoose.model('PersonalTaxRecord');

var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.personalTaxRecordsCreate = function (req, res) {
  Ptr.create({
    email: req.body.email
  }, function(err, personalTaxRecord) {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      sendJsonResponse(res, 201, personalTaxRecord);
    }
  });
}

module.exports.personalTaxRecordsReadOne = function (req, res) {
  if (req.params && req.params.personalTaxRecordId) {
    Ptr
      .findById(req.params.personalTaxRecordId)
      .exec(function (err, personalTaxRecord) {
        if (!personalTaxRecord) {
          sendJsonResponse(res, 404, {
            "message": "personalTaxRecordId not found"
          });
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        } else {
          sendJsonResponse(res, 200, personalTaxRecord);
        }
      });
  } else {
    sendJsonResponse(res, 404, {
      "message": "No personalTaxRecordId in request"
    });
  }
};
