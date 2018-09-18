import React from 'react';

const ItemTodoList = ({ task }) => {
    return(
      <li className="item-task" data-role-id={task.id}>
        <h4 className="header-small">{task.taskHeader}</h4>
        <p className="wrapper">
          <span className="container-project-name">
            <span className="project">Проект:</span>
            <span className="project-name">{task.projectName}</span>
          </span>
          <span className={`container-priority importance_${task.projectPriority}`}>
            Приоритет:
            <span className="priority-value">{task.projectPriority}</span>
          </span>
        </p>
        <p className="content">{task.taskDescription}</p>
        <div className="container-buttons">
          <button className="btn" data-role="change">изменить</button>
          <button className="btn" data-role="delete">закрыть</button>
          <button className="btn show-hide" data-role="open">развернуть</button>
        </div>
      </li>
    )
};

export default ItemTodoList;