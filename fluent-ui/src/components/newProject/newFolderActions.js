import adapterService from '../../adapterService/adapterService'
import {getSelfUri} from '../utils'
import {setCurrentFolder} from '../../pages/projectList/projectListActions';

export async function createNewFolder(dispatch, metadataRoot, folderName, _options = {}) {

  if (folderName === ''){
      return Promise.reject("Please enter a name for the folder");
  }
  let response;
  try{
    await adapterService.getFolderDetails(dispatch, metadataRoot, null)
      .then(async(res)=>{
        const parentUri = getSelfUri(res.body.links)
        response = await adapterService.createNewFolder(dispatch, parentUri, folderName, {});
        //console.log(response);
      })
      .catch((error)=>{
        if(error.status === 409)
        return Promise.reject("A folder with this name already exists.")
        else 
        return Promise.reject(error.message)
      })
    }catch(error){
      return Promise.reject(error.message);
    }
    return Promise.resolve(response.body)
}

export async function renameFolder(dispatch, uri, newName, lastModified){

  try {
    const res = await adapterService.updateFolderMetadata(dispatch, uri, {name: newName}, lastModified, true);

    console.log("RES", res);

    res.body.lastModified = res.headers['last-modified'] || res.headers.get('Last-Modified');

    setCurrentFolder(dispatch, res.body);

    return Promise.resolve();
  }
  catch(e){
    console.log("RENAME FOLDER ERROR", e);

    if (e.status === 412) {
      return Promise.reject("The folder has been updated since you last retrieved it");
    }

    if (e.status === 409) {
      return Promise.reject("A folder with this name already exists");
    }

    //TODO: Add more custom error handlers if needed

    return Promise.reject(e.message);
  }
}