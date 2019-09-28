import React, { useState, useContext } from 'react'
import {Page, Navbar, List, ListInput, Fab, Icon, Toolbar, ListItem, Toggle} from 'framework7-react';
import { StoreContext } from '../data/Store';
import BottomToolbar from './BottomToolbar';
import { editCustomer, showMessage, editUser } from '../data/Actions'


const EditCustomer = props => {
  const { state } = useContext(StoreContext)
  const customer = state.customers.find(rec => rec.id === props.id)
  const userInfo = state.users.find(rec => rec.id === props.id)
  const [name, setName] = useState(userInfo.name)
  const [address, setAddress] = useState(customer.address)
  const [isActive, setIsActive] = useState(customer.isActive)
  const [type, setType] = useState(customer.type)
  const [storeId, setStoreId] = useState(customer.storeId)
  const [deliveryFees, setDeliveryFees] = useState(customer.deliveryFees)
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
  const customerTypesOptionsTags = state.customerTypes.map(type => 
    <option 
      key={type.id} 
      value={type.id}
    >
      {type.name}
    </option>
  )
  const handleSubmit = () => {
    editCustomer({
      id: props.id,
      storeId,
      type,
      address,
      isActive,
      deliveryFees: deliveryFees * 1000
    }).then(() => {
      editUser({
        id: props.id,
        name
      }).then(() => {
        showMessage(props, 'success', state.labels.editSuccess)
        props.f7router.back()  
      })
    })
  }
  return (
    <Page>
      <Navbar title={state.labels.editCustomer} backLink='Back' />
      <List form>
        <ListInput 
          name="name" 
          label={state.labels.name}
          value={name}
          floatingLabel 
          clearButton
          type="text" 
          onChange={e => setName(e.target.value)}
          onInputClear={() => setName('')}
        />
        <ListInput 
          name="mobile" 
          label={state.labels.mobile}
          value={userInfo.mobile}
          floatingLabel 
          type="number"
          readonly
        />
        <ListItem
          title={state.labels.type}
          smartSelect
          smartSelectParams={{
            openIn: 'popup', 
            closeOnSelect: true, 
            searchbar: true, 
            searchbarPlaceholder: state.labels.search,
            popupCloseLinkText: state.labels.close
          }}
        >
          <select name="type" value={type} onChange={e => setType(e.target.value)}>
            <option value="" disabled></option>
            {customerTypesOptionsTags}
          </select>
        </ListItem>
        <ListItem>
          <span>{state.labels.isActive}</span>
          <Toggle name="isActive" color="green" checked={isActive} onToggleChange={() => setIsActive(!isActive)}/>
        </ListItem>
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
          name="deliveryFees" 
          label={state.labels.deliveryFees}
          value={(customer.deliveryFees / 1000).toFixed(3)}
          floatingLabel 
          type="number"
          clearButton
          value={deliveryFees}
          onChange={(e) => setDeliveryFees(e.target.value)}
          onInputClear={() => setDeliveryFees('')}
        />
        <ListInput 
          name="address" 
          label={state.labels.address}
          value={address}
          floatingLabel 
          clearButton
          type="text" 
          onChange={(e) => setAddress(e.target.value)}
          onInputClear={() => setAddress('')}
        />
      </List>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
      {!name || (type === 'o' && !storeId) || (name === userInfo.name && address === customer.address && isActive === customer.isActive && type === customer.type && storeId === customer.storeId && deliveryFees === customer.deliveryFees)
      ? ''
      : <Fab position="left-bottom" slot="fixed" color="green" onClick={() => handleSubmit()}>
          <Icon ios="f7:check" aurora="f7:check" md="material:done"></Icon>
        </Fab>
      }
    </Page>
  )
}
export default React.memo(EditCustomer)