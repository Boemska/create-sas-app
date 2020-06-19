import React from 'react'
import LogoImg from '../../assets/images/blogo.svg'
import LoadingIndicator from '../loading-indicator/loading-indicator'
import UserInfoDropDown from '../userInfoDropDown/userInfoDropDown'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {removeRequest} from '../../adapterService/adapterActions'
import moment from 'moment'
import {Button, Nav, Navbar} from 'react-bootstrap'
import './header.scss'


class Header extends React.PureComponent {

	constructor(props) {
		super(props)
		this.requestsWatcherInterval = null
	}

	requestsWatcher = () => {
		this.requestsWatcherInterval = setInterval(() => {
			Array.from(this.props.requests.keys()).forEach(key => {
				let param = this.props.requests.get(key)
				let timeDiff = moment().diff(moment(param.timestamp), 'seconds')
				if (timeDiff > 360) {
					this.props.removeRequest(key)
				}
			})
		})
	}

	componentDidMount() {
		this.requestsWatcher();
	}

	componentWillUnmount() {
		clearInterval(this.requestsWatcherInterval);
	}

	render() {
		return (<Navbar expand="lg" className={'header'}>
				<Navbar.Brand><img src={LogoImg} alt={'logo'} onClick={() => {
					this.props.history.push('/')
				}}/></Navbar.Brand>
				{this.props.update ?
					<Button variant={'danger'} className={'mr-3'} onClick={() => window.location.reload()}>New update
						available </Button> : null}
				{this.props.offline &&
				<span className={'mr-4'}><i className={'fas fa-exclamation-triangle mr-3'}/>Application is offline</span>}
				<Navbar.Toggle aria-controls="basic-navbar-nav"/>
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto">
						<div className={'info-block'}>
							<LoadingIndicator/>
							<UserInfoDropDown/>
						</div>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		)
	}
}

function mapStateToProps(state) {
	return {
		requests: state.adapter.requests,
		update: state.header.update,
		offline: state.home.offline
	}
}

function mapDispatchToProps(dispatch) {
	return {
		removeRequest: (promise) => removeRequest(dispatch, promise),

	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))

