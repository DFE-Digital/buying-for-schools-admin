import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
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

export class Categories extends Component {
  constructor (props) {
    super(props)
    this.state = {
      categories: []
    }
  }

  componentDidMount() {
    this.props.getCategories()
  }

  render() {
    return (
      <div className="govuk-width-container">
        <h1>Categories</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {this.props.categories.map((f) => (
              <tr key={f.get('_id')}>
                <td><Link to={`/category/${f.get('_id')}`}>{f.get('_id')}</Link></td>
                <td>{f.get('title')}</td>
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
