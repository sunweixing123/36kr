import React,{Component} from 'react';
import '../style/Splitpane.css';
function Contacts(){
    return (
        <div className="Contacts"></div>
    )
}
function Chat(){
    return (
        <div className="Chat"></div>
    )
}
function Splitpane1(props){
    return (
        <div className='SplitPane'>
            <div className="SplitPane-left">
                {props.left}
            </div>
            <div className="SplitPane-right">
                {props.right}
            </div>
        </div>
    )
}
function App(){
    return (
        <Splitpane1
            left={
                <Contacts/> 
            }
            right={
                <Chat/>
            }
        />
    )
}
class Splitpane extends Component {
    render(){
        return(
            <App/>
        )
    }
}
export default Splitpane;