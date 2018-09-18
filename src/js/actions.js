const pubsub = new (require('./utils/PubSub'));

module.exports = {
  saveTask( data ) {
    pubsub.publish('save-task', data );
  },

  showTaskEditor() {
    pubsub.publish('show-task-editor');
  },

  hideTaskEditor() {
    pubsub.publish('hide-task-editor');
  },

  editTask( id ) {
    pubsub.publish('edit-task', id );
  },

  deleteTask( id ) {
    pubsub.publish('delete-task', id );
  },

  sortTasks() {
    pubsub.publish('sort-tasks');
  },

  changeProject( projectName ) {
    pubsub.publish('change project', projectName );
  },
};