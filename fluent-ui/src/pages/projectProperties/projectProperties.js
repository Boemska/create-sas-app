import React, {useEffect, useState} from 'react'
import {getProject} from './projectActions'
import {useDispatch, useSelector} from 'react-redux'
import './projectProperties.scss'
import {Button, MessageBar, MessageBarType, OverflowSet, IconButton, Link} from '@fluentui/react'


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



const ProjectProperties = () => {

  const dispatch = useDispatch();
  const shareURL = window.location.href;
  const [message, setMessage] = useState(false);

  const {save, projectContent, projectMetadata} = useSelector(state => state.project);

  useEffect(() => {
    getProject(dispatch, '34292165-c0a3-4652-b678-70cc85aae540') //hardcoded project from EconoApp
    return () => {
      
    }
  }, [])

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
      onClick: noOp,
    },
    {
      key: 'delete',
      name: 'Delete project',
      onClick: noOp,
    },
  ]

  return (
    projectMetadata?
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
       
      </div> : <h1 style={{color: 'red'}}>No project selected</h1>
      
 
  )
}

export default ProjectProperties
