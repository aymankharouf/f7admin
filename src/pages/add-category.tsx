import {useState, useContext} from 'react'
import {f7, Page, Navbar, List, ListInput, Fab, Icon} from 'framework7-react'
import labels from '../data/labels'
import {addCategory, getMessage} from '../data/actions'
import {StateContext} from '../data/state-provider'
import { useIonToast } from '@ionic/react'
import { useHistory, useLocation } from 'react-router'

type Props = {
  id: string
}
const AddCategory = (props: Props) => {
  const {state} = useContext(StateContext)
  const [message] = useIonToast()
  const location = useLocation()
  const history = useHistory()
  const [name, setName] = useState('')
  const [ordering, setOrdering] = useState(() => {
    const siblings = state.categories.filter(c => c.parentId === props.id)
    const siblingsOrder = siblings.map(s => s.ordering)
    const maxOrder = Math.max(...siblingsOrder) || 0
    return (maxOrder + 1).toString()
  })
  const handleSubmit = () => {
    try{
      addCategory(props.id, name, +ordering)
      message(labels.addSuccess, 3000)
      history.goBack()
    } catch(err) {
			message(getMessage(location.pathname, err), 3000)
		}
  }
  
  return (
    <Page>
      <Navbar title={labels.addCategory} backLink={labels.back} />
      <List form inlineLabels>
        <ListInput 
          name="name" 
          label={labels.name}
          clearButton
          autofocus
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onInputClear={() => setName('')}
        />
        <ListInput 
          name="ordering" 
          label={labels.ordering}
          clearButton
          type="number" 
          value={ordering}
          onChange={e => setOrdering(e.target.value)}
          onInputClear={() => setOrdering('')}
        />
      </List>
      {name && ordering &&
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      }
    </Page>
  )
}
export default AddCategory
