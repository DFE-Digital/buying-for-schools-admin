import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { updateQuestion, saveNewQuestion } from '../../actions/question-actions'
import Input from '../form/Input'
import ErrorSummary from '../form/ErrorSummary'
import { List, Map } from 'immutable'
import { getBlankQuestion } from '../../services/question'
import './questionEditor.scss'

const mapStateToProps = (state) => {
  return {
    updateErrors: state.questionReducer.updateErrors,
    questions: state.questionReducer.questions,
    frameworks: state.frameworkReducer.frameworks
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateQuestion: (question) => dispatch(updateQuestion(question)),
    saveNewQuestion: (question, parent = null) => dispatch(saveNewQuestion(question, parent)),
  }
}

export class QuestionEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      question: null,
      originalQuestion: null,
      error: ''
    }
  }

  componentDidMount () {
    if (this.needsUpdate()) {
      this.update() 
    }
  }

  componentDidUpdate (prevProps) {
    if (this.needsUpdate(prevProps)) {
      this.update() 
    }
  }

  needsUpdate (prevProps) {
    if (!List.isList(this.props.questions)) {
      // no questions have loaded yet
      return false
    }

    if (!Map.isMap(this.state.question)) {
      // no question to edit has been defined
      return true
    }

    const questionId = this.props.match.params.questionId
    if (questionId === 'new') {
      return false
    }

    const originalQuestion = this.props.questions.find(q => q.get('_id') === questionId)
    if (!this.state.originalQuestion.equals(originalQuestion)) {
      // has the original question changed as a result of a save?
      return true
    }

    if (prevProps && this.state.question.get('_id') === prevProps.match.params.questionId) {
      // question id has not changed
      return false
    }

    return true
  }

  update () {
    const questionId = this.props.match.params.questionId
    const baseLink = this.props.match.path.substr(0, 9) === '/question' ? '/question' : '/diagram'
    let question
    if (questionId === 'new') {
      question = getBlankQuestion()
    } else {
      question = this.props.questions.find(q => q.get('_id') === questionId)
    }
    if (question && Map.isMap(question)) {
      this.setState({ 
        question: question,
        originalQuestion: question,
        baseLink
      })
    }
  }

  onChange (id, value) {
    this.setState({ question: this.state.question.set(id, value) })
  }

  onSave (e) {
    e.preventDefault()
    if (this.state.question.get('_id') === 'new') {
      const query = queryString.parse(this.props.location.search)
      const parent = (query.parentId && query.optionId) ? { parentId: query.parentId, optionId: query.optionId } : null
      this.props.saveNewQuestion(this.state.question.toJS(), parent).then(data => {
        if (data._id) {
          this.props.history.push(`${this.state.baseLink}/${data._id}`)
        }
      })
    } else {
      this.props.updateQuestion(this.state.question.toJS())
    }
  }

  render () {
    if (!Map.isMap(this.state.question)) {
      return <h1>Loading</h1>
    }

    const hasChanged = !this.state.question.equals(this.state.originalQuestion)
    const saveButtonClasses = ['button']
    if (hasChanged) {
      saveButtonClasses.push('button--green')
    }

    const hasErrors = this.props.updateErrors && this.props.updateErrors.data && this.props.updateErrors.data.errors
    const errorIds = hasErrors ? this.props.updateErrors.data.errors.map(e => e.id) : []
    const errors = hasErrors ? this.props.updateErrors.data.errors : []
    return (
      <div className="questioneditor govuk-width-container">
        <h1 className="questioneditor__title">Question</h1>
        
        <form className="questioneditor__question">
          <ErrorSummary errors={errors} />
          
          <Input 
            id="ref"
            value={this.state.question.get('ref')}
            label="Ref"
            onChange={this.onChange.bind(this)}
            error={errorIds.includes('ref')}
            />
          <Input 
            id="title"
            value={this.state.question.get('title')}
            label="Title"
            onChange={this.onChange.bind(this)}
            error={errorIds.includes('title')}
            />
          <Input 
            id="hint"
            value={this.state.question.get('hint')}
            label="Hint"
            onChange={this.onChange.bind(this)}
            />
          <Input 
            id="err"
            value={this.state.question.get('err')}
            label="Error"
            onChange={this.onChange.bind(this)}  
            />
          
          <input type="submit" value="Save" className={saveButtonClasses.join(' ')} onClick={e => this.onSave(e)} />
          <Link to={`${this.state.baseLink}`} className="button">{ hasChanged ? 'Cancel' : 'Back' }</Link>
          <div className="questioneditor__optionlist">
            <h3>Options</h3>
            { this.state.question.get('options').map((opt, i) => (
              <p key={opt.get('_id')}><Link to={`${this.props.match.url}/${opt.get('_id')}?return=question`}>{ opt.get('title') }</Link></p>
            )) }
            <Link to={`${this.state.baseLink}/${this.state.question.get('_id')}/new`} className="button button--green">Add option</Link>
          </div>          
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionEditor)