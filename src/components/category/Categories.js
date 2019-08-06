import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { List } from 'immutable'
import { confirmDeleteCategory } from '../../actions/category-actions'

const mapStateToProps = (state) => {
  return {
    categories: state.categoryReducer.categories || List([])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteCategory: (category) => dispatch(confirmDeleteCategory(category))
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
              <th>Ref</th>
              <th>Title</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.categories.map(c => (
              <tr key={c.get('_id')}>
                <td>{c.get('ref')}</td>
                <td><Link to={`/category/${c.get('_id')}`}>{c.get('title')}</Link></td>
                <td><button className="button button--red" onClick={e => this.props.deleteCategory(c)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/category/new" className="button button--green">New Category</Link>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories)
