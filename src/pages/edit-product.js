import React, {useState, useContext, useMemo, useEffect } from 'react'
import { Page, Navbar, List, ListItem, ListInput, Fab, Icon } from 'framework7-react'
import { StoreContext } from '../data/store'
import { editProduct, showMessage, showError, getMessage } from '../data/actions'
import labels from '../data/labels'
import { storageTypes } from '../data/config'

const EditProduct = props => {
  const { state } = useContext(StoreContext)
  const [error, setError] = useState('')
  const product = useMemo(() => state.products.find(p => p.id === props.id)
  , [state.products, props.id])
  const [name, setName] = useState(product.name)
  const [engName, setEngName] = useState(product.engName)
  const [categoryId, setCategoryId] = useState(product.categoryId)
  const [trademarkId, setTrademarkId] = useState(product.trademarkId)
  const [countryId, setCountryId] = useState(product.countryId)
  const [tagId, setTagId] = useState(product.tagId)
  const [storageId, setStorageId] = useState(product.storageId)
  const [imageUrl, setImageUrl] = useState(product.imageUrl)
  const [image, setImage] = useState('')
  const [fileErrorMessage, setFileErrorMessage] = useState('')
  const categories = useMemo(() => [...state.categories].sort((c1, c2) => c1.name > c2.name ? 1 : -1)
  , [state.categories]) 
  const trademarks = useMemo(() => [...state.trademarks].sort((t1, t2) => t1.name > t2.name ? 1 : -1)
  , [state.trademarks]) 
  const countries = useMemo(() => [...state.countries].sort((c1, c2) => c1.name > c2.name ? 1 : -1)
  , [state.countries]) 
  const tags = useMemo(() => [...state.tags].sort((t1, t2) => t1.name > t2.name ? 1 : -1)
  , [state.tags]) 
  const handleFileChange = e => {
    const files = e.target.files
    const filename = files[0].name
    if (filename.lastIndexOf('.') <= 0) {
      setFileErrorMessage(labels.invalidFile)
      return
    }
    const fileReader = new FileReader()
    fileReader.addEventListener('load', () => {
      setImageUrl(fileReader.result)
    })
    fileReader.readAsDataURL(files[0])
    setImage(files[0])
  }
  const hasChanged = useMemo(() => {
    if (name !== product.name) return true
    if (engName !== product.engName) return true
    if (countryId !== product.countryId) return true
    if (categoryId !== product.categoryId) return true
    if (trademarkId !== product.trademarkId) return true
    if (tagId !== product.tagId) return true
    if (storageId !== product.storageId) return true
    if (imageUrl !== product.imageUrl) return true
    return false
  }, [product, name, engName, countryId, categoryId, trademarkId, tagId, storageId, imageUrl])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])

  const handleSubmit = async () => {
    try{
      const product = {
        id: props.id,
        categoryId,
        name,
        engName,
        trademarkId,
        countryId,
        tagId,
        storageId,
        imageUrl
      }
      await editProduct(product, image)
      showMessage(labels.editSuccess)
      props.f7router.back()
    } catch(err) {
			setError(getMessage(props, err))
		}
  }
  return (
    <Page>
      <Navbar title={labels.editProduct} backLink={labels.back} />
      <List form>
        <ListInput 
          name="name" 
          label={labels.name}
          floatingLabel 
          clearButton
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)}
          onInputClear={() => setName('')}
        />
        <ListInput 
          name="engName" 
          label={labels.engName}
          floatingLabel 
          clearButton
          type="text" 
          value={engName} 
          onChange={e => setEngName(e.target.value)}
          onInputClear={() => setEngName('')}
        />
        <ListItem
          title={labels.category}
          smartSelect
          smartSelectParams={{
            openIn: "popup", 
            closeOnSelect: true, 
            searchbar: true, 
            searchbarPlaceholder: labels.search,
            popupCloseLinkText: labels.close
          }}
        >
          <select name="categoryId" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value=""></option>
            {categories.map(c => 
              <option key={c.id} value={c.id}>{c.name}</option>
            )}
          </select>
        </ListItem>
        <ListItem
          title={labels.trademark}
          smartSelect
          smartSelectParams={{
            openIn: "popup", 
            closeOnSelect: true, 
            searchbar: true, 
            searchbarPlaceholder: labels.search,
            popupCloseLinkText: labels.close
          }}
        >
          <select name="trademarkId" value={trademarkId} onChange={e => setTrademarkId(e.target.value)}>
            <option value=""></option>
            {trademarks.map(t => 
              <option key={t.id} value={t.id}>{t.name}</option>
            )}
          </select>
        </ListItem>
        <ListItem
          title={labels.country}
          smartSelect
          smartSelectParams={{
            openIn: "popup", 
            closeOnSelect: true, 
            searchbar: true, 
            searchbarPlaceholder: labels.search,
            popupCloseLinkText: labels.close
          }}
        >
          <select name="countryId" value={countryId} onChange={e => setCountryId(e.target.value)}>
            <option value=""></option>
            {countries.map(c => 
              <option key={c.id} value={c.id}>{c.name}</option>
            )}
          </select>
        </ListItem>
        <ListItem
          title={labels.tag}
          smartSelect
          smartSelectParams={{
            openIn: "popup", 
            closeOnSelect: true, 
            searchbar: true, 
            searchbarPlaceholder: labels.search,
            popupCloseLinkText: labels.close
          }}
        >
          <select name="tagId" value={tagId} onChange={e => setTagId(e.target.value)}>
            <option value=""></option>
            {tags.map(t => 
              <option key={t.id} value={t.id}>{t.name}</option>
            )}
          </select>
        </ListItem>
        <ListItem
          title={labels.storage}
          smartSelect
          smartSelectParams={{
            openIn: "popup", 
            closeOnSelect: true, 
            searchbar: true, 
            searchbarPlaceholder: labels.search,
            popupCloseLinkText: labels.close
          }}
        >
          <select name="storageId" value={storageId} onChange={e => setStorageId(e.target.value)}>
            <option value=""></option>
            {storageTypes.map(t => 
              <option key={t.id} value={t.id}>{t.name}</option>
            )}
          </select>
        </ListItem>
        <ListInput 
          name="image" 
          label="Image" 
          type="file" 
          accept="image/*" 
          errorMessage={fileErrorMessage}
          errorMessageForce
          onChange={e => handleFileChange(e)}
        />
        <img src={imageUrl} className="img-card" alt={name} />
      </List>
      {(!name && !engName) || !countryId || !categoryId || !imageUrl || !hasChanged ? '' :
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      }
    </Page>
  )
}
export default EditProduct
