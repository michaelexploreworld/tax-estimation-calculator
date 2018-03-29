var mongoose = require( 'mongoose' );

var taxRangeSchema = new mongoose.Schema({
  from: { type: Number, required: true },
  to: { type: Number, required: true },
  percentage: { type: Number, required: true },
  over: { type: Number, required: true },
  amount: { type: Number, required: true }
});

var taxRateSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  taxRanges: [ taxRangeSchema ]
});

mongoose.model('taxRate', taxRateSchema);
