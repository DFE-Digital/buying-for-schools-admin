import React, { Component } from 'react'
import { connect } from 'react-redux'
import { rootQuestionRef } from '../../config'
import { getQuestions, cancelEdit } from '../../actions/question-actions'
import { getFrameworks } from '../../actions/framework-actions'
import DiagramQuestion from './DiagramQuestion'
import { List, Map } from 'immutable'
import './diagram.css'

const mapStateToProps = (state) => {
  return {
    questions: state.questionReducer.questions,
    frameworks: state.frameworkReducer.frameworks,
    editing: state.questionReducer.editing
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getQuestions: () => dispatch(getQuestions()),
    getFrameworks: () => dispatch(getFrameworks()),
    cancelEdit: () => dispatch(cancelEdit())
  }
}

export class Diagram extends Component {

  componentDidMount() {
    this.props.getQuestions()
    this.props.getFrameworks()
  }

  render() {
    if (!List.isList(this.props.questions)) {
      return (
        <p>Loading</p>
      )
    }

    const diagramQuestionClasses = ['diagram']
    
    // if (this.props.editing) {
    //   diagramQuestionClasses.push('diagram--editing')
    // }

    const rootQuestion = this.props.questions.find(q => q.get('ref') === rootQuestionRef)
    if (!Map.isMap(rootQuestion)) {
      return <p>RootQuestion not found</p>
    }

    // const style = { height: window.innerHeight }

    return (
      <div className="diagramouter">
        <div className={diagramQuestionClasses.join(' ')} id="diagram">
          <DiagramQuestion qID={ rootQuestion.get('_id') } />
        </div>
      </div>
    )
  }
}  


export default connect(mapStateToProps, mapDispatchToProps)(Diagram)