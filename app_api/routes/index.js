var express = require('express');
var router = express.Router();
var ctrlPersonalTaxRecords = require('../controllers/personalTaxRecords');
var ctrlTaxResults = require('../controllers/taxResults');
var ctrlTaxRates = require('../controllers/taxRates');

// personalTaxRecords
router.post('/personalTaxRecords', ctrlPersonalTaxRecords.personalTaxRecordsCreate);
router.get('/personalTaxRecords/:personalTaxRecordId', ctrlPersonalTaxRecords.personalTaxRecordsReadOne);

// taxResults
router.post('/personalTaxRecords/:personalTaxRecordId/taxResults', ctrlTaxResults.taxResultsCreate);
router.delete('/personalTaxRecords/:personalTaxRecordId/taxResults/:taxResultId', ctrlTaxResults.taxResultsDeleteOne);

// taxRates
router.get('/taxRates', ctrlTaxRates.taxRatesList);

module.exports = router;
