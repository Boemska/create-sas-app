import React from 'react'
import { IconButton } from '@fluentui/react'
import './headerButton.scss'

export const HeaderButton=(props)=>{

  const {background,color,value} = props;

  //to compute width of badge(for more digits we need bigger width)
  const numberOfDigits = value.toString().length
  return (
    <div>
      <IconButton
				onClick={props.onClick}
        style={{width:`${49+numberOfDigits}px`}}
        className={'header-btn'}
        iconProps={{iconName:'List'}} title="Emoji" ariaLabel="Emoji">
          <div style={{backgroundColor: background, width:`${18+numberOfDigits}px`}} className={'badge'}>
            <span style={{color: color}}className={'value'}>
              {props.value}
            </span>
          </div>
      </IconButton>
    </div>
  )
}
