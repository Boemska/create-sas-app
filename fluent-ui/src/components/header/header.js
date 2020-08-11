import React from 'react'
import LogoImg from '../../assets/images/blogo.svg'
import './header.scss'
import LoadingIndicator from '../loading-indicator/loading-indicator'
import UserInfoDropDown from '../userInfoDropDown/userInfoDropDown'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {removeRequest} from '../../adapterService/adapterActions'
import moment from 'moment'
import {Customizations} from '@fluentui/react'


class Header extends React.PureComponent {

	constructor(props) {
		super(props)
		this.requestsWatcherInterval = null
		this.customization = Customizations.getSettings(['theme'])
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
		return (
			<div className={'header'} style={{backgroundColor: this.customization.theme.palette.themePrimary}}>
				<img src={LogoImg} alt={'logo'} onClick={() => {
					this.props.history.push('/')
				}}/>
				<div className={'info-block'}>
					<LoadingIndicator/>
					{/* eslint-disable-next-line react/jsx-no-undef */}
					<UserInfoDropDown/>
				</div>
			</div>)
	}
}

function mapStateToProps(state) {
	return {
		requests: state.adapter.requests
	}
}

function mapDispatchToProps(dispatch) {
	return {
		removeRequest: (promise) => removeRequest(dispatch, promise),

	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))

