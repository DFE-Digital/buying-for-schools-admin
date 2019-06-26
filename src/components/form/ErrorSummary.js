import React from 'react'

const ErrorSummary = props => {

  if (!props.errors || props.errors.length === 0) {
    return ''
  }

  return (
    <div className="govuk-error-summary">
      <h2 className="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>
      <div className="govuk-error-summary__body">
        <ul className="govuk-list govuk-error-summary__list">
          {props.errors.map((e, i) => (
            <li key={`error-${i}`}><a href={`#${e.id}`}>{ e.msg }</a></li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ErrorSummary