import React from 'react'
import adapterService from "../../adapterService/adapterService"
import {connect} from 'react-redux'
import {setUserData,getUserData} from '../../pages/home/homeActions'
import {Stack, CommandBarButton, Persona, PersonaSize, PersonaPresence} from '@fluentui/react';
import {clearRequests} from '../../adapterService/adapterActions'

class RightPanelFooter extends React.Component{


  logout=()=>{
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

  render(){
  const {userData} = this.props;
  return(
    <Stack gap={10}>
      <Stack.Item>
        <Persona
          text= {userData? userData.name : "Unknown person"}
          secondaryText= {userData ? "Software Engineer" : ""}
          size={PersonaSize.size56}
          hidePersonaDetails={false}
          presence={userData ? PersonaPresence.online : PersonaPresence.away}
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
          onClick={()=>this.logout()}
          iconProps={ { iconName: 'Contact' }}
          text="Log out"
          />
        </Stack>
      </Stack.Item>
  </Stack>
  )
  }
}

function mapStateToProps(state) {
	return {
    userData: state.home.userData,
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
