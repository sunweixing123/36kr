import React, { Component } from 'react';
import Boiling from '../Components/Boiling';
// import Temperature from '../Components/TemperatureInput';
import TemperatureInput from '../Components/TemperatureInput';
function toCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
}
function toFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}
function tryConvert(temperature, convert) {
    const input = parseFloat(temperature);
    if (Number.isNaN(input)) {
        return '';
    }
    const output = convert(input);
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
}
class Calculator extends Component {
    constructor(props) {
        super(props);
        // this.handleChange = this.handleChange.bind(this);
        this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
        this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
        // this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
        this.state = {
            temperature: '',
            scale: 'c'
        }
    }
    // handleChange(e){
    //     this.setState({
    //         temperature : 'e.target.value'
    //     })
    // }
    handleCelsiusChange(temperature) {
        this.setState({
            sccale: 'c', temperature
        })
    }
    handleFahrenheitChange(temperature) {
        this.setState({
            scale: 'f', temperature
        })
    }
    render() {
        const scale = this.state.scale;
        const temperature = this.state.temperature;
        const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
        const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;


        return (
            // <div>
            //     <TemperatureInput scale="c" />
            //     <TemperatureInput scale="f" />
            // </div>
            // <fieldset>
            //     <legend>Enter temperature in Celsius:</legend>
            //     <input value={this.temperature} onChange={this.handleChange}></input>
            //     <Boiling celsius={parseFloat(temperature)} />
            // </fieldset>
            <div>
                <TemperatureInput
                    scale="c"
                    temperature={celsius}
                    onTemperatureChange={this.handleCelsiusChange} />

                <TemperatureInput
                    scale="f"
                    temperature={fahrenheit}
                    onTemperatureChange={this.handleFahrenheitChange} />

                <Boiling celsius={parseFloat(celsius)} />

            </div>
        )
    }
}
export default Calculator;