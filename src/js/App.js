const storage = require('./storage');
const store = require('./store');
import React, { Component } from 'react';
import TodoList from './components/TodoList';
import TaskEditor from './components/TaskEditor';
import TaskListControlPanel from './components/TaskListControlPanel';

class App extends Component {
  render() {
    return(
      <React.Fragment>
        <h2 className="header-medium">todo-list</h2>
        <TodoList />
        <br/>
        <TaskEditor />
        <TaskListControlPanel selectList={[]} />
      </React.Fragment>
    )
  }
}

export default App;