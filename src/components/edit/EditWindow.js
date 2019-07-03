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

    const style = { height: document.body.clientHeight }


    return (
      <div className={editWindowClasses.join(' ')} style={style} onClick={e => false}>
        <div className="editwindow__inner">
          <button onClick={this.closeEditWindow.bind(this)}>Close</button>
          
          <EditQuestion />
          <EditOption />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditWindow)