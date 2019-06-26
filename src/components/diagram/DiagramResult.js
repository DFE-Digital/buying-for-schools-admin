import React, { Component } from 'react'
import { connect } from 'react-redux'
import { is, List, Map } from 'immutable'

const mapStateToProps = (state) => {
  return {
    frameworks: state.frameworkReducer.frameworks || List(),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    
  }
}

export class DiagramResult extends Component {
  constructor (props) {
    super(props)
    this.state = {
      framework:Map({})
    }
  }
  componentDidMount() {
    this.updateFrameworkReference(this.props.frameworkId)
  }

  componentDidUpdate(prevProps) {
    this.updateFrameworkReference(this.props.frameworkId)
  }

  updateFrameworkReference (id) {
    const framework = this.props.frameworks.find(f => f.get('_id') === id)
    if (!is(framework, this.state.framework) && framework) {
      this.setState({ framework })
    }
  }

  render () {
    return (
      <p>{ this.state.framework.get('title')}</p>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagramResult)