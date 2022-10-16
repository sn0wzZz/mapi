import React from 'react'

import { AppProvider } from './src/contexts/appContext.context'

import MainContainer from './src/components/navigation/mainContainer.component'
import { View } from 'react-native'

export default function App() {
  return (
    <>
    <AppProvider>
      <MainContainer/>
    </AppProvider>
    </>
  )
}
