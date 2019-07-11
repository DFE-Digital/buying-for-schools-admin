import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { List } from 'immutable'
import { getProviders, deleteProvider } from '../../actions/provider-actions'

const mapStateToProps = (state) => {
  return {
    providers: state.providerReducer.providers || List([])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteProvider: (id) => dispatch(deleteProvider(id))
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
            {this.props.providers.map((f) => (
              <tr key={f.get('_id')}>
                <td><Link to={`/provider/${f.get('_id')}`}>{f.get('initials')}</Link></td>
                <td>{f.get('title')}</td>
                <td><button className="button button--red" onClick={e => this.props.deleteProvider(f.get('_id'))}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/provider/new" className="button button--green">New Provider</Link>
        <Link to="/" className="button">Back</Link>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Providers)
