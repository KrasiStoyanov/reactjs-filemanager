import React, { Component } from 'react';

import { ItemTypes } from '../constants/ItemTypes';
import { StatusTypes } from '../constants/StatusTypes';
import Filemanager from './FileManager';

class FileManagerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: props.item.collapsed !== undefined ? props.item.collapsed : true,
      deprecated: props.item.deprecated !== undefined ? props.item.deprecated : false
    };
  }

  collapseFolder() {
    this.setState({
      collapsed: !this.state.collapsed
    });

    this.props.item.collapsed = !this.state.collapsed;
    this.props.updateData();
  }

  toggleDeprecation() {
    this.setState({
      deprecated: !this.state.deprecated
    });

    this.props.item.deprecated = !this.state.deprecated;
    this.props.updateData();
  }

  toggleFileState() {
    switch (this.props.item.status) {
      case StatusTypes.todo:
        this.props.item.status = StatusTypes.inProgress;
        break;
      case StatusTypes.inProgress:
        this.props.item.status = StatusTypes.inReview;
        break;
      case StatusTypes.inReview:
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
    let fileButtonColorType = '';
    if (item.type == ItemTypes.file) {
      switch (item.status) {
        case StatusTypes.todo:
          fileButtonColorType = 'red';
          break;
        case StatusTypes.inProgress:
          fileButtonColorType = 'blue';
          break;
        case StatusTypes.inReview:
          fileButtonColorType = 'yellow';
          break;
        case StatusTypes.done:
          fileButtonColorType = 'green';
          break;  
      }
    }
    
    return (
      <li>
        {itemType === ItemTypes.folder ?
          <button 
            onClick={this.collapseFolder.bind(this)}
            className={`file-manager__item file-manager__item--folder button button--small button--full-width button--max-width button--grey`}
          >
            {item.title}
          </button>
          : ''
        }
        {itemType === ItemTypes.file ?
          <div>
            <button 
              onClick={this.toggleFileState.bind(this)}
              className={`file-manager__item file-manager__item--file file-manager__item--file-${item.status} button button--extra-small button--${fileButtonColorType} ${this.state.deprecated ? 'button--disabled' : ''}`}
              disabled={`${this.state.deprecated ? 'button--disabled' : ''}`}
            >
              {item.title}.{item.extension}
            </button>
            <button 
              onClick={this.toggleDeprecation.bind(this)}
              className={`button button--square button--${this.state.deprecated ? 'green' : 'purple'}`}
            >
              {this.state.deprecated ? 'Y' : 'X'}
            </button>
          </div>
          : ''
        }
        {item.children ? (
          item.children.length > 0 ? 
            <Filemanager 
              updateData={this.props.updateData} 
              collapsed={this.state.collapsed} 
              data={item.children} 
            /> 
            : ''
        ) : ''}
      </li>
    );
  }
}

export default FileManagerItem;
