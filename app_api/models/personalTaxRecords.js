var mongoose = require( 'mongoose' );

var taxRangeSchema = new mongoose.Schema({
  from: { type: Number, required: true },
  to: { type: Number, required: true },
  percentage: { type: Number, required: true },
  over: { type: Number, required: true },
  amount: { type: Number, required: true }
});

var taxResultSchema = new mongoose.Schema({
  net: { type: Number, "default": 0 },
  sup: { type: Number, "default": 0 },
  netPlusSup: { type: Number, "default": 0 },
  gross: { type: Number, "default": 0 },
  grossPlusSup: { type: Number, "default": 0 },
  tax: { type: Number, "default": 0 },
  taxRange: { taxRangeSchema },
  createdOn: { type: Date, "default": Date.now }
});

var personalTaxRecordSchema = new mongoose.Schema({
  email: { type: String },
  taxResults: [ taxResultSchema ]
});

mongoose.model('PersonalTaxRecord', personalTaxRecordSchema);
