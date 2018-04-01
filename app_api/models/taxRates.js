var mongoose = require( 'mongoose' );

var taxRangeSchema = new mongoose.Schema({
  from: { type: Number, required: true },
  to: { type: Number, required: true },
  amount: { type: Number, required: true },
  percentage: { type: Number, required: true },
  over: { type: Number, required: true }
});

var taxRateSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  taxRanges: [ taxRangeSchema ]
});

var Tax = mongoose.model('TaxRate', taxRateSchema);

taxRateSchema.pre('save', function (next) {
  var self = this;
  Tax.find({ from: self.from, to: self.to }, function (err, docs) {
      if (!docs.length){
        next();
        console.log('TaxRate updates: ' + '{ from: ' + self.from + ', to: ' + self.to + ' }');
      }else{
        console.log('TaxRate exists: ' + '{ from: ' + self.from + ', to: ' + self.to + ' }');
      }
  });
});
