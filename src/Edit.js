import React, { Component } from 'react'
import Globals from './Globals'
import './editbox.css'


class Edit extends Component {
 
  constructor (props) {
    super(props)
    const { hierarchy, answer } = props
    if (answer) {
      const nextBranch = answer.next
      console.log(answer)
      this.state = {
        isNew: !answer.ref,
        isAnswer: true,
        editBoxTitle: 'Answer',
        keyref: answer.ref,
        title: answer.title,
        next: nextBranch && nextBranch.ref ? nextBranch.ref : nextBranch,
        result: answer.result
      }
    } else {
      this.state = {
        isAnswer: false,
        editBoxTitle: 'Question',
        keyref: hierarchy.ref,
        title: hierarchy.title
      }
    }
  }

  closeIt (e) {
    e.preventDefault()
    Globals.app.setState({
      editing: null
    })
  }

  handleKeyrefChange (e) {
    this.setState({ keyref: e.target.value });
  }

  handleTitleChange (e) {
    this.setState({ title: e.target.value });
  }

  handleResultChange (e) {
    this.setState({ result: e.target.value });
  }

  handleNextChange (e) {
    this.setState({ next: e.target.value });
  }

  getSaveUrl () {
    if (this.state.isNew) {
      return '/api/question/' + this.props.hierarchy.ref + '/answer'
    } else if (this.state.isAnswer) {
      return '/api/question/' + this.props.hierarchy.ref + '/answer/' + this.props.answer.ref
    } else {
      return '/api/question/' + this.props.hierarchy.ref
    }
  }

  save (e) {
    e.preventDefault()
    const method = this.state.isNew ? 'POST': 'PUT'
    const data = {
      ref: this.state.keyref,
      title: this.state.title
    }
    if (this.state.isAnswer) {
      data.next = this.state.next
      data.result = this.state.result
    }
    fetch(this.getSaveUrl(), {
      method,
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(result => {
      Globals.app.setState({
        ...result,
        editing: null,
        editingAnswer: null
      })
    })

  }

  render () {
    const { hierarchy } = this.props

    if (!hierarchy || !hierarchy.title) {
      return <h4>Undefined branch title</h4>
    }

    return (
      <div className="editbox">
        <h2>{this.state.isNew && <span>NEW</span>} { this.state.editBoxTitle }</h2>
        <div className="editbox__field">
          <label className="editbox__label" htmlFor="ref">Ref</label>
          <input 
            title="ref"
            className="editbox__input editbox__input--ref" 
            type="text" 
            defaultValue={this.state.keyref} 
            onChange={this.handleKeyrefChange.bind(this)} 
          />
        </div>
        <div className="editbox__field">
          <label className="editbox__label" htmlFor="title">Title</label>
          <input 
            id="title"
            className="editbox__input editbox__input--title" 
            type="text" 
            defaultValue={this.state.title} 
            onChange={this.handleTitleChange.bind(this)} 
          />
        </div>
        { this.state.isAnswer && (
          <div>
            <div className="editbox__field">
              <label className="editbox__label" htmlFor="next">Next</label>
              <input
                id="next"
                className="editbox__input editbox__input--next" 
                type="text" 
                defaultValue={this.state.next} 
                onChange={this.handleNextChange.bind(this)} 
              />
            
            </div>
            <div className="editbox__field">
              <label className="editbox__label" htmlFor="result">Result</label>
              <input 
                id="result"
                className="editbox__input editbox__input--result" 
                type="text" 
                defaultValue={this.state.result} 
                onChange={this.handleResultChange.bind(this)} 
              />
            </div>
          </div>
        )}
        <a onClick={e => this.closeIt(e)}>Close</a>
        <a onClick={e => this.save(e)}>Save</a>
      </div>
    )
  }
}

export default 
Edit
