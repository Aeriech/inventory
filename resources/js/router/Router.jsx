import React from 'react'
import {Routes, Route} from 'react-router-dom'

import MainPage from '../components/inventory/MainPage'
import NotFound from '../components/inventory/NotFound'

export default function Router() {
  return (
    <div>
        <Routes>
            <Route path='/' element={ <MainPage/> } />
            <Route path='/*' element={ <NotFound/> } />
        </Routes>
    </div>
  )
}
