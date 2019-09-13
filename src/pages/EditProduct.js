import React, {useState, useContext } from 'react'
import {Page, Navbar, List, ListItem, ListInput, Fab, Icon, Block, Toggle } from 'framework7-react';
import { StoreContext } from '../data/Store';
import { editProduct, deleteProduct } from '../data/Actions'


const EditProduct = props => {
  const { state } = useContext(StoreContext)
  const product = state.products.find(rec => rec.id === props.id)
  const [name, setName] = useState(product.name)
  const [category, setCategory] = useState(product.category)
  const [trademark, setTrademark] = useState(product.trademark)
  const [byWeight, setByWeight] = useState(product.byWeight)
  const [isNew, setIsNew] = useState(product.isNew)
  const [country, setCountry] = useState(product.country)
  const [imageUrl, setImageUrl] = useState(product.imageUrl)
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const handleFileChange = e => {
    const files = e.target.files
    const filename = files[0].name
    if (filename.lastIndexOf('.') <= 0) {
      setError(state.labels.invalidFile)
      return
    }
    const fileReader = new FileReader()
    fileReader.addEventListener('load', () => {
      setImageUrl(fileReader.result)
    })
    fileReader.readAsDataURL(files[0])
    setImage(files[0])
  }
  const handleSubmit = () => {
    try{
      if (name === '') {
        throw new Error(state.labels.enterName)
      }
      if (category === '') {
        throw new Error(state.labels.enterCategory)
      }
      if (country === '') {
        throw new Error(state.labels.enterCountry)
      }
      if (imageUrl === '') {
        throw new Error(state.labels.enterImage)
      }
      editProduct({
        id: props.id,
        category,
        name,
        trademark,
        byWeight,
        isNew,
        country,
        imageUrl,
        image
      }).then(() => {
        props.f7router.back()
      })  
    } catch (err){
      setError(err.message)
    }
  }
  const handleDelete = () => {
    deleteProduct(product).then(() => {
      props.f7router.back()
    })
  }
  const categoriesOptionsTags = state.categories.map(rec => <option key={rec.id} value={rec.id}>{rec.name}</option>)
  const trademarksOptionsTags = state.trademarks.map(rec => <option key={rec.id} value={rec.id}>{rec.name}</option>)
  const countriesOptionsTags = state.countries.map(rec => <option key={rec.id} value={rec.id}>{rec.name}</option>)
  return (
    <Page>
      <Navbar title={state.labels.editProduct} backLink="Back" />
      {error ? <Block strong className="error">{error}</Block> : null}
      <List form>
      <ListItem
          title={state.labels.category}
          smartSelect
          smartSelectParams={{openIn: 'popup', closeOnSelect: true, searchbar: true, searchbarPlaceholder: 'Search trademark'}}
        >
          <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="" disabled></option>
            {categoriesOptionsTags}
          </select>
        </ListItem>
        <ListItem
          title={state.labels.trademark}
          smartSelect
          smartSelectParams={{openIn: 'popup', closeOnSelect: true, searchbar: true, searchbarPlaceholder: 'Search trademark'}}
        >
          <select name="trademark" value={trademark} onChange={(e) => setTrademark(e.target.value)}>
            <option value="" disabled></option>
            {trademarksOptionsTags}
          </select>
        </ListItem>
        <ListItem
          title={state.labels.country}
          smartSelect
          smartSelectParams={{openIn: 'popup', closeOnSelect: true, searchbar: true, searchbarPlaceholder: 'Search country'}}
        >
          <select name="country" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="" disabled></option>
            {countriesOptionsTags}
          </select>
        </ListItem>
        <ListInput 
          name="name" 
          label={state.labels.name}
          floatingLabel 
          clearButton
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          onInputClear={() => setName('')}
        />
        <ListItem>
          <span>{state.labels.byWeight}</span>
          <Toggle 
            name="byWeight" 
            color="green" 
            checked={byWeight} 
            onToggleChange={() => setByWeight(!byWeight)}
          />
        </ListItem>
        <ListItem>
          <span>{state.labels.isNew}</span>
          <Toggle 
            name="isNew" 
            color="green" 
            checked={isNew} 
            onToggleChange={() => setIsNew(!isNew)}
          />
        </ListItem>
        <ListInput name="image" label="Image" type="file" accept="image/*" onChange={(e) => handleFileChange(e)}/>
        <img src={imageUrl} alt=""/>
      </List>
      <Fab position="center-bottom" slot="fixed" text={state.labels.submit} color="green" onClick={() => handleSubmit()}>
        <Icon ios="f7:check" aurora="f7:check" md="material:done"></Icon>
      </Fab>
      <Fab position="left-bottom" slot="fixed" color="red" onClick={() => handleDelete()}>
        <Icon ios="f7:close" aurora="f7:close" md="material:close"></Icon>
      </Fab>
    </Page>
  )
}
export default EditProduct
