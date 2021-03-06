// Coordinate Suspending components with SuspenseList

// http://localhost:3000/isolated/exercises/07

import React from 'react'
import '../suspense-list/style-overrides.css'
import * as cn from '../suspense-list/app.module.css'
import Spinner from '../suspense-list/spinner'
import { createResource, ErrorBoundary, PokemonForm } from '../utils'
import { fetchUser } from '../fetch-pokemon'

// 💰 this delay function just allows us to make a promise take longer to resolve
// so we can easily play around with the loading time of our code.
const delay = time => promiseResult =>
  new Promise(resolve => setTimeout(() => resolve(promiseResult), time))

function preloadableLazy(dynamicImport) {
  let promise
  function load() {
    if (!promise) {
      promise = dynamicImport()
    }
    return promise
  }
  const Component = React.lazy(load)
  Component.preload = load
  console.log('Comp: ', Component);

  return Component
}

// 🐨 feel free to play around with the delay timings.
const NavBar = preloadableLazy(() =>
  import('../suspense-list/nav-bar').then(delay(500)),
)
const LeftNav = preloadableLazy(() =>
  import('../suspense-list/left-nav').then(delay(2000)),
)
const MainContent = preloadableLazy(() =>
  import('../suspense-list/main-content').then(delay(1500)),
)
const RightNav = preloadableLazy(() =>
  import('../suspense-list/right-nav').then(delay(1000)),
)

const fallback = (
  <div className={cn.spinnerContainer}>
    <Spinner />
  </div>
)
const SUSPENSE_CONFIG = { timeoutMs: 4000 }

function App() {
  const [startTransition] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  function handleSubmit(pokemonName) {
    startTransition(() => {
      setPokemonResource(createResource(() => fetchUser(pokemonName)))
    })
    NavBar.preload()
    LeftNav.preload()
    MainContent.preload()
    RightNav.preload()
  }

  if (!pokemonResource) {
    return (
      <div className={`${cn.root} totally-centered`} style={{ height: '100vh' }}>
        <PokemonForm onSubmit={handleSubmit} />
      </div>
    )
  }

  // 🐨 Use React.SuspenseList throughout these Suspending components to make
  // them load in a way that is not jaring to the user.
  // 💰 there's not really a specifically "right" answer for this.
  return (
    <div className={cn.root}>
      <ErrorBoundary>
        <React.SuspenseList revealOrder="forwards" tail="collapsed">
          <React.Suspense fallback={fallback}>
            <NavBar pokemonResource={pokemonResource} />
          </React.Suspense>
          <div className={cn.mainContentArea}>
            <React.SuspenseList revealOrder="forwards" tail="collapsed">
              <React.Suspense fallback={fallback}>
                <LeftNav />
              </React.Suspense>
              <React.SuspenseList revealOrder="together">

                <React.Suspense fallback={fallback}>
                  <MainContent pokemonResource={pokemonResource} />
                </React.Suspense>
                <React.Suspense fallback={fallback}>
                  <RightNav pokemonResource={pokemonResource} />
                </React.Suspense>
              </React.SuspenseList>

            </React.SuspenseList>
          </div>
        </React.SuspenseList>
      </ErrorBoundary>
    </div>
  )
}

/*
🦉 Elaboration & Feedback
After the instruction, copy the URL below into your browser and fill out the form:
http://ws.kcd.im/?ws=Concurrent%20React&e=Coordinate%20Suspending%20components%20with%20SuspenseList&em=
*/

////////////////////////////////////////////////////////////////////
//                                                                //
//                 Don't make changes below here.                 //
// But do look at it to see how your code is intended to be used. //
//                                                                //
////////////////////////////////////////////////////////////////////

export default App