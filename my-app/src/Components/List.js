import React, { Component } from 'react';
const numbers = [1,2,3,4,5];
const listItems = numbers.map((number)=>
    <li>{number}</li>
);
class List extends Component {
    // NumberList(props) {
    //     const numbers = props.numbers;
    //     const listItems = numbers.map((number) =>
    //         <li>{number}</li>
    //     );
    //     return (
    //         <ul>{listItems}</ul>
    //     );
    // }
    // numbers = [1,2,3,4,5];
    render() {

        return (
            <ul>{listItems}</ul>
            // <ul>
            //     <li>111</li>
            //     <li>222</li>
            //     <li>333</li>
            // </ul>
        )
        // return (
        //     <NumberList numbers={numbers}/>
        // )
       
    }
}
export default List;