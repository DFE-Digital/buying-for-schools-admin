import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hideDialog } from '../../actions/dialog-actions'

import './dialog.css'

const mapStateToProps = (state) => {
  
  return {
    settings: state.dialogReducer,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hideDialog: () => dispatch(hideDialog()),
    dispatch
  }
}


export class Dialog extends Component {

  onClick (b) {
    console.log(b)
    if (!b.action) {
      this.props.hideDialog()
      return
    }
    
    this.props.dispatch(b.action)
    this.props.hideDialog()
  }

  render () {

    const classes = ['dialog']

    if (this.props.settings.show) {
      classes.push('dialog--open')
    } else {
      classes.push('dialog--closed')
    }

    return (
      <div className={classes.join(' ')}>
        <div className="dialog__blackout"></div>
        <div className="dialog__content">
          <h1>{this.props.settings.title}</h1>

          { this.props.settings.msg.map((m, i) => (
            <p key={`message--n${i}`}>{ m }</p>
          ))}

          <div className="dialog__buttons">
            { this.props.settings.buttons.map((b, i) => (
              <button className={`button button--${b.color}`} onClick={e => this.onClick(b) } key={`button--n${i}`}>{b.text}</button>  
            )) }
          </div>
        </div>
      
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dialog)