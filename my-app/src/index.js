import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Test from './Components/Test';
import Footer from './Components/Footer';
import Header from './Components/Header';
import Test2 from './Components/Test2';
import Timer from './Components/Timer';
import List from './Components/List';
import Form from './Components/Form';
import State from './Components/State';
import Chuanzhi from './Components/Chuanzhi';
import Style from './Components/Style';
class Index extends Component {
    render(){
        return (
            <div>
                <Header/>
                <Test/>
                <Test2/>
                <Timer/>
                <List/>
                <Form/>
                <State/>
                <Chuanzhi/>
                <Style/>
                <Footer/>
            </div>
        )
    }
}
ReactDOM.render(<Index/>, document.getElementById('root'));
registerServiceWorker();
