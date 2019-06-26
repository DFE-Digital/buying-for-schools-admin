import React from 'react'
import DiagramQuestion from './DiagramQuestion'
import DiagramResult from './DiagramResult'
import { Map } from 'immutable'
import './diagramOption.css'

const DiagramOption = (props) => {
  const opt = props.opt || Map({
    ref: 'NEW',
    title: 'new',
    hint: '',
    nxt: '',
    result: ''
  })

  const ref = opt.get('ref')
  const title = opt.get('title') || 'undefined'
  const hint = opt.get('hint')
  const nxt = opt.get('next')
  const result = opt.get('result') || []
  const hasEnd = nxt || result.size
  const path = props.path + '/' + ref

  return (
    <div className="doption">
      <h3 id={path} onClick={e => props.onEdit(props.optionIndex)}>{ title }</h3>
      { hint && (<span className="doption__hint">{ hint }</span>)}
      { nxt && <DiagramQuestion qID={nxt} path={path} />}
      { result.map( r => (
        <DiagramResult frameworkId={r} key={r} />
      )) }
      { !hasEnd && (
        <div className="doption__endoptions">
          <button onClick={e => props.onEdit(props.optionIndex)} className="button doption__endbutton">Edit</button>
          <button onClick={e => props.onCreateNew(props.optionIndex)} className="button doption__endbutton">Create new question</button>
        </div>
      )}

      
    </div>
  )
}


export default DiagramOption