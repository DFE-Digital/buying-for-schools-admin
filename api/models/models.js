const models = (mongoose) => {
  return {
    framework: require('./framework.js')(mongoose),
    question: require('./question.js')(mongoose)
  }
}

exports = module.exports = models