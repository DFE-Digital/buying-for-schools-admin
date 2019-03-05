import React, { Component } from 'react'
import Answer from './Answer'

const Result = props => {
  const classes = ['result']
  if (props.templateExists) {
    classes.push('result--exists')
  }
  return (
    <div className={classes.join(' ')}>
      {props.result}
    </div>
  )
}

export default Result