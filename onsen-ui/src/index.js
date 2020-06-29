import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {HashRouter as Router} from 'react-router-dom'
import {Provider} from 'react-redux'
import {getStore} from './store'
import {initializeIcons} from '@uifabric/icons';
import ToastActionTypes from './components/customToast/ActionTypes'

initializeIcons()

export const store = getStore();

const RootApp = () =>
	(<Provider store={store}>
		<Router>
			<App/>
		</Router>
	</Provider>)

ReactDOM.render(RootApp(), document.getElementById('root'));


const offlineToast = () => {
	store.dispatch({
		type: ToastActionTypes.SHOW_TOAST,
		payload: {
			isOpen:true,
		  message: 'Offline mode',
			btnText:'Ok',
			action:null
		}
	})
}

window.addEventListener('load', () => {

	function checkNetworkStatus(event) {

		if (!navigator.onLine) {
			console.log("ALERT")
			offlineToast();
		}
	}

	window.addEventListener('offline', checkNetworkStatus())

})

//The second addEventListener is for detecting the offline status while using the appliaction, the first one checks only for initial load
window.addEventListener('offline', () => {
	offlineToast();
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
