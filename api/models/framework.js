const framework = (mongoose) => {
  const Schema = mongoose.Schema
  const FrameworkModelSchema = new Schema({
    ref: String,
    title: String,
    supplier: String,
    url: String,
    cat: String,
    descr: String,
    expiry: Date
  })
  return  mongoose.model('framework', FrameworkModelSchema )
}

exports = module.exports = framework