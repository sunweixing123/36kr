import React,{Component} from 'react'
function FancyBorder(props){
    return(
        <div>
            {props.children}
        </div>
    )
}
function Children(){
    return (
        <FancyBorder>
            <h1>Welcome</h1>
            <p>thank you for waiting</p>
        </FancyBorder>
    )
}
export default Children;