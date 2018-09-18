import React, { Component } from 'react';
import Select from './Select';
const store = require('../store');
const actions = require('../actions');

class TaskEditor extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      isShow: store.isTaskEditor,
      projectName: store.projectName,
      taskHeader: store.taskHeader,
      projectPriority: store.projectPriority,
      taskDescription: store.taskDescription,
      taskId: store.taskId,
      taskHeaderError: false,
      projectNameError: false,
      taskDescriptionError: false,
    };
    this._setState = this._setState.bind( this );
    this._addTask = this._addTask.bind( this );
    this._hideEditor = this._hideEditor.bind( this );
    this._setValue = this._setValue.bind( this );
    this._changePriority = this._changePriority.bind( this );
  }

  componentDidMount() {
    store.subscribe('change', this._setState );
  }

  componentWillUnmount() {
    store.unSubscribe('change', this._setState );
  }

  _setState() {
    this.setState({
      isShow: store.isTaskEditor,
      projectName: store.projectName,
      taskHeader: store.taskHeader,
      projectPriority: store.projectPriority,
      taskDescription: store.taskDescription,
      taskId: store.taskId,
    });
    this._clearErrors();
  }

  _hideEditor( event ) {
    event.preventDefault();
    actions.hideTaskEditor();
    this._clearErrors();
  }

  _clearErrors() {
    if( this.state.taskHeaderError ||
        this.state.projectNameError ||
        this.state.taskDescriptionError ) {
      this.setState({
        taskHeaderError: false,
        projectNameError: false,
        taskDescriptionError: false,
      });
    }
  }

  _addTask( event ) {
    event.preventDefault();
    if( this._checkErrors() ) return;
    const listElements = [...(this.refs.form.querySelectorAll('[name]'))]
    const newTask = listElements.reduce( ( data, item ) => {
      data[item.name] = item.value;
      return data;
    }, {});
    actions.saveTask( newTask );
    this._clearErrors();
  }

  _checkErrors() {
    const requiredFields = [...this.refs.form.querySelectorAll('[required]')];
    let isError = false;
    requiredFields.forEach( item => {
      if( !item.value.trim() ) {
        this.setState({[`${item.name}Error`]: true});
        isError = true;
      }
    });
    return isError;
  }

  _setValue( event ) {
    const target = event.target;
    this.setState({[target.name]: target.value});
  }

  _changePriority( value ) {
    this.setState({ projectPriority: value })
  }

  render() {
    if( !this.state.isShow ) return <div style={{display:'none'}}></div>
    return(
      <form className="container-task-editor" ref="form" >
        <input type="hidden" name="id" defaultValue={this.state.taskId} />
        <div className={ this.state.taskHeaderError ? `row error` : `row`}>
          <span className="requiredFields">Заголовок задачи</span>
          <input
            className="input"
            type="text"
            required
            onChange={this._setValue}
            name="taskHeader"
            value={this.state.taskHeader}
          />
          <small className="error-content">required field</small>
        </div>
        <div className={ this.state.projectNameError ? `row error` : `row`}>
          <span className="requiredFields">Название проекта</span>
          <input
            className="input"
            type="text"
            required
            onChange={this._setValue}
            name="projectName"
            value={this.state.projectName}
          />
          <small className="error-content">required field</small>
        </div>
        <div className="row">
          <span>Приоритет</span>
          <Select
            name="projectPriority"
            selected={this.state.projectPriority}
            selectList={ store.priorityList }
            changeHandler={this._changePriority}
          />
        </div>
        <div className={this.state.taskDescriptionError ? 'row error' : 'row'}>
          <span className="requiredFields">Описание</span>
          <textarea
            rows="2"
            className="input"
            required
            name="taskDescription"
            onChange={this._setValue}
            value={this.state.taskDescription}>
          </textarea>
          <small className="error-content">required field</small>
        </div>
        <div className="row">
          <button className="btn" type="submit" onClick={this._addTask}>Save</button>
          <button className="btn" onClick={this._hideEditor}>Cancel</button>
        </div>
        <small>* This field is required.</small>
      </form>
    )
  }
}

export default TaskEditor;