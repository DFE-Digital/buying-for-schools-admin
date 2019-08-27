import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css';
import "../node_modules/govuk-frontend/all.scss"


import Dashboard from './components/dashboard/Dashboard'
import Frameworks from './components/frameworks/Frameworks'
import Categories from './components/category/Categories'
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
import Management from './components/management/Management'
import ManagementEditor from './components/management/ManagementEditor'
import CategoryEditor from './components/category/CategoryEditor'
import Dialog from './components/dialog/Dialog'
import Header from './components/Header'
import Auth from './components/auth/Auth'

const mapStateToProps = (state) => {
  return {
    structure: state.structureReducer,
    auth: state.authReducer
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
    if (this.props.auth.token) {
      this.props.getQuestions()
      this.props.getFrameworks()
      this.props.getProviders()
      this.props.getCategories()
    }
  }

  componentDidUpdate(prevProps) {
    // console.log('Now:', this.props.structure, 'Prev:', prevProps.structure)
    if (this.props.auth.token
      && (this.props.structure.draftId !== prevProps.structure.draftId
          || this.props.auth.token !== prevProps.auth.token)) {
      this.props.getQuestions()
      this.props.getFrameworks()
      this.props.getProviders()
      this.props.getCategories()   
    }
  }

  render () {
    return (
      <Router>
        <Header />  
        <div className="govuk-width-container app-width-container">
          <main className="govuk-main-wrapper app-main-wrapper" id="main-content" role="main">
            <div className="app">
              <Auth>
                <Route path='/' component={Dashboard} exact />
                <Route path='/framework' component={Frameworks} exact />
                <Route path='/framework/:frameworkId' component={FrameworkEditor} exact />
                <Route path='/category' component={Categories} exact />
                <Route path='/category/:categoryId' component={CategoryEditor} exact />
                <Route path='/provider' component={Providers} exact />
                <Route path='/provider/:providerId' component={ProviderEditor} exact />
                <Route path='/question' component={Questions} exact />
                <Route path='/question/:questionId' component={QuestionEditor} exact />
                <Route path='/question/:questionId/:optionId' component={OptionEditor} exact />
                <Route path='/diagram/:questionId?/:optionId?' component={Diagram} />
                <Route path='/structure' component={Management} exact />
                <Route path='/structure/:structureId' component={ManagementEditor} exact />
              </Auth>
            </div>
          </main>
        </div>
        <Dialog />
      </Router>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
