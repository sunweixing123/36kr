import React, { Component } from 'react';
class Chuanzhi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name : 'sunweixing',
            age : 18
        }
    }
    testChange(){
        // this.setState({
        //     age : 20
        // });
    }
    render() {

        return (
            <div>
                <h1>{this.state.name}</h1>
                <h1>{this.state.age}</h1>
                <button onClick = {this.testChange}>改变</button>
            </div>
        )
    }
}
export default Chuanzhi;