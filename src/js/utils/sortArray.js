const sortArray = ( list, key ) => {
  if( !Array.isArray( list ) || !key ) {
    throw new Error('list must be an array and key can not be empty');
  }
  list.sort( ( a, b ) => {
    if (a[key] > b[key]) return 1;
    if (a[key] < b[key]) return -1;
    return 0;
  });
};

module.exports = sortArray;