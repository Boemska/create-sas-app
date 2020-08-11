import React from 'react';
import 'react-toggle/style.css'
import 'toastr/toastr.scss'
import './App.scss';
import {Switch, Route} from 'react-router-dom';
import Home from './pages/home/home'
import Footer from './components/footer/footer'
import Header from './components/header/header'
import Page500 from './pages/Page500/Page500'
import Page404 from './pages/Page404/Page404'
import Portal from './components/portal/portal'
import LoginModal from './components/loginModal/loginModal'
import ApplicationLogs from './pages/applicationLogs/applicationLogs'
import FailedRequests from './pages/failedRequests/failedRequests'
import ErrorLogs from './pages/errorLogs/errorLogs'
import DebugLogs from './pages/debugLogs/debugLogs'

import {
	createTheme,
	Customizations,
	Fabric,
} from '@fluentui/react';



const myTheme = createTheme({
	palette: {
		themePrimary: '#aa78d4',
		themeLighterAlt: '#eff6fc',
		themeLighter: '#deecf9',
		themeLight: '#c7e0f4',
		themeTertiary: '#71afe5',
		themeSecondary: '#2b88d8',
		themeDarkAlt: '#106ebe',
		themeDark: '#005a9e',
		themeDarker: '#004578',
		neutralLighterAlt: '#faf9f8',
		neutralLighter: '#f3f2f1',
		neutralLight: '#edebe9',
		neutralQuaternaryAlt: '#e1dfdd',
		neutralQuaternary: '#d0d0d0',
		neutralTertiaryAlt: '#c8c6c4',
		neutralTertiary: '#a19f9d',
		neutralSecondary: '#605e5c',
		neutralPrimaryAlt: '#3b3a39',
		neutralPrimary: '#323130',
		neutralDark: '#201f1e',
		black: '#000000',
		white: '#ffffff',
	}
});
Customizations.applySettings({theme: myTheme});

function App() {
	return (
		<Fabric applyThemeToBody>
			<div className="App">
				<Header/>
				<div className={'main'}>
					<div className={'mainContainer'}>
						<Switch>
							<Route exact path='/' component={Home}/>
							<Route exact path='/error' component={Page500}/>
							<Route exact path='/applicationLogs' component={ApplicationLogs}/>
							<Route exact path='/errorLogs' component={ErrorLogs}/>
							<Route exact path='/failedRequests' component={FailedRequests}/>
							<Route exact path='/debugLogs' component={DebugLogs}/>
							<Route component={Page404}/>
						</Switch>
					</div>
				</div>
				<Footer/>
				<Portal>
					<LoginModal/>
				</Portal>
			</div>
		</Fabric>

	);
}

export default App;
