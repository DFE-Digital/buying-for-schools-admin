import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import DiagramOption from './DiagramOption'
import { Map, List } from 'immutable'
import './diagramQuestion.css'

const mapStateToProps = (state) => { 
  return {
    questions: state.questionReducer.questions
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // editQuestion: (qID, optionIndex) => dispatch(editQuestion(qID, optionIndex)),
    // createNewQuestion: (qID, optionIndex) => dispatch(createNewQuestion(qID, optionIndex))
  }
}

export class DiagramQuestion extends Component {
  constructor (props) {
    super(props)

    this.state = {
      questions: List([])
    }
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
              <h2 id={path}><Link to={`/diagram/${qID}`}>{ title }</Link></h2>
              { hint && (<span className="dquestion__hint">{ hint }</span>)}
              { err && (<span className="dquestion__err">{err}</span>)}
              <Link className="dquestion__addoption" to={`/diagram/${qID}/new`}></Link>
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
                    />
                </td>
            )})}
          </tr>
        </tbody>
      </table>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagramQuestion)