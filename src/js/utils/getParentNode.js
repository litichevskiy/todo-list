const getParentNode = ( target, tagName ) => {
  if( !target || !tagName ) throw new Error('target - should be an html-element; tagName - string');
  tagName = tagName.toUpperCase();
  while( target ) {
    if( target.tagName === tagName ) return target;
    else target = target.parentElement;
  }
};

module.exports = getParentNode;