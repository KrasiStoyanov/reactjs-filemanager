import React, { Component } from 'react';

import { ItemTypes } from '../constants/ItemTypes';
import { StatusTypes } from '../constants/StatusTypes';
import * as StringHelper from '../helpers/StringHelper';
import * as StringValidator from '../validators/StringValidator';
import * as NameValidator from '../validators/NameValidator';

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

  /**
   * Call the function for updating the data API from the props.
   */
  updateData() {
    this.props.updateData();
  }

  /**
   * Toggle the collapse state of the current folder.
   * @return {object} [The updated state]
   */
  collapseFolder() {
    this.props.item.collapsed = !this.state.collapsed;
    this.props.updateData();

    this.setState({
      collapsed: !this.state.collapsed,
      item: this.props.item
    });
  }

  /**
   * Toggle the deprecation state of the current file.
   * @return {object} [The updated state]
   */
  toggleDeprecation() {
    this.props.item.deprecated = !this.state.deprecated;
    this.props.updateData();

    this.setState({
      deprecated: !this.state.deprecated,
      item: this.props.item
    });
  }

  /**
   * Switch the state of the current file.
   * @return {object} [The updated state]
   */
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

  /**
   * Enable the possibility to rename the selected file manager item.
   * @param  {event} e [The event object]
   * @return {object}   [The updated state]
   */
  enableRenameItem(e) {
    /**
     * Get the parent of the toggle button for renaming a file manager item and find the renaming input.
     */
    let renameOption = e.target;
    let parentNode = renameOption.parentNode;
    let closestChildInput = parentNode.querySelector('.file-manager__item--input');

    /**
     * Get the current name from the same file manager option and hide it.
     */
    let renameOptionText = parentNode.querySelector('.button__text');
    renameOptionText.classList.add('button__text--hidden');

    /**
     * Enable the renaming input and show it to the user as well as focus on it.
     */
    closestChildInput.disabled = false;
    closestChildInput.classList.add('file-manager__item--active');
    closestChildInput.focus();

    /**
     * Disable the possibilities to collapse folders or changing file states while renaming.
     */
    this.setState({
      collapseDisabled: true,
      fileStateDisabled: true,
      renameOptionText: renameOptionText,
      renameInput: closestChildInput
    });
  }

  /**
   * On input type catch every key pressed and check for specific ones.
   * If the user has pressed a button that represents them being done with renaming, the function will validate their input and proceed to updating and saving the data.
   * If the user has pressed a button that represents them exiting, the function will disable the input and return to the normal state.
   * @param  {event} e [The event object]
   */
  detectKeyPress(e) {
    let processedValue = {};
    let key = e.key;
    let renameInput = e.target;

    /**
     * Check if the user is done with renaming the file manager item.
     * If so, validate the new name and proceed to updating and storing the data.
     * @param  {string} key [The currently pressed key]
     */
    if (key === 'Enter') {
      let isOk = this.validateItemNewName(renameInput.value);
      if (isOk) {
        this.state.renameInput.setAttribute('data-processing', true);
        this.disableRenameItem();

        let processedValue = this.processNewName(renameInput.value);
        this.renameItem(processedValue);

        this.state.renameInput.removeAttribute('data-processing');
      }
    }

    /**
     * Check if the user wants to escape renaming the file manager item.
     * If so, disable the renaming possibility and return the item to its normal state.
     * @param  {string} key [The currently pressed key]
     */
    if (key === 'Escape') {
      this.disableRenameItem();

      renameInput.value = this.props.item.title;
      if (this.state.item.type === ItemTypes.file) {
        renameInput.value = `${this.props.item.title}.${this.props.item.extension}`;
      }
    }
  }

  /**
   * Validate the new file manager item name.
   * @param  {string} value [The new file manager item name]
   * @return {bool}       [Whether the provided file manager item name is valid]
   */
  validateItemNewName(value) {
    let label = `${StringHelper.capitalize(this.props.item.type)} name`;
    let isValid = false;

    /**
     * Validation for all types of file manager items.
     */
    let isNullOrEmpty = StringValidator.isNullOrEmpty(value, label);
    let hasForbiddenCharacters = NameValidator.hasForbiddenCharacters(value, label);
    if (hasForbiddenCharacters || isNullOrEmpty) {
      isValid = false;
    } else {
      isValid = true;
    }

    /**
     * If the file manager item is a file, validate its extension.
     * @param  {string} this.props.item.type [The type of the file manager item]
     * @return {bool}                      [Whether the file extension is valid]
     */
    if (this.props.item.type === ItemTypes.file) {
      let hasInvalidExtension = NameValidator.hasInvalidExtension(value, label);
      if (hasInvalidExtension) {
        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * Disable the option to rename a file manager item.
   * @return {object} [The updated state]
   */
  disableRenameItem() {
    if (this.state.renameOptionText === undefined || this.state.renameInput === undefined) {
      return;
    }

    /**
     * Escape state mutability by copying the reference to the state variable and updating the copy, not the state directly.
     */
    let renameInputCopy = this.state.renameInput;
    renameInputCopy.disabled = true;

    this.state.renameInput.classList.remove('file-manager__item--active');
    this.state.renameOptionText.classList.remove('button__text--hidden');

    this.setState({
      collapseDisabled: false,
      fileStateDisabled: false,
      renameInput: renameInputCopy
    });
  }

  /**
   * Process the new file manager item name.
   * @param  {strinf} value [The new file manager item name]
   * @return {object}       [The processed file manager item name]
   */
  processNewName(value) {
    let result = {};

    /**
     * If the file manager item is a file, split the name and the extension.
     * @param  {string} this.state.item.type [The type of the file manager item]
     * @return {object}                      [The updated result]
     */
    if (this.state.item.type === ItemTypes.file) {
      let splitValue = value.split('.');

      result.title = splitValue[0];
      result.extension = splitValue[1];
    } else {
      result.title = value;
    }

    return result;
  }

  // TODO: Implement commenting system.
  // TODO: Add sorting/filtering options.
  // TODO: Add a button for adding a file/folder and add it to the list of children and begin the rename function. If the user presses escape or clicks outside, the newly added element is removed from the list. The global data should be updated only when the user successfully adds a new item

  /**
   * Rename the file manager item with the provided processed and validated value.
   * @param  {string} value [The processed and validated new file manager item name]
   */
  renameItem(value) {
    /**
     * Do not mutate state directly.
     * Insted create a copy of the state property value and change it.
     * Afterwards call this.setState.
     */
    let itemCopy = Object.assign({}, this.state.item);
    itemCopy.title = value.title;

    /**
     * If the new name has an extension, that means it is a file. Add that extension to the copied file variable.
     * @param  {string} value.extension [Whether the new name has an extension]
     * @return {object}                 [The updated item copy]
     */
    if (value.extension) {
      itemCopy.extension = value.extension;
    }

    this.setState({
      item: itemCopy
    });

    /**
     * Update props and JSON data.
     */
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
            disableRenameItem={this.disableRenameItem.bind(this)} 
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
            disableRenameItem={this.disableRenameItem.bind(this)} 
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