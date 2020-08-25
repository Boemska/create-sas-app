import adapterService from '../../adapterService/adapterService'
import {getSelfUri} from '../utils'

export async function getFolderDetails(dispatch, fileName, options) {
	let callData = await adapterService.getFolderDetails(dispatch, fileName, options)
	return callData
}

export async function createNewFolder(dispatch, metadataRoot, folderName, _options = {}) {

  if (folderName === ''){
      return Promise.reject("Please enter a name for the folder");
  }

  try{
    await adapterService.getFolderDetails(dispatch, metadataRoot, null)
      .then(async(res)=>{
        const parentUri = getSelfUri(res.body.links)
        const response = await adapterService.createNewFolder(dispatch, parentUri, folderName, {});
        //console.log(response);
        return Promise.resolve()
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
}