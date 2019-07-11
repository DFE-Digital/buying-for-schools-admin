import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { List } from 'immutable'
import { getFrameworks, deleteFramework } from '../../actions/framework-actions'
import { getFrameworkUsage } from '../../services/framework'

import './frameworks.css'

const mapStateToProps = (state) => {
  return {
    questions: state.questionReducer.questions || List([]),
    frameworks: state.frameworkReducer.frameworks || List([]),
    providers: state.providerReducer.providers || List([]),
    categories: state.categoryReducer.categories || List([])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteFramework: id => dispatch(deleteFramework(id))
  }
}

export class Frameworks extends Component {

  render() {

    console.log(this.props.frameworks.toJS())

    const usage = getFrameworkUsage(this.props.questions)

    const frameworksWithProvider = this.props.frameworks.map(f => {
      const provider = this.props.providers.find(p => p.get('_id') === f.get('provider'))
      return f.set('provider', provider ? provider.get('initials') : '') 
    })

    const frameworksWithCategories = frameworksWithProvider.map(f => {
      const category = this.props.categories.find(c => c.get('_id') === f.get('cat'))
      return f.set('cat', category ? category.get('title') : '')
    })

    const frameworks = frameworksWithCategories.sortBy(f => f.get('cat'))

    return (
      <div className="govuk-width-container">
        <h1>Frameworks</h1>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Ref</th>
              <th>Title</th>
              <th>Category</th>
              <th>Provider</th>
              <th>Expiry</th>
              <th>Usage</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {frameworks.map((f) => (
              <tr key={f.get('_id')}>
                <td className={`framework__status--${f.getIn(['_info', 'expiry', 'class'])}`}>{f.getIn(['_info', 'expiry', 'msg'])}</td>
                <td><Link to={`/framework/${f.get('_id')}`}>{f.get('ref')}</Link></td>
                <td>{f.get('title')}</td>
                <td>{f.get('cat')}</td>
                <td>{f.get('provider')}</td>
                <td>{f.getIn(['_info', 'displayDate'])}</td>
                <td>{usage[f.get('_id')] || 0}</td>
                <td><button className="button button--red" onClick={e => this.props.deleteFramework(f.get('_id'))}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/framework/new" className="button button--green">New Framework</Link>
        <Link to="/" className="button">Back</Link>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Frameworks)
