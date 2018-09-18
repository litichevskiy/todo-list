import React, { Component } from 'react';
import ItemTodoList from './ItemTodoList';
const getParentNode = require('../utils/getParentNode');
const actions = require('../actions');
const store = require('../store');

class TodoList extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      todoList: store.currentListTask,
    }
    this._changeTask = this._changeTask.bind( this );
    this._setState = this._setState.bind( this );
  }

  componentDidMount() {
    store.subscribe('change', this._setState );
  }

  componentWillUnmount() {
    store.unSubscribe('change', this._setState );
  }

  _setState() {
    this.setState({todoList: store.currentListTask});
  }

  _changeTask( event ) {
    const target = event.target;
    const role = target.getAttribute('data-role');
    if( !role ) return;
    const task = getParentNode( target, 'LI' );
    if( !task ) return;
    const roleId = task.getAttribute('data-role-id')
    if( role === 'open' ) this._showHideDescription( task );
      else
        if( role === 'change' ) actions.editTask( roleId );
          else
            if( role === 'delete' ) actions.deleteTask( roleId );
  }

  _showHideDescription( el ) {
    el.classList.toggle('show-description');
  }

  render() {
    return(
      <div className="container-todo-list">
        <ul className="todo-list" onClick={this._changeTask}>
          {this.state.todoList.map( ( item, index ) => {
            return <ItemTodoList key={index} task={item} />
          })}
        </ul>
      </div>
    )
  }
}

export default TodoList;