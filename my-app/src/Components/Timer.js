import React,{Component} from 'react';
class Timer extends Component {
    constructor(props){
        super(props);
        this.state = {seconds:0};
    }
    tick(){
        this.setState (prevState=>({
            seconds:prevState.seconds+1
        }));
    }
    componentDidMount(){
        this.interval = setInterval(()=>this.tick(),1000);
    }
    componentWillMount(){
        clearInterval(this.interval);
    }
    render(){
        return (
            <div>
                <h1>
                    Seconds:{this.state.seconds};
                </h1>
            </div>
        )
    }
}
export default Timer;