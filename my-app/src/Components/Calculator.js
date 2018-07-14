import React,{Component} from 'react';
import Boiling from '../Components/Boiling';
import Temperature from '../Components/TemperatureInput';
import TemperatureInput from '../Components/TemperatureInput';
class Calculator extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            temperature : ''
        }
    }
    handleChange(e){
        this.setState({
            temperature : 'e.target.value'
        })
    }
    render(){
        const temperature = this.state.temperature;
        return (
            <div>
                <TemperatureInput scale="c" />
                <TemperatureInput scale="f" />
            </div>
            // <fieldset>
            //     <legend>Enter temperature in Celsius:</legend>
            //     <input value={this.temperature} onChange={this.handleChange}></input>
            //     <Boiling celsius={parseFloat(temperature)} />
            // </fieldset>
        )
    }
}
export default Calculator;