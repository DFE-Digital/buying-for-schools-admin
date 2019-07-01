import React, { Component } from 'react'
import CategoryForm from './CategoryForm'
import { get, put, post, remove } from '../services/io'

import { categoryUrl } from '../config'

export class Category extends Component {
  constructor (props) {
    super(props)
    this.state = {
      category: null,
      busy: true,
      error: ''
    }
  }

  componentDidMount() {
    const categoryId = this.props.match.params.categoryId
    if (categoryId === 'new') {
      this.setState({ category: {}, busy: false })
    } else {
      get(`${categoryUrl}/${categoryId}`).then(category => {
        this.setState({ category, busy: false })
      })
    }
  }

  handleChange(id, value) {
    const newState = {}
    newState[id] = value
    this.setState(newState)
  }

  save (f) {
    const categoryId = this.props.match.params.categoryId
    this.setState({ busy: true })
    
    const action = categoryId === 'new' ? post : put
    const url = categoryId === 'new' ? categoryUrl: `${categoryUrl}/${categoryId}`
    
    action(url, f).then(response => {
      if (response.ok) {
        this.props.history.push('/category')
      } else {
        this.setState({ error: response.data.msg })
      }
    })
  }

  delete () {
    const categoryId = this.props.match.params.categoryId
    this.setState({ busy: true })
    remove(`${categoryUrl}/${categoryId}`).then(response => {
      this.props.history.push('/category')
    })
  }

  render() {
    if (this.state.category || !this.state.busy) {

      return (
        <div>
          {this.state.error && (
            <h2>Error: {this.state.error}</h2>
          )}
          <CategoryForm category={this.state.category} save={this.save.bind(this)} delete={this.delete.bind(this)} />
        </div>
      )
    }
    return <h2>Loading</h2>
  }
}

export default Category
