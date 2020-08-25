import React, { Component } from 'react'
import {TextField, Dialog, PrimaryButton, DefaultButton, DialogFooter} from '@fluentui/react'
import {connect} from 'react-redux';
import { createNewFolder } from './newFolderActions';
import {withRouter} from 'react-router-dom'

class NewFolder extends Component {

  constructor(props){
    super(props);

    this.state ={
      name: '',
      error: '',
    }
  }

  submit = () => {
    const res =this.props.createNewFolder(this.props.metadataRoot, this.state.name, {})
    res.then(() => {
      console.log("Successfully created new folder!")
      this.close();
    }).catch((er)=>{
      this.setState({error : er})
    })
	}

  close = () => {
    this.setState({name: '', error: ''});
    this.props.close();
  }
  
  render() {
    return (
      <Dialog 
        title={'Create New Folder'}
        isOpen={this.props.isOpen}
        subText={this.props.metadataRoot==="/" ? "You can not create new folder in root folder! " : `Path: ${this.props.metadataRoot}`}
      >
        <TextField  value={this.state.name} onChange={e => this.setState({name: e.target.value, error:""})} errorMessage={this.state.error} label={"Folder name"}/>
       
        <DialogFooter>
          <PrimaryButton text="Create new folder" onClick={this.submit} disabled={this.props.metadataRoot==="/" ? true:false}/>
          <DefaultButton text="Close" onClick={this.close}/>
        </DialogFooter>
      </Dialog>
    )
  } 
}

function mapDispatchToProps(dispatch) {
	return {
    createNewFolder: (parentUri, folderName, options) => createNewFolder(dispatch, parentUri, folderName, options)
	}
}

export default withRouter(connect(null, mapDispatchToProps)(NewFolder))
