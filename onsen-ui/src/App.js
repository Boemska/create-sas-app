import React from 'react';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import './App.scss';
import {connect} from 'react-redux'
import AppTabbar from './components/AppTabbar/AppTabbar.js'
import Portal from './components/portal/portal'
import LoginModal from './components/loginModal/loginModal'
import UserInfoSplitter from './components/userInfoSplitter/userInfoSplitter'
import LeftSplitter from './components/leftSplitter/leftSplitter'
import {
	Dialog,
	Icon,
	Navigator,
	Page,
	Splitter,
	SplitterContent,
	SplitterSide, Toolbar,
	ToolbarButton
} from 'react-onsenui';
import LoadingIndicator from './components/loading-indicator/loading-indicator'
import {CustomToast} from './components/customToast/customToast'
import unknownPerson from './assets/images/unknownPerson.png'
import {setWelcomeMessage} from './pages/home/homeActions'

class App extends React.Component {
	constructor(props) {
		super(props);
		this.renderToolbar = this.renderToolbar.bind(this);
		this.state = {
			isOpenLeftSplitter: false,
			isOpenUserInfoSplitter: false
		}
	}

	setShowSplitter = (isOpen) => {
		this.setState({isOpenLeftSplitter: isOpen});
	}

	setShowUserInfoSplitter = (isOpen) => {
		this.setState({isOpenUserInfoSplitter: isOpen});
	}


	renderPage(route, navigator) {
		route.props = route.props || {};
		route.props.navigator = navigator;
		return React.createElement(route.component, route.props)
	}

	renderToolbar() {
		return (
			<Toolbar>
				<div className="left">
					<ToolbarButton onClick={() => this.setShowSplitter(true)}>
						<Icon icon='md-menu'/>
					</ToolbarButton>
				</div>
				<div className='right'>
					<LoadingIndicator handleIconClick={() => this.setShowUserInfoSplitter(true)}/>
				</div>
			</Toolbar>
		)
	}

	hideWelcomeMessage = () => {
		setTimeout(() => {
				this.props.setWelcomeMessage(false);
			}
			, 2000)
	}

	render() {
		const avatar = this.props.userData &&
			(this.props.userData.userAvatar || (this.props.userData.userInfo && this.props.userData.userInfo[0].AVATAR_URI))
		if (this.props.welcomeMessage) {
			this.hideWelcomeMessage()
		}
		return (
			<Splitter>
				<SplitterSide
					side='left'
					width={200}
					collapse={true}
					swipeable={true}
					isOpen={this.state.isOpenLeftSplitter}
					onClose={() => this.setShowSplitter(false)}
					onOpen={() => this.setShowSplitter(true)}
				>
					<LeftSplitter isOpenLeftSplitter={this.setShowSplitter} navigator={this.navigator}/>
				</SplitterSide>
				<SplitterSide
					side='right'
					width={200}
					collapse={true}
					swipeable={true}
					isOpen={this.state.isOpenUserInfoSplitter}
					onClose={() => this.setShowUserInfoSplitter(false)}
					onOpen={() => this.setShowUserInfoSplitter(true)}
				>
					<UserInfoSplitter isOpenSplitter={this.setShowUserInfoSplitter} navigator={this.navigator}/>
				</SplitterSide>
				<SplitterContent>
					<Page renderToolbar={this.renderToolbar}>
						<Navigator
							swipeable
							initialRoute={{
								component: AppTabbar,
								props: {key: 'appTabbar'}
							}}
							renderPage={this.renderPage}
							ref={(navigator) => {
								this.navigator = navigator;
							}}
						/>
						<Dialog
							isOpen={this.props.welcomeMessage}
							isCancelable={false}
							className={'welcome-wrapper'}
						>
							<div className={'welcome-container'}>
								<div className={'img-container'}>
									<img src={this.props.userData ? avatar : unknownPerson} alt="avatar"
											 className={'img-size'}/>
								</div>
								<div className={'message-container'}>
									<p className={'welcome-message'}>
										Welcome
									</p>
									<p className={'welcome-message'}>
										{this.props.userData ? this.props.userData.name : ' Unknown'}
									</p>
								</div>
							</div>
						</Dialog>
						<CustomToast/>
					</Page>
				</SplitterContent>
				<Portal>
					<LoginModal/>
				</Portal>
			</Splitter>
		)
	}
}

function mapStateToProps(state) {
	return {
		userData: state.home.userData,
		welcomeMessage: state.home.welcomeMessage
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setWelcomeMessage: isActive => setWelcomeMessage(dispatch, isActive),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
