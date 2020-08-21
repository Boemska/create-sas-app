import React, {useEffect, useState} from 'react'
import {getProject, fetchSingleProject, deleteProject} from './projectActions'
import {useDispatch, useSelector} from 'react-redux'
import './projectProperties.scss'
import {Button, MessageBar, MessageBarType, OverflowSet, IconButton, Link, Dialog, DialogFooter, PrimaryButton, DefaultButton, Modal, Stack, CommandButton, Separator, Persona, PersonaSize} from '@fluentui/react'
import {useParams, useHistory } from 'react-router-dom';
import ActionTypes from './ActionTypes';
import { useBoolean } from '@uifabric/react-hooks';
import QRcode from 'qrcode.react';
import {getUserAvatar} from './projectActions'


const onRenderOverflowButton = overflowItems => {
  const buttonStyles = {
    root: {
      minWidth: 0,
      padding: '0 4px',
      alignSelf: 'center',
     
    },
  };
  return (
    <IconButton
      role="menuitem"
      title="More options"
      styles={buttonStyles}
      menuIconProps={{ iconName: 'More' }}
      menuProps={{ items: overflowItems }}
    />
  );
};

const ConfirmationModal = props => {
  return (
    <Dialog title="Deleting a project can not be reversed, are you sure you want to continue?" hidden={props.hidden}>
      <DialogFooter>
        <PrimaryButton text="Delete" onClick={() => props.confirm()} />
        <DefaultButton text="Cancel" onClick={props.close}/>
      </DialogFooter>
    </Dialog>
  )
}

const ProjectProperties = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const shareURL = window.location.href;
  const [message, setMessage] = useState(false);
  const {uri} = useParams();
  // const uri = '34292165-c0a3-4652-b678-70cc85aae540'; //hardcoded project from EconoAp
  const {save, projectContent, projectMetadata, createdByAvatar: userData} = useSelector(state => state.project);

  const [hideDialog, {toggle: toggleDialog}] = useBoolean(true);
  const [qrDialog, {toggle: toggleQR}] = useBoolean(false);

  useEffect(() => {
    if (uri !== null && uri !== "noProject" && (!projectMetadata || (projectMetadata && projectMetadata.uri.split('/').pop() !== uri))) {
      getProject(dispatch, uri).then(({projectMetadata}) => getUserAvatar(dispatch, projectMetadata.createdBy));
      // getUserAvatar(dispatch, projectMetadata.createdBy)
		}
    return () => {
      
    }
  }, [uri])

  const copy = url => {
    navigator.clipboard.writeText(url);

    setMessage(true);
    setTimeout(() => {
      setMessage(false);
    }, 2000)
  }

  const items = [
    {
      key: 'rename',
      name: 'Rename project',
      onClick: () => props.rename(projectContent.name),
    },
    {
      key: 'delete',
      name: 'Delete project',
      onClick: toggleDialog,
    }
  ]

  
  const projectActions = {
    items: [
      {
        key: 'rename',
        text: 'Rename project',
        iconProps: { iconName: 'Edit' },
        onClick: () => props.rename(projectContent.name)
      },
      {
        key: 'delete',
        text: 'Delete project',
        iconProps: { iconName: 'Delete' },
        onClick: toggleDialog,
      }
    ]
  };

  return (
    projectMetadata && projectContent?
      <div className={'projectProperties align-center'}>

        <Stack horizontal verticalAlign={'center'} className={'projectPropertiesHeader'}>
          <CommandButton text='Show QR code' iconProps={{iconName: "Share"}}  onClick={toggleQR}/>
          <CommandButton text='Copy link' iconProps={{iconName: "Copy"}} onClick={() => copy(shareURL)}/>
          <CommandButton text="" iconProps={{iconName:'CollapseMenu'}} menuProps={projectActions}/>
          {/* <OverflowSet
              aria-label="Basic Menu Example"
              role="menubar"
              overflowItems={items}
              onRenderOverflowButton={onRenderOverflowButton}
            /> */}
             {
              message && <div style={{width: '300px'}}> <MessageBar   messageBarType={MessageBarType.success}>URL copied to clipboard</MessageBar> </div>
            }
        </Stack>
        <Separator />
          
        <div className={'content'}>
          <div className={'fs-42 ms-fontWeight-bold'}>{projectContent.name}</div>
          <div className={'fs-16 mt-15'}> Last modified {projectContent.lastModified}</div>


          <div className={'mt-20 mb-15 fs-20 section ms-fontWeight-bold'}>Created by</div>
          {
            userData && <Persona text={userData.name} 
            secondaryText= {userData ? "Software Engineer" : ""} 
            size={PersonaSize.size56}
            hidePersonaDetails={false}
            imageAlt="User photo"
            imageUrl={userData? userData.userAvatar : null}/>
          }

          <div className={'mt-20 fs-20 section ms-fontWeight-bold'}>Project URI</div>
          <div className={'mt15 fs-16'}>{shareURL}</div>

          <Modal isOpen={qrDialog} onDismiss={toggleQR} className={'qrDialog'}>
              <QRcode value={shareURL} size={window.innerWidth < 500 ? 250 : 500} />
            </Modal>

            <ConfirmationModal hidden={hideDialog} close={toggleDialog}
                confirm={() => deleteProject(dispatch, projectMetadata.uri).then(() => {
              toggleDialog();
              history.push('/');
            })} />
        </div>
      </div> : <div> <h1 style={{color: 'red'}}>{(uri !== null && uri !== 'noProject')? "404. Project with the given URI could not be found." : "No project selected"}</h1></div>
      
 
  )
}

export default ProjectProperties
