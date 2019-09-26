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
    window.addEventListener('beforeunload', () => {
      this.setState({
        didTransferData: false
      });

      if (!this.state.didTransferData) {
        alert('You sure bout this?');
      }


      this.updateData.bind(this);
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
    });
  }

  updateData() {
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
      return <FileManager updateData={this.updateData.bind(this)} collapsed={false} data={items} />
    }
  }
}

export default App;
