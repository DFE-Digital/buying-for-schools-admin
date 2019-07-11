export const DIALOG_SHOW = 'DIALOG_SHOW'
export const DIALOG_HIDE = 'DIALOG_HIDE'


export const hideDialog = () => {
  return {
    type: DIALOG_HIDE,
    data: {}
  }  
}