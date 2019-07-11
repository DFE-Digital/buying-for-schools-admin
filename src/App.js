import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css';
import "../node_modules/govuk-frontend/all.scss"

import Nav from './components/Nav'
import Dashboard from './components/dashboard/Dashboard'
import Frameworks from './components/frameworks/Frameworks'
import Categories from './components/Categories'
import Category from './components/Category'
import Providers from './components/providers/Providers'
import Questions from './components/questions/Questions'
import Diagram from './components/diagram/Diagram'

import { connect } from 'react-redux'
import { getQuestions } from './actions/question-actions'
import { getFrameworks } from './actions/framework-actions'
import { getProviders } from './actions/provider-actions'
import { getCategories } from './actions/category-actions'
import QuestionEditor from './components/questions/QuestionEditor'
import OptionEditor from './components/questions/OptionEditor'
import FrameworkEditor from './components/frameworks/FrameworkEditor'
import ProviderEditor from './components/providers/ProviderEditor'
import { List } from 'immutable'

const mapStateToProps = (state) => {
  return {
    // questions: state.questionReducer.questions || List([]),
    // frameworks: state.frameworkReducer.frameworks || List([]),
    // providers: state.providerReducer.providers || List([]),
    // categories: state.categoryReducer.categories || List([])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getQuestions: () => dispatch(getQuestions()),
    getFrameworks: () => dispatch(getFrameworks()),
    getProviders: () => dispatch(getProviders()),
    getCategories: () => dispatch(getCategories()),
  }
}

export class App extends Component {
  componentDidMount() {
    this.props.getQuestions()
    this.props.getFrameworks()
    this.props.getProviders()
    this.props.getCategories()
  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate', prevProps)
  }

  render () {
    return (
      <Router>
        <div className="app">
          <Nav />
          <Route path='/' component={Dashboard} exact />
          <Route path='/framework' component={Frameworks} exact />
          <Route path='/framework/:frameworkId' component={FrameworkEditor} exact />
          <Route path='/category' component={Categories} exact />
          <Route path='/category/:categoryId' component={Category} exact />
          <Route path='/provider' component={Providers} exact />
          <Route path='/provider/:providerId' component={ProviderEditor} exact />
          <Route path='/question' component={Questions} exact />
          <Route path='/question/:questionId' component={QuestionEditor} exact />
          <Route path='/question/:questionId/:optionId' component={OptionEditor} exact />
          <Route path='/diagram/:questionId?/:optionId?' component={Diagram} />
        </div>
      </Router>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
