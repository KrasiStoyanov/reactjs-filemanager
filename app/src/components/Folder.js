import React, { Component } from 'react';

class Folder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseDisabled: props.collapseDisabled,
      renameOptionText: props.renameOptionText,
      renameInput: props.renameInput,
      item: props.item
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.collapseDisabled !== state.collapseDisabled) {
      return {
        collapseDisabled: props.collapseDisabled
      }
    }

    return null;
  }

  collapseFolder() {
    if (!this.state.collapseDisabled) {
      this.props.toggleCollapse();
    }
  }

  enableRenameItem(e) {
    this.props.enableRenameItem(e);
  }

  disableRenameItem(e) {
    this.props.disableRenameItem();
  }

  detectKeyPress(e) {
    this.props.detectKeyPress(e);
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
            onBlur={this.disableRenameItem.bind(this)} 
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