import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateQuestion, saveNewQuestion } from '../../actions/question-actions'
import Input from '../form/Input'
import Select from '../form/Select'
import ErrorSummary from '../form/ErrorSummary'
import { fromJS, List, Map } from 'immutable'
import { getAllAncestorIDs } from '../../services/question'
// import './optionEditor.scss'

const mapStateToProps = (state) => {
  return {
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

export class OptionEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      question: null,
      originalOption: null,
      option: null,
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
    const optionId = this.props.match.params.optionId
    const question = this.props.questions.find(q => q.get('_id') === questionId)
    const optionIndex = question.get('options').findIndex(o => o.get('_id') === optionId)
    const option = question.getIn(['options', optionIndex])
    if (option && Map.isMap(option)) {
      this.setState({ 
        question,
        originalQuestion: question,
        originalOption: option,
        option,
        optionIndex,
        nextQuestionOptions: this.getOptionsForTheNextQuestionSelect()
      })
    }
  }

  getOptionsForTheNextQuestionSelect () {
    // need to remove any questions that would cause a recursive loop
    const questionId = this.props.match.params.questionId
    const ancestorIDs = getAllAncestorIDs(this.props.questions, questionId)
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

    return questionOptions
  }

  onChange (id, value) {
    this.setState({ option: this.state.option.set(id, value) })
  }

  onChangeFramework (id, frameworkId) {
    const resultList = this.state.option.get('result')
    const newResultList = this.state.option.get('result').push(frameworkId)
    const newOption = this.state.option.set('result', newResultList)
    this.setState({ option: newOption })
  }

  onRemoveFrameworkOption (frameworkId) {
    const newResultList = this.state.option.get('result').filter(r => r !== frameworkId)
    const newOption = this.state.option.set('result', newResultList)
    this.setState({ option: newOption })
  }

  onSave (e) {
    e.preventDefault()
    const newQuestion = this.state.question.setIn(['options', this.state.optionIndex], this.state.option)
    this.props.updateQuestion(newQuestion.toJS())
  }

  render () {
    if (!Map.isMap(this.state.option)) {
      return <h1>Loading</h1>
    }

    const hasChanged = !this.state.option.equals(this.state.originalOption)
    const saveButtonClasses = ['button']
    if (hasChanged) {
      saveButtonClasses.push('button--green')
    }

    const frameworks = this.props.frameworks || List([])
    const frameworkOptions = frameworks.map(f => {
      return {
        label: f.get('title'),
        value: f.get('_id')
      }
    }).filter(f => !this.state.option.get('result').includes(f.value)).toJS()
    frameworkOptions.unshift({
      label: '...',
      value: '0'
    })

    const resultFrameworks = []
    this.state.option.get('result').forEach(r => {
      const framework = this.props.frameworks.find(f => f.get('_id') === r)
      if (framework) {
        resultFrameworks.push({
          title: framework.get('title'),
          id: framework.get('_id')
        })
      }
    })

    const showFrameworkOptions = this.state.option.get('next') ? false : true
    const showQuestionOptions = resultFrameworks.length === 0

    return (
      <div className="govuk-width-container">
        <form>
          <h2>Option</h2>
          <Input 
            id="ref"
            value={this.state.option.get('ref')}
            label="Ref"
            onChange={this.onChange.bind(this)}  
            />
          <Input 
            id="title"
            value={this.state.option.get('title')}
            label="Title"
            onChange={this.onChange.bind(this)}  
            />
          <Input 
            id="hint"
            value={this.state.option.get('hint')}
            label="Hint"
            onChange={this.onChange.bind(this)}  
            />
          <Select
            id="next"
            value={this.state.option.get('next')}
            label="Next question"
            options={this.state.nextQuestionOptions}
            disabled={!showQuestionOptions}
            onChange={this.onChange.bind(this)}
          />

          <div className="editoption__results">
            <h2 className="govuk-label">Results</h2>
            <table>
              <tbody>
                {resultFrameworks.map(r => (
                  <tr key={r.id}>
                    <td>{r.title}</td>
                    <td><button className="button button--red editoption__resultremove" onClick={e => this.onRemoveFrameworkOption(r.id)}>Remove</button></td>
                  </tr>
                ))}

                <tr>
                  <td>
                    <Select
                      className="editoption__resultselect"
                      id="result"
                      label="Framework"
                      value={Math.random().toString()}
                      options={frameworkOptions}
                      disabled={!showFrameworkOptions}
                      onChange={this.onChangeFramework.bind(this)}
                    />
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <input type="submit" value="Save" className={saveButtonClasses.join(' ')} onClick={e => this.onSave(e)} />
          <Link to={`/diagram/${this.state.question.get('_id')}`} className="button">Cancel</Link>
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionEditor)