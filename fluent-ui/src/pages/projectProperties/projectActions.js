import ActionTypes from './ActionTypes'
import adapterService from '../../adapterService/adapterService'
import {PROJECT_EXTENTION} from '../../services/constants';

const filesPrefix = '/files/files/'

function getProjectBlob(projectContent) {
  const forBlob = JSON.stringify(projectContent);
  let blob = new Blob([forBlob], {type: "octet/stream"});
  let fileName = projectContent.name
  if (!fileName.endsWith(PROJECT_EXTENTION)) {
    fileName += PROJECT_EXTENTION
  }
  const dataObj = {
    file: [blob, fileName]
  }
  return dataObj
}

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
    //throw new Error(e.message)
  }
}

export async function fetchSingleProject(dispatch, uri) {

  if (!uri.includes(filesPrefix)) uri = filesPrefix + uri;

  try{
    let res = await adapterService.getFileContent(dispatch, uri);
		res.body.lastModified = res.headers['last-modified'] || res.headers.get('Last-Modified');
		dispatch({
			type: ActionTypes.FETCH_SINGLE_PROJECT,
			payload: res.body
		})
  } catch (e) {
    console.log("SINGLE PROJECT ERROR: ", e);
    if (e.status === 404) {
      selectProject(dispatch, null);
    }
	}

}

export async function renameProject(dispatch, newName, projectContent, uri) {


  try{ 
    let newProject = Object.assign({}, projectContent, {name: newName});
    const blob = getProjectBlob(newProject);

    const res = await adapterService.updateFile(dispatch, uri, blob, newProject.lastModified);

    console.log("RES", res);

    newProject.lastModified = res.headers['last-modified'] || res.headers.get('Last-Modified');
    res.body.uri = uri;
    updateProject(dispatch, newProject);
    selectProject(dispatch, res.body);

    return Promise.resolve();
  }
  catch(e) {
    console.log("RENAME PROJECT ERROR", e)

    if (e.status === 412) {
      return Promise.reject("The file has been updated since you last retrieved it");
    }

    //TODO: Add more custom error handlers if needed

    return Promise.reject(e.message);
  }

}

export async function getUserAvatar(dispatch, username) {
  const url = `/identities/users/${username}`
  try{
    const res = await adapterService.managedRequest(dispatch, 'get', url, {});

    res.body.userAvatar = url + '/avatar/content';

    console.log("res", res);

    setCreatorAvatar(dispatch, res.body)
  }
  catch(e) {
    console.log("USER AVATAR ERROR", e)
  }
}

export async function deleteProject(dispatch, uri) {
  try{
    await adapterService.deleteItem(dispatch, uri);

    dispatch({
      type: ActionTypes.DELETE_PROJECT
    })
    return Promise.resolve();
  }
  catch(e) {
    console.log("DELETE PROJECT ERROR", e);

    return Promise.reject(e.message);
  }
}

export function selectProject(dispatch, payload) {
	dispatch({
		type: ActionTypes.SELECT_PROJECT,
		payload
	})
}

export function updateProject(dispatch, payload){
  dispatch({
    type: ActionTypes.UPDATE_PROJECT,
    payload
  })
}

export function setCreatorAvatar(dispatch, payload) {
  dispatch({
    type: ActionTypes.GET_CREATOR_AVATAR,
    payload
  })
}
