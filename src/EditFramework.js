import React, { Component } from 'react'
import Globals from './Globals'
import './editFramework.css'


class EditFramework extends Component {
 
  constructor (props) {
    super(props)
    const framework = Globals.app.state.frameworks.find(f => f.ref === props.framework) || {}
    


    this.state = {
      keyref: props.framework,
      title: framework.title || '',
      supplier: framework.supplier || '',
      url: framework.url || '',
      isNew: framework.ref ? false : true,
      category: framework.cat || ''
    }
  }

  closeIt (e) {
    e.preventDefault()
    Globals.app.setState({
      editingFramework: null
    })
  }

  handleKeyrefChange (e) {
    this.setState({ keyref: e.target.value });
  }

  handleTitleChange (e) {
    this.setState({ title: e.target.value });
  }

  handleSupplierChange (e) {
    this.setState({ supplier: e.target.value });
  }

  handleUrlChange (e) {
    this.setState({ url: e.target.value });
  }

  handleCategoryChange (e) {
    this.setState({ category: e.target.value });
  }

  getSaveUrl () {
    if(this.state.isNew) {
      return '/api/framework'
    }
    return '/api/framework/' + this.props.framework
  }

  save (e) {
    e.preventDefault()
    const method = this.state.isNew ? 'POST': 'PUT'
    const data = {
      ref: this.state.keyref,
      title: this.state.title,
      supplier: this.state.supplier,
      url: this.state.url,
      cat: this.state.category
    }
    
    fetch(this.getSaveUrl(), {
      method,
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(result => {
      Globals.app.setState({
        ...result,
        editing: null,
        editingAnswer: null,
        editingFramework: null
      })
    })

  }

  render () {
    return (
      <div className="editbox">
        <div className="editbox__field">
          <label className="editbox__label" htmlFor="ref">Ref</label>
          <input 
            title="ref"
            className="editbox__input editbox__input--ref" 
            type="text" 
            defaultValue={this.state.keyref} 
            onChange={this.handleKeyrefChange.bind(this)} 
          />
        </div>

        <div className="editbox__field">
          <label className="editbox__label" htmlFor="title">Title</label>
          <input 
            id="title"
            className="editbox__input editbox__input--title" 
            type="text" 
            defaultValue={this.state.title} 
            onChange={this.handleTitleChange.bind(this)} 
          />
        </div>

        <div className="editbox__field">
          <label className="editbox__label" htmlFor="supplier">Supplier</label>
          <input 
            id="supplier"
            className="editbox__input editbox__input--supplier" 
            type="text" 
            defaultValue={this.state.supplier} 
            onChange={this.handleSupplierChange.bind(this)} 
          />
        </div>

        <div className="editbox__field">
          <label className="editbox__label" htmlFor="url">URL</label>
          <input 
            id="url"
            className="editbox__input editbox__input--url" 
            type="text" 
            defaultValue={this.state.url} 
            onChange={this.handleUrlChange.bind(this)} 
          />
        </div>

        <div className="editbox__field">
          <label className="editbox__label" htmlFor="cat">Category</label>
          <select 
            id="category"
            className="editbox__input editbox__input--category" 
            defaultValue={this.state.category} 
            onChange={this.handleCategoryChange.bind(this)} 
          >
            <option value="">Category...</option>
            <option value="books">Books and related materials</option>
            <option value="energy">Energy and utilities</option>
            <option value="fm">Facilities management and estates</option>
            <option value="financial">Financial</option>
            <option value="ict">ICT</option>
            <option value="hr">Recruitment and HR</option>
            <option value="legal">Legal</option>
            <option value="professional">Professional</option>
          </select>
        </div>
        <a href="#" className="btn btn--grey" onClick={e => this.closeIt(e)}>Close</a>
        <a href="#" className="btn btn--green"onClick={e => this.save(e)}>Save</a>
      </div>
    )
  }
}

export default EditFramework