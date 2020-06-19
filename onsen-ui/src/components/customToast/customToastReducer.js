import ActionTypes from './ActionTypes';

const initialState = {
  isOpen: false,
  message: '',
  btnText:'Dismiss',
  action: null
}

export function customToastReducer (state = initialState, action) {
  switch (action.type) {
  case ActionTypes.SHOW_TOAST: {
    return Object.assign({},state,{...action.payload})
  }
  case ActionTypes.HIDE_TOAST: {
    return Object.assign({}, state,{isOpen: false,action:null})
  }
  default:
    return state
  }
}
