import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import './App.css';
import "../node_modules/govuk-frontend/all.scss"

import Dashboard from './components/Dashboard'
import Frameworks from './components/Frameworks'
import Framework from './components/Framework'
import Questions from './components/Questions'
import Question from './components/Question'
import Diagram from './components/diagram/Diagram'

function App() {
  return (
    <Router>
      <div className="App">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/framework">Frameworks</NavLink>
        <NavLink to="/question">Question</NavLink>
        
        <Route path='/' component={Dashboard} exact />
        <Route path='/framework' component={Frameworks} exact />
        <Route path='/framework/:frameworkId' component={Framework} exact />
        <Route path='/question' component={Questions} exact />
        <Route path='/question/:questionId' component={Question} exact />
        <Route path='/diagram' component={Diagram} exact />
      </div>
    </Router>
  );
}

export default App;
