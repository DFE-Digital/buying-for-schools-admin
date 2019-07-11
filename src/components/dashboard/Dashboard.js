import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import FrameworkExpiryList from '../frameworks/FrameworkExpiryList'

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
        
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)