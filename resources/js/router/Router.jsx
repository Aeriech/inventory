import React from 'react'
import {Routes, Route} from 'react-router-dom'

import ItemPage from '../components/inventory/ItemPage'
import NotFound from '../components/inventory/NotFound'
import AddItem from '../components/inventory/AddItem'

export default function Router() {
  return (
    <div>
        <Routes>
            <Route path='/' element={ <ItemPage/> } />
            <Route path='/*' element={ <NotFound/> } />
            <Route path='/Add_Item' element={ <AddItem/> } />
        </Routes>
    </div>
  )
}
