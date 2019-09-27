import React, { Component } from 'react';
import FileManager from './components/FileManager';

import './assets/sass/style.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoaded: false
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', (e) => {
      if (this.state.didTransferData === 'undefined')
      {
        this.updateData.bind(this);
      }
      if (!this.state.didTransferData) {
        e.returnValue = `Are you sure you want to leave?`;
      }
    });

    fetch('https://api.myjson.com/bins/1b5iud')
      .then(res => res.json())
      .then(json => {
        this.setState({
          isLoaded: true,
          items: json
        });
      });
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', () => {
      if (!this.state.didTransferData) {
        alert('You sure bout this?');
      }

      this.updateData.bind(this);

      return '';
    });
  }

  updateData() {
    this.setState({
      didTransferData: this.state.didTransferData !== 'undefined' ? this.state.didTransferData : false
    });

    if (this.state.items.length > 0) {
      fetch('https://api.myjson.com/bins/1b5iud', {
          method: 'put',
          mode: 'cors',
          body: JSON.stringify(this.state.items),
          headers: {
            'Content-Type': 'application/json'          
          }
      })
      .then(res => {
        this.setState({
          didTransferData: true
        });
      
        return res;
      })
      .catch(err => err);
    }
  }

  render() {
    let { isLoaded, items } = this.state;

    if (!isLoaded) {
      return <div>Loading...</div>
    }
    else {
      return (
        <div className='file-manager'>
          <FileManager 
            updateData={this.updateData.bind(this)} 
            collapsed={false} 
            data={items} 
          />
        </div>
      );
    }
  }
}

export default App;
