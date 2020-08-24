import React from 'react';
import adapterService from "../../adapterService/adapterService";
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {getUserData, setRightPanel, setUserData} from '../../pages/home/homeActions'
import {Toggle, Stack, Separator, Pivot, PivotItem} from '@fluentui/react'
import './rightPanelContent.scss'
import ApplicationLogs from '../../pages/applicationLogs/applicationLogs'
import FailedRequests from '../../pages/failedRequests/failedRequests'
import ErrorLogs from '../../pages/errorLogs/errorLogs'
import DebugLogs from '../../pages/debugLogs/debugLogs'


class RightPanelContent extends React.Component {
  constructor(props) {
		super(props);
		this.handleSwitchChange = this.handleSwitchChange.bind(this);
		this.state = {
			debugMode: false
		}
	}

  componentDidMount() {
		let debugMode;
		const debugModeLocalStore = localStorage.getItem('debugMode');
		if (debugModeLocalStore) {
			debugModeLocalStore === 'true' ? debugMode = true : debugMode = false
			this.setState({
				debugMode: debugMode
			}, () => {
				adapterService._debugMode = this.state.debugMode;
			})
		}
	}

	handleSwitchChange() {
		this.setState({
			debugMode: !this.state.debugMode
		}, () => {
			adapterService._debugMode = this.state.debugMode;
			const debugMode = adapterService._debugMode
			localStorage.setItem("debugMode", debugMode);
		})
	}

  render(){
    return(
      <div>
				<Stack>
					<Stack.Item>
					<Toggle
						checked={this.state.debugMode}
						onChange={this.handleSwitchChange}
						label={"Debug mode"}
						inlineLabel
					/>
					</Stack.Item>
					<Separator/>
					<Stack.Item>
        <Pivot className='pivot'>
          <PivotItem headerText="App"
            itemCount={this.props.logs && this.props.logs.applicationLogs.length > 0 ? this.props.logs.applicationLogs.length : 0}
          >
            <ApplicationLogs/>
          </PivotItem>
          {this.state.debugMode ?
            <PivotItem headerText="Debug"
              itemCount={this.props.logs && this.props.logs.debugData.length > 0 ? this.props.logs.debugData.length : 0}
            >
              <DebugLogs/>
            </PivotItem>
            :
            <PivotItem headerText="Failed Requests"
              itemCount={this.props.logs && this.props.logs.failedRequests.length > 0 ? this.props.logs.failedRequests.length : 0}
            >
              <FailedRequests/>
            </PivotItem>
          }
          <PivotItem headerText="Error"
            itemCount={this.props.logs && this.props.logs.sasErrors.length > 0 ? this.props.logs.sasErrors.length : 0}
          >
            <ErrorLogs/>
          </PivotItem>
        </Pivot>
				</Stack.Item>
				</Stack>
      </div>
    )
  }

}

function mapStateToProps(state) {
	return {
		userData: state.home.userData,
		logs: state.adapter.logs,
		rightPanel: state.home.rightPanel
	}

}

function mapDispatchToProps(dispatch) {
	return {
		getUserData: () => getUserData(dispatch),
		setUserData: data => setUserData(dispatch, data),
		setRightPanel: state => setRightPanel(dispatch, state)
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RightPanelContent))
