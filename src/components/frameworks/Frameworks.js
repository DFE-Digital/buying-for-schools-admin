import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { List } from 'immutable'
import { getFrameworks } from '../../actions/framework-actions'
import { getFrameworkUsage } from '../../services/framework'

const mapStateToProps = (state) => {
  return {
    questions: state.questionReducer.questions || List([]),
    frameworks: state.frameworkReducer.frameworks || List([]),
    providers: state.providerReducer.providers || List([]),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getFrameworks: () => dispatch(getFrameworks())
  }
}

export class Frameworks extends Component {
  constructor (props) {
    super(props)
    this.state = {
      frameworks: []
    }
  }

  componentDidMount() {
    this.props.getFrameworks()
  }

  render() {

    const usage = getFrameworkUsage(this.props.questions)

    const frameworks = this.props.frameworks.map(f => {
      const provider = this.props.providers.find(p => p.get('_id') === f.get('provider'))
      return f.set('provider', provider ? provider.get('initials') : '') 
    })

    return (
      <div className="govuk-width-container">
        <h1>Frameworks</h1>
        <table>
          <thead>
            <tr>
              <th>Ref</th>
              <th>Title</th>
              <th>Provider</th>
              <th>Expiry</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            {frameworks.map((f) => (
              <tr key={f.get('_id')}>
                <td><Link to={`/framework/${f.get('_id')}`}>{f.get('ref')}</Link></td>
                <td>{f.get('title')}</td>
                <td>{f.get('provider')}</td>
                <td>{f.get('expiry')}</td>
                <td>{usage[f.get('_id')] || 0}</td>
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
