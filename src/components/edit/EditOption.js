import React, { Component } from 'react'
import { connect } from 'react-redux'
import { cancelEdit, updateQuestion } from '../../actions/question-actions'
import Input from '../form/Input'
import Select from '../form/Select'
import { Map, List } from 'immutable'
import { getAllAncestorIDs } from '../../services/question'

const mapStateToProps = (state) => {
  return {
    editing: state.questionReducer.editing,
    questions: state.questionReducer.questions || [],
    frameworks: state.frameworkReducer.frameworks || List([])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    cancelEdit: () => dispatch(cancelEdit()),
    updateQuestion: (question) => dispatch(updateQuestion(question))
  }
}

export class EditOption extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ref: '',
      title: '',
      hint: '',
      next: null,
      question: null,
      option: null,
      result: List([]),
      frameworkIdToAddToResult: ''
    }
  }


  componentDidUpdate (prevProps) {
    const oldData = prevProps.editing ? prevProps.editing.questionID + prevProps.editing.optionIndex : null
    const newData = this.props.editing ? this.props.editing.questionID + this.props.editing.optionIndex : null
    
    if (newData && oldData !== newData && this.props.editing.optionIndex!== null) {
      const question = this.props.questions.find(q => q.get('_id') === this.props.editing.questionID)
      const option = question.getIn(['options', this.props.editing.optionIndex]) || Map({
        ref: '',
        title: '',
        hint: '',
        next: '',
        result: List([])
      })

      const ref = option.get('ref') || ''
      const title = option.get('title') || ''
      const hint = option.get('hint') || ''
      const nextUnchecked = option.get('next') || ''
      const next = this.props.questions.find(q => q.get('_id') === nextUnchecked) ? nextUnchecked : ''
      const result = option.get('result') || List([])
      this.setState({ ref, title, hint, next, question, option, result })
    }
  }


  onChange (id, value) {
    const newState = {...this.state}
    newState[id] = value
    this.setState(newState)
  }

  handleChangeNext (id, value) {
    this.setState({next: value})
  }

  onChangeFramework (id, frameworkIdToAddToResult) {
    this.setState({ frameworkIdToAddToResult })
  }

  onAddFrameworkToResult (e, frameworkId) {
    e.preventDefault()
    if (!this.state.result.includes(frameworkId) && frameworkId.length >= 16) {
      const result = this.state.result.push(frameworkId)
      this.setState({ result, frameworkIdToAddToResult: '' })
    }
  } 

  removeFrameworkOption (id) {
    const result = this.state.result.filter(r => r !== id)
    this.setState({ result })
  }


  onSave (e) {
    e.preventDefault()
    const currentQuestion = this.state.question
    const currentOption = this.state.option
    const newOption = currentOption
      .set('ref', this.state.ref)
      .set('title', this.state.title)
      .set('hint', this.state.hint)
      .set('next', this.state.next)
      .set('result', this.state.result)

    const newQuestion = currentQuestion.setIn(['options', this.props.editing.optionIndex], newOption)
    this.props.updateQuestion(newQuestion.toJS())
  }


  onDelete(e) {
    e.preventDefault()
    const currentQuestion = this.state.question
    const newQuestion = currentQuestion.deleteIn(['options', this.props.editing.optionIndex])
    this.props.updateQuestion(newQuestion.toJS())
  }



  render () {
    if (!this.props.editing || this.props.editing.optionIndex === null) {
      return ''
    }

    const ancestorIDs = getAllAncestorIDs(this.props.questions, this.props.editing.questionID)
    const otherQuestions = this.props.questions.filter(q => !ancestorIDs.includes(q.get('_id')))
    const questionOptions = otherQuestions.map(q => {
      return {
        label: q.get('title'),
        value: q.get('_id')
      }
    }).toJS()
    questionOptions.unshift({
      label: '...',
      value: ''
    })

    const frameworks = this.props.frameworks
    const frameworkOptions = frameworks.map(f => {
      return {
        label: f.get('title'),
        value: f.get('_id')
      }
    }).filter(f => !this.state.result.includes(f.value)).toJS()
    frameworkOptions.unshift({
      label: '...',
      value: ''
    })

    const resultFrameworks = []
    this.state.result.forEach(r => {
      const framework = this.props.frameworks.find(f => f.get('_id') === r)
      if (framework) {
        resultFrameworks.push({
          title: framework.get('title'),
          id: framework.get('_id')
        })
      }
    })

    const showFrameworkOptions = this.state.next ? false : true
    const showQuestionOptions = resultFrameworks.length === 0

    

    return (
      <div>
        <form>
          <h2>Option</h2>
          <Input 
            id="ref"
            value={this.state.ref}
            label="Ref"
            onChange={this.onChange.bind(this)}  
            />
          <Input 
            id="title"
            value={this.state.title}
            label="Title"
            onChange={this.onChange.bind(this)}  
            />
          <Input 
            id="hint"
            value={this.state.hint}
            label="Hint"
            onChange={this.onChange.bind(this)}  
            />

          <Select
            id="next"
            value={this.state.next}
            label="Next question"
            options={questionOptions}
            disabled={!showQuestionOptions}
            onChange={this.handleChangeNext.bind(this)}
          />

          <table>
            <tbody>
              {resultFrameworks.map(r => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td><button className="button button--red" onClick={e => this.removeFrameworkOption(r.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <Select
            id="result"
            label="Framework"
            value={this.state.frameworkIdToAddToResult}
            options={frameworkOptions}
            disabled={!showFrameworkOptions}
            onChange={this.onChangeFramework.bind(this)}
          />
          <button className="button button--green" onClick={e => this.onAddFrameworkToResult(e, this.state.frameworkIdToAddToResult)}>Add</button>

          <input type="submit" value="Save" className="button button--green" onClick={e => this.onSave(e)} />

          <button className="button button--red" onClick={e => this.onDelete(e)}>Delete</button>
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOption)