import React, { Component } from 'react'
import QuestionForm from './QuestionForm'
import QuestionHierarchy from './QuestionHierarchy'
import { get, put, remove, post } from '../services/io'

const questionUrl = '/api/question'

export class Question extends Component {
  constructor (props) {
    super(props)
    this.state = {
      question: null,
      busy: true,
      error: ''
    }
  }

  componentDidMount() {
    const questionId = this.props.match.params.questionId
    if (questionId === 'new') {
      this.setState({ question: {}, busy: false })
    } else {
      get(`${questionUrl}/${questionId}`).then(question => {
        this.setState({ question, busy: false })
      })
    }
  }

  handleChange(id, value) {
    const newState = {}
    newState[id] = value
    this.setState(newState)
  }

  save (f) {
    const questionId = this.props.match.params.questionId
    this.setState({ busy: true })
    
    const action = questionId === 'new' ? post : put
    const url = questionId === 'new' ? questionUrl: `${questionUrl}/${questionId}`
    
    action(url, f).then(response => {
      if (response.ok) {
        this.props.history.push('/question')
      } else {
        this.setState({ error: response.data.msg })
      }
    })
  }

  delete () {
    const questionId = this.props.match.params.questionId
    this.setState({ busy: true })
    remove(`${questionUrl}/${questionId}`).then(response => {
      this.props.history.push('/question')
    })
  }

  render() {
    if (this.state.question || !this.state.busy) {
      return (
        <div className="govuk-width-container">
          <QuestionForm question={this.state.question} save={this.save.bind(this)} delete={this.delete.bind(this)} />
          <QuestionHierarchy question={this.state.question} />
        </div>
      )
    }
    return <h2>Loading</h2>
  }
}

export default Question
