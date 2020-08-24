import React, { Component} from 'react'
import { TextField, Dialog, PrimaryButton, DefaultButton, DialogFooter} from '@fluentui/react'
import {connect} from 'react-redux';
import {renameProject} from './projectActions';

class RenameProject extends Component {

  constructor(props){
    super(props);

    this.state ={
      oldPropsName: this.props.value,
      name: this.props.value,
      error: '',
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.oldPropsName) {
      return {name: nextProps.value, oldPropsName: nextProps.value}
    }
  }

  close = () => {
    this.setState({name: '', error: ''});
    this.props.close();
  }

  rename = () => {
    //No need to send request of name stayed the same
    this.setState({error: ''})
    if (this.state.name === '') {
      this.setState({error: "Please enter a name for the project"});
      return;
    }
    if (this.state.name !== this.state.oldPropsName) {
      this.props.rename(this.state.name, this.props.projectContent, this.props.projectMetadata.uri)
                .then(() => this.close())
                .catch(e => this.setState({error: e}))
    }
  }
  
  render() {
    return (
      <Dialog 
        title={'Rename project'}
        isOpen={this.props.isOpen}
      >
        <TextField  value={this.state.name} onChange={e => this.setState({name: e.target.value})} errorMessage={this.state.error}/>
  
        <DialogFooter>
          <PrimaryButton text="Rename" onClick={this.rename} />
          <DefaultButton text="Close" onClick={this.close}/>
        </DialogFooter>
      </Dialog>
    )
  }
 
}

function mapStateToProps(store) {
	return {
    projectContent: store.project.projectContent,
    projectMetadata: store.project.projectMetadata
	}
}

function mapDispatchToProps(dispatch) {
	return {
    rename: (newName, projectContent, uri) => renameProject(dispatch, newName, projectContent, uri)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RenameProject)
