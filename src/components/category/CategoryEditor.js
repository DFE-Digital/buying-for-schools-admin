import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateCategory, saveNewCategory } from '../../actions/category-actions'
import Input from '../form/Input'
import ErrorSummary from '../form/ErrorSummary'
import { List, Map } from 'immutable'
import { getBlankCategory } from '../../services/category'

const mapStateToProps = (state) => {
  return {
    updateErrors: state.categoryReducer.updateErrors,
    categories: state.categoryReducer.categories
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCategory: (category) => dispatch(updateCategory(category)),
    saveNewCategory: (category, parent = null) => dispatch(saveNewCategory(category, parent))
  }
}


export class CategoryEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      category: null,
      originalCategory: null,
      error: ''
    }
  }

  componentDidMount () {
    if (this.needsUpdate()) {
      this.update() 
    }
  }

  componentDidUpdate (prevProps) {
    if (this.needsUpdate(prevProps)) {
      this.update() 
    }
  }

  needsUpdate (prevProps) {
    if (!List.isList(this.props.categories)) {
      // no categories have loaded yet
      return false
    }

    if (!Map.isMap(this.state.category)) {
      // no category to edit has been defined
      return true
    }

    const categoryId = this.props.match.params.categoryId
    if (categoryId === 'new') {
      return false
    }

    const originalCategory = this.props.categories.find(q => q.get('_id') === categoryId)
    if (!this.state.originalCategory.equals(originalCategory)) {
      // has the original category changed as a result of a save?
      return true
    }

    if (prevProps && this.state.category.get('_id') === prevProps.match.params.categoryId) {
      // category id has not changed
      return false
    }

    return true
  }

  update () {
    const categoryId = this.props.match.params.categoryId
    let category
    if (categoryId === 'new') {
      category = getBlankCategory()
    } else {
      category = this.props.categories.find(q => q.get('_id') === categoryId)
    }
    
    if (category && Map.isMap(category)) {
      this.setState({ 
        category: category,
        originalCategory: category
      })
    }
  }

  onChange (id, value) {
    this.setState({ category: this.state.category.set(id, value) })
  }

  onSave (e) {
    e.preventDefault()
    if (this.state.category.get('_id') === 'new') {
      this.props.saveNewCategory(this.state.category.toJS()).then(data => {
        if (data._id) {
          this.props.history.push(`/category/${data._id}`)
        }
      })
    } else {
      this.props.updateCategory(this.state.category.toJS())
    }
  }

  render () {
    if (!Map.isMap(this.state.category)) {
      return <h1>Loading</h1>
    }

    const hasChanged = !this.state.category.equals(this.state.originalCategory)
    const saveButtonClasses = ['button']
    if (hasChanged) {
      saveButtonClasses.push('button--green')
    }

    const hasErrors = this.props.updateErrors && this.props.updateErrors.data && this.props.updateErrors.data.errors
    const errorIds = hasErrors ? this.props.updateErrors.data.errors.map(e => e.id) : []
    const errors = hasErrors ? this.props.updateErrors.data.errors : []
    return (
      <div className="categoryeditor govuk-width-container">
        <h1 className="categoryeditor__title">Category</h1>
        
        <form className="categoryeditor__category">
          <ErrorSummary errors={errors} />

           <Input 
            id="ref"
            value={this.state.category.get('ref')}
            label="Ref"
            onChange={this.onChange.bind(this)}
            error={errorIds.includes('ref')}
            />

          <Input 
            id="title"
            value={this.state.category.get('title')}
            label="Title"
            onChange={this.onChange.bind(this)}
            error={errorIds.includes('title')}
            />
          
          <input type="submit" value="Save" className={saveButtonClasses.join(' ')} onClick={e => this.onSave(e)} />
          <Link to="/category" className="button">{ hasChanged ? 'Cancel' : 'Back' }</Link>    
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryEditor)