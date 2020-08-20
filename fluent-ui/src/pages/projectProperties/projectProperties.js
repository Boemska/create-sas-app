import React, {useEffect, useState} from 'react'
import {getProject, fetchSingleProject, deleteProject} from './projectActions'
import {useDispatch, useSelector} from 'react-redux'
import './projectProperties.scss'
import {Button, MessageBar, MessageBarType, OverflowSet, IconButton, Link, Dialog, DialogFooter, PrimaryButton, DefaultButton} from '@fluentui/react'
import {useParams, useHistory } from 'react-router-dom';
import ActionTypes from './ActionTypes';
import { useBoolean } from '@uifabric/react-hooks';

const noOp = () => undefined;

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
  const uri = 'bb18a9de-0b90-4d69-85a2-dd9385e0180c'; //hardcoded project from EconoAp
  const {save, projectContent, projectMetadata} = useSelector(state => state.project);

  const [hideDialog, {toggle: toggleDialog}] = useBoolean(true);

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
          
        <div className={'projectDetails'}>

        <div className={'flex flex-row'}>
          <OverflowSet
              aria-label="Basic Menu Example"
              role="menubar"
              overflowItems={items}
              onRenderOverflowButton={onRenderOverflowButton}
            />
            <h1 className={'ml-15'}>{projectMetadata.name}</h1>
          </div>
          <h2>Project properties</h2>

          {projectMetadata.parentFolderUri && <div> <h3>Parent folder</h3> <p>{projectMetadata.parentFolderUri}</p> </div>}

          <h3>Created by</h3>
        <p>{projectMetadata.createdBy}</p>

          <h3>Project file URI</h3>
          <p>{projectMetadata.uri}</p>

          {
            projectContent && <div> 
              <h3>Last modified</h3>
            <p>{projectContent.lastModified}</p>
            </div>
          }
        </div>

        <div className={'shareProject'}>

          <h2>Share project</h2>

          <p>Project URL</p>
          <p>{shareURL}</p>

          <Button onClick={() => copy(shareURL)}>Copy URL</Button>
        </div>

        {
          message && <MessageBar messageBarType={MessageBarType.success}>URL copied to clipboard</MessageBar>
        }
       <ConfirmationModal hidden={hideDialog} close={toggleDialog}
          confirm={() => deleteProject(dispatch, projectMetadata.uri).then(() => {
         toggleDialog();
         history.push('/');
       })} />
      </div> : <div> <h1 style={{color: 'red'}}>{(uri !== null && uri !== 'noProject')? "404. Project with the given URI could not be found." : "No project selected"}</h1></div>
      
 
  )
}

export default ProjectProperties
