import React from 'react'
import FrameworkExpiryListRow from './FrameworkExpiryListRow'

export default props => {

  if (!props.frameworks.size) {
    return (
      <div id="frameworkexpiry">
        <h2>Framework expiry</h2>
      </div>
    )
  }

  const expiredFrameworks = props.frameworks.filter(f => {
    const eb = f.getIn(['_info', 'expiry', 'block'])
    return eb !== null && eb !== -1
  }).sortBy(f => f.get('expiry'))

  return (
    <div id="frameworkexpiry">
      <h2>Framework expiry</h2>
      <table id="frameworkexpiry__table">
        <tbody>
          { expiredFrameworks.map(f => <FrameworkExpiryListRow key={f.get('_id')} framework={f} /> )}
        </tbody>
      </table>
    </div>
  )
}