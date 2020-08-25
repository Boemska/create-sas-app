import adapterService from '../../adapterService/adapterService'
import {getSelfUri} from '../utils'

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