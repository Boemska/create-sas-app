import React from 'react'
import './header.scss'
import LoadingIndicator from '../loading-indicator/loading-indicator'
import UserInfoDropDown from '../userInfoDropDown/userInfoDropDown'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {removeRequest} from '../../adapterService/adapterActions'
import moment from 'moment'
import {Customizations, FontIcon, mergeStyles} from '@fluentui/react'
import {setLeftPanel} from '../../pages/home/homeActions'

const iconClass = mergeStyles({
	fontSize: 50,
	height: 50,
	width: 50,
	color: '#fff'
})

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
				{this.props.width < 600 ? <FontIcon
					iconName="Waffle"
					className={`${iconClass} leftPanelToggle`}
					onClick={() => this.props.toggleLeftPanel(!this.props.leftPanel)}/> : <div></div>
				}
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
		requests: state.adapter.requests,
		leftPanel: state.home.leftPanel,
		width: state.home.width
	}
}

function mapDispatchToProps(dispatch) {
	return {
		removeRequest: (promise) => removeRequest(dispatch, promise),
		toggleLeftPanel: state => setLeftPanel(dispatch, state)
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))

