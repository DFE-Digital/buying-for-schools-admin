import React from 'react'
import { Link } from 'react-router-dom'
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
  const path = props.path
  const qID = props.q.get('_id')
  const optId = opt.get('_id')

  return (
    <div id={path} className="doption">
      <span className="doption__slug">{ ref }</span>
      <h3><Link to={`/diagram/${qID}/${optId}?return=diagram`}>{ title }</Link></h3>
      { hint && (<span className="doption__hint">{ hint }</span>)}
      { nxt && <DiagramQuestion qID={nxt} path={path} />}
      { result.map( r => (
        <DiagramResult frameworkId={r} key={r} path={path} />
      )) }
      { !hasEnd && (
        <div className="doption__endoptions">
          <Link to={`/diagram/${qID}/${optId}?return=diagram`} className="doption__link doption__link--edit">Edit</Link>
          <Link to={`/diagram/new?parentId=${qID}&optionId=${optId}`} className="doption__link doption__link--newquestion">Create new question</Link>
        </div>
      )}      
    </div>
  )
}


export default DiagramOption