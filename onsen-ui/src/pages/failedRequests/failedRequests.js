import React from 'react'
import {connect} from 'react-redux'
import LogHeader from '../../components/logHeader/logHeader'
import {Page} from 'react-onsenui'
import CustomToolbar from "../../components/customToolbar/customToolbar";

class FailedRequests extends React.Component {

	constructor(props) {
		super(props);
		this.name = 'failedRequest'
	}

	render() {
		const failedRequests = this.props.logs.failedRequests
		return (
			<Page renderToolbar={()=><CustomToolbar title={'Failed requests'}/>}>
				{failedRequests && failedRequests.length > 0
					? failedRequests.map((log, index) =>
						<div className={'item'} key={index}>
							<LogHeader log={log}/>
							<br/>
							<pre>{log.message}</pre>
						</div>) : <h4 className={'text-center text-danger'}>Failed Requests list is empty!</h4>
				}
			</Page>
		)
	}
}

function mapStateToProps(state) {
	return {
		logs: state.adapter.logs
	}
}

export default connect(mapStateToProps, null)(FailedRequests)
