import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import Users from './User'

const queryClient= new QueryClient()
function App() {

  return (
    <div>
        <QueryClientProvider client={queryClient}>

          <Users/>
        </QueryClientProvider>
        </div>
  )
}

export default App
