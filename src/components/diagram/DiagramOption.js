import React, { Component } from 'react'
import DiagramQuestion from './DiagramQuestion'
import DiagramResult from './DiagramResult'
import './diagramOption.css'

const DiagramOption = (props) => {
  const opt = props.opt
  const nxt = opt.next || null
  const result = opt.result || []

  if (!opt || !opt.title) {
    return <h4>Undefined option</h4>
  }

  const path = props.path + '/' + opt.ref

  return (
    <div className="doption">
      <h3 id={path}>{ opt.title }</h3>
      { opt.hint && (<span className="doption__hint">{ opt.hint }</span>)}
      {nxt && <DiagramQuestion questions={props.questions} qref={nxt} path={path} />}
      {result && result.length && result.map(res => (
        <DiagramResult result={res} />
      ))}
    </div>
  )
}


export default DiagramOption