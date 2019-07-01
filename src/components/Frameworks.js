import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getFrameworks } from '../actions/framework-actions'

const mapStateToProps = (state) => {
  return {
    frameworks: state.frameworkReducer.frameworks
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
    return (
      <div className="govuk-width-container">
        <h1>Frameworks</h1>
        <table>
          <thead>
            <tr>
              <th>Ref</th>
              <th>Title</th>
              <th>Supplier</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            {this.props.frameworks.map((f) => (
              <tr key={f.get('ref')}>
                <td><Link to={`/framework/${f.get('ref')}`}>{f.get('ref')}</Link></td>
                <td>{f.get('title')}</td>
                <td>{f.get('supplier')}</td>
                <td>{f.get('expiry')}</td>
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
