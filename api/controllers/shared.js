
const stdErrorResponse = (res, err) => {
  // console.log(err)
  res.statusCode = 400
  const response = {
    success: false
  }

  if (err.code === 404) {
    res.statusCode = 404
    response.err = 404
    response.msg = 'Document not found'
    return res.send(response)
  }
  if (err.code === 11000) {
    response.err = 'validation'
    response.msg = 'Validation errors'
    response.errors = [{ id: 'ref', msg: 'Reference must be unique'}]
    return res.send(response)
  }

  if (err.errors) {
    const errorMessages = Object.keys(err.errors).map(k => {
      return { id: k, msg: err.errors[k].message }
    })
    response.err = 'validation'
    response.msg = 'Validation errors'
    response.errors = errorMessages
    return res.send(response)
  }

  if (err.kind === 'ObjectId' && err.name === 'CastError') {
    response.err = 'invalid-object-id'
    response.msg = 'Invalid object ID'
    return res.send(response)
  }



  console.log(err)
  return res.send(response)
}


exports = module.exports = {
  stdErrorResponse
}