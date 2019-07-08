import React, { Component } from 'react'
import FrameworkForm from './FrameworkForm'
import { get, put, post, remove } from '../services/io'

import { frameworkUrl } from '../config'

export class Framework extends Component {
  constructor (props) {
    super(props)
    this.state = {
      framework: null,
      busy: true,
      error: ''
    }
  }

  componentDidMount() {
    const frameworkId = this.props.match.params.frameworkId
    if (frameworkId === 'new') {
      this.setState({ framework: {}, busy: false })
    } else {
      get(`${frameworkUrl}/${frameworkId}`).then(framework => {
        this.setState({ framework, busy: false })
      })
    }
  }

  handleChange(id, value) {
    const newState = {}
    newState[id] = value
    this.setState(newState)
  }

  onSave (e) {
    e.preventDefault()
    if (this.state.framework.get('_id') === 'new') {
      this.props.saveNewFramework(this.state.framework.toJS()).then(data => {
        if (data._id) {
          this.props.history.push(`framework/${data._id}`)
        }
      })
    } else {
      this.props.updateFramework(this.state.framework.toJS())
    }
  }

  delete () {
    const frameworkId = this.props.match.params.frameworkId
    this.setState({ busy: true })
    remove(`${frameworkUrl}/${frameworkId}`).then(response => {
      this.props.history.push('/framework')
    })
  }

  render() {
    if (this.state.framework || !this.state.busy) {

      return (
        <div className="govuk-width-container">
          {this.state.error && (
            <h2>Error: {this.state.error}</h2>
          )}
          <FrameworkForm framework={this.state.framework} save={this.onSave.bind(this)} delete={this.delete.bind(this)} />
        </div>
      )
    }
    return <h2>Loading</h2>
  }
}

export default Framework
