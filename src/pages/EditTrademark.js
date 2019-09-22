import React, { useState, useContext } from 'react'
import { editTrademark, showMessage } from '../data/Actions'
import {Page, Navbar, List, ListInput, Fab, Icon, Toolbar, ListItem, Toggle} from 'framework7-react';
import { StoreContext } from '../data/Store';
import BottomToolbar from './BottomToolbar';


const EditTrademark = props => {
  const { state } = useContext(StoreContext)
  const trademark = state.trademarks.find(rec => rec.id === props.id)
  const [name, setName] = useState(trademark.name)
  const [isActive, setIsActive] = useState(trademark.isActive || false)
  const handleEdit = () => {
    editTrademark({
      id: trademark.id,
      name,
      isActive
    }).then(() => {
      showMessage(props, 'success', state.labels.editSuccess)
      props.f7router.back()
    })
  }
  return (
    <Page>
      <Navbar title={state.labels.editTrademark} backLink='Back' />
      <List form>
        <ListInput 
          name="name" 
          label={state.labels.name}
          value={name}
          floatingLabel 
          type="text" 
          onChange={(e) => setName(e.target.value)}
        />
        <ListItem>
          <span>{state.labels.isActive}</span>
          <Toggle name="isActive" color="green" checked={isActive} onToggleChange={() => setIsActive(!isActive)}/>
        </ListItem>

      </List>
      {!name || (name === trademark.name && isActive === trademark.isActive)
      ? ''
      : <Fab position="left-bottom" slot="fixed" color="green" onClick={() => handleEdit()}>
          <Icon ios="f7:check" aurora="f7:check" md="material:done"></Icon>
        </Fab>
      }
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>

    </Page>
  )
}
export default React.memo(EditTrademark)