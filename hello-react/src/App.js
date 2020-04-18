import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      restraunt: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }



  handleChange(event) {
    this.setState({ value: event.target.value });
  }


  async componentDidMount() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "address": "Stumpergasse 51, 1060 Vienna" }) //JSON.stringify({ "address": this.state.value }) ////
    };
    const response = await fetch('http://10.160.217.36:9095/api/v1/outlets/', requestOptions);
    const data = await response.json();
    this.setState({ restraunt: data.payload[0].name });

  }

  handleSubmit(event) {
    alert('An address was submitted: ' + this.state.value, this.state.restraunt);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Address of customer:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
        <div className="card-body">
          Returned restraunt address: {this.state.restraunt}
        </div>
      </form>

    );
  }

  /*render() {

    return (
      <div className="card text-center m-3">
        <h5 className="card-header">POST Request with Async/Await</h5>
        <div className="card-body">
          Returned Id: {postId}
        </div>
      </div>
    );
  }*/
}


export default App;
