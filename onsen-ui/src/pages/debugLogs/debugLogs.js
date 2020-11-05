import React from 'react'
import BoCollapsible from '../../components/colapsable/boCollapsible'
import {connect} from 'react-redux'
import {Page} from 'react-onsenui'
import LogHeader from '../../components/logHeader/logHeader'
import CustomToolbar from "../../components/customToolbar/customToolbar";

class DebugLogs extends React.Component {

	constructor(props) {
		super(props);
		this.name = 'debugLogs'
	}

	render() {
		const debugData = this.props.logs.debugData
		return (
			<Page renderToolbar={()=><CustomToolbar title={'Debug Logs'}/>}>
				{debugData && debugData.length > 0 ?
					debugData.map((log, index) => <BoCollapsible
						title={<LogHeader log={log}/>}
						content={() => <div dangerouslySetInnerHTML={{__html: log.debugHtml}}>
						</div>}
						key={index}
					/>)
					: <h4 className={'text-center text-danger'}> Debug List is empty!</h4>}
			</Page>
		)
	}
}

function mapStateToProps(state) {
	return {
		logs: state.adapter.logs
	}
}

export default connect(mapStateToProps, null)(DebugLogs)
