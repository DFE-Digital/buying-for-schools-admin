import React, { Component } from 'react'
import Input from '../form/Input'

export default class QuestionOptionForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ...this.props.option
    }
  }

  handleChange(id, value) {
    const newState = { ...this.state }
    const field = id.replace(/opt-(.+)-\d+/, '$1')
    newState[field] = value
    this.setState(newState)
    this.props.onChange(this.props.index, newState)
  }

  handleChangeNext(e) {
    e.preventDefault()
    const newState = { ...this.state }
    newState.next = e.target.value
    this.setState(newState)
    this.props.onChange(this.props.index, newState)
  }

  render () {
    const i = this.props.index
    const defaultValue=this.state.next
    return (
      <tr>
        <td>
          <Input 
            id={`opt-ref-${i}`}
            value={this.state.ref}
            label="Ref"
            onChange={this.handleChange.bind(this)}  
            />  
        </td>

        <td>
          <Input 
            id={`opt-title-${i}`}
            value={this.state.title}
            label="Title"
            onChange={this.handleChange.bind(this)}  
            />  
        </td>

        <td>
          <select onChange={this.handleChangeNext.bind(this)} value={defaultValue} >
            <option value="">...next</option>
            { this.props.otherQuestions.map((q, j) => (
              <option value={q.ref} key={q.ref}>{q.title}</option>
            ))}
          </select> 
        </td>
      </tr>
    )
  }
}