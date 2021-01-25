import React from 'react'
import adapterService from '../../adapterService/adapterService'
import {setGlobalData} from '../home/homeActions'
import {connect} from 'react-redux'

class Figures extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			error: ''
		}
	}

	componentWillReceiveProps(np) {
	}

	render() {
		return <div>Figures page</div>
	}
}

function mapStateToProps(store) {
	return {
		userData: store.home.userData,
		globalData: store.home.globalData
	}
}

function mapDispatchToProps(dispatch) {
	return {
		// managedRequest: (method, url, data, options) => adapterService.managedRequest(dispatch, method, url, data, options),
		setGlobalData: data => setGlobalData(dispatch, data)
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(Figures)
