import React, { useState, useContext } from 'react'
import {Page, Navbar, List, ListInput, Fab, Icon, Toolbar, ListItem, Toggle} from 'framework7-react';
import { StoreContext } from '../data/Store';
import BottomToolbar from './BottomToolbar';
import { approveUser, showMessage } from '../data/Actions'


const ApproveUser = props => {
  const { state } = useContext(StoreContext)
  const userInfo = state.users.find(rec => rec.id === props.id)
  const [name, setName] = useState(userInfo.name)
  const [address, setAddress] = useState(userInfo.address || '')
  const [storeId, setStoreId] = useState('')
  let stores = state.stores.filter(rec => rec.id !== 's' && rec.isActive === true)
  stores.sort((store1, store2) => store1.name > store2.name ? 1 : -1)
  const storesOptionsTags = stores.map(store => 
    <option 
      key={store.id} 
      value={store.id}
    >
      {store.name}
    </option>
  )
  const handleSubmit = () => {
    approveUser({
      id: props.id,
      name,
      storeId,
      address,
    }).then(() => {
      showMessage(props, 'success', state.labels.approveSuccess)
      props.f7router.back()  
    })
  }
  return (
    <Page>
      <Navbar title={state.labels.approveUser} backLink='Back' />
      <List form>
        <ListInput 
          name="name" 
          label={state.labels.name}
          floatingLabel 
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <ListInput 
          name="mobile" 
          label={state.labels.mobile}
          floatingLabel 
          type="number"
          value={userInfo.mobile}
          readonly
        />
        <ListInput 
          name="storeName" 
          label={state.labels.storeName}
          floatingLabel 
          type="text"
          value={userInfo.storeName || ''}
          readonly
        />
        <ListItem
          title={state.labels.store}
          smartSelect
          smartSelectParams={{
            openIn: 'popup', 
            closeOnSelect: true, 
            searchbar: true, 
            searchbarPlaceholder: state.labels.search,
            popupCloseLinkText: state.labels.close
          }}
        >
          <select name="store" value={storeId} onChange={e => setStoreId(e.target.value)}>
            <option value="" disabled></option>
            {storesOptionsTags}
          </select>
        </ListItem>
        <ListInput 
          name="address" 
          label={state.labels.address}
          floatingLabel 
          type="text" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </List>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
      {!name || (userInfo.storeName && !storeId)
      ? ''
      : <Fab position="left-bottom" slot="fixed" color="green" onClick={() => handleSubmit()}>
          <Icon ios="f7:check" aurora="f7:check" md="material:done"></Icon>
        </Fab>
      }
    </Page>
  )
}
export default React.memo(ApproveUser)