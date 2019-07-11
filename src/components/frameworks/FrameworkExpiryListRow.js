import React from 'react'
import { Link } from 'react-router-dom'

export default props => {
  const f = props.framework
  const eb = f.getIn(['_info', 'expiryBlock'])
  const id = f.get('_id')
  const title = f.get('title')
  const msg = f.getIn(['_info', 'expiry', 'msg'])
  const classes = ['frameworkexpirylist__row']

  switch(eb) {
    case 0: {
      classes.push('frameworkexpirylist__row--expired')
      break
    }
    case 1: {
      classes.push('frameworkexpirylist__row--expiryimminent')
      break
    }
    case 3: {
      classes.push('frameworkexpirylist__row--expirysoon')
      break
    }
    case 6: {
      classes.push('frameworkexpirylist__row--expirywarning')
      break
    }

    default: {
      
    }
  }

  return (
    <tr>
      <td className={`framework__status--${f.getIn(['_info', 'expiry', 'class'])}`}>{ msg }</td>
      <td><Link to={ `/framework/${id}` }>{ title}</Link></td>
      <td>{ f.getIn(['_info', 'displayDate']) }</td>
    </tr>
  )
}

