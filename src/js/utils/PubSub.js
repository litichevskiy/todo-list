let instance;

module.exports = class PubSub {

  constructor() {
      if ( instance ) return instance;
      this.storage = {};
      instance = this;
  }

  subscribe ( eventName, func ) {
      if ( !this.storage.hasOwnProperty( eventName ) ) {
          this.storage[eventName] = [];
      }

      this.storage[eventName].push( func );
  }

  publish ( eventName, data ) {
      ( this.storage[eventName] || [] ).forEach( ( func ) => { func( data ); });
  }

  unSubscribe ( eventName, func ) {
      var index = this.storage[eventName].indexOf( func );
      if ( index > -1 ) {
          this.storage[eventName].splice( index, 1  );
      };
  }
};