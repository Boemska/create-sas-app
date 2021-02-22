import {BackButton, Toolbar} from "react-onsenui";
import React from "react";

const CustomToolbar = (props) =>{
  return (
      <Toolbar>
        <div className='left'><BackButton>Back</BackButton></div>
        <div className='center'>{props.title}</div>
      </Toolbar>
    );
}

export default CustomToolbar;
