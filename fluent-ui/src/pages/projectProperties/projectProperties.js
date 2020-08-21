import React, {useEffect, useState} from 'react'
import {getProject, fetchSingleProject, deleteProject} from './projectActions'
import {useDispatch, useSelector} from 'react-redux'
import './projectProperties.scss'
import {Button, MessageBar, MessageBarType, OverflowSet, IconButton, Link, Dialog, DialogFooter, PrimaryButton, DefaultButton, Modal} from '@fluentui/react'
import {useParams, useHistory } from 'react-router-dom';
import ActionTypes from './ActionTypes';
import { useBoolean } from '@uifabric/react-hooks';
import QRcode from 'qrcode.react';


const onRenderOverflowButton = overflowItems => {
  const buttonStyles = {
    root: {
      minWidth: 0,
      padding: '0 4px',
      alignSelf: 'center',
      height: '50px',
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
  // const {uri} = useParams();
  const uri = '34292165-c0a3-4652-b678-70cc85aae540'; //hardcoded project from EconoAp
  const {save, projectContent, projectMetadata} = useSelector(state => state.project);

  const [hideDialog, {toggle: toggleDialog}] = useBoolean(true);
  const [qrDialog, {toggle: toggleQR}] = useBoolean(false);

  useEffect(() => {

    if (uri !== null && uri !== "noProject" && (!projectMetadata || (projectMetadata && projectMetadata.uri.split('/').pop() !== uri))) {
      
      getProject(dispatch, uri);
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
    },
  ]

  return (
    projectMetadata && projectContent?
      <div className={'projectProperties'}>
          
        <div className={'projectDetails ms-depth-16 p-2r'}>

        <div className={'flex flex-row mb-15 '}>
          <OverflowSet
              aria-label="Basic Menu Example"
              role="menubar"
              overflowItems={items}
              onRenderOverflowButton={onRenderOverflowButton}
            />
            <div className={'ml-15 fs-42'}>{projectMetadata.name}</div>
          </div>
          <div className={'fs-32 mb-15'}>Project properties:</div>

          {projectMetadata.parentFolderUri && <div> <div className={'fs-24 mb-10'}>Parent folder</div> <div className={'fs-16 mb-15'}>{projectMetadata.parentFolderUri}</div> </div>}
        
      
          <div className={'fs-24 mb-10'}>Created by</div>
        <div className={'fs-16 mb-15'}>{projectMetadata.createdBy}</div>

          <div className={'fs-24 mb-10'}>Project file URI</div>
          <div className={'fs-16 mb-15'}>{projectMetadata.uri}</div>

          {
            projectContent && <div> 
              <div className={'fs-24 mb-10'}>Last modified</div>
            <div className={'fs-16 mb-15'}>{projectContent.lastModified}</div>
            </div>
          }
        </div>

        <div className={'shareProject mt-20 p-2r ms-depth-16 flex flex-row'}>

          <div >
            <div className={'fs-24 mb-15'}>Share project</div>

            <div className={'fs-16 mb-10'}>Project URL</div>
            <div className={'fs-16 mb-15'}>{shareURL}</div>

            <Button onClick={() => copy(shareURL)}>Copy URL</Button>
            {
              message && <div style={{width: '300px'}}> <MessageBar className={'mt-15'}  messageBarType={MessageBarType.success}>URL copied to clipboard</MessageBar> </div>
            }
          </div> 
          <QRcode size={220} className={'qr'} value={shareURL} onClick={toggleQR}/>
          <Modal isOpen={qrDialog} onDismiss={toggleQR} className={'qrDialog'}>
            <QRcode value={shareURL} size={window.innerWidth < 500 ? 250 : 500} />
          </Modal>
         
        </div>

        
       <ConfirmationModal hidden={hideDialog} close={toggleDialog}
          confirm={() => deleteProject(dispatch, projectMetadata.uri).then(() => {
         toggleDialog();
         history.push('/');
       })} />
      </div> : <div> <h1 style={{color: 'red'}}>{(uri !== null && uri !== 'noProject')? "404. Project with the given URI could not be found." : "No project selected"}</h1></div>
      
 
  )
}

export default ProjectProperties
