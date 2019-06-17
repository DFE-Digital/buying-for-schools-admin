import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { get } from '../../services/io'
import { questionUrl, rootQuestionRef } from '../../config'
import DiagramQuestion from './DiagramQuestion'
import './diagram.css'

export class Diagram extends Component {
  constructor (props) {
    super(props)
    this.state = {
      questions: []
    }
  }

  componentDidMount() {
    get(questionUrl).then(questions => {
      this.setState({ questions })
    })
  }

  render() {
    if (this.state.questions.length === 0) {
      return (
        <p>Loading</p>
      )
    }

    return (
      <DiagramQuestion questions={ this.state.questions } qref={ rootQuestionRef } />
    )
  }
}  


export default Diagram