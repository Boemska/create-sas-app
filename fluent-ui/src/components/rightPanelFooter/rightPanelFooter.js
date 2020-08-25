import React from 'react'
import adapterService from "../../adapterService/adapterService"
import {connect} from 'react-redux'
import {setUserData,getUserData} from '../../pages/home/homeActions'
import {Stack, CommandBarButton, Persona, PersonaSize, PersonaPresence, Dialog, DialogFooter,DialogType, PrimaryButton, DefaultButton} from '@fluentui/react';
import {clearRequests} from '../../adapterService/adapterActions'
import moment from 'moment'

class RightPanelFooter extends React.Component{
  constructor(props){
    super(props)
    this.state={
      isHidden : true,
      requests: [],
      loading: false
    }
  }

  logout=()=>{
    this.setState({isHidden:true})
		adapterService.logout()
			.then(() => {
				// This will trigger getting user's data and
				// creating of fresh csrf token for login form
				// which will pop up automatically
			this.props.setUserData(null)
			this.props.getUserData()
			})
			.catch(e => {
        //TO DO
				//toastr.error('Something went wrong!')
			})
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.props.requests !== nextProps.requests) {
		 this.getRequestsList(nextProps)
		}
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
    this.props.getUserData();
  }
  
  componentWillUnmount() {
		clearInterval(this.requestsWatcherInterval);
	}

  getRequestsList (props) {
    const requests = Array.from(props.requests.values()).reverse()

    let loading = false;
    for (let file of requests) {
      if (file.running) {
        loading = true;
        break;
      }
    }

    this.loading = loading;
    this.setState({
      loading,
      requests
    })
  }

  getPresentanceStage=()=>{
		if (this.props.offline) return PersonaPresence.offline
		if (this.state.loading) return PersonaPresence.away
    if (!this.state.loading && this.state.requests.length > 0 &&  !this.state.requests[0].successful) return PersonaPresence.dnd
    if (!this.state.loading && this.state.requests.length > 0 &&  this.state.requests[0].successful)  return PersonaPresence.online
	}

  render(){
  const {userData} = this.props;
  return(
    <Stack gap={10}>
      <Stack.Item>
        <Persona
          text= {userData? userData.name : null}
          secondaryText= {userData ? "Software Engineer" : ""}
          size={PersonaSize.size56}
          hidePersonaDetails={false}
          presence={this.getPresentanceStage()}
          imageAlt="User photo"
          imageUrl={userData? userData.userAvatar : null}
        />
      </Stack.Item>
      <Stack.Item>
        <Stack horizontal>
          <CommandBarButton
          onClick={()=>this.props.clearRequests()}
          iconProps={ { iconName: 'Cancel' }}
          text="Clear history"
          />
          <CommandBarButton
          onClick={()=>this.setState({isHidden:false})}
          iconProps={ { iconName: 'Contact' }}
          text="Log out"
          />
        </Stack>
      </Stack.Item>
      <Dialog
        hidden={this.state.isHidden}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Log out?',
          subText: 'Are you sure you want to log out of the application?'}}
      >
        <DialogFooter>
          <PrimaryButton  text="I'm sure" onClick={this.logout}/>
          <DefaultButton  text="No, take me back" onClick={()=>this.setState({isHidden:true})}/>
        </DialogFooter>
      </Dialog>
  </Stack>
  )
  }
}

function mapStateToProps(state) {
	return {
    requests: state.adapter.requests,
    userData: state.home.userData,
		offline: state.header.offline,
  }
}

function mapDispatchToProps(dispatch) {
	return {
		clearRequests: () => clearRequests(dispatch),
    setUserData: (payload) => setUserData(dispatch,payload),
    getUserData: () => getUserData(dispatch)
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(RightPanelFooter)
