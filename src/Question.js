import React, { Component } from 'react'
import Answer from './Answer'
import Globals from './Globals'
import './question.css'

class Question extends Component {
  
  showEdit (e) {
    e.preventDefault()
    Globals.app.edit(this.props.hierarchy, null, e)
  }

  addOption (e) {
    e.preventDefault()
    Globals.app.addOption(this.props.hierarchy, e) 
  }

  render () {
    const { hierarchy } = this.props
   
    if (!hierarchy || !hierarchy.title) {
      return <h4>Undefined branch title</h4>
    }

    return (
      <table>
        <tbody>
          <tr className="question--outer">
            <td className="question" colSpan={ hierarchy.options.length }>
              <h2><a href="#" onClick={e => this.showEdit(e)}>{ hierarchy.title }</a></h2>
              <a className="question__addanswer" href="#" onClick={e => this.addOption(e)}>+</a>
            </td>
          </tr>
          <tr className="options">
            {hierarchy.options.map(opt => (
              <td className="answer--outer">
                <Answer opt={opt} hierarchy={hierarchy} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    )
  }
}

export default Question
