import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import homeReducer from './pages/home/homeReducer'
import loginReducer from './components/loginModal/loginReducer'
import {adapterReducer} from './adapterService/adapterReducer' // eslint-disable-line no-unused-vars
import headerReducer from "./components/header/headerReducer" // eslint-disable-line no-unused-vars
import {projectReducer} from './pages/projectProperties/projectReducer';

let middlewares = []

middlewares.push(thunk)

const showLogs = false

// if (process.env.NODE_ENV !== 'production') {
// 	if (showLogs) {
// 		middlewares.push(createLogger({
// 		  collapsed: true,
// 		  predicate: (getState, action) => action.type !== 'UPDATE_BBOX'
// 		}));
// 	}
// }
if (showLogs) {
		middlewares.push(createLogger({
		  collapsed: true,
		  predicate: (getState, action) => action.type !== 'UPDATE_BBOX'
		}));
	}


const reducer = combineReducers({
	home: homeReducer,
	login: loginReducer,
	adapter: adapterReducer,
  header: headerReducer,
  project: projectReducer
})

export function getStore(preloadedState) {
	return createStore(reducer, preloadedState,
    applyMiddleware(...middlewares)
  );
}
