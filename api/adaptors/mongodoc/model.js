const validateFrameworkRef = RegExp(/^[a-z-]*$/)
const validateQuestionRef = RegExp(/^[a-z-]*$/)


const mongoose = require('mongoose')

const structure = (connectionString) => {
  mongoose.set('useCreateIndex', true)
  mongoose.set('useFindAndModify', false)
  mongoose.connect(connectionString, { useNewUrlParser: true })
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'MongoDB connection error:'))

  const Schema = mongoose.Schema
  const structureModelSchema = new Schema({
    status: {
      type: String,
      default: 'DRAFT'
    },
    published: {
      date: Date,
      note: String
    },
    archived: {
      date: Date,
      note: String
    },
    framework: [{
      ref: {
        type: String,
        required: [true, 'A reference is required'],
        minlength: [2, 'A reference must be at least two characters long'],
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
        ref: 'structure.provider'
      },
      url: String,
      cat: {
        default: null,
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'structure.category'
      },
      descr: String,
      body: String,
      expiry: Date
    }],
    question: [{
      ref: {
        type: String,
        required: [true, 'A reference is required'],
        minlength: [2, 'A reference must be at least two characters long'],
        maxlength: [32, 'A reference must be no longer than 32 characters'],
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
          maxlength: [32, 'A reference must be no longer than 32 characters'],
          match: [validateQuestionRef, 'A reference must contain only a-z and dashes']
        }, 
        title: {
          type: String,
          required: [true, 'A title is required'],
        },  
        hint: String,
        next: {
          default: null,
          required: false,
          type: mongoose.Schema.Types.ObjectId,
          ref: 'structure.question'
        },
        result: []
      }],
      err: String,
      suffix: String
    }],
    provider: [{
      title: {
        type: String,
        required: [true, 'A title is required'],
      },
      initials: {
        type: String,
        default: ''
      }
    }],
    category: [{
      ref: {
        type: String,
        // required: [true, 'A reference is required'],
        minlength: [2, 'A reference must be at least two characters long'],
        maxlength: [32, 'A reference must be no longer than 32 characters'],
        match: [validateQuestionRef, 'A reference must contain only a-z and dashes']
      },
      title: {
        type: String,
        required: [true, 'A title is required'],
      }
    }]
  },{
    timestamps: true
  })
  return  mongoose.model( 'structure', structureModelSchema )
}

exports = module.exports = structure