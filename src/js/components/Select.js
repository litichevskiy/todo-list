import React, { Component } from 'react';

class Select extends Component {
  constructor( props ) {
    super( props );
    this.changeValue = this.changeValue.bind( this );
  }

  changeValue( event ) {
    if( this.props.changeHandler ) this.props.changeHandler( event.target.value );
  }

  render() {
    return(
      <select
        value={this.props.selected}
        name={this.props.name || ''}
        className="select"
        onChange={this.changeValue}
      >
        {this.props.selectList.map( ( item, index ) => {
          return <option key={index} value={item}>{item}</option>;
        })}
      </select>
    )
  }
}

export default Select;