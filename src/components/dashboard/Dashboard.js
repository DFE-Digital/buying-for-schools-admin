import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { List } from 'immutable'
import FrameworkExpiryList from '../frameworks/FrameworkExpiryList'
import Management from '../management/Management'

const mapStateToProps = (state) => {
  return {
    questions: state.questionReducer.questions || List([]),
    frameworks: state.frameworkReducer.frameworks || List([]),
    providers: state.providerReducer.providers || List([]),
    categories: state.categoryReducer.categories || List([])
  }
}

const mapDispatchToProps = (dispatch) => {
  return { }
}

export class Dashboard extends Component {

  render () {
    return (
      <div className="dashboard govuk-width-container">
        <h1>Dashboard</h1>
        <FrameworkExpiryList frameworks={this.props.frameworks} />
        <Link className="button" to="/structure">Publish options</Link>
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)