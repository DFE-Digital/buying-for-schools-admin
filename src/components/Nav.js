import React from 'react'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import './nav.css'

const Nav = props => {
  return (
    <nav className="govuk-width-container js-enabled govuk-tabs">
      <ul className="govuk-tabs__list" role="tablist">
        <li className="govuk-tabs__list-item" role="presentation">
          <NavLink className="govuk-tabs__tab" activeClassName="govuk-tabs__tab--selected" to="/"  exact={true}>Dashboard</NavLink>
        </li>
        <li className="govuk-tabs__list-item" role="presentation">
          <NavLink className="govuk-tabs__tab" activeClassName="govuk-tabs__tab--selected" to="/diagram"  exact={true}>Diagram</NavLink>
        </li>
        <li className="govuk-tabs__list-item" role="presentation">
          <NavLink className="govuk-tabs__tab" activeClassName="govuk-tabs__tab--selected" to="/framework">Frameworks</NavLink>
        </li>
        <li className="govuk-tabs__list-item" role="presentation">
          <NavLink className="govuk-tabs__tab" activeClassName="govuk-tabs__tab--selected" to="/question">Question</NavLink>
        </li>
        <li className="govuk-tabs__list-item" role="presentation">
          <NavLink className="govuk-tabs__tab" activeClassName="govuk-tabs__tab--selected" to="/category">Category</NavLink>
        </li>
        <li className="govuk-tabs__list-item" role="presentation">
          <NavLink className="govuk-tabs__tab" activeClassName="govuk-tabs__tab--selected" to="/provider">Provider</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Nav)