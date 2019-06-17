import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { get } from '../services/io'
import { questionUrl } from '../config'

export class Questions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      questions: []
    }
  }

  componentDidMount() {
    get(questionUrl).then(questions => {
      this.setState({ questions })
    })
  }

  render() {
    // let the Dropdown do the display

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
            {this.state.questions.map((q) => (
              <tr key={q.ref}>
                <td><Link to={`/question/${q.ref}`}>{q.ref}</Link></td>
                <td>{q.title}</td>
                <td>
                  <table>
                    <tbody>
                      {q.options.map((opt) => (
                        <tr key={q.ref + opt.ref}>
                          <td>{opt.ref}</td>
                          <td>{opt.title}</td>
                          <td>{opt.result}</td>
                          <td>{opt.next}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
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

export default Questions
