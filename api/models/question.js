const question = (mongoose) => {
  const Schema = mongoose.Schema
  const questionModelSchema = new Schema({
    ref: {
      type: String,
      unique: true,
      required: true
    },
   title: {
      type: String,
      required: true
    },
    hint: String,
    options: [{
      ref: String,  
      title: String,  
      hint: String,
      next: String,
      result: []
    }],
    err: String,
    suffix: String
  })
  return  mongoose.model('question', questionModelSchema )
}

exports = module.exports = question