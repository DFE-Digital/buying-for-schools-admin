import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Input from '../form/Input'
import QuestionOptionsForm from './QuestionOptionsForm'


export default class QuestionForm extends Component {
  constructor (props) {
    super(props)
    const f = this.props.question
    this.state = {
      question: {
        ref: '',
        title: '',
        hint: '',
        options: [],
        ...f 
      }
    }
  }

  handleChange(id, value) {
    const newState = this.state
    newState.question[id] = value
    this.setState(newState)
  }

  submit(e) {
    e.preventDefault()
    this.props.save(this.state.question)
  }

  delete(e) {
    e.preventDefault()
    this.props.delete()
  }

  render () {
    const labels = {
      'ref': 'Ref',
      'title': 'Title',
      'hint': 'Hint'
    }
    return (
      <form>
        { Object.keys(labels).map(ref => (
          <Input 
            key={ref}
            id={ref}
            value={this.state.question[ref]}
            label={labels[ref]}
            onChange={this.handleChange.bind(this)}  
            />
        ))}

        <QuestionOptionsForm question={this.state.question} />

        <Link to="/question" className="button">Cancel</Link>
        <input type="submit" value="Submit" className="button button--green" onClick={e => this.submit(e)} />
        <button className="button button--red" onClick={e => this.delete(e)}>Delete</button>
      </form>
    )
  }
}
