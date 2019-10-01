import React, { Component } from 'react';

import { ItemTypes } from '../constants/ItemTypes';
import { StatusTypes } from '../constants/StatusTypes';
import * as StringHelper from '../helpers/StringHelper';
import * as StringValidator from '../validators/StringValidator';
import * as FileValidator from '../validators/FileValidator';

import Filemanager from './FileManager';
import Folder from './Folder';
import File from './File';

class FileManagerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: props.item.collapsed !== undefined ? props.item.collapsed : true,
      deprecated: props.item.deprecated !== undefined ? props.item.deprecated : false,
      item: props.item,
      renameOptionText: null,
      renameInput: null,
      collapseDisabled: false,
      fileStateDisabled: false
    };
  }

  updateData() {
    this.props.updateData();
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

  enableRenameItem(e) {
    let renameOption = e.target;
    let parentNode = renameOption.parentNode;
    let closestChildInput = parentNode.querySelector('.file-manager__item--input');

    let renameOptionText = parentNode.querySelector('.button__text');
    renameOptionText.classList.add('button__text--hidden');

    closestChildInput.disabled = false;
    closestChildInput.classList.add('file-manager__item--active');
    closestChildInput.focus();

    this.setState({
      collapseDisabled: true,
      fileStateDisabled: true,
      renameOptionText: renameOptionText,
      renameInput: closestChildInput
    });
  }

  detectKeyPress(e) {
    let processedValue = {};
    let key = e.key;
    let renameInput = e.target;

    if (key === 'Enter') {
      let isOk = this.validateItemNewName(renameInput.value);
      if (isOk) {
        this.disableRenameItem();

        let processedValue = this.processNewFilename(renameInput.value);
        this.renameItem(processedValue);
      }
    }

    if (key === 'Escape') {
      this.disableRenameItem();

      renameInput.value = this.props.item.title;
      if (this.state.item.type === ItemTypes.file) {
        renameInput.value = `${this.props.item.title}.${this.props.item.extension}`;
      }
    }
  }

  processNewFilename(value) {
    let result = {};
    if (this.state.item.type === ItemTypes.file) {
      let splitValue = value.split('.');

      result.title = splitValue[0];
      result.extension = splitValue[1];
    } else {
      result.title = value;
    }

    return result;
  }

  validateItemNewName(value) {
    let label = `${StringHelper.capitalize(ItemTypes.folder)} name`;
    let isValid = false;
    isValid = StringValidator.isNullorEmpty(value, label);

    if (this.state.item.type === ItemTypes.file) {
      let hasForbiddenCharacters = FileValidator.hasForbiddenCharacters(value);
      let hasInvalidExtension = FileValidator.hasInvalidExtension(value);

      if (hasForbiddenCharacters || hasInvalidExtension) {
        isValid = false;
      } else {
        isValid = true;
      }
    }

    return isValid;
  }

  disableRenameItem() {
    if (this.state.renameOptionText === undefined || this.state.renameInput === undefined) {
      return;
    }

    this.state.renameInput.disabled = true;
    this.state.renameInput.classList.remove('file-manager__item--active');
    this.state.renameOptionText.classList.remove('button__text--hidden');

    this.setState({
      collapseDisabled: false,
      fileStateDisabled: false
    });
  }

  // TODO: Implement commenting system.
  // TODO: Add sorting/filtering options.

  renameItem(value) {
    /**
     * Do not mutate state directly.
     * Insted create a copy of the state property value and change it.
     * Afterwards call this.setState.
     */
    let itemCopy = Object.assign({}, this.state.item);
    itemCopy.title = value.title;

    if (value.extension) {
      itemCopy.extension = value.extension;
    }

    this.setState({
      item: itemCopy
    });

    // Update props and JSON data.
    this.props.item.title = value.title;
    if (value.extension) {
      this.props.item.extension = value.extension;
    }

    this.props.updateData();
  }

  render() {
    let item = this.state.item;
    let itemType = item.type;

    return (
      <li>
        {itemType === ItemTypes.folder ?
          <Folder 
            item={item} 
            toggleCollapse={this.collapseFolder.bind(this)} 
            enableRenameItem={this.enableRenameItem.bind(this)} 
            detectKeyPress={this.detectKeyPress.bind(this)} 
            renameItem={this.renameItem.bind(this)} 
            collapseDisabled={this.state.collapseDisabled} 
            renameOptionText={this.state.renameOptionText} 
            renameInput={this.renameInput} 
            updateData={this.updateData.bind(this)}
          />
          : ''
        }
        {itemType === ItemTypes.file ?
          <File 
            item={item} 
            toggleDeprecation={this.toggleDeprecation.bind(this)} 
            toggleFileState={this.toggleFileState.bind(this)} 
            enableRenameItem={this.enableRenameItem.bind(this)} 
            detectKeyPress={this.detectKeyPress.bind(this)} 
            renameItem={this.renameItem.bind(this)} 
            renameInput={this.renameInput} 
            updateData={this.updateData.bind(this)} 
            fileStateDisabled={this.state.fileStateDisabled} 
            deprecated={this.state.deprecated} 
            renameOptionText={this.state.renameOptionText} 
          />
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