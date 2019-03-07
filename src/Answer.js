import React, { Component } from 'react'
import Question from './Question'
import Result from './Result'
import Globals from './Globals'
import './answer.css'

class Answer extends Component {
  showEdit (e) {
    e.preventDefault()
    Globals.app.edit(this.props.hierarchy, this.props.opt, e)
  }

  render () {
    const { opt } = this.props
    const nxt = opt.next && opt.next.ref ? opt.next : null
    const result = opt.result

    if (!opt || !opt.title) {
      return <h4>Undefined option</h4>
    }

    return (
      <div className="answer">
        <h3><a href="#" onClick={e => this.showEdit(e)}>{ opt.title }</a></h3>
        { opt.hint && (<span className="answer__hint">{ opt.hint }</span>)}
        {nxt && <Question hierarchy={nxt} />}
        {result && <Result result={result} templateExists={opt.templateExists}/>}
      </div>
    )
  }
}

export default Answer
