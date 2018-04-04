var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
var ctrlPersonalTaxRecords = require('../controllers/personalTaxRecords');
var ctrlTaxResults = require('../controllers/taxResults');
var ctrlTaxRates = require('../controllers/taxRates');
var ctrlAuth = require('../controllers/authentication');

// personalTaxRecords
router.post('/personalTaxRecords', ctrlPersonalTaxRecords.personalTaxRecordsCreate);
router.get('/personalTaxRecords', auth,  ctrlPersonalTaxRecords.personalTaxRecordByEmail);
router.get('/personalTaxRecords/:personalTaxRecordId', auth, ctrlPersonalTaxRecords.personalTaxRecordsReadOne);

// taxResults
router.post('/personalTaxRecords/:personalTaxRecordId/taxResults', auth, ctrlTaxResults.taxResultsCreate);
router.delete('/personalTaxRecords/:personalTaxRecordId/taxResults/:taxResultId', auth, ctrlTaxResults.taxResultsDeleteOne);

// taxRates
router.get('/taxRates', ctrlTaxRates.taxRatesList);

// users
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
