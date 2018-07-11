import React, { Component } from 'react';
import Success from './Success';
import Error from './Error';
class Header extends Component {

    testClick(){
        alert('aa');
    }
    render() {
        var aa;
        if (true) {
            aa = <Success/>
        }else{
            aa = <Error/>
        }
        return (
            <div>
                {aa}
                <h1 onClick={this.testClick}>这是头部</h1>
            </div>
        )
    }
}
export default Header;
