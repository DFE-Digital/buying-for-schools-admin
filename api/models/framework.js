const validateFrameworkRef = RegExp(/^[a-z-]*$/)

const framework = (mongoose) => {
  const Schema = mongoose.Schema
  const FrameworkModelSchema = new Schema({
    ref: {
      type: String,
      unique: true,
      required: [true, 'A reference is required'],
      minlength: [2, 'A reference must be at least two characters long'],
      maxlength: [24, 'A reference must be no longer than 24 characters'],
      match: [validateFrameworkRef, 'A reference must contain only a-z and dashes']
    },
    title: {
      type: String,
      required: [true, 'A title is required']
    },
    provider: {
      default: null,
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'provider'
    },
    url: String,
    cat: {
      default: null,
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category'
    },
    descr: String,
    body: String,
    expiry: Date
  })

  return  mongoose.model('framework', FrameworkModelSchema )
}

exports = module.exports = framework