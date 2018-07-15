import React,{Component} from 'react';
import Boiling from '../Components/Boiling';
// import Temperature from '../Components/TemperatureInput';
import TemperatureInput from '../Components/TemperatureInput';
class Calculator extends Component {
    constructor(props){
        super(props);
        // this.handleChange = this.handleChange.bind(this);
        this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
        // this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
        this.state = {
            temperature : '',
            // scale: 'c'
        }
    }
    // handleChange(e){
    //     this.setState({
    //         temperature : 'e.target.value'
    //     })
    // }
    handleCelsiusChange(temperature){
        this.setState({
            temperature
        })
    }
    // handleFahrenheitChange(temperature){
    //     this.setState({
    //         temperature
    //     })
    // }
    render(){
        // const scale = this.state.scale;     
        const temperature = this.state.temperature;
        // const celsius = this.state.celsius;

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
        //   scale="c"
          temperature={temperature}
          onTemperatureChange={this.handleCelsiusChange} />

        <TemperatureInput
        //   scale="f"
          temperature={temperature}
          onTemperatureChange={this.handleCelsiusChange} />

        <Boiling />

      </div>
        )
    }
}
export default Calculator;