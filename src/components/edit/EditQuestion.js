import React, { Component } from 'react'
import { connect } from 'react-redux'
import { cancelEdit, updateQuestion, questionUpdateErrored, saveNewQuestion } from '../../actions/question-actions'
import { QUESTION_NEW } from '../../actions/question-actions'
import Input from '../form/Input'
import ErrorSummary from '../form/ErrorSummary'
import { getBlankQuestion } from '../../services/question'

const mapStateToProps = (state) => {
  return {
    editing: state.questionReducer.editing,
    updateErrors: state.questionReducer.updateErrors,
    questions: state.questionReducer.questions
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    cancelEdit: () => dispatch(cancelEdit()),
    updateQuestion: (question) => dispatch(updateQuestion(question)),
    saveNewQuestion: (question, parent) => dispatch(saveNewQuestion(question, parent)),
    questionUpdateErrored: (err) => dispatch(questionUpdateErrored(err))
  }
}

export class EditQuestion extends Component {
  constructor (props) {
    super(props)
      this.state = {
      ref: '',
      title: '',
      hint: '',
      err: ''
    }
  }

  componentDidUpdate (prevProps) {
    const oldData = prevProps.editing ? prevProps.editing.questionID : null
    const newData = this.props.editing ? this.props.editing.questionID : null

    if (!newData || oldData === newData) {
      return
    }

    let question = null
    if (newData === QUESTION_NEW) {
      question = getBlankQuestion()
    } else {
      question = this.props.questions.find(q => q.get('_id') === this.props.editing.questionID)
    }
    
    const ref = question.get('ref') || ''
    const title = question.get('title') || ''
    const hint = question.get('hint') || ''
    const err = question.get('err') || ''
    this.setState({ ref, title, hint, err, question })
  }

  onChange (id, value) {
    const newState = {...this.state}
    newState[id] = value
    this.setState(newState)
  }

  onSave (e) {
    e.preventDefault()
    const currentQuestion = this.state.question
    const newRef = this.state.ref.toLowerCase()
    const newQuestion = currentQuestion
      .set('ref', newRef)
      .set('title', this.state.title)
      .set('hint', this.state.hint)
      .set('err', this.state.err)

    const errors = []
    const validateQuestionRef = RegExp(/[a-z-]*/)
    if (!validateQuestionRef.test(newRef)) {
      errors.push({ id: 'ref', msg: 'Invalid ref'})
    }

    if (errors.length) {
      this.props.questionUpdateErrored({data: {errors}})
    } else if (newQuestion.get('_id') === null) {
      this.props.saveNewQuestion(newQuestion.toJS(), this.props.editing._parent || null)
    } else {
      this.props.updateQuestion(newQuestion.toJS())
    }
  }

  render () {
    if (!this.props.editing || this.props.editing.optionIndex !== null) {
      return ''
    }


    const hasErrors = this.props.updateErrors && this.props.updateErrors.data && this.props.updateErrors.data.errors
    const errorIds = hasErrors ? this.props.updateErrors.data.errors.map(e => e.id) : []
    const errors = hasErrors ? this.props.updateErrors.data.errors : []
    return (
      <div>
        <form>
          <h2>Question</h2>
          <ErrorSummary errors={errors} />
          
          <Input 
            id="ref"
            value={this.state.ref}
            label="Ref"
            onChange={this.onChange.bind(this)}
            error={errorIds.includes('ref')}
            />
          <Input 
            id="title"
            value={this.state.title}
            label="Title"
            onChange={this.onChange.bind(this)}
            error={errorIds.includes('title')}
            />
          <Input 
            id="hint"
            value={this.state.hint}
            label="Hint"
            onChange={this.onChange.bind(this)}
            />
          <Input 
            id="err"
            value={this.state.err}
            label="Error"
            onChange={this.onChange.bind(this)}  
            />

          <input type="submit" value="Save" className="button button--green" onClick={e => this.onSave(e)} />
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditQuestion)