import React from 'react'
import {Routes, Route} from 'react-router-dom'

import ItemPage from '../components/inventory/ItemPage'
import NotFound from '../components/inventory/NotFound'
import AddItem from '../components/inventory/AddItem'
import UpdateItem from '../components/inventory/UpdateItem'
import AddReceipt from '../components/inventory/AddReceipt'
import ViewReceipts from '../components/inventory/ViewReceipts'
import ViewArchives from '../components/inventory/ViewArchives'
import AddPurchase from '../components/inventory/AddPurchase'
import UseItem from '../components/inventory/UseItem'
import ViewHistoryLog from '../components/inventory/ViewHistoryLog'
import AddCategory from '../components/inventory/AddCategory'
import AddMeasurement from '../components/inventory/AddMeasurement'
import NewPurchase from '../components/inventory/NewPurchase'


export default function Router() {
  return (
    <div>
        <Routes>
            <Route path='/' element={ <ItemPage/> } />
            <Route path='/*' element={ <NotFound/> } />
            <Route path='/new-item' element={ <AddItem/> } />
            <Route path='/get-item/:id' element={ <UpdateItem/> } />
            <Route path='/new-receipt' element={ <AddReceipt/> } />
            <Route path='/view-receipts' element={ <ViewReceipts/> } />
            <Route path='/view-archives' element={ <ViewArchives/> } />
            <Route path='/add-purchase/:id' element={ <AddPurchase/> } />
            <Route path='/use-item/:id' element={ <UseItem/> } />
            <Route path='/view-logs' element={ <ViewHistoryLog/> } />
            <Route path='/add-category' element={ <AddCategory/> } />
            <Route path='/add-measurement' element={ <AddMeasurement/> } />
            <Route path='/new-purchase' element={ <NewPurchase/> } />
        </Routes>
    </div>
  )
}
