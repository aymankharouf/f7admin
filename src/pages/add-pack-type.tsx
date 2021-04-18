import { useContext, useState, useEffect } from 'react'
import { StoreContext } from '../data/store'
import { f7, Page, Navbar, List, ListInput, Fab, Icon, Toolbar } from 'framework7-react'
import Footer from './footer'
import labels from '../data/labels'
import { addPackType, showMessage, showError, getMessage } from '../data/actions'


const AddPackType = () => {
  const { state } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const handleSubmit = () => {
    try{
      if (state.packTypes.filter(t => t.name === name).length > 0) {
        throw new Error('duplicateName')
      }
      addPackType({
        id: Math.random().toString(),
        name,
      })
      showMessage(labels.addSuccess)
      f7.views.current.router.back()
    } catch(err) {
			setError(getMessage(f7.views.current.router.currentRoute.path, err))
		}
  }
  return (
    <Page>
      <Navbar title={labels.addPackType} backLink={labels.back} />
      <List form inlineLabels>
        <ListInput 
          name="name" 
          label={labels.name} 
          clearButton
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onInputClear={() => setName('')}
        />
      </List>
      {!name ? '' :
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      }
      <Toolbar bottom>
        <Footer/>
      </Toolbar>
    </Page>
  )
}
export default AddPackType