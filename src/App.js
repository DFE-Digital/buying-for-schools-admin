import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import './App.css';
import "../node_modules/govuk-frontend/all.scss"

import Nav from './components/Nav'
import Dashboard from './components/Dashboard'
import Frameworks from './components/Frameworks'
import Framework from './components/Framework'
import Categories from './components/Categories'
import Category from './components/Category'
import Questions from './components/questions/Questions'
import Question from './components/questions/Question'
import Diagram from './components/diagram/Diagram'
import EditWindow from './components/edit/EditWindow'

function App() {
  return (
    <Router>
      <div className="app">
        <Nav />
        
        <Route path='/' component={Dashboard} exact />
        <Route path='/framework' component={Frameworks} exact />
        <Route path='/framework/:frameworkId' component={Framework} exact />
        <Route path='/category' component={Categories} exact />
        {<Route path='/category/:categoryId' component={Category} exact />}
        <Route path='/question' component={Questions} exact />
        <Route path='/question/:questionId' component={Question} exact />
        <Route path='/diagram' component={Diagram} exact />

        <EditWindow />
      </div>
    </Router>
  );
}

export default App;
