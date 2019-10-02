import React, { Component } from 'react';

import { ItemTypes } from '../constants/ItemTypes';
import { StatusTypes } from '../constants/StatusTypes';

class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileStateDisabled: props.fileStateDisabled,
      deprecated: props.deprecated,
      renameOptionText: props.renameOptionText,
      renameInput: props.renameInput,
      item: props.item
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.fileStateDisabled !== state.fileStateDisabled) {
      return {
        fileStateDisabled: props.fileStateDisabled
      }
    }

    if (props.deprecated !== state.deprecated) {
      return {
        deprecated: props.deprecated
      }
    }

    return null;
  }

  toggleDeprecation() {
    this.props.toggleDeprecation();
  }

  toggleFileState() {
    if (!this.state.fileStateDisabled) {
      this.props.toggleFileState();
    }
  }

  enableRenameItem(e) {
    this.props.enableRenameItem(e);
  }

  disableRenameItem(e) {
    /**
     * Disable the rename item only if the application isn't busy processing the data.
     * @type {Boolean}
     */
    let isCurrentlyProcessingNewName = e.target.getAttribute('data-processing');
    if (!isCurrentlyProcessingNewName) {
      e.target.value = this.props.renameOptionText.textContent;
      
      this.props.disableRenameItem();
    }
  }

  detectKeyPress(e) {
    this.props.detectKeyPress(e);
  }

  render() {
    let item = this.state.item;
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
      <div>
        <button 
          onClick={this.toggleFileState.bind(this)} 
          className={`file-manager__item file-manager__item--file file-manager__item--file-${item.status} button button--extra-small button--${fileButtonColorType} ${this.state.deprecated ? 'button--disabled' : ''}`} 
          disabled={`${this.state.deprecated ? 'button--disabled' : ''}`}
        >
          <input
            type="text" 
            defaultValue={`${item.title}.${item.extension}`} 
            onKeyDown={this.detectKeyPress.bind(this)} 
            onBlur={this.disableRenameItem.bind(this)} 
            className={`file-manager__item file-manager__item--input`}
          />
          <span className="button__text">{item.title}.{item.extension}</span>
        </button>
        <button 
          onClick={this.toggleDeprecation.bind(this)} 
          className={`button button--icon button--${this.state.deprecated ? 'green' : 'purple'}`}
        >
          <span className={`icon icon--extra-small icon--cross ${this.state.deprecated ? '' : 'icon--cross--active'}`}></span>
        </button>
        <button
          onClick={this.enableRenameItem.bind(this)} 
          className={`button button--extra-small button--yellow`}
        >
          R
        </button>
      </div>
    );
  }
}

export default File;