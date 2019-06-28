import React, { Component } from 'react'
import { connect } from 'react-redux'
import DiagramOption from './DiagramOption'
import { Map, List } from 'immutable'
import { editQuestion, createNewQuestion } from '../../actions/question-actions'
import './diagramQuestion.css'

const mapStateToProps = (state) => { 
  return {
    questions: state.questionReducer.questions,
    frameworks: state.frameworkReducer.frameworks
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editQuestion: (qID, optionIndex) => dispatch(editQuestion(qID, optionIndex)),
    createNewQuestion: (qID, optionIndex) => dispatch(createNewQuestion(qID, optionIndex))
  }
}

export class DiagramQuestion extends Component {
  constructor (props) {
    super(props)

    this.state = {
      questions: List([])
    }
  }

  edit (optionIndex = null) {
    this.props.editQuestion(this.props.qID, optionIndex)
  }

  onCreateNew (optionIndex = null) {
    const q = this.props.questions.find(q => q.get('_id') === this.props.qID)
    this.props.createNewQuestion(q, optionIndex)
  }

  addOption (e) {
    const q = this.props.questions.find(q => q.get('_id') === this.props.qID)
    const options = q.get('options')
    this.props.editQuestion(this.props.qID, options.size)
  }

  render () {
    const { qID } = this.props
    const q = this.props.questions.find(q => q.get('_id') === this.props.qID)
    if (!Map.isMap(q)) {
      return <p>{qID}</p>
    }

    const path = Map.isMap(this.props.path) || Map({}).set(qID, null)
    const title = q.get('title')
    const hint = q.get('hint') || ''
    const err = q.get('err')
    const options = q.get('options').map(opt => {
      const nxt = opt.get('next')
      if (nxt && !this.props.questions.find(q => q.get('_id') === nxt)) {
        return opt.set('next', null)
      }
      return opt
    })

    return (
      <table className="dquestiontable">
        <tbody>
          <tr className="dquestion--outer">
            <td className="dquestion" colSpan={ options.size }>
              <h2 id={path} onClick={e => this.edit()}>{ title }</h2>
              { hint && (<span className="dquestion__hint">{ hint }</span>)}
              { err && (<span className="dquestion__err">{err}</span>)}
              <button className="dquestion__addoption" onClick={this.addOption.bind(this)}></button>
            </td>
          </tr>
          <tr className={`doptions doptions--x${options.size}`}>
            {options.map((opt, i) => {
              const optionPath = path.set(qID, i)
              return (
                <td className="doption--outer" key={`option-${i}`}>
                  <DiagramOption 
                    opt={opt} 
                    optionIndex={i} 
                    q={q} 
                    path={optionPath} 
                    onEdit={this.edit.bind(this)} 
                    onCreateNew={this.onCreateNew.bind(this)} />
                </td>
            )})}
          </tr>
        </tbody>
      </table>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagramQuestion)