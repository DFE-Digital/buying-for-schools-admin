import React, { Component } from 'react'
import DiagramOption from './DiagramOption'
import './diagramQuestion.css'


const DiagramQuestion = (props) => {

  const { questions, qref } = props
  const q = questions.find(q => q.ref === qref)

  if (!q || !q.ref) {
    return (
      <p>{qref}</p>
    )
  }

  const path = props.path + '/' + q.ref

  return (
    <table className="dquestiontable">
      <tbody>
        <tr className="dquestion--outer">
          <td className="dquestion" colSpan={ q.options.length }>
            <h2 id={path}>{ q.title }</h2>
            { q.hint && (<span className="dquestion__hint">{ q.hint }</span>)}
            { q.err && (<span className="dquestion__err">{q.err}</span>)}
          </td>
        </tr>
        <tr className="doptions">
          {q.options.map(opt => (
            <td className="doption--outer">
              <DiagramOption questions={questions} opt={opt} q={q} path={path} />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

export default DiagramQuestion