import React, { Component } from 'react';
import * as StringValidator from '../validators/StringValidator';

import { ItemTypes } from '../constants/ItemTypes';

class Folder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseDisabled: false,
      renameOptionText: null,
      renameInput: null,
      item: props.item
    };
  }
  
  collapseFolder() {
    if (!this.state.collapseDisabled) {
      this.props.toggleCollapse();
    }
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
      renameOptionText: renameOptionText,
      renameInput: closestChildInput
    });
  }

  detectKeyPress(e) {
    let key = e.key;
    let renameInput = e.target;

    if (key === 'Enter') {
      let isOk = this.validateItemNewName(renameInput.value);
      if (isOk) {
        this.disableRenameItem();
        this.props.renameItem(renameInput.value);
      }
    }

    if (key === 'Escape') {
      this.disableRenameItem();
      renameInput.value = this.props.item.title;
    }
  }

  validateItemNewName(value) {
    let label = `${ItemTypes.folder.capitalize()} name`;
    StringValidator.IsNullorEmpty(null, label);

    return true;
  }

  disableRenameItem() {
    if (this.state.renameOptionText === undefined || this.state.renameInput === undefined) {
      return;
    }

    this.state.renameInput.disabled = true;
    this.state.renameInput.classList.remove('file-manager__item--active');
    this.state.renameOptionText.classList.remove('button__text--hidden');

    this.setState({
      collapseDisabled: false
    });
  }

  render() {
    let item = this.state.item;

    return (
      <div>
        <button
          onClick={this.collapseFolder.bind(this)}
          className={`file-manager__item file-manager__item--folder button button--small button--full-width button--max-width button--grey`}
        >
          <input
            type="text"
            defaultValue={item.title}
            onKeyDown={this.detectKeyPress.bind(this)}
            className={`file-manager__item file-manager__item--input`}
          />
          <span className="button__text">{item.title}</span>
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

export default Folder;
