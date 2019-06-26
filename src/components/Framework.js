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

  save (f) {
    const frameworkId = this.props.match.params.frameworkId
    this.setState({ busy: true })
    
    const action = frameworkId === 'new' ? post : put
    const url = frameworkId === 'new' ? frameworkUrl: `${frameworkUrl}/${frameworkId}`
    
    action(url, f).then(response => {
      if (response.ok) {
        this.props.history.push('/framework')
      } else {
        this.setState({ error: response.data.msg })
      }
    })
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
        <div>
          {this.state.error && (
            <h2>Error: {this.state.error}</h2>
          )}
          <FrameworkForm framework={this.state.framework} save={this.save.bind(this)} delete={this.delete.bind(this)} />
        </div>
      )
    }
    return <h2>Loading</h2>
  }
}

export default Framework
