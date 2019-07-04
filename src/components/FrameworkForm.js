import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Input from './form/Input'
import Select from './form/Select'
import { List } from 'immutable'

import { getCategories } from '../actions/category-actions'

const mapStateToProps = (state) => {
  return {
    categories: state.categoryReducer.categories || List([])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCategories: () => dispatch(getCategories())
  }
}


export class FrameworkForm extends Component {
  constructor (props) {
    super(props)
    const f = this.props.framework
    this.state = {
      categories: List([]),
      ref: '',
      title: '',
      cat: '',
      descr: '',
      expiry: '',
      supplier: '',
      url: '',
      ...f 
    }
  }

  componentDidMount() {
    this.props.getCategories()
  }

  handleChange(id, value) {
    const newState = {}
    newState[id] = value
    this.setState(newState)
  }

  submit(e) {
    e.preventDefault()
    this.props.save(this.state)
  }

  delete(e) {
    e.preventDefault()
    this.props.delete()
  }

  render () {
    const categoryOptions = this.props.categories.map(cat => {
      return {
        value: cat.get('_id'),
        label: cat.get('title')
      }
    }).toJS()

    if (!this.state.cat) {
      console.log(`cat="${this.state.cat}"`, categoryOptions)
      categoryOptions.unshift({value: '', label: 'Choose a category'})

    }

    const labels = {
      'ref': 'Ref',
      'title': 'Title',
      'descr': 'Description',
      'expiry': 'Expiry',
      'supplier': 'Supplier',
      'url': 'URL'
    }
    return (
      <form>
        { Object.keys(labels).map(ref => (
          <Input 
            key={ref}
            id={ref}
            value={this.state[ref]}
            label={labels[ref]}
            onChange={this.handleChange.bind(this)}  
            />
        ))}

        <Select
          className=""
          id="cat"
          label="Category"
          value={this.state.cat}
          options={categoryOptions}
          onChange={this.handleChange.bind(this)}
        />

        <Link to="/framework" className="button">Cancel</Link>
        <input type="submit" value="Submit" className="button button--green" onClick={e => this.submit(e)} />
        <button className="button button--red" onClick={e => this.delete(e)}>Delete</button>
      </form>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FrameworkForm)
