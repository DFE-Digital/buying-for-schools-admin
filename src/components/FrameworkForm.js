import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Input from './form/Input'

export default class FrameworkForm extends Component {
  constructor (props) {
    super(props)
    const f = this.props.framework
    this.state = {
      ref: '',
      title: '',
      cat: '',
      descr: '',
      expiry: '',
      supplier: '',
      url: '',
      ...f 
    }
  }

  handleChange(id, value) {
    const newState = {}
    newState[id] = value
    this.setState(newState)
  }

  submit(e) {
    e.preventDefault()
    this.props.save(this.state)
  }

  delete(e) {
    e.preventDefault()
    this.props.delete()
  }

  render () {
    const labels = {
      'ref': 'Ref',
      'title': 'Title',
      'cat': 'Category',
      'descr': 'Description',
      'expiry': 'Expiry',
      'supplier': 'Supplier',
      'url': 'URL'
    }
    return (
      <form>
        { Object.keys(labels).map(ref => (
          <Input 
            key={ref}
            id={ref}
            value={this.state[ref]}
            label={labels[ref]}
            onChange={this.handleChange.bind(this)}  
            />
        ))}

        <Link to="/framework" className="button">Cancel</Link>
        <input type="submit" value="Submit" className="button button--green" onClick={e => this.submit(e)} />
        <button className="button button--red" onClick={e => this.delete(e)}>Delete</button>
      </form>
    )
  }
}
