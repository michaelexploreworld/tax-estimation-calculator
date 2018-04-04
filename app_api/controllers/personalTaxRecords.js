var mongoose = require('mongoose');
var Ptr = mongoose.model('PersonalTaxRecord');
var User = mongoose.model('User');

var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

// Make sure there is a user before using the user dara in the controllers.
var getAuthor = function (req, res, callback) {
  if (req.payload && req.payload.email) {
    User
      .findOne({ email : req.payload.email })
      .exec(function(err, user) {
        if (!user) {
          sendJsonResponse(res, 404, {
            "message": "User not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJsonResponse(res, 404, err);
          return;
        }
        callback(req, res, user.email);
      });
  } else {
    sendJSONresponse(res, 404, {
      "message": "User not found"
    });
    return;
  }
};

module.exports.personalTaxRecordsCreate = function (req, res) {
  //getAuthor(req, res, function (req, res, userEmail) {
    Ptr.create({
      email: req.query.email
    }, function(err, personalTaxRecord) {
      if (err) {
        sendJsonResponse(res, 400, err);
      } else {
        sendJsonResponse(res, 201, personalTaxRecord);
      }
    });
  //});
}

module.exports.personalTaxRecordByEmail = function (req, res) {
  getAuthor(req, res, function (req, res, userEmail) {
    if (userEmail) {
      Ptr
        .findOne({ email: userEmail })
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
        "message": "Email query parameter is required"
      });
      return;
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
