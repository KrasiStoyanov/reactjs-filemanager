import React, { Component } from 'react';
import FileManagerItem from './FileManagerItem';

class FileManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: props.collapsed !== undefined ? props.collapsed : true
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.collapsed !== state.collapsed) {
      return {
        collapsed: props.collapsed
      }
    }

    return null;
  }
  
  render() {
    let data = this.props.data;

    return (
      <ul className={`file-manager__list ${this.state.collapsed ? 'file-manager__list--collapsed' : ''}`}>
        {data.map((item, index) => {
          return (
            <FileManagerItem 
              key={`${index} - ${item.title}`} 
              updateData={this.props.updateData}
              item={item} 
            />
          );
        })}
      </ul>
    );
  }
}

export default FileManager;
