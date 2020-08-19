import React, {useEffect} from 'react'
import {getProject} from './projectActions'
import {useDispatch, useSelector} from 'react-redux'

const ProjectProperties = () => {

  const dispatch = useDispatch();

  const {save, projectContent, projectMetadata} = useSelector(state => state.project);

  useEffect(() => {
    getProject(dispatch, '34292165-c0a3-4652-b678-70cc85aae540') //hardcoded project from EconoApp
    return () => {
      
    }
  }, [])

  return (
    <div>
      {
        projectMetadata && <h1>{projectMetadata.name}</h1>
      }
    </div>
  )
}

export default ProjectProperties
