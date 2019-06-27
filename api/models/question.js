
const validateQuestionRef = RegExp(/^[a-z-]*$/)

const question = (mongoose) => {
  const Schema = mongoose.Schema
  const questionModelSchema = new Schema({
    ref: {
      type: String,
      unique: true,
      required: [true, 'A reference is required'],
      minlength: [2, 'A reference must be at least two characters long'],
      maxlength: [24, 'A reference must be no longer than 24 characters'],
      match: [validateQuestionRef, 'A reference must contain only a-z and dashes']
    },
    title: {
      type: String,
      required: [true, 'A title is required'],
    },
    hint: String,
    options: [{
      ref: {
        type: String,
        required: [true, 'A reference is required'],
        minlength: [2, 'A reference must be at least two characters long'],
        maxlength: [24, 'A reference must be no longer than 24 characters'],
        match: [validateQuestionRef, 'A reference must contain only a-z and dashes']
      }, 
      title: {
        type: String,
        required: [true, 'A title is required'],
      },  
      hint: String,
      // next: String,
      next: {
        default: null,
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      },
      result: []
    }],
    err: String,
    suffix: String
  })
  return  mongoose.model( 'question', questionModelSchema )
}

exports = module.exports = question