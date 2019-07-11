import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { List } from 'immutable'
import { confirmDeleteProvider } from '../../actions/provider-actions'

const mapStateToProps = (state) => {
  return {
    providers: state.providerReducer.providers || List([])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteProvider: (provider) => dispatch(confirmDeleteProvider(provider))
  }
}

export class Providers extends Component {
  constructor (props) {
    super(props)
    this.state = {
      providers: []
    }
  }

  render() {
    return (
      <div className="govuk-width-container">
        <h1>Providers</h1>
        <table>
          <thead>
            <tr>
              <th>Initials</th>
              <th>Title</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.providers.map((p) => (
              <tr key={p.get('_id')}>
                <td><Link to={`/provider/${p.get('_id')}`}>{p.get('initials')}</Link></td>
                <td>{p.get('title')}</td>
                <td><button className="button button--red" onClick={e => this.props.deleteProvider(p)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/provider/new" className="button button--green">New Provider</Link>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Providers)
