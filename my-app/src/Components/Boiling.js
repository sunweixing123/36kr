import React,{Component} from 'react';
// class Boiling extends Component {
//     BoilingVerdict(props){
//         if(props.celsius >= 100){
//             return <p>The Water would boil</p>;
//         }
//     }
//     render(){
//         return (
//             <div></div>
//         )
//     }
// }
function Boiling(props){
    if(props.celsius >= 100){
        return <p>the water was boil</p>
    }else{
        return <p>the water was not boil</p>
    }
}
export default Boiling;