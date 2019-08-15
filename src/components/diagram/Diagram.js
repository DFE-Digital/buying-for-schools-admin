import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { rootQuestionRef } from '../../config'
import { getQuestions, cancelEdit } from '../../actions/question-actions'
import { getFrameworks } from '../../actions/framework-actions'
import DiagramQuestion from './DiagramQuestion'
import QuestionEditor from '../questions/QuestionEditor'
import OptionEditor from '../questions/OptionEditor'
import { List, Map } from 'immutable'
import './diagram.css'
import './editWindow.css'

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

  render() {
    if (!List.isList(this.props.questions)) {
      return (
        <p>Loading</p>
      )
    }

    const diagramQuestionClasses = ['diagram']    
    const rootQuestion = this.props.questions.find(q => q.get('ref') === rootQuestionRef)
    if (!Map.isMap(rootQuestion)) {
      return <p>RootQuestion not found</p>
    }

    
    const editWindowClasses = ['editwindow']
    const editing = this.props.match.params && this.props.match.params.questionId
    
    if (editing) {
      editWindowClasses.push('editwindow--open')
    }

    // const style = { height: document.body.offsetHeight }
    return (
      <div className="diagramouter">
        <div className={diagramQuestionClasses.join(' ')} id="diagram">
          <DiagramQuestion qID={ rootQuestion.get('_id') } />
        </div>
        <div className={editWindowClasses.join(' ')} onClick={e => false}>
          <div className="editwindow__inner">
            <Route path='/diagram/:questionId' component={QuestionEditor} exact />
            <Route path='/diagram/:questionId/:optionId' component={OptionEditor} exact />
          </div>
        </div>
      </div>
    )
  }
}  


export default connect(mapStateToProps, mapDispatchToProps)(Diagram)