var mongoose = require('mongoose');
var Ptr = mongoose.model('PersonalTaxRecord');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var doAddTaxResult = function (req, res, personalTaxRecord) {
  if (!personalTaxRecord) {
    sendJsonResponse(res, 404, {
      "message": "personalTaxRecord not found"
    });
  } else {
    personalTaxRecord.taxResults.push({
      net: req.body.net,
      sup: req.body.sup,
      netPlusSup: req.body.netPlusSup,
      gross: req.body.gross,
      grossPlusSup: req.body.grossPlusSup,
      tax: req.body.tax,
      taxRange: req.body.taxRange
    });
    personalTaxRecord.save(function (err, personalTaxRecord) {
      var thisTaxResult;
      if (err) {
        sendJsonResponse(res, 400, err);
      } else {
        thisTaxResult = personalTaxRecord.taxResults[personalTaxRecord.taxResults.length - 1];
        sendJsonResponse(res, 201, thisTaxResult);
      }
    });
  }
};

var doDeleteTaxResult = function (req, res, personalTaxRecord) {
  if (personalTaxRecord.taxResults && personalTaxRecord.taxResults.length > 0) {
    if (!personalTaxRecord.taxResults.id(req.params.taxResultId)) {
      sendJsonResponse(res, 404, {
        "message": "taxResultId not found"
      });
    } else {
      personalTaxRecord.taxResults.id(req.params.taxResultId).remove();
      personalTaxRecord.save(function(err) {
        if (err) {
          sendJsonResponse(res, 404, err);
        } else {
          sendJsonResponse(res, 204, null);
        }
      });
    }
  } else {
    sendJsonResponse(res, 404, {
      "message": "No taxResult to delete"
    });
  }
};

module.exports.taxResultsCreate = function (req, res) {
  var personalTaxRecordId = req.params.personalTaxRecordId;
  if (personalTaxRecordId) {
    Ptr
      .findById(personalTaxRecordId)
      .select('taxResults')
      .exec(
        function (err, personalTaxRecord) {
          if (err) {
            sendJsonResponse(res, 400, err);
          } else {
            doAddTaxResult(req, res, personalTaxRecord);
          }
        }
      );
  } else {
    sendJsonResponse(res, 404, {
      "message": "Not found, personalTaxRecordId required"
    });
  }
};

module.exports.taxResultsDeleteOne = function (req, res) {
  if (!req.params.personalTaxRecordId || !req.params.taxResultId) {
    sendJsonResponse(res, 404, {
      "message": "Not found, personalTaxRecordId and taxResultId are both required"
    });
    return;
  }
  Ptr
    .findById(req.params.personalTaxRecordId)
    .select('taxResults')
    .exec(
      function(err, personalTaxRecord) {
        if (!personalTaxRecord) {
          sendJsonResponse(res, 404, {
            "message": "personalTaxRecord not found"
          });
          return;
        } else if (err) {
          sendJsonResponse(res, 400, err);
          return;
        } else {
          doDeleteTaxResult(req, res, personalTaxRecord)
        }
      }
    );
};
