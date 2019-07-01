import React from 'react'
import { Link } from 'react-router-dom'


const Dashboard = props => {
  return (
    <div className="dashboard govuk-width-container">
      <h1>Dashboard</h1>
      {/*<Questions />*/}
      <Link to="/framework" className="button">Frameworks</Link>
      <Link to="/question" className="button">Questions</Link>
      <Link to="/diagram" className="button">Diagram</Link>
    </div>
  )
}

export default Dashboard