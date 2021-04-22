import { useContext, useState, useEffect } from 'react'
import { f7, Page, Navbar, Card, CardContent, CardFooter, Link, List, ListItem, Icon, Fab, Badge, FabButton, FabButtons, FabBackdrop, Actions, ActionsButton } from 'framework7-react'
import { StateContext } from '../data/state-provider'
import { getPackStores, deleteStorePack, refreshPackPrice, deletePack, changeStorePackStatus, showMessage, showError, getMessage, quantityText } from '../data/actions'
import moment from 'moment'
import labels from '../data/labels'
import { Pack, PackPrice, Store } from '../data/types'

type Props = {
  id: string
}
type ExtendedPack = Pack & {
  detailsCount: number
}
type ExtendedPackPrice = PackPrice & {
  packInfo: Pack,
  storeInfo: Store
}
const PackDetails = (props: Props) => {
  const { state, dispatch } = useContext(StateContext)
  const [error, setError] = useState('')
  const [currentStorePack, setCurrentStorePack] = useState<PackPrice>()
  const [actionOpened, setActionOpened] = useState(false);
  const [pack, setPack] = useState<ExtendedPack>(() => {
    const pack = state.packs.find(p => p.id === props.id)!
    const detailsCount = state.packPrices.filter(p => p.packId === pack.id).length
    return {
      ...pack,
      detailsCount
    }
  })
  const [packStores, setPackStores] = useState<ExtendedPackPrice[]>([])
  useEffect(() => {
    setPackStores(() => {
      const packStores = getPackStores(pack, state.packPrices, state.stores, state.packs)
      const today = new Date()
      today.setDate(today.getDate() - 30)
      return packStores.sort((s1, s2) => (s1.unitPrice ?? 0) - (s2.unitPrice ?? 0))
    })
  }, [pack, state.stores, state.packPrices, state.packs])
  useEffect(() => {
    setPack(() => {
      const pack = state.packs.find(p => p.id === props.id)!
      let detailsCount = state.packPrices.filter(p => p.packId === pack.id).length
      return {
        ...pack,
        detailsCount
      }
    })
  }, [state.packs, state.packPrices, props.id])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const handleRefreshPrice = () => {
    try{
      refreshPackPrice(pack, state.packPrices)
      showMessage(labels.refreshSuccess)
    } catch(err) {
			setError(getMessage(f7.views.current.router.currentRoute.path, err))
		}
  }
  const handleDelete = () => {
    f7.dialog.confirm(labels.confirmationText, labels.confirmationTitle, () => {
      try{
        deletePack(pack.id!)
        showMessage(labels.deleteSuccess)
        f7.views.current.router.back()
      } catch(err) {
        setError(getMessage(f7.views.current.router.currentRoute.path, err))
      }
    })
  }
  const handleDeletePrice = () => {
    f7.dialog.confirm(labels.confirmationText, labels.confirmationTitle, () => {
      try{
        deleteStorePack(currentStorePack!, state.packPrices, state.packs)
        showMessage(labels.deleteSuccess)
      } catch(err) {
        setError(getMessage(f7.views.current.router.currentRoute.path, err))
      }
    })
  }
  const handlePurchase = () => {
		try{
      if (currentStorePack?.offerEnd && new Date() > currentStorePack.offerEnd) {
        throw new Error('offerEnded')
      }
      let params
      if (pack.byWeight) {
        f7.dialog.prompt(labels.enterWeight, labels.actualWeight, weight => {
          params = {
            pack,
            packStore: currentStorePack,
            quantity : pack.isDivided ? Number(weight) : 1,
            price: currentStorePack?.price,
            weight: Number(weight),
          }
          dispatch({type: 'ADD_TO_BASKET', payload: params})
          showMessage(labels.addToBasketSuccess)
          f7.views.current.router.back()
        })
      } else {
        params = {
          pack, 
          packStore: currentStorePack,
          quantity: 1,
          price: currentStorePack?.price
        }
        dispatch({type: 'ADD_TO_BASKET', payload: params})
        showMessage(labels.addToBasketSuccess)
        f7.views.current.router.back()
      }
    } catch(err) {
			setError(getMessage(f7.views.current.router.currentRoute.path, err))
		}
  }
  const handleChangeStatus = () => {
    try{
      changeStorePackStatus(currentStorePack!, state.packPrices, state.packs)
      showMessage(labels.editSuccess)
    } catch(err) {
      setError(getMessage(f7.views.current.router.currentRoute.path, err))
    }
  }

  const handleActions = (storePackInfo: PackPrice) => {
    const storePack: PackPrice = {
      packId: pack.id!,
      storeId: storePackInfo.storeId,
      price: storePackInfo.price,
      offerEnd: storePackInfo.offerEnd,
      isActive: storePackInfo.isActive,
      isAuto: false,
      time: storePackInfo.time
    }
    if (storePackInfo.quantity) storePack['quantity'] = storePackInfo.quantity
    setCurrentStorePack(storePack)
    setActionOpened(true)
  }
  let i = 0
  return (
    <Page>
      <Navbar title={`${pack.productName}${pack.productAlias ? '-' + pack.productAlias : ''}`} backLink={labels.back} />
      <Card>
        <CardContent>
          <div className="card-title">{`${pack.name}${pack.closeExpired ? '(' + labels.closeExpired + ')' : ''}`}</div>
          <img src={pack.imageUrl} className="img-card" alt={labels.noImage} />
        </CardContent>
        <CardFooter>
          <p>{(pack.price / 100).toFixed(2)}</p>
          <p>{pack.unitsCount}</p>
        </CardFooter>
      </Card>
      <List mediaList>
        {packStores.map(s => 
          <ListItem 
            title={s.storeInfo?.name}
            subtitle={s.packId === pack.id ? '' : `${s.packInfo?.productName}${s.packInfo?.productAlias ? '-' + s.packInfo.productAlias : ''}`}
            text={s.packId === pack.id ? '' : s.packInfo?.name}
            footer={s.quantity ? `${labels.balance}: ${quantityText(s.quantity, s.weight)}` : ''}
            key={i++}
            className={currentStorePack?.storeId === s.storeId && currentStorePack?.packId === s.packId ? 'selected' : ''}
          >
            <div className="list-subtext1">{`${labels.price}: ${(s.price / 100).toFixed(2)}${s.price === s.unitPrice ? '' : '(' + ((s.unitPrice ?? 0)/ 100).toFixed(2) + ')'}`}</div>
            <div className="list-subtext2">{s.subQuantity ? `${labels.quantity}: ${s.subQuantity}` : ''}</div>
            {s.offerEnd ? <div className="list-subtext4">{labels.offerUpTo}: {moment(s.offerEnd).format('Y/M/D')}</div> : ''}
            {s.isActive ? '' : <Badge slot="title" color='red'>{labels.inActive}</Badge>}
            {s.packId === pack.id && !s.isAuto ? <Link slot="after" iconMaterial="more_vert" onClick={()=> handleActions(s)}/> : ''}
          </ListItem>
        )}
      </List>
      <FabBackdrop slot="fixed" />
      <Fab position="left-top" slot="fixed" color="orange" className="top-fab">
        <Icon material="keyboard_arrow_down"></Icon>
        <Icon material="close"></Icon>
        <FabButtons position="bottom">
          <FabButton color="green" onClick={() => f7.views.current.router.navigate(`/add-pack-store/${props.id}`)}>
            <Icon material="add"></Icon>
          </FabButton>
          <FabButton color="blue" onClick={() => f7.views.current.router.navigate(`/${pack.isOffer ? 'edit-offer' : (pack.subPackId ? 'edit-bulk' : 'edit-pack')}/${props.id}`)}>
            <Icon material="edit"></Icon>
          </FabButton>
          <FabButton color="yellow" onClick={() => handleRefreshPrice()}>
            <Icon material="cached"></Icon>
          </FabButton>
          {pack.detailsCount === 0 ? 
            <FabButton color="red" onClick={() => handleDelete()}>
              <Icon material="delete"></Icon>
            </FabButton>
          : ''}
        </FabButtons>
      </Fab>
      <Actions opened={actionOpened} onActionsClosed={() => setActionOpened(false)}>
        {currentStorePack?.storeId === 's' ? '' :
          <ActionsButton onClick={() => handleChangeStatus()}>{currentStorePack?.isActive ? labels.deactivate : labels.activate}</ActionsButton>
        }
        {currentStorePack?.storeId === 's' && currentStorePack?.quantity === 0 ? '' : 
          <ActionsButton onClick={() => f7.views.current.router.navigate(`/edit-price/${currentStorePack?.packId}/store/${currentStorePack?.storeId}`)}>{labels.editPrice}</ActionsButton>
        }
        {currentStorePack?.storeId === 's' ? '' :
          <ActionsButton onClick={() => handleDeletePrice()}>{labels.delete}</ActionsButton>
        }
        {currentStorePack?.storeId === 's' ? '' :
          <ActionsButton onClick={() => handlePurchase()}>{labels.purchase}</ActionsButton>
        }
      </Actions>
    </Page>
  )
}

export default PackDetails
