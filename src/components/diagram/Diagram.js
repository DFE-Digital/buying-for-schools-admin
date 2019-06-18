import React, { Component } from 'react'
import ReactDOM from 'react-dom'
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

    this.myRef = React.createRef()
  }

  componentDidMount() {
    get(questionUrl).then(questions => {
      this.setState({ questions })
    })
  }

  componentDidUpdate () {
    const path = '/what/goods/goods/ict'
    const el = document.getElementById(path)
    const rect = el.getBoundingClientRect();
    el.scrollIntoView()
  }

  closeEditWindow (e) {
    e.preventDefault(e)
    this.setState({ editing: false })
  }

  openEditWindow (e) {
    e.preventDefault(e)
    this.setState({ editing: true })
  }  

  render() {
    if (this.state.questions.length === 0) {
      return (
        <p>Loading</p>
      )
    }

    const diagramQuestionClasses = ['diagram']
    const editWindowClasses = ['editwindow']
    if (this.state.editing) {
      diagramQuestionClasses.push('diagram--editing')
      editWindowClasses.push('editwindow--open')
    }

    return (
      <div className="diagramouter" ref={this.myRef}>

        <div className={editWindowClasses.join(' ')}>
          <button onClick={this.closeEditWindow.bind(this)}>Close</button>
          <h2>EDIT</h2>
        </div>
        
        <div className={diagramQuestionClasses.join(' ')} id="diagram">
          <DiagramQuestion questions={ this.state.questions } qref={ rootQuestionRef } path={''} />
        </div>
        

        { !this.state.editing && (
          <button onClick={this.openEditWindow.bind(this)}>Open</button>
        )}
      </div>
    )
  }
}  


export default Diagram