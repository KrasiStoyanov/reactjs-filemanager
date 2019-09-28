import React, { Component } from 'react';

import { ItemTypes } from '../constants/ItemTypes';
import { StatusTypes } from '../constants/StatusTypes';

import Filemanager from './FileManager';
import Folder from './Folder';

class FileManagerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: props.item.collapsed !== undefined ? props.item.collapsed : true,
      deprecated: props.item.deprecated !== undefined ? props.item.deprecated : false,
      item: props.item
    };
  }

  collapseFolder() {
    this.props.item.collapsed = !this.state.collapsed;
    this.props.updateData();

    this.setState({
      collapsed: !this.state.collapsed,
      item: this.props.item
    });
  }

  toggleDeprecation() {
    this.props.item.deprecated = !this.state.deprecated;
    this.props.updateData();
    
    this.setState({
      deprecated: !this.state.deprecated,
      item: this.props.item
    });
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
      default:
        this.props.item.status = StatusTypes.todo;
        break;
    }

    this.props.updateData();
    
    this.setState({
      item: this.props.item
    });
  }

  renameItem(value) {
    /**
     * Do not mutate state directly.
     * Insted create a copy of the state property value and change it.
     * Afterwards call this.setState.
     */
    let itemCopy = Object.assign({}, this.state.item);
    itemCopy.title = value;

    this.setState({
      item: itemCopy
    });

    // Update props and JSON data.
    this.props.item.title = value;
    this.props.updateData();
  }
  
  render() {
    let item = this.state.item;
    let itemType = item.type;
    let fileButtonColorType = '';
    
    if (item.type === ItemTypes.file) {
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
        default:
          fileButtonColorType = 'red';
          break;
      }
    }
    
    return (
      <li>
        {itemType === ItemTypes.folder ?
          <Folder 
            item={item} 
            toggleCollapse={this.collapseFolder.bind(this)} 
            renameItem={this.renameItem.bind(this)}
          />
          : ''
        }
        {itemType === ItemTypes.file ?
          <div>
            {/* <button 
              onClick={this.toggleFileState.bind(this)}
              className={`file-manager__item file-manager__item--file file-manager__item--file-${item.status} button button--extra-small button--${fileButtonColorType} ${this.state.deprecated ? 'button--disabled' : ''}`}
              disabled={`${this.state.deprecated ? 'button--disabled' : ''}`}
            >
              {item.title}.{item.extension}
            </button> */}
            <input 
              defaultValue={`${item.title}.${item.extension}`} 
              onClick={this.toggleFileState.bind(this)}
              className={`file-manager__item file-manager__item--file file-manager__item--file-${item.status} button button--extra-small button--${fileButtonColorType} ${this.state.deprecated ? 'button--disabled' : ''}`}
              disabled={`${this.state.deprecated ? 'button--disabled' : ''}`}
            />
            <button 
              onClick={this.toggleDeprecation.bind(this)}
              className={`button button--icon button--${this.state.deprecated ? 'green' : 'purple'}`}
            >
              <span className={`icon icon--extra-small icon--cross ${this.state.deprecated ? '' : 'icon--cross--active'}`}></span>
              {/* <span className={`icon icon--extra-small icon--check ${!this.state.deprecated ? 'icon--check--active' : ''}`}></span> */}
            </button>
            {/* <button 
              onClick={this.renameItem.bind(this)}
              className={`button button--extra-small button--yellow`}
            >
              R
            </button> */}
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
