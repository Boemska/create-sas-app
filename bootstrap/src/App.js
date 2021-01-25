import React from 'react';
import 'react-toggle/style.css'
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
import Results from './pages/results/results'
import Interview from './pages/interview/interview'
import Figures from './pages/figures/figures'
// import Sidebar from './components/sidebar/sidebar' // comented out
import toastr from 'toastr'
import {connect} from 'react-redux'


class App extends React.Component {
	componentWillReceiveProps(nextProps) {
		if (nextProps.update) {
			toastr.info('A new version of this app is avaliable, refresh the page to view the changes')
		}
	}

	render() {
		return (
			<div className="App">
				<Header/>
				<div className={'main'}>
					{/*<Sidebar/>*/}
					<div className={'mainContainer'}>
						<Switch>
							<Route exact path='/' component={Home}/>

							<Route exact path='/results' component={Results}/>
							<Route exact path='/interview' component={Interview}/>
							<Route exact path='/figures' component={Figures}/>
							<Route path='/error' component={Page500}/>
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
		);
	}
}

function mapStateToProps(state) {
	return {
		update: state.header.update
	}
}

export default connect(mapStateToProps)(App);
