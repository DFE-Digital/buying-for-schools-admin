import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { List } from 'immutable'

import { getStructures } from '../../actions/structure-actions'



const mapStateToProps = (state) => {
  return {
    structures: state.structureReducer.structures || List([])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getStructures: () => dispatch(getStructures())
  }
}

export class Management extends Component {
  componentDidMount() {
    this.props.getStructures()
  }

  getLink(s) {
    switch(s.get('status')){
      case 'DRAFT': {
        return <Link to={`/structure/${s.get('_id')}`}>Publish</Link>
      }
      case 'LIVE': {
        return <Link to={`/structure/${s.get('_id')}`}>Copy to draft</Link>
      }
      default: {
        return <Link to={`/structure/${s.get('_id')}`}>Restore</Link>
      }
    }
  }

  render() {
    return (
      <div className="categoryeditor govuk-width-container">
        <h1>Management</h1>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.structures.map((s) => (
              <tr key={s.get('_id')}>
                <td>{ s.get('_id') }</td>
                <td>{ s.get('status') }</td>
                <td>{ s.get('updatedAt') }</td>
                <td>{ s.getIn(['published', 'date']) }</td>
                <td>{ s.getIn(['published', 'note']) }</td>
                <td>{ this.getLink(s) }</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Management)
