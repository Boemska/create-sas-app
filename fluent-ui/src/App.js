import React, {useEffect, useState} from 'react';
import 'react-toggle/style.css'
import 'toastr/toastr.scss'
import './App.scss';
import {Switch, Route} from 'react-router-dom';
import Home from './pages/home/home'
import Header from './components/header/header'
import Page500 from './pages/Page500/Page500'
import Page404 from './pages/Page404/Page404'
import Portal from './components/portal/portal'
import LoginModal from './components/loginModal/loginModal'
import ApplicationLogs from './pages/applicationLogs/applicationLogs'
import FailedRequests from './pages/failedRequests/failedRequests'
import ErrorLogs from './pages/errorLogs/errorLogs'
import DebugLogs from './pages/debugLogs/debugLogs'
import {Panel, Nav} from '@fluentui/react'
import {useDispatch, useSelector, connect} from 'react-redux';
import ActionTypes from './pages/home/ActionTypes'
import RightPanelFooter from './components/rightPanelFooter/rightPanelFooter'
import RightPanelContent from './components/rightPanelContent/rightPanelContent'
import ProjectList from './pages/projectList/projectList'
import {
	createTheme,
	Customizations,
  Fabric,
  PersonaPresence
} from '@fluentui/react';
import appSettings from './appSettings'
import ProjectProperties from './pages/projectProperties/projectProperties';



const myTheme = createTheme({
	palette: {
		themePrimary: '#04304B',
		themeLighterAlt: '#eff6fc',
		themeLighter: '#deecf9',
		themeLight: '#c7e0f4',
		themeTertiary: '#71afe5',
		themeSecondary: '#2b88d8',
		themeDarkAlt: '#106ebe',
		themeDark: '#005a9e',
		themeDarker: '#004578',
		neutralLighterAlt: '#faf9f8',
		neutralLighter: '#f3f2f1',
		neutralLight: '#edebe9',
		neutralQuaternaryAlt: '#e1dfdd',
		neutralQuaternary: '#d0d0d0',
		neutralTertiaryAlt: '#c8c6c4',
		neutralTertiary: '#a19f9d',
		neutralSecondary: '#605e5c',
		neutralPrimaryAlt: '#3b3a39',
		neutralPrimary: '#323130',
		neutralDark: '#201f1e',
		black: '#000000',
		white: '#ffffff',
	}
});
Customizations.applySettings({theme: myTheme});

class App extends React.Component {

  constructor(props) {
		super(props)
		this.state = {
			avatarPresence: null,
			headerState: {
				requests: [],
				loading: false
			}
		}
  }
  
  onResize = () => {
		this.props.setWindowWidth(window.innerWidth)
	}

	componentDidMount() {
		this.onResize()
		window.addEventListener('resize', this.onResize)
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize)
  }

  getPresentanceStage = () => {
		if (this.props.offline) {
			// this.props.changeAvatarPresence(PersonaPresence.offline)
			return PersonaPresence.offline
			}
		if (this.state.headerState.loading){
			// this.props.changeAvatarPresence(PersonaPresence.away)
			return PersonaPresence.away
		}
    if (!this.state.headerState.loading && this.state.headerState.requests.length > 0 &&  !this.state.headerState.requests[0].successful){
			// this.props.changeAvatarPresence(PersonaPresence.dnd)
			return PersonaPresence.dnd
		}
    if (!this.state.headerState.loading && this.state.headerState.requests.length > 0 &&  this.state.headerState.requests[0].successful){
			// this.props.changeAvatarPresence(PersonaPresence.online)
			return PersonaPresence.online
		}
	}


  render() {
    const projectMetadata = this.props.project.projectMetadata
		const projectUri = projectMetadata ? projectMetadata.uri.split('/').pop() : 'noProject';
		let links = [
			{name: 'SAS Folders', url: '#/projectList', key: 'projectList', icon: 'FolderHorizontal'},
			{name: 'Project properties', url: `#/project/${projectUri}`, key: 'project', icon: 'AllApps'},
			{name: 'Home', url: '#/', key: 'home', icon: 'home'},
		]
		const navLinkGroups = [{links}];

		const presence = this.getPresentanceStage()
		// const presence = PersonaPresence.offline
    return (
      <Fabric applyThemeToBody>
        <div className="App">
          <Header changeAvatarPresence={(presence) => this.setState({avatarPresence: presence})} setHeaderState={state => this.setState({headerState: state})}/>
          <div className={'flex'}>
            <Nav
              className={`nav ${this.props.leftPanel || this.props.width > appSettings.leftNavBrakPoint ? 'open' : ''}`}
              onLinkClick={e =>  console.log('click', e)}
              selectedKey="key1"
              ariaLabel="Nav basic example"
              groups={navLinkGroups}
            />
            <Panel
              layerProps={{ styles: { root: { zIndex: 999998 }}}}
              className={'rightPanel'}
              isOpen={this.props.rightPanel}
              //isLightDismiss
              // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
              //closeButtonAriaLabel="Close"
              //onDismiss={() => setRightPanel(dispatch, false)}
              hasCloseButton={false}
              onRenderFooterContent={()=>{return <RightPanelFooter avatarPresence={presence} />}}
              isFooterAtBottom={true}
            >
              <RightPanelContent/>
            </Panel>
            <div className={'main'}>
              <div className={'mainContainer'}>
                <Switch>
                  <Route exact path='/' component={Home}/>
                  <Route exact path='/project/:uri' component={ProjectProperties} />
                  <Route exact path='/error' component={Page500}/>
                  <Route exact path='/applicationLogs' component={ApplicationLogs}/>
                  <Route exact path='/errorLogs' component={ErrorLogs}/>
                  <Route exact path='/failedRequests' component={FailedRequests}/>
                  <Route exact path='/debugLogs' component={DebugLogs}/>
                  <Route exact path='/projectList' component={ProjectList}/>
                  <Route component={Page404}/>
                </Switch>
              </div>
            </div>
          </div>
          <Portal>
            <LoginModal/>
            
          </Portal>
        </div>
      </Fabric>
  
    )
  }

}

function mapStateToProps(state) {
	return {
		project: state.project,
		width: state.home.width,
		rightPanel: state.home.rightPanel,
		leftPanel: state.home.leftPanel,
		offline: state.header.offline
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setWindowWidth: width => setWindowWidth(dispatch, width)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);




function setWindowWidth(dispatch, width) {
	dispatch({
		type: ActionTypes.SET_WINDOW_WIDTH,
		width
	})
}
