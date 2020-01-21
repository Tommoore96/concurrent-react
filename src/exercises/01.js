// Simple Data-fetching

// http://localhost:3000/isolated/exercises/01

import React from 'react'
import { PokemonDataView } from '../utils'
// 🐨 you'll need to import the fetchPokemon function
// 💰 here you go:
import fetchPokemon from '../fetch-pokemon'
// 💰 use it like this: fetchPokemon(pokemonName).then(handleSuccess, handleFailure)

// you'll also need the ErrorBoundary component from utils
// 💰 here you go:
import { ErrorBoundary, createResource, PokemonInfoFallback } from '../utils'
// 💰 use it like this: <ErrorBoundary><SomeOtherComponents /></ErrorBoundary>

// By default, all fetches are mocked so we can control the time easily.
// You can adjust the fetch time with this:
// window.FETCH_TIME = 3000
// If you want to make an actual network call for the pokemon
// then uncomment the following line
// window.fetch.restoreOriginalFetch()
// Note that by doing this, the FETCH_TIME will no longer be considered
// and if you want to slow things down you should use the Network tab
// in your developer tools to throttle your network to something like "Slow 3G"

// 🐨 create the following mutable variable references (using let):
// pokemon, pokemonError, pokemonPromise


const pokemonResource = createResource(() => fetchPokemon('pikachu'))

// We don't need the app to be mounted to know that we want to fetch the pokemon
// named "pikachu" so we can go ahead and do that right here.
// 🐨 assign the pokemonPromise variable to a call to fetchPokemon('pikachu')

// 🐨 when the promise resolves, set the pokemon variable to the resolved value
// 🐨 if the promise fails, set the pokemonError variable to the error

function PokemonInfo() {

  const pokemon = pokemonResource.read()

  // if the code gets it this far, then the pokemon variable is defined and
  // rendering can continue!
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function App() {
  return (
    <div className="pokemon-info">
      <ErrorBoundary>
        <React.Suspense fallback={<PokemonInfoFallback name="Pikachu" />}>
          <PokemonInfo />
        </React.Suspense>
      </ErrorBoundary>
    </div>
  )
}

/*
🦉 Elaboration & Feedback
After the instruction, copy the URL below into your browser and fill out the form:
http://ws.kcd.im/?ws=Concurrent%20React&e=Simple%20Data-fetching&em=
*/

////////////////////////////////////////////////////////////////////
//                                                                //
//                 Don't make changes below here.                 //
// But do look at it to see how your code is intended to be used. //
//                                                                //
////////////////////////////////////////////////////////////////////

export default App
