import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import Input from '../form/Input'
import TextArea from '../form/TextArea'
import ErrorSummary from '../form/ErrorSummary'
import { List, Map } from 'immutable'

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
    publish: (id, note) => dispatch(publish(id, note)),
    deleteStructure: id => dispatch(deleteStructure(id)),
    restore: id => dispatch(restore(id)),
    archive: (id, note) => dispatch(archive(id, note)),
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
      note: ''
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
    const promises = liveDocs.map(s => this.props.archive(s.get('_id'), `Archived in favour of: ${this.state.note}`))
    Promise.all(promises)
      .then(() => this.props.publish(id, this.state.note))
      .then(() => this.props.restore(id))
      .then(draft => this.props.structureDraftChanged(draft.data._id))
      .then(() => this.props.getStructures())
  }

  onRestore (e) {
    e.preventDefault()
    const id = this.state.structure.get('_id')
    const drafts = this.props.structures.filter(s => s.get('status') === 'DRAFT')
    const promises = drafts.map(s => this.props.deleteStructure(s.get('_id')))
    return Promise.all(promises)
      .then(() => this.props.restore(id))
      .then(draft => this.props.structureDraftChanged(draft.data._id))
      .then(() => this.props.getStructures())
  }

  render () {
    if (!Map.isMap(this.state.structure)) {
      return <h1>Loading</h1>
    }

    const hasChanged = !this.state.structure.equals(this.state.originalStructure)
    const saveButtonClasses = ['button']
    if (hasChanged) {
      saveButtonClasses.push('button--green')
    }
    const status = this.state.structure.get('status')
    const hasErrors = this.props.updateErrors && this.props.updateErrors.data && this.props.updateErrors.data.errors
    const errorIds = hasErrors ? this.props.updateErrors.data.errors.map(e => e.id) : []
    const errors = hasErrors ? this.props.updateErrors.data.errors : []
    return (
      <div className="structureeditor govuk-width-container">
        <h1 className="structureeditor__title">Structure</h1>
        
        <form className="structureeditor__structure">
          <ErrorSummary errors={errors} />
          
          <h2>{ status }</h2>
          { status === 'DRAFT' && (
            <div>
              <p className="govuk-body">Publish the current draft to live.</p>
              <p className="govuk-body">Archive the current live version.</p>
              <TextArea 
                id="note"
                value={this.state.publishnote}
                label="Publish note"
                hint="Why is this being published? e.g. Updated the Books and Materials framework"
                onChange={this.onChange.bind(this)}
                />
              <button className="button button--red" onClick={e => this.onPublish(e)}>Publish</button>
            </div>
          )}

          { status === 'ARCHIVE' && (
            <div>
              <p className="govuk-body-l">Replace the current draft with a copy of this archive?</p>
              <p className="govuk-body">The archived data will remain so, but a copy of it will replace the draft version, such that it can be edited and then pushed live.</p>
              <button className="button button--red" onClick={e => this.onRestore(e)}>Replace draft with archive</button>
            </div>
          )}

          { status === 'LIVE' && (
            <div>
              <p className="govuk-body">{ this.state.structure.getIn(['published', 'date']) }</p>
              <p className="govuk-body">{ this.state.structure.getIn(['published', 'note']) }</p>
              <p className="govuk-body-l">Replace the current draft with a copy of the Live data?</p>
              <p className="govuk-body">The live data will not be altered, but a copy of it will replace the draft version, such that it can be edited and then pushed live.</p>
              <button className="button button--red" onClick={e => this.onRestore(e)}>Replace draft with live</button>
            </div>
          )}


          
          <Link to="/structure" className="button">{ hasChanged ? 'Cancel' : 'Back' }</Link>
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StructureEditor)