import React, { Component } from 'react';
import '../style/WelcomeDialog.css'
function FancyBorder(props) {
    return (
        <div className={'FancyBorder FancyBorder-' + props.color}>
            {props.children}
        </div>
    )
}
function WelcomeDialog1() {
    return (
        <FancyBorder color="blue">
            <h1 className="Dialog-title">
                welcome
            </h1>
            <p className="Dialog-message">
                Thank you for visiting our spacecraft!
      </p>
        </FancyBorder>
    )
}
class WelcomeDialog extends Component {
    render(){
       return (
        <WelcomeDialog1/>
       )
    }
}
export default WelcomeDialog;