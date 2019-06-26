import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { get } from '../services/io'
import { questionUrl } from '../config'
import { List } from 'immutable'
import { getQuestions, deleteQuestion } from '../actions/question-actions'

const mapStateToProps = (state) => {
  return {
    questions: state.questionReducer.questions || []
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getQuestions: () => dispatch(getQuestions()),
    deleteQuestion: (id) => dispatch(deleteQuestion(id))
  }
}


export class Questions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      questions: []
    }
  }

  componentDidMount() {
    this.props.getQuestions()
  }

  deleteQuestion(id) {
    this.props.deleteQuestion(id)
  }

  render() {
    // let the Dropdown do the display
    if (!List.isList(this.props.questions)) {
      return (
        <p>Loading</p>
      )
    }


    return (
      <div>
        <h2>Questions</h2>
        <table>
          <thead>
            <tr>
              <th>Ref</th>
              <th>Title</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {this.props.questions.map(q => (
              <tr key={q.get('ref')}>
                <td><Link to={`/question/${q.get('_id')}`}>{q.get('ref')}</Link></td>
                <td>{q.title}</td>
                <td>
                  <table>
                    <tbody>
                      {q.get('options').map(opt => (
                        <tr key={q.get('_id')}>
                          <td>{opt.get('ref')}</td>
                          <td>{opt.get('title')}</td>
                          <td>{opt.get('result')}</td>
                          <td>{opt.get('next')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td><button className="button button--red" onClick={e => this.deleteQuestion(q.get('_id'))}>Delete</button></td>

              </tr>
            ))}
          </tbody>
        </table>

        <Link to="/question/new" className="button button--green">New Question</Link>
        <Link to="/" className="button">Back</Link>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions)
