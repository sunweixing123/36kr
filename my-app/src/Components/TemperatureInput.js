import React,{Component} from 'react';
const scaleNames = {

}
class TemperatureInput extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            temperature : ''
        }
    }
    handleChange(e){
        this.setState({
            temperature : e.target.value
        })
    }
    render(){
        const temperature = thia.state.temperature;
        const scale = this.state.scale;
        return (
            <fieldset>
                <legend>Enter temperature in {scaleNames[scale]}:</legend>
                <input value={temperature} onChange={this.handleChange} />
            </fieldset>
        )
    }
}
export default TemperatureInput;