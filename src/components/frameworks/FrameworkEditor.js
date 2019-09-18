import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateFramework, saveNewFramework } from '../../actions/framework-actions'
import Input from '../form/Input'
import Select from '../form/Select'
import TextArea from '../form/TextArea'
import ErrorSummary from '../form/ErrorSummary'
import { List, Map } from 'immutable'
import { getBlankFramework } from '../../services/framework'



const mapStateToProps = (state) => {
  return {
    categories: state.categoryReducer.categories || List([]),
    updateErrors: state.frameworkReducer.updateErrors,
    frameworks: state.frameworkReducer.frameworks,
    providers: state.providerReducer.providers || List([]),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateFramework: (framework) => dispatch(updateFramework(framework)),
    saveNewFramework: (framework, parent = null) => dispatch(saveNewFramework(framework, parent)),
  }
}


export class FrameworkEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      framework: null,
      originalFramework: null,
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
    if (!List.isList(this.props.frameworks)) {
      // no frameworks have loaded yet
      return false
    }

    if (!Map.isMap(this.state.framework)) {
      // no framework to edit has been defined
      return true
    }

    const frameworkId = this.props.match.params.frameworkId
    if (frameworkId === 'new') {
      return false
    }

    const originalFramework = this.props.frameworks.find(q => q.get('_id') === frameworkId)
    if (!this.state.originalFramework.equals(originalFramework)) {
      // has the original framework changed as a result of a save?
      return true
    }

    if (prevProps && this.state.framework.get('_id') === prevProps.match.params.frameworkId) {
      // framework id has not changed
      return false
    }

    return true
  }

  update () {
    const frameworkId = this.props.match.params.frameworkId
    let framework
    if (frameworkId === 'new') {
      framework = getBlankFramework()
    } else {
      framework = this.props.frameworks.find(q => q.get('_id') === frameworkId)
    }
    if (framework && Map.isMap(framework)) {
      this.setState({ 
        framework: framework,
        originalFramework: framework
      })
    }
  }

  onChange (id, value) {
    this.setState({ framework: this.state.framework.set(id, value) })
  }

  onChangeLink (id, value) {
    const i = Number(id.substr(8))
    const key = id.substr(4,3) === 'txt' ? 'text' : 'url'
    // console.log(key, i, value)
    this.setState({ framework: this.state.framework.setIn(['links', i, key], value)})
  }

  addLink (e) {
    e.preventDefault()
    const newLinks = this.state.framework.get('links').push(Map({ text: '', url: ''}))
    this.setState({ framework: this.state.framework.set('links', newLinks) })
  }

  onRemoveLink (e, i) {
    e.preventDefault()
    const newLinks = this.state.framework.get('links').delete(i)
    this.setState({ framework: this.state.framework.set('links', newLinks) }) 
  }

  onSave (e) {
    e.preventDefault()
    const f = this.state.framework.delete('_info')
    if (f.get('_id') === 'new') {
      this.props.saveNewFramework(f.toJS()).then(data => {
        // if (data._id) {
        //   this.props.history.push(`/framework/${data._id}`)
        // }
        this.props.history.push('/framework')
      })
    } else {
      this.props.updateFramework(f.toJS()).then(data => {
        this.props.history.push('/framework')
      })
    }
  }

  getCategoryOptions () {
    const currentCat = this.state.framework.get('cat')
    const categoryOptions = this.props.categories.map(cat => {
      return {
        value: cat.get('_id'),
        label: cat.get('title')
      }
    }).sortBy(c => c.label)

    if (!categoryOptions.find(c => c.value === currentCat)) {
      return categoryOptions.unshift({value: '', label: 'Choose a category'})
    }

    return categoryOptions
  }

  getProviderOptions () {
    const currentProvider = this.state.framework.get('provider')
    const providerOptions = this.props.providers.map(pro => {
      return {
        value: pro.get('_id'),
        label: `${pro.get('initials')} (${pro.get('title')})`
      }
    }).sortBy(c => c.label)

    if (!providerOptions.find(p => p.value === currentProvider)) {
      return providerOptions.unshift({value: '', label: 'Choose a provider'})
    }

    return providerOptions
  }

  

  render () {
    if (!Map.isMap(this.state.framework)) {
      return <h1>Loading</h1>
    }

    const categoryOptions = this.getCategoryOptions()
    const providerOptions = this.getProviderOptions()

    const hasChanged = !this.state.framework.equals(this.state.originalFramework)
    const saveButtonClasses = ['button']
    if (hasChanged) {
      saveButtonClasses.push('button--green')
    }

    const hasErrors = this.props.updateErrors && this.props.updateErrors.data && this.props.updateErrors.data.errors
    const errorIds = hasErrors ? this.props.updateErrors.data.errors.map(e => e.id) : []
    const errors = hasErrors ? this.props.updateErrors.data.errors : []
    return (
      <div className="frameworkeditor govuk-width-container">
        <h1 className="frameworkeditor__title">Framework</h1>
        
        <form className="frameworkeditor__framework" id="frameworkeditorform">
          <ErrorSummary errors={errors} />
          
          <Input 
            id="ref"
            value={this.state.framework.get('ref')}
            label="Slug"
            onChange={this.onChange.bind(this)}
            error={errorIds.includes('ref')}
            />
          <Input 
            id="title"
            value={this.state.framework.get('title')}
            label="Title"
            onChange={this.onChange.bind(this)}
            error={errorIds.includes('title')}
            />
          <TextArea 
            id="descr"
            value={this.state.framework.get('descr')}
            label="Description"
            onChange={this.onChange.bind(this)}
            />
          <Input 
            id="expiry"
            value={this.state.framework.get('expiry')}
            label="Expiry"
            onChange={this.onChange.bind(this)}  
            />

          <Input 
            id="url"
            value={this.state.framework.get('url')}
            label="URL"
            onChange={this.onChange.bind(this)}  
            />

          <Select
            id="provider"
            value={this.state.framework.get('provider')}
            label="Provider"
            options={providerOptions}
            onChange={this.onChange.bind(this)}
          />

          <Select
            id="cat"
            label="Category"
            value={this.state.framework.get('cat')}
            options={categoryOptions}
            onChange={this.onChange.bind(this)}
          />
          <TextArea 
            id="body"
            value={this.state.framework.get('body')}
            label="Body"
            onChange={this.onChange.bind(this)}
            />

          <div className="frameworkeditor_links">
            <h2 className="govuk-label">Associated links</h2>
            <p>These are displayed in the righthand side column of the framework page</p>
            <table>
              <thead>
                <tr>
                  <th><label className="govuk-label" for="linkurl-0">Text</label></th>
                  <th><label className="govuk-label" for="linktxt-0">URL</label></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                { this.state.framework.get('links').map((l, i) => (
                  <tr key={`link-${i}`}>
                    <td>
                      <Input 
                        id={`linktxt-${i}`}
                        value={l.get('text')}
                        label="Text"
                        onChange={this.onChangeLink.bind(this)}  
                        />
                    </td>
                    <td>
                      <Input 
                        id={`linkurl-${i}`}
                        value={l.get('url')}
                        label="URL"
                        onChange={this.onChangeLink.bind(this)}  
                        />
                    </td>
                    <td>
                      <button className="button" onClick={e => this.onRemoveLink(e, i)}>Remove</button>
                    </td>          
                  </tr>  
                )) }
              </tbody>
            </table>
            <button id="addlinkbtn" className="button" onClick={e => this.addLink(e)}>Add link</button>
          </div>
          {/*<ReactMarkdown source={this.state.framework.get('body')} />*/}

          <input type="submit" id="savebtn" value="Save" className={saveButtonClasses.join(' ')} onClick={e => this.onSave(e)} />
          <Link to="/framework" id="cancelbtn" className="button">{ hasChanged ? 'Cancel' : 'Back' }</Link>    
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FrameworkEditor)