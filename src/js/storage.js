const STORAGE_NAME = 'appData';
const storage = {
  init() {
    if( !localStorage.getItem( STORAGE_NAME ) ) {
      localStorage.setItem( STORAGE_NAME, JSON.stringify( {tasks:{}} ) );
    }
  },

  async getAllTodoList() {
    try{
      const data = await JSON.parse( localStorage.getItem(STORAGE_NAME) );
      const allTasks = Object.keys( data.tasks );
      return allTasks.reduce(( prev, key, index ) => {
        return prev.concat( data.tasks[key]['listTasks'] );
      }, [] );
    } catch( error ){console.error( error )};
  },

  async getNameAllProjects() {
    try{
      const data = await JSON.parse( localStorage.getItem(STORAGE_NAME) );
      return Object.keys( data.tasks );
    } catch( error ) {console.error(error)};
  },

  async getTodoList( key ) {
    if( !key ) throw new Error('key can not be empty');
    try{
      if( key === 'all project' ) return this.getAllTodoList();
      const data = await JSON.parse( localStorage.getItem(STORAGE_NAME) );
      if( data.tasks[key] ) return data.tasks[key]['listTasks'];
      else return undefined;
    } catch( error ){console.error(error)};
  },

  async updateTask( task, key ) {
    if( !task || !key ) throw new Error('task and key can not be empty');
    let listTasks;
    let index;
    try{
      const data = await JSON.parse( localStorage.getItem(STORAGE_NAME) );
      if( data.tasks[key] ) {
        listTasks = data.tasks[key]['listTasks'];
        index = searchIndex( listTasks, task.id );
        if( task.projectName !== key ) {
          await this.deleteTask(task.id, key);
          await this.createTask(task, task.projectName );
          return await this.getTodoList( key );
        }
        else{
          listTasks.splice( index, 1, task );
          data.tasks[key]['listTasks'] = listTasks;
          await localStorage.setItem( STORAGE_NAME, JSON.stringify( data ) );
          return listTasks;
        }
      }
      else{
        for ( let name in data.tasks ) {
          index = searchIndex( data.tasks[name].listTasks, task.id );
          if( index !== undefined ) {
            if( task.projectName !== name ) {
              await this.deleteTask(task.id, name);
              await this.createTask(task, task.projectName );
              return await this.getAllTodoList();
            }
            data.tasks[name]['listTasks'].splice( index, 1, task );
            await localStorage.setItem( STORAGE_NAME, JSON.stringify( data ) );
            return await this.getAllTodoList();
          }
        }
      }

    } catch( error ){console.error(error)};
  },

  async deleteTask( id, key ) {
    if( !id || !key ) throw new Error('id and key can not be empty');
    try{
      const data = await JSON.parse( localStorage.getItem(STORAGE_NAME) );
      let listTasks;
      let index;
      if( data.tasks[key] ) {
        listTasks = data.tasks[key]['listTasks'];
        index = searchIndex( listTasks, id );
        data.tasks[key]['listTasks'].splice( index, 1 );
        if( !listTasks.length ) {
          delete data.tasks[key];
          await localStorage.setItem( STORAGE_NAME, JSON.stringify( data ) );
          return [];
        }
        await localStorage.setItem( STORAGE_NAME, JSON.stringify( data ) );
        return data.tasks[key]['listTasks'];
      }

      else{
        for ( let name in data.tasks ) {
          index = searchIndex( data.tasks[name].listTasks, id );
          if( index !== undefined ) {
            data.tasks[name]['listTasks'].splice( index, 1 );
            if( !data.tasks[name]['listTasks'].length ) delete data.tasks[name];
            await localStorage.setItem( STORAGE_NAME, JSON.stringify( data ) );
            return await this.getAllTodoList();
          }
        }
      }
    } catch( error ) { console.error(error) };
  },

  async createTask( task, projectName ) {
    if( !task ) throw new Error('task and projectName can not be empty');
    try{
      const data = await JSON.parse( localStorage.getItem(STORAGE_NAME) );
      if( data.tasks[task.projectName] ) {
        data.tasks[task.projectName]['listTasks'].push( task );
      }
      else{
        data.tasks[task.projectName] = {'listTasks': [task] };
      }
      await localStorage.setItem( STORAGE_NAME, JSON.stringify( data ) );
      return await this.getTodoList( projectName );
    } catch(error){console.error(error)};
  }
};

const searchIndex = ( list, id ) => {
  let index;
  list.some(( item, i ) => {
    if( item.id === id ) return true, index = i;
    else return false;
  });

  return index;
};

storage.init();

module.exports = storage;