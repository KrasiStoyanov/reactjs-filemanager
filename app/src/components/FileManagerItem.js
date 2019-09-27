import React, { Component } from 'react';

import { ItemTypes } from '../constants/ItemTypes';
import { StatusTypes } from '../constants/StatusTypes';
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
    switch (this.props.item.status) {
      case StatusTypes.todo:
        this.props.item.status = StatusTypes.inProgress;
        break;
      case StatusTypes.inProgress:
        this.props.item.status = StatusTypes.done;
        break;
        case StatusTypes.done:
          this.props.item.status = StatusTypes.todo;
          break;  
    }

    this.props.updateData();
  }
  
  render() {
    let item = this.props.item;
    let itemType = item.type;

    return (
      <li>
        {itemType === ItemTypes.folder ?
          <button 
            onClick={this.collapseFolder.bind(this)}
            className={`file-manager__item file-manager__item--small file-manager__item--folder`}
          >
            {item.title}
          </button>
          : ''
        }
        {itemType === ItemTypes.file ?
          <button 
            onClick={this.toggleFileState.bind(this)}
            className={`file-manager__item file-manager__item--file file-manager__item--file-${item.status}`}
          >
            {item.title}.{item.extension}
          </button>
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
