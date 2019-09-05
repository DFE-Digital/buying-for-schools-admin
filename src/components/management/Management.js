import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { List } from 'immutable'
import { getCookie } from '../../services/utils'
import { cookieName } from '../../config'
import './management.css'
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
        return <Link to={`/structure/${s.get('_id')}`} className="button">Publish</Link>
      }
      case 'LIVE': {
        return <Link to={`/structure/${s.get('_id')}`} className="button">Copy to draft</Link>
      }
      default: {
        return <Link to={`/structure/${s.get('_id')}`} className="button">Restore</Link>
      }
    }
  }

  render() {
    const structures = this.props.structures.map(s => {
      const updatedAt = moment(s.get('updatedAt'))
      const published = moment(s.get('published'))
      const archived = moment(s.get('archived'))

      return s
        .set('updatedAt', updatedAt.isValid() ? updatedAt.format('DD/MM/YYYY HH:mm'): '')
        .set('published', published.isValid() ? published.format('DD/MM/YYYY HH:mm'): '')
        .set('archived', archived.isValid() ? archived.format('DD/MM/YYYY HH:mm'): '')
    })

    
    return (
      <div className="managementeditor govuk-width-container">
        <h1>Management</h1>
        {structures.size && (
          <table id="structuretable">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Published</th>
                <th>Archived</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {structures.map((s) => (
                <tr key={s.get('_id')} className={`structuretable__${s.get('status').toLowerCase()}`}>
                  <td>{ s.get('title') }</td>
                  <td>{ s.get('status') }</td>
                  <td>{ s.get('updatedAt') }</td>
                  <td>{ s.get('published') }</td>
                  <td>{ s.get('archived') }</td>
                  <td>{ this.getLink(s) }</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Management)
