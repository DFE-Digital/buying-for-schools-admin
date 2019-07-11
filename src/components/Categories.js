import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { List } from 'immutable'
import { getCategories, deleteCategory } from '../actions/category-actions'

const mapStateToProps = (state) => {
  return {
    categories: state.categoryReducer.categories || List([])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteCategory: (id) => dispatch(deleteCategory(id))
  }
}

export class Categories extends Component {
  constructor (props) {
    super(props)
    this.state = {
      categories: []
    }
  }

  render() {
    return (
      <div className="govuk-width-container">
        <h1>Categories</h1>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.categories.map((f) => (
              <tr key={f.get('_id')}>
                <td><Link to={`/category/${f.get('_id')}`}>{f.get('title')}</Link></td>
                <td><button className="button button--red" onClick={e => this.props.deleteCategory(f.get('_id'))}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/category/new" className="button button--green">New Category</Link>
        <Link to="/" className="button">Back</Link>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories)
