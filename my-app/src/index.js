import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
// import { Router, Route } from 'react-router';
// import {Link} from 'react-router-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
// import {HashRouter, Route, Link, Switch} from 'react-router-dom';
import './index.css';
import App from './App';
import Children from './Components/Children';
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
import Calculator from './Components/Calculator';
import WelcomeDialog from './Components/WelcomeDialog';
import Splitpane from './Components/Splitpane';
import SignUpDialog from './Components/SignUpDialog';
import NumberList1 from './Components/NumberList';
import Blog1 from './Components/Blog';
class Index extends Component {
    render() {
        return (
            <div>
                <Router>
                    <div>
                        <ul>
                            <li><Link to="/Blog1">Blog</Link></li>
                            <li><Link to="/NumberList1">NumberList</Link></li>
                            <li><Link to="/SignUpDialog">SignUpDialog</Link></li>
                            <li><Link to="/children">children</Link></li>
                            <li><Link to="/splitpane">Splitpane</Link></li>
                            <li><Link to="/welcomedialog">WelcomeDialog</Link></li>
                            <li><Link to="/calculator">Calculator</Link></li>
                            <li><Link to="/">header</Link></li>
                            <li><Link to="/test">test</Link></li>
                            <li><Link to="/test2">test2</Link></li>
                            <li><Link to="/timer">timer</Link></li>
                            <li><Link to="/list">list</Link></li>
                            <li><Link to="/form">form</Link></li>
                            <li><Link to="/state">state</Link></li>
                            <li><Link to="/chuanzhi">chuanzhi</Link></li>
                            <li><Link to="/style">style</Link></li>
                            <li><Link to="/footer">footer</Link></li>
                        </ul>
                        <Route path="/Blog1" component={Blog1}></Route>
                        <Route path="/numberlist1" component={NumberList1}></Route>
                        <Route path="/signupdialog" component={SignUpDialog}></Route>
                        <Route path="/children" component={Children}></Route>
                        <Route path="/splitpane" component={Splitpane}></Route>
                        <Route path="/welcomedialog" component={WelcomeDialog}></Route>
                        <Route path="/calculator" component={Calculator}></Route>
                        <Route path="/header" component={Header} ></Route>
                        <Route path="/test" component={Test} ></Route>
                        <Route path="/test2" component={Test2} ></Route>
                        <Route path="/timer" component={Timer} ></Route>
                        <Route path="/list" component={List} ></Route>
                        <Route path="/form" component={Form} ></Route>
                        <Route path="/state" component={State} ></Route>
                        <Route path="/chuanzhi" component={Chuanzhi} ></Route>
                        <Route path="/style" component={Style} ></Route>
                        <Route path="/footer" component={Footer} ></Route>
                    </div>
                </Router>
            </div>
        )
    }
}
ReactDOM.render((
    <Index />
),

    document.getElementById('root'));
registerServiceWorker();
