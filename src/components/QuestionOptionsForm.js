import React, { Component } from 'react'
import QuestionOptionForm from './QuestionOptionForm'
import './QuestionOptionsForm.css'

import { get } from '../services/io'
import { questionUrl } from '../config'


export default class QuestionOptionsForm extends Component {
  constructor (props) {
    super(props)
    const f = this.props.question
    this.state = {
      otherQuestions: [],
      options: f.options || []
    }
  }

  componentDidMount() {
    get(questionUrl, true).then(allQuestions => {
      const otherQuestions = allQuestions.filter(q => q.ref !== this.props.question.ref)
      this.setState({ otherQuestions })
    })
  }

  handleChange(index, option) {
    const newOptions = this.state.options
    newOptions[index] = option
    this.setState({options: newOptions})
  }

  addOption(e) {
    e.preventDefault()
    const newOptions = this.state.options
    newOptions.push({
      ref: '',
      title: ''
    })
    this.setState({options: newOptions})
  }

  render () {

    return (
      <div>
        <h2>Options</h2>
        <table className="optionstable">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {this.state.options.map((opt, i) => (
              <QuestionOptionForm 
                key={`opt-${i}`} 
                option={opt} 
                index={i} 
                onChange={this.handleChange.bind(this)}
                otherQuestions={this.state.otherQuestions}
                />
            ))}
          </tbody>
        </table>

        <button className="button button--green" onClick={e => this.addOption(e)}>Add option</button>
      </div>
    )
  }
}