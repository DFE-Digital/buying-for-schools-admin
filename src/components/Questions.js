import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get } from '../services/io'
import { questionUrl } from '../config'
import { List } from 'immutable'
import { getQuestions, deleteQuestion } from '../actions/question-actions'
import { getFrameworks } from '../actions/framework-actions'
import { getPaths } from '../services/question'
import QuestionsVisual from './QuestionsVisual'
import './questions.css'

const mapStateToProps = (state) => {
  return {
    questions: state.questionReducer.questions || List([]),
    frameworks: state.frameworkReducer.frameworks
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getQuestions: () => dispatch(getQuestions()),
    getFrameworks: () => dispatch(getFrameworks()),
    deleteQuestion: (id) => dispatch(deleteQuestion(id))
  }
}

export class Questions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      questions: List([])
    }
  }

  componentDidMount() {
    this.props.getQuestions()
    this.props.getFrameworks()
  }

  deleteQuestion(id) {
    this.props.deleteQuestion(id)
  }

  render() {
    const nextQuestionsList = []
    const allPaths = getPaths(this.props.questions)
    console.log(allPaths)
    const orphans = this.props.questions.filter(q => {
      return allPaths.find(path => {
        const last = path[path.length -2]
        console.log(last, last._id === q.get('_id'))
        return last._id === q.get('_id')
      })
    })

    const findInPaths = (id) => {
      return allPaths.find(path => {
        const last = path[path.length -2]
        console.log(last, last._id === id)
        return (last._id === id)
      })
    }

    console.log(findInPaths('5d036c48aec9a546a438a4e6'))

    // console.log(orphans.toJS())

    const qlist = this.props.questions.map(q => {      
      return {
        _id: q.get('_id'),
        ref: q.get('ref'),
        title: q.get('title'),
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

    return <QuestionsVisual questionList={qlist} deleteQuestion={this.deleteQuestion} /> 
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions)
