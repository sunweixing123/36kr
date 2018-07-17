import React , {Component} from 'react';
function NumberList(props){
    const numbers = props.numbers;
    const listItems = numbers.map((number)=>
    <li key={number.toString()}>{number}</li>
);
    return (
        <ul>{listItems}</ul>
    );
}
const numbers = [1,2,3,4,5];
class NumberList1 extends Component{
    render(){
        return(
            <NumberList numbers={numbers} />
        )
    }
}
export default NumberList1;