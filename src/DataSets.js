import React, { Component } from 'react'
import Globals from './Globals'

class DataSets extends Component {

  switchIt (e, d) {
    e.preventDefault()
    fetch('/api/dataset', {
      method: 'PUT',
      body: JSON.stringify({ dataSet: d }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(result => {
      Globals.app.setState({
        ...result,
        editing: null,
        editingAnswer: null,
        editingFramework: null,
        selectedDataSet: d
      })
    })
  }

  render () {
    const dataSets = this.props.dataSets || []
    const selectedDataSet = this.props.selectedDataSet
    const toRender = dataSets.map(d => {
      return {
        label: d,
        class: (d === selectedDataSet) ? 'green' : 'grey'
      }
    })


    return (
      <div>
      { toRender.map(d => (
        <a href="#" className={ 'btn btn--' + d.class } onClick={e => this.switchIt(e, d.label)}>{d.label}</a>
      )) }
      </div>
    )
  }
}

export default DataSets