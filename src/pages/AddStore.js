import React, { useState, useContext, useEffect } from 'react'
import { addStore } from '../data/Actions'
import {Page, Navbar, List, ListItem, ListInput, Block, Fab, Icon} from 'framework7-react';
import { StoreContext } from '../data/Store';


const AddStore = props => {
  const { state, dispatch } = useContext(StoreContext)
  const [storeType, setStoreType] = useState('')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const patterns = {
    mobile: /^07[7-9][0-9]{7}$/
  }

  useEffect(() => {
    const validateMobile = (value) => {
      if (patterns.mobile) {
        if (patterns.mobile.test(value)){
          setError('')
        } else {
          setError('not a valid mobile number')
        }
      }
    }
    if (mobile !== '') validateMobile(mobile)
  }, [mobile])

  const handleSubmit = () => {
    try{
      if (name === '') {
        throw 'enter store name'
      }
      if (storeType === '') {
        throw 'enter store type'
      }
      addStore({
        name,
        storeType,
        mobile,
        address
      }).then(id => {
        dispatch({type: 'ADD_STORE', store: {id, name, storeType, mobile, address}})
        props.f7router.back()
      })
    } catch(err) {
      setError(err)
    }
  }
  const storeTypesOptionsTags = state.storeTypes.map(storeType => <option key={storeType.id} value={storeType.id}>{storeType.name}</option>)
  return (
    <Page>
      <Navbar title={state.labels.newStore} backLink='Back' />
      <List form>
        <ListInput 
          name="name" 
          label={state.labels.name}
          value={name}
          floatingLabel
          clearButton 
          type="text" 
          onChange={(e) => setName(e.target.value)}
          onInputClear={() => setName('')}
        />
        <ListInput
          label={state.labels.mobile}
          type="number"
          name="mobile"
          clearButton
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          onInputClear={() => setMobile('')}
        />
        <ListInput 
          name="address" 
          label={state.labels.address}
          value={address}
          floatingLabel
          clearButton 
          type="textarea" 
          onChange={(e) => setAddress(e.target.value)}
          onInputClear={() => setAddress('')}
        />
        <ListItem
          title={state.labels.type}
          smartSelect
          smartSelectParams={{openIn: 'popup', closeOnSelect: true, searchbar: true, searchbarPlaceholder: 'Search store type'}}
        >
          <select name='storeType' defaultValue="" onChange={(e) => setStoreType(e.target.value)}>
            <option value="" disabled></option>
            {storeTypesOptionsTags}
          </select>
        </ListItem>
      </List>
      <Block strong className="error">
        <p>{error}</p>
      </Block>
      <Fab position="center-bottom" slot="fixed" text={state.labels.submit} color="green" onClick={() => handleSubmit()}>
        <Icon ios="f7:check" aurora="f7:check" md="material:done"></Icon>
      </Fab>
    </Page>
  )
}
export default AddStore
