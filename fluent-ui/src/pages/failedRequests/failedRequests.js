import React from 'react'
import {connect} from 'react-redux'
import LogHeader from '../../components/logHeader/logHeader'
class FailedRequests extends React.Component {

	render() {
		const failedRequests = this.props.logs.failedRequests
		return(
			<div>
				<h2 className={'text-center'}> Failed Requests</h2>
				{ failedRequests && failedRequests.length >0
					? failedRequests.map((log, index) =>
						<div className={'item'} key={index}>
							<LogHeader log={log}/>
							<br/>
							<pre>{log.message}</pre>
						</div>):<h4 className={'text-center text-danger'}>Failed Requests list is empty!</h4>
				}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		logs: state.adapter.logs
	}
}

export default connect(mapStateToProps)(FailedRequests)
