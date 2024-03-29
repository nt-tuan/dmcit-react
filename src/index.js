import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import { store } from './_helpers';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'moment/locale/vi';
import Moment from 'react-moment';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import vi from 'date-fns/locale/vi';
Moment.globalLocale = 'vi';
Moment.globalFormat = 'DD/MM/YYYY';
Moment.globalLocal = true;
registerLocale('vi', vi);
setDefaultLocale('vi');
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
