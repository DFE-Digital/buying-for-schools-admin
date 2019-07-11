import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { confirmDeleteQuestion, createNewQuestion } from '../../actions/question-actions'
import QuestionsVisual from './QuestionsVisual'
import { getQuestionUsage } from '../../services/question'
import './questions.css'

const mapStateToProps = (state) => {
  return {
    questions: state.questionReducer.questions || List([]),
    frameworks: state.frameworkReducer.frameworks || List([])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteQuestion: (q) => dispatch(confirmDeleteQuestion(q)),
    createNewQuestion: (qID, optionIndex) => dispatch(createNewQuestion(qID, optionIndex))
  }
}

export class Questions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      questions: List([])
    }
  }

  edit (qID, optionIndex = null) {
    this.props.editQuestion(qID, optionIndex)
  }

  onCreateNew (optionIndex = null) {
    const q = this.props.questions.find(q => q.get('_id') === this.props.qID)
    this.props.createNewQuestion(q, optionIndex)
  }

  render() {
    const usage = getQuestionUsage(this.props.questions)
    const qlist = this.props.questions.map(q => {      
      return {
        _id: q.get('_id'),
        ref: q.get('ref'),
        title: q.get('title'),
        usage: usage[q.get('_id')] || 0,
        original: q,
        options: q.get('options').map(o => {
          const opt = {
            _id: o.get('_id'),
            ref: o.get('ref'),
            title: o.get('title')
          }
          
          const nxt = this.props.questions.find(qq => qq.get('_id') === o.get('next'))
          if (nxt) {
            opt.next = {
              _id: nxt.get('_id'),
              title: nxt.get('title')
            }
          }

          opt.result = o.get('result').map(r => {
            const f = this.props.frameworks.find(ff => ff.get('_id') === r)
            if (f) {
              return {
                _id: f.get('_id'),
                title: f.get('title')
              }
            }
            return null
          }).filter(o => o !== null)
          return opt
        })
      }
    })

    return <QuestionsVisual questionList={qlist} deleteQuestion={this.props.deleteQuestion.bind(this)} /> 
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions)
