import React, { useContext, useMemo } from 'react'
import { Page, Navbar, List, ListInput, Fab, Icon } from 'framework7-react'
import { StoreContext } from '../data/store'
import labels from '../data/labels'

const ProductDetails = props => {
  const { state } = useContext(StoreContext)
  const product = useMemo(() => state.products.find(p => p.id === props.id)
  , [state.products, props.id])
  return (
    <Page>
      <Navbar title={labels.productDetails} backLink={labels.back} />
      <List form>
        <ListInput 
          name="name" 
          label={labels.name}
          type="text" 
          value={product.name}
          readonly
        />
        <ListInput 
          name="categoryId" 
          label={labels.category}
          type="text" 
          value={state.categories.find(c => c.id === product.categoryId).name}
          readonly
        />
        <ListInput 
          name="trademark" 
          label={labels.trademark}
          type="text" 
          value={product.trademark}
          readonly
        />
        <ListInput 
          name="countryId" 
          label={labels.country}
          type="text" 
          value={product.country}
          readonly
        />
        <ListInput 
          name="tagId" 
          label={labels.tag}
          type="text" 
          value={product.tagId ? state.tags.find(t => t.id === product.tagId).name : ''}
          readonly
        />
        <img src={product.imageUrl} className="img-card" alt={product.name} />
      </List>
      <Fab position="left-top" slot="fixed" color="red" className="top-fab" href={`/edit-product/${props.id}`}>
        <Icon material="edit"></Icon>
      </Fab>
    </Page>
  )
}
export default ProductDetails