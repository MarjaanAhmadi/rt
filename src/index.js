import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from "react-router-dom";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from "./config/redux/store";
import 'bootstrap-v4-rtl/dist/css/bootstrap-rtl.css';
import "react-toastify/dist/ReactToastify.css";
import "animate.css/animate.min.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import 'rc-time-picker/assets/index.css';

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
