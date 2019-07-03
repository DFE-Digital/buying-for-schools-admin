import React from 'react'
import { Link } from 'react-router-dom'

const QuestionsVisual = (props) => {
  return (
    <div className="govuk-width-container">
      <h1>Questions</h1>
      <table>
        <thead>
          <tr>
            <th>Ref</th>
            <th>Title</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {props.questionList.map(q => (
            <tr key={q.ref}>
              <td><span onClick={e => props.edit(q._id)}>{q.ref}</span></td>
              <td>{q.title}</td>
              <td>
                <table>
                  <tbody>
                    {q.options.map(opt => (
                      <tr key={opt._id}>
                        <td>{opt.ref}</td>
                        <td>{opt.title}</td>
                        <td>
                          {opt.next && (<span className="questions__next">{opt.next.title}</span>)}
                          {opt.result && opt.result.map(r => (
                            <span key={r._id} className="questions__result">{r.title}</span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
              <td><button className="button button--red" onClick={e => props.deleteQuestion(q._id)}>Delete</button></td>

            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/question/new" className="button button--green">New Question</Link>
      <Link to="/" className="button">Back</Link>
    </div>
  )
} 

export default QuestionsVisual