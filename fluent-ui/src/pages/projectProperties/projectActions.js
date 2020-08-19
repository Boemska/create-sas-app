import ActionTypes from './ActionTypes'
import adapterService from '../../adapterService/adapterService'

const filesPrefix = '/files/files/'

export async function getProject(dispatch, uri) {

  try{
    const {projectContent, projectMetadata}=  await adapterService.getProject(dispatch, uri);
    if (projectMetadata === null) {
      //TODO: Handle this error on front
      throw new Error("Project could not be found");
    }

    selectProject(dispatch, projectMetadata);
    dispatch({
      type: ActionTypes.FETCH_SINGLE_PROJECT,
      payload: projectContent
    })
    return Promise.resolve({projectContent, projectMetadata})
  }
  catch(e) {
    console.log("FETCH PROJECT ERROR", e)
    throw new Error(e.message)
  }
}

export function selectProject(dispatch, payload) {
	dispatch({
		type: ActionTypes.SELECT_PROJECT,
		payload
	})
}