import React,{Component} from 'react';
function FancyBorder(props){
    return (
        <div>
            {props.children}
        </div>
    )
}
function Dialog(props){
    return (
        <FancyBorder>
            <h1>
                {props.title}
            </h1>
            <p>
                {props.message}
            </p>
            {props.children}
        </FancyBorder>
    )
}
class SignUpDialog extends Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
        this.state = {login:''};
    }
    render(){
        return(
            <Dialog 
            title="我是标题"
            message="how should we refer to you">              
                <input value={this.state.login} onChange={this.handleChange} />
                <button onClick={this.handleSignup}>
                    Sign Me Up!
                </button>
            </Dialog>
        )
    }
    handleChange(e){
        this.setState({
            login:e.target.value
        })
    }
    handleSignup(){
        alert(`welcome aborad , ${this.state.login }`)
    }
}
export default SignUpDialog;