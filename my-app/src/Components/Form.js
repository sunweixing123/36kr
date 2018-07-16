import React, { Component } from 'react';
class Form extends Component {
    render() {
        return (
            <div>
                <label>
                    Name:
                        <form type="text" name="name"></form>
                </label>
                <input type="submit" value="提交"></input>
            </div>
        )
    }
}
export default Form;