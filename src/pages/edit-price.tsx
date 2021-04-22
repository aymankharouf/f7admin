import { useState, useContext, useEffect } from 'react'
import { f7, Page, Navbar, List, ListInput, Fab, Icon } from 'framework7-react'
import { StateContext } from '../data/state-provider'
import { editPrice, showMessage, showError, getMessage } from '../data/actions'
import labels from '../data/labels'

type Props = {
  packId: string,
  storeId: string
}
const EditPrice = (props: Props) => {
  const { state } = useContext(StateContext)
  const [error, setError] = useState('')
  const [pack] = useState(() => state.packs.find(p => p.id === props.packId)!)
  const [store] = useState(() => state.stores.find(s => s.id === props.storeId)!)
  const [storePack] = useState(() => state.packPrices.find(p => p.packId === props.packId && p.storeId === props.storeId)!)
  const [price, setPrice] = useState(0)
  const [offerDays, setOfferDays] = useState('')
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const handleEdit = () => {
    try{
      if (Number(price) !== Number(Number(price).toFixed(2))) {
        throw new Error('invalidPrice')
      }
      if (Number(price) < 0) {
        throw new Error('invalidPrice')
      }
      if (offerDays && Number(offerDays) <= 0) {
        throw new Error('invalidPeriod')
      }
      let offerEnd
      if (offerDays) {
        offerEnd = new Date()
        offerEnd.setDate(offerEnd.getDate() + Number(offerDays))
      }
      const newStorePack = {
        ...storePack,
        price : price * 100,
        offerEnd,
        time: new Date()
      }
      editPrice(newStorePack, storePack.price, state.packPrices, state.packs)
      showMessage(labels.editSuccess)
      f7.views.current.router.back()
    } catch(err) {
			setError(getMessage(f7.views.current.router.currentRoute.path, err))
		}
  }
  return (
    <Page>
      <Navbar title={`${labels.editPrice} ${store.name}`} backLink={labels.back} />
      <List form inlineLabels>
        <ListInput 
          name="productName" 
          label={labels.product}
          value={pack.productName}
          type="text" 
          readonly
        />
        <ListInput 
          name="packName" 
          label={labels.pack}
          value={pack.name}
          type="text" 
          readonly
        />
        <ListInput 
          name="oldPrice" 
          label={labels.oldPrice}
          value={(storePack.price / 100).toFixed(2)}
          type="text" 
          readonly
        />
        <ListInput 
          name="price" 
          label={labels.price}
          clearButton 
          type="number" 
          value={price}
          onChange={e => setPrice(e.target.value)}
          onInputClear={() => setPrice(0)}
        />
        <ListInput 
          name="offerDays" 
          label={labels.offerDays}
          value={offerDays}
          clearButton 
          type="number" 
          onChange={e => setOfferDays(e.target.value)}
          onInputClear={() => setOfferDays('')}
        />
      </List>
      {price &&
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleEdit()}>
          <Icon material="done"></Icon>
        </Fab>
      }
    </Page>
  )
}
export default EditPrice
