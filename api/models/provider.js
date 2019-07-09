const provider = (mongoose) => {
  const Schema = mongoose.Schema
  const ProviderModelSchema = new Schema({
    title: {
      type: String,
      required: [true, 'A title is required'],
    },
    initials: {
      type: String,
      default: ''
    }
  })
  return  mongoose.model('provider', ProviderModelSchema )
}

exports = module.exports = provider