import React, { Component } from 'react'
import Answer from './Answer'
import Globals from './Globals'
import './result.css'

class Result extends Component {

  showEdit (e) {
    e.preventDefault()
    Globals.app.editFramework(this.props.result)
  }

  render () {
    const result = Globals.app.state.frameworks.find(f => f.ref === this.props.result)
    const classes = ['result__link']
    if (!this.props.result) {
      return ''
    }
    if (result && result.templateExists) {
      classes.push('result__link--exists')
    }
    return (
      <div className="result">
        <a className={classes.join(' ')} href="#" onClick={e => this.showEdit(e)}>{ this.props.result }</a>
        { result && (
            <span className="result__title">Supplier: { result.supplier }</span>
        )}
        { result && result.cat && (
          <span className="result__cat">Cat: { result.cat }</span>
        )}
        { result && !result.cat && (
          <span className="result__cat result__cat--error">Cat: NONE</span>
        )}

      </div>
    )
  }
}

export default Result