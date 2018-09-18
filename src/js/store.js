const pubsub = new (require('./utils/PubSub'));
const storage = require('./storage');
const sortArray = require('./utils/sortArray');
const DEFAULT_PRIORITY = 1;
const DEFAULT_PROJECT = 'all project';
const SORT_KEY = 'projectPriority';

const store = {
  isTaskEditor: false,
  isTaskControlPanel: true,
  priorityList: [1, 2, 3, 4],
  projectName: '',
  taskHeader: '',
  projectPriority: DEFAULT_PRIORITY,
  taskDescription: '',
  taskId: '',
  isSortTask: false,
  currentProjectName: DEFAULT_PROJECT,
  currentListTask: [],
  nameAllProjects: [],

  subscribe( eventName, func ) {
    pubsub.subscribe( eventName, func );
  },

  unSubscribe( eventName, func ) {
    pubsub.unSubscribe( eventName, func );
  },

  showHidePanels() {
    this.isTaskControlPanel = !this.isTaskControlPanel;
    this.isTaskEditor = !this.isTaskEditor;
    pubsub.publish('change');
  },

  getNameAllProjects() {
    return storage.getNameAllProjects()
    .then( listProjects => {
      this.nameAllProjects = [DEFAULT_PROJECT].concat( listProjects );
    })
    .catch(error => console.error(error));
  },

  getAllLists() {
    return storage.getAllTodoList()
    .then( listTasks => {
      this.setCurrentListTask( listTasks );
    })
    .catch(error => console.error(error));
  },

  setCurrentListTask( listTasks ) {
    this.currentListTask = listTasks;
    if( this.isSortTask ) sortArray( this.currentListTask, SORT_KEY );
  },

  async initLists() {
    await this.getAllLists();
    await this.getNameAllProjects();
    pubsub.publish('change');
  },

  clearTaskDate() {
    this.taskId = '';
    this.projectName = '';
    this.taskHeader = '';
    this.projectPriority = DEFAULT_PRIORITY;
    this.taskDescription = '';
  },

  init() {
    this.initLists();

    pubsub.subscribe('show-task-editor', () => {
      this.showHidePanels();
    });

    pubsub.subscribe('hide-task-editor', () => {
      this.clearTaskDate();
      this.showHidePanels();
    });

    pubsub.subscribe('save-task', ( data ) => {
      if( !data ) throw new Error('new task can not be empty');
      this.showHidePanels();
      this.clearTaskDate();
      if( data.id ){
        storage.updateTask( data, this.currentProjectName )
        .then(
          async ( listTasks ) => {
            if( !listTasks ) {
              listTasks = await storage.getTodoList( DEFAULT_PROJECT );
              this.currentProjectName = DEFAULT_PROJECT;
            }
            this.setCurrentListTask( listTasks );
            await this.getNameAllProjects();
            pubsub.publish('change');
        })
        .catch(error => console.error(error));
      }
      else{
        data.id = getId();
        storage.createTask( data, this.currentProjectName )
        .then(
          async ( listTasks ) => {
            this.setCurrentListTask( listTasks );
            await this.getNameAllProjects();
            pubsub.publish('change');
        })
        .catch(error => console.error(error));
      }
    });

    pubsub.subscribe('edit-task', ( id ) => {
      if( !id ) throw new Error('id can not be empty');
      let index;
      this.currentListTask.some(( item, i ) => {
        if( item.id === id ) return true, index = i;
        else return false;
      });
      const task = this.currentListTask[index];
      this.taskId = task.id;
      this.projectName = task.projectName;
      this.taskHeader = task.taskHeader;
      this.projectPriority = task.projectPriority;
      this.taskDescription = task.taskDescription;
      this.isTaskEditor = true;
      this.isTaskControlPanel = false;
      pubsub.publish('change');
    });

    pubsub.subscribe('delete-task', ( id ) => {
      if( !id ) throw new Error('id can not be empty');
      this.clearTaskDate();
      this.showHidePanels();
      this.isTaskControlPanel = true;
      this.isTaskEditor = false;
      storage.deleteTask( id, this.currentProjectName )
      .then(
        async (listTasks) => {
        this.setCurrentListTask( listTasks );
        if( !listTasks.length ) {
          this.currentProjectName = DEFAULT_PROJECT;
          this.initLists();
        }
        else {
          await this.getNameAllProjects();
          pubsub.publish('change');
        }
      })
      .catch(error => console.error(error));
    });

    pubsub.subscribe('sort-tasks', () => {
      this.isSortTask = !this.isSortTask;
      if( !this.isSortTask ) {
        storage.getTodoList( this.currentProjectName )
        .then( listTasks => {
          this.setCurrentListTask( listTasks );
          pubsub.publish('change');
        })
        .catch(error => console.error(error));
      }
      else {
        this.setCurrentListTask( this.currentListTask );
        pubsub.publish('change');
      }
    });

    pubsub.subscribe('change project', ( projectName ) => {
      if( !projectName ) throw new Error('projectName can not be empty');
      storage.getTodoList( projectName )
      .then( todoList => {
        this.setCurrentListTask( todoList );
        this.currentProjectName = projectName;
        pubsub.publish('change');
      })
      .catch(error => console.error(error));
    });
  }
};

const getId = () => String( Date.now() );
store.init();

module.exports = store;