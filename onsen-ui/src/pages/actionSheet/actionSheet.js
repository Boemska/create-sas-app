import React from 'react'
import {Page, ActionSheetButton, ActionSheet, Button, ListTitle} from 'react-onsenui';
import './myActionSheet.scss'
import CustomToolbar from "../../components/customToolbar/customToolbar";

class MyActionSheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
    this.name = 'actionSheet' //this name is mandatory for navigator to work
  }

  handleClick = () => {
    this.setState({isOpen: true});
  }

  handleCancel = () => {
    this.setState({isOpen: false});
  }

  render() {
    return (
      <Page renderToolbar={() => <CustomToolbar title={'Action Sheet'}/>}>
        <ListTitle>
          docs: <a href='https://onsen.io/v2/api/react/ActionSheet.html'>list-docs-onsen</a>
          <p>
            <Button onClick={this.handleClick.bind(this)}>Show dialog</Button>
          </p>
        </ListTitle>
        <ActionSheet isOpen={this.state.isOpen} animation='default'
                     onCancel={this.handleCancel.bind(this)}
                     isCancelable={true}
                     title={'This is description'}
        >
          <ActionSheetButton onClick={this.handleCancel.bind(this)}>Label1</ActionSheetButton>
          <ActionSheetButton onClick={this.handleCancel.bind(this)}>Label2</ActionSheetButton>
          <ActionSheetButton onClick={this.handleCancel.bind(this)} modifier={'destructive'}>Label3</ActionSheetButton>
          <ActionSheetButton onClick={this.handleCancel.bind(this)} icon={'md-close'}>Cancel</ActionSheetButton>
        </ActionSheet>
      </Page>
    )
  }
}

export default MyActionSheet;
