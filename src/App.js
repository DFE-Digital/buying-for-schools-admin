import React, { Component } from 'react'

import './App.css'
import Diagram from './Diagram'
import Edit from './Edit'
import Globals from './Globals'


class App extends Component {
  constructor (props) {
    super(props)
    this.state = { 
      tree: [],
      editing: null,
      editingAnswer: null
    }
    Globals.app = this
  }

  edit (hierarchy, answer, e) {
    // console.log('EDIT', hierarchy, e)
    this.setState({ 
      editing: hierarchy, 
      editingAnswer: answer
    })
  }

  addOption (hierarchy, e) {
    this.setState({
      editing: hierarchy, 
      editingAnswer: {
        ref: '',
        title: ''
      }
    }) 
  }

  componentDidMount () {
    fetch('/api/decision-tree')
      .then(res => res.json())
      .then(result => {
        this.setState({
          ...result
        })
      }, error => {
        console.log('ERROR', error)
      })
  }

  render () {
    const orphans = this.state.tree.filter(branch => !branch.used)
    return (
      <div className='App'>
        <h1>Admin</h1>
        <Diagram hierarchy={ this.state.hierarchy } />
        <div className="orphans">
          <h2>Orphan nodes</h2>
          <ul className="orphans__list">
            {orphans.map(o => (
              <li><span class="ref">{o.ref}</span> <span class="title">{o.title}</span></li>
            ))}
          </ul>
        </div>
        { this.state.editing && <Edit hierarchy={this.state.editing} answer={this.state.editingAnswer} />}

      </div>
    )
  }
}

export default App
