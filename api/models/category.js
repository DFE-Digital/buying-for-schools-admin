const category = (mongoose) => {
  const Schema = mongoose.Schema
  const CategoryModelSchema = new Schema({
    title: {
      type: String,
      required: [true, 'A title is required'],
    }
  })
  return  mongoose.model('category', CategoryModelSchema )
}

exports = module.exports = category