import React from 'react'
import {connect} from "react-redux";
import './loading-indicator.scss'
import {ProgressCircular, ToolbarButton, Popover, Button} from 'react-onsenui'
import unknownPerson from '../../assets/images/unknownPerson.png'
import {getRequestsList} from '../../common/utils'
import ons from 'onsenui';

class LoadingIndicator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ios_platform: false
		}
	}

	handleClick = () => {
		this.props.handleIconClick();
	}

	setBorder = (isLoading, requests) => {
		let class_name = 'image-holder '
		if (!isLoading && requests.length > 0) {
			if (requests[0].successful) {
				class_name += 'success-border'
			} else {
				class_name += 'fail-border'
			}
		} else {
			class_name += 'transparent-border'
		}
		return class_name
	}

	componentDidMount() {
		if (!ons.platform.isAndroid()) {
			this.setState({ios_platform: true})
		}
	}

	render() {
		const {ios_platform} = this.state;
		const avatar = this.props.userData && (this.props.userData.userAvatar || (this.props.userData.userInfo && this.props.userData.userInfo[0].AVATAR_URI))
		const requestsStatus = getRequestsList(this.props.requests)
		return (
			<div className={ios_platform ? 'icons-wrapper ios-top' : 'icons-wrapper android-top'}>
				<div>
					{requestsStatus.loading &&
					<ProgressCircular
						className={ios_platform ?
							'progres-circular-position ios-indicator'
							: 'progres-circular-position android-indicator'}
						indeterminate/>
					}
				</div>
				{
					this.props.isUpdateAvailable &&
					<i style={{color: "#fdcf08", position: "absolute", right: "1px"}} className="fas fa-bell"/>
				}
				<div className={this.setBorder(requestsStatus.loading, requestsStatus.requests)}>
					<ToolbarButton onClick={this.handleClick} className={ios_platform ? '' : 'android-position'}>
						<img src={this.props.userData ? avatar : unknownPerson} alt="avatar"
								 className={ios_platform ? 'img-size ios-img' : 'img-size android-img'}/>
					</ToolbarButton>
				</div>
			</div>
		)
	}
}

function mapStateToProps(store) {
	return {
		requests: store.adapter.requests,
		userData: store.home.userData,
		isUpdateAvailable: store.home.newUpdate
	}
}

export default (connect(mapStateToProps)(LoadingIndicator))

