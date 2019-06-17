import React, { Component } from 'react'
import FrameworkForm from './FrameworkForm'
import { get, put, post, remove } from '../services/io'

import { questionHierarchyUrl } from '../config'

export class QuestionHierarchy extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hierarchy: []
    }
  }

  componentDidMount () {
    get(`${questionHierarchyUrl}/${this.props.question.ref}`).then(hierarchy => {
      this.setState({ hierarchy })
    })
  }

  render () {

    const history = this.state.hierarchy.map(q => {
      const answer = q.question.options.find(opt => opt.ref === q.selectedOption)
      console.log('answer', answer)
      return {
        ref: q.question.ref,
        title: q.question.title,
        selectedOption: q.selectedOption,
        answer
      }
    })
    history.reverse()
    
    return (
      <div>
        <h2>Hierarchy</h2>
        {history.map(h => (
          <div key={h.ref}>
            <h3>{h.title}</h3>
            <p>{h.selectedOption.title}</p>
          </div>
        ))}
      </div>
    )
  }
}

export default QuestionHierarchy