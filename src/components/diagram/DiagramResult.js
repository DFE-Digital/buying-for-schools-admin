import React, { Component } from 'react'
import { connect } from 'react-redux'
import { is, List, Map } from 'immutable'
import './diagramResult.css'

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
      framework: null
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

    if (this.state.framework === null) {
      return ''
    }
    return (
      <div className="dresult">{ this.state.framework.get('title')}</div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagramResult)