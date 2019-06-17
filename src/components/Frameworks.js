import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { get } from '../services/io'

import { frameworkUrl } from '../config'

export class Frameworks extends Component {
  constructor (props) {
    super(props)
    this.state = {
      frameworks: []
    }
  }

  componentDidMount() {
    get(frameworkUrl).then(frameworks => {
      this.setState({frameworks})
    })
  }

  render() {
    return (
      <div>
        <h2>Frameworks</h2>
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
            {this.state.frameworks.map((f) => (
              <tr key={f.ref}>
                <td><Link to={`/framework/${f.ref}`}>{f.ref}</Link></td>
                <td>{f.title}</td>
                <td>{f.supplier}</td>
                <td>{f.expiry}</td>
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

export default Frameworks
