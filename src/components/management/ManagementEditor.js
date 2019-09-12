import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'

import Input from '../form/Input'
import ErrorSummary from '../form/ErrorSummary'
import { List, Map } from 'immutable'
import { get } from '../../services/io'
import { structureUrl } from '../../config'
import { getStructures, publish, deleteStructure, restore, archive, structureDraftChanged } from '../../actions/structure-actions'

const mapStateToProps = (state) => {
  return {
    updateErrors: state.structureReducer.updateErrors,
    structures: state.structureReducer.structures
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getStructures: () => dispatch(getStructures()),
    publish: (id, title) => dispatch(publish(id, title)),
    deleteStructure: id => dispatch(deleteStructure(id)),
    restore: id => dispatch(restore(id)),
    archive: (id) => dispatch(archive(id)),
    structureDraftChanged: id => dispatch(structureDraftChanged(id))
    // clone: (id, updates) => dispatch(clone(id, updates))
  }
}


export class StructureEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      structure: null,
      originalStructure: null,
      error: '',
      title: '',
      json: ''
    }
  }

  componentDidMount () {
    this.props.getStructures()
    if (this.needsUpdate()) {
      this.update() 
    }
  }

  componentDidUpdate (prevProps) {
    if (this.needsUpdate(prevProps)) {
      this.update() 
    }
  }

  needsUpdate (prevProps) {
    if (!List.isList(this.props.structures)) {
      // no structures have loaded yet
      return false
    }

    if (!Map.isMap(this.state.structure)) {
      // no structure to edit has been defined
      return true
    }

    const structureId = this.props.match.params.structureId
    const originalStructure = this.props.structures.find(q => q.get('_id') === structureId)
    if (!this.state.originalStructure.equals(originalStructure)) {
      // has the original structure changed as a result of a save?
      return true
    }

    if (prevProps && this.state.structure.get('_id') === prevProps.match.params.structureId) {
      // structure id has not changed
      return false
    }

    return true
  }

  update () {
    const structureId = this.props.match.params.structureId
    const structure = this.props.structures.find(q => q.get('_id') === structureId)
    
    if (structure && Map.isMap(structure)) {
      this.setState({ 
        structure: structure,
        originalStructure: structure
      })
    }

    get(`${structureUrl}/${structureId}`)
    .then(data => {
      console.log(data)
      this.setState({ json:JSON.stringify(data, null, '  ') })
    })
    .catch(err => {
      console.log(err)
      this.setState({ json: '' })
    })
  }

  onChange (id, value) {
    const newValues = {}
    newValues[id] = value
    this.setState(newValues)
  }

  onPublish (e) {
    e.preventDefault()
    const id = this.state.structure.get('_id')
    const liveDocs = this.props.structures.filter(s => s.get('status') === 'LIVE')
    const promises = liveDocs.map(s => this.props.archive(s.get('_id')))
    Promise.all(promises)
      .then(() => this.props.publish(id, this.state.note))
      .then(() => this.props.restore(id))
      .then(draft => this.props.structureDraftChanged(draft.data._id))
      .then(() => this.props.history.push('/structure'))
  }

  onRestore (e) {
    e.preventDefault()
    const id = this.state.structure.get('_id')
    const drafts = this.props.structures.filter(s => s.get('status') === 'DRAFT')
    const promises = drafts.map(s => this.props.deleteStructure(s.get('_id')))
    return Promise.all(promises)
      .then(() => this.props.restore(id))
      .then(draft => this.props.structureDraftChanged(draft.data._id))
      .then(() => this.props.history.push('/structure'))
  }

  render () {
    if (!Map.isMap(this.state.structure)) {
      return <h1>Loading</h1>
    }

    const published = moment(this.state.structure.get('published'))

    const structure = this.state.structure
      .set('published', published.isValid() ? published.format('DD/MM/YYYY HH:mm'): '')
      .set('publishedAgo', published.isValid() ? published.fromNow(): '')
      

    const hasChanged = !structure.equals(this.state.originalStructure)
    const saveButtonClasses = ['button']
    if (hasChanged) {
      saveButtonClasses.push('button--green')
    }
    const status = structure.get('status')
    const hasErrors = this.props.updateErrors && this.props.updateErrors.data && this.props.updateErrors.data.errors
    const errors = hasErrors ? this.props.updateErrors.data.errors : []
    return (
      <div className="structureeditor govuk-width-container">
        
        
        <form className="structureeditor__structure">
          <ErrorSummary errors={errors} />
         
          { status === 'DRAFT' && (
            <div>
              <h1 className="structureeditor__title">Publish changes</h1>
              <p className="govuk-body">Publish the current changes to live.</p>
              <p className="govuk-body">Archive the current live version.</p>
              <Input 
                id="note"
                value={structure.get('title')}
                label="Title"
                hint="A label or reference to help identify this version of the data"
                onChange={this.onChange.bind(this)}
                />
              <button className="button button--red" onClick={e => this.onPublish(e)}>Publish</button>
            </div>
          )}

          { status === 'ARCHIVE' && (
            <div>
              <h1 className="structureeditor__title">Restore an archive</h1>
              <p className="govuk-body">Load archive: <span className="structure__attribute">{ structure.get('title') }</span> published: <span className="structure__attribute">{structure.get('publishedAgo')} ({structure.get('published')})</span> to the test site, so that it can be checked before being published.</p>
              <button className="button button--red" onClick={e => this.onRestore(e)}>Restore</button>
            </div>
          )}

          { status === 'LIVE' && (
            <div>
              <h1 className="structureeditor__title">Discard changes</h1>
              <p className="govuk-body">Discard all changes, revert test site to match content on Live: <span className="structure__attribute">{ structure.get('title') }</span> published: <span className="structure__attribute">{structure.get('publishedAgo')} ({structure.get('published')})</span></p>
              <button className="button button--red" onClick={e => this.onRestore(e)}>Revert changes</button>
            </div>
          )}

          <Link to="/structure" className="button">{ hasChanged ? 'Cancel' : 'Back' }</Link>

        </form>

        <div className="structureeditor__json">
          <a onClick={ e => this.setState({ showJson: !this.state.showJson }) }>Show JSON</a>
          { this.state.showJson && (
            <textarea value={ this.state.json } />
          )}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(StructureEditor))