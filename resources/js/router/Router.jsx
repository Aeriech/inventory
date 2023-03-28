import React from 'react'
import {Routes, Route} from 'react-router-dom'

import ItemPage from '../components/inventory/ItemPage'
import NotFound from '../components/inventory/NotFound'
import AddItem from '../components/inventory/AddItem'
import UpdateItem from '../components/inventory/UpdateItem'
import AddReceipt from '../components/inventory/AddReceipt'
import ViewReceipts from '../components/inventory/ViewReceipts'

export default function Router() {
  return (
    <div>
        <Routes>
            <Route path='/' element={ <ItemPage/> } />
            <Route path='/*' element={ <NotFound/> } />
            <Route path='/add-item' element={ <AddItem/> } />
            <Route path='/get-item/:id' element={ <UpdateItem/> } />
            <Route path='/add-receipt' element={ <AddReceipt/> } />
            <Route path='/view-receipts' element={ <ViewReceipts/> } />
        </Routes>
    </div>
  )
}
