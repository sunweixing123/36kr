import React,{Component} from 'react';
class Boiling extends Component {
    BoilingVerdict(props){
        if(props.celsius >= 100){
            return <p>The Water would boil</p>;
        }
    }
    render(){
        return (
            <div></div>
        )
    }
}
export default Boliing;