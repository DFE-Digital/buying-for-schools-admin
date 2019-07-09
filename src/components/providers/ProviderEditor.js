import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateProvider, saveNewProvider } from '../../actions/provider-actions'
import Input from '../form/Input'
import ErrorSummary from '../form/ErrorSummary'
import { List, Map } from 'immutable'
import { getBlankProvider } from '../../services/provider'

const mapStateToProps = (state) => {
  return {
    updateErrors: state.providerReducer.updateErrors,
    providers: state.providerReducer.providers
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateProvider: (provider) => dispatch(updateProvider(provider)),
    saveNewProvider: (provider, parent = null) => dispatch(saveNewProvider(provider, parent))
  }
}


export class ProviderEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      provider: null,
      originalProvider: null,
      error: ''
    }
  }

  componentDidMount () {
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
    if (!List.isList(this.props.providers)) {
      // no providers have loaded yet
      return false
    }

    if (!Map.isMap(this.state.provider)) {
      // no provider to edit has been defined
      return true
    }

    const providerId = this.props.match.params.providerId
    if (providerId === 'new') {
      return false
    }

    const originalProvider = this.props.providers.find(q => q.get('_id') === providerId)
    if (!this.state.originalProvider.equals(originalProvider)) {
      // has the original provider changed as a result of a save?
      return true
    }

    if (prevProps && this.state.provider.get('_id') === prevProps.match.params.providerId) {
      // provider id has not changed
      return false
    }

    return true
  }

  update () {
    const providerId = this.props.match.params.providerId
    let provider
    if (providerId === 'new') {
      provider = getBlankProvider()
    } else {
      provider = this.props.providers.find(q => q.get('_id') === providerId)
    }
    console.log(provider)
    if (provider && Map.isMap(provider)) {
      this.setState({ 
        provider: provider,
        originalProvider: provider
      })
    }
  }

  onChange (id, value) {
    this.setState({ provider: this.state.provider.set(id, value) })
  }

  onSave (e) {
    e.preventDefault()
    if (this.state.provider.get('_id') === 'new') {
      this.props.saveNewProvider(this.state.provider.toJS()).then(data => {
        if (data._id) {
          this.props.history.push(`/provider/${data._id}`)
        }
      })
    } else {
      this.props.updateProvider(this.state.provider.toJS())
    }
  }

  render () {
    console.log(this.state.provider)
    if (!Map.isMap(this.state.provider)) {
      return <h1>Loading</h1>
    }

    const hasChanged = !this.state.provider.equals(this.state.originalProvider)
    const saveButtonClasses = ['button']
    if (hasChanged) {
      saveButtonClasses.push('button--green')
    }

    const hasErrors = this.props.updateErrors && this.props.updateErrors.data && this.props.updateErrors.data.errors
    const errorIds = hasErrors ? this.props.updateErrors.data.errors.map(e => e.id) : []
    const errors = hasErrors ? this.props.updateErrors.data.errors : []
    return (
      <div className="providereditor govuk-width-container">
        <h1 className="providereditor__title">Provider</h1>
        
        <form className="providereditor__provider">
          <ErrorSummary errors={errors} />
          
          <Input 
            id="initials"
            value={this.state.provider.get('initials')}
            label="Initials/Short name/"
            hint="e.g. ESPO"
            onChange={this.onChange.bind(this)}
            error={errorIds.includes('initials')}
            />
          <Input 
            id="title"
            value={this.state.provider.get('title')}
            label="Title"
            onChange={this.onChange.bind(this)}
            error={errorIds.includes('title')}
            />
          
          <input type="submit" value="Save" className={saveButtonClasses.join(' ')} onClick={e => this.onSave(e)} />
          <Link to="/provider" className="button">{ hasChanged ? 'Cancel' : 'Back' }</Link>    
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProviderEditor)