import React, { Component } from 'react'
import { connect } from 'react-redux'
import { cancelEdit } from '../../actions/question-actions'
import EditQuestion from './EditQuestion'
import EditOption from './EditOption'
import './editWindow.css'

const mapStateToProps = (state) => {
  return {
    editing: state.questionReducer.editing
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    cancelEdit: () => dispatch(cancelEdit())
  }
}

export class EditWindow extends Component {


  closeEditWindow (e) {
    e.preventDefault(e)
    this.props.cancelEdit()
  }

  render () {
    const editWindowClasses = ['editwindow']
    const editing = this.props.editing
    if (editing) {
      editWindowClasses.push('editwindow--open')
    }



    return (
      <div className={editWindowClasses.join(' ')}>
        <button onClick={this.closeEditWindow.bind(this)}>Close</button>
        
        <EditQuestion />
        <EditOption />
        
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditWindow)