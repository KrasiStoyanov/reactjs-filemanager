import React, { Component } from 'react';

import { ItemTypes } from '../constants/ItemTypes';
import Filemanager from './FileManager';

class FileManagerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };
  }

  collapseFolder() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  toggleFileState() {
    this.props.item.state = this.props.item.state !== 'undefined' ? !this.props.item.state : true;
    this.props.updateData();
  }
  
  render() {
    let item = this.props.item;
    let itemType = item.type;

    return (
      <li>
        {itemType === ItemTypes.folder ?
          <div onClick={this.collapseFolder.bind(this)}>
            {item.title}
          </div>
          : ''
        }
        {itemType === ItemTypes.file ?
          <span 
            onClick={this.toggleFileState.bind(this)}
            className={item.status}
          >
            {item.title}.{item.extension}
          </span>
          : ''
        }
        {item.children ? (
          item.children.length > 0 ? 
            <Filemanager updateData={this.props.updateData} collapsed={this.state.collapsed} data={item.children} /> 
            : ''
        ) : ''}
      </li>
    );
  }
}

export default FileManagerItem;
