import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { List, Map } from 'immutable'
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

  render() {
    const structures = this.props.structures.map(s => {
      const updatedAt = moment(s.get('updatedAt'))
      const published = moment(s.get('published'))
      const archived = moment(s.get('archived'))

      return s
        .set('updatedAt', updatedAt.isValid() ? updatedAt.format('DD/MM/YYYY HH:mm'): '')
        .set('published', published.isValid() ? published.format('DD/MM/YYYY HH:mm'): '')
        .set('archived', archived.isValid() ? archived.format('DD/MM/YYYY HH:mm'): '')
        .set('updatedAtAgo', updatedAt.isValid() ? updatedAt.fromNow(): '')
        .set('publishedAgo', published.isValid() ? published.fromNow(): '')
        .set('archivedAgo', archived.isValid() ? archived.fromNow(): '')
    })
    

    const draft = structures.find(s => s.get('status') === 'DRAFT') || Map({})
    const live = structures.find(s => s.get('status') === 'LIVE') || Map({})
    const changed = true //live.get('updatedAt') !== draft.get('updatedAt')

    const archives = structures.filter(s => s.get('status') === 'ARCHIVE')


    return (
      <div className="managementeditor govuk-width-container">

        <h1 className="govuk-heading-l govuk-!-margin-bottom-3">Publishing</h1>

        <h2 className="govuk-!-margin-bottom-0">Live now</h2>
        <p className="govuk-body govuk-!-margin-bottom-0"><span className="structure__attribute">{ live.get('title') }</span> published: <span className="structure__attribute">{live.get('publishedAgo')} ({live.get('published')})</span></p>

        <h2 className="govuk-!-margin-bottom-0">Changes</h2>
        <p className="govuk-body govuk-!-margin-bottom-0">Content on the test site and editable within the admin interface.</p>
        { changed && (
          <div>
            
            <Link to={`/structure/${draft.get('_id')}`} className="button button--green">Publish changes</Link>
            <p className="govuk-body">Last changed: {draft.get('updatedAtAgo')} ({draft.get('updatedAt')})</p>
            
            <Link to={`/structure/${live.get('_id')}`} className="button button--red">Discard changes</Link> 
            <p className="govuk-body">Discard all changes not currently live.</p>
          </div>
        )}

        {!changed && (
          <p>No changes found</p>
        )}


        {archives.size && (
          <div>
            <h2 className="govuk-!-margin-bottom-0">Archives</h2>
            <p className="govuk-body">When changes are published the live content gets archived and can be restored if required.</p>
            <table id="structuretable">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Updated</th>
                  <th>Published</th>
                  <th>Archived</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {archives.map((s) => (
                  <tr key={s.get('_id')} className={`structuretable__${s.get('status').toLowerCase()}`}>
                    <td>{ s.get('title') }</td>
                    <td>{ s.get('updatedAt') }</td>
                    <td>{ s.get('published') }</td>
                    <td>{ s.get('archived') }</td>
                    <td><Link to={`/structure/${s.get('_id')}`} className="button">Restore</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Management)
