import React, { Component } from 'react';
import Select from './Select';
const store = require('../store');
const actions = require('../actions');

class TaskListControlPanel extends Component{
  constructor( props ) {
    super( props );
    this.state = {
      isShow: store.isTaskControlPanel,
      selectList: store.nameAllProjects
    }
    this._addTask = this._addTask.bind( this );
    this._setState = this._setState.bind( this );
  }

  componentDidMount() {
    store.subscribe('change', this._setState );
  }

  componentWillUnmount() {
    store.unSubscribe('change', this._setState );
  }

  _setState() {
    this.setState({
      isShow: store.isTaskControlPanel,
      selectList: store.nameAllProjects,
    });
  }

  _addTask() {
    actions.showTaskEditor();
  }

  _sortTasks( event ) {
    actions.sortTasks();
  }

  _changeProject( projectName ){
    actions.changeProject( projectName );
  }

  render() {
    if( !this.state.isShow ) return <div style={{display:'none'}}></div>
    return(
      <div className="container-task-list-control-panel">
        <button className="btn" onClick={this._addTask}>Добавить</button>
        <label>
          <input onChange={this._sortTasks} checked={store.isSortTask} type="checkbox" />
          <span className="input-description">по приоритету</span>
        </label>
        <Select
          selected={store.currentProjectName}
          selectList={this.state.selectList}
          changeHandler={this._changeProject}
        />
      </div>
    )
  }
};

export default TaskListControlPanel;