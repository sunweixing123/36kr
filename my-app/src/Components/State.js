import React, { Component } from 'react'
class State extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '请输入内容'
        };
        this.testChange = this.testChange.bind(this);
        this.testSubmit = this.testSubmit.bind(this);
        this.test = this.test.bind(this);
    }
    testChange(event) {
        this.setState({ value: event.target.value })
    }
    test(event){
        this.setState({value:''})
    }
    testSubmit(event) {
        alert(this.state.value);
        event.preventDefault();
    }
    render() {
        return (
            <form onSubmit={this.testSubmit}>
                <label>
                    文章:
          <textarea value={this.state.value} onChange={this.testChange} onFocus={this.test}/>
                </label>
                <input type="submit" value="提交" />
            </form>
        )
    }
}
export default State;