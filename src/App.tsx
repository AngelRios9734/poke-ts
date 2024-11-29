import { useQuery } from '@tanstack/react-query'
import { PokeDexResponse, PokemonInfo, PokemonDetailsList } from './types/type'
import './App.css'
// https://pokeapi.co/api/v2/pokemon?limit=10&offset=0 all pokemons
// https://pokeapi.co/api/v2/pokemon/ditto only one pokemon


//1) fetch de la url principal uqe devuelve el nombre y el url(con mas detalles) de cada pokemon... 
const fetchPokemon = async () => {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=48&offset=0')
    if (!res.ok) throw new Error('Error in fetchin')
    const pokemonResponse = await res.json() as PokeDexResponse  //4) una vez q hicimos el interface y el tipado aclaramos la estructura de la respuesta 

    //4) con la url que contiene los detalles de c/u que tenemos en pokemonResponse usamos Promise.all y map paraacceder a cada url y hacer un fecth de c/u
    const detailedPokemonData = await Promise.all(
        pokemonResponse.results.map(async (el) => {
            const pokemonRes = await fetch(el.url)
            if (!pokemonRes.ok) throw new Error('Error in fetchin detail pokemon')
            return await pokemonRes.json() as PokemonInfo //6) como cada elemento va a ser un objeto c/u le decimos que va a tener la estructura de PokemonInfo

        })
    )

    return detailedPokemonData
}

function App() {
    //2) llamamos al useQuery con el fetch
    const { data: pokemonData } = useQuery<PokemonDetailsList>({ //7) y la respuesta final de la consulta va a ser un arreglo que va acontener todos los Pokemon info
        queryKey: ['pokemon'],                                  //asi que usamos PokemonDetailList
        queryFn: fetchPokemon,
    })

    console.log(pokemonData)

    return (
        <>
            <div className='min-h-screen bg-red-700'>
                <h1 className='text-5xl text-center mb-5'>Poke api</h1>
                <main>
                    <ul className='flex flex-wrap gap-3 items-center justify-center'>
                        {
                            pokemonData?.map(pokemon => ( //8) mapeamos la respuesta agregamos ? para asegurar que primero tengamos la respuesta
                                <li className='flex text-center' key={pokemon.name}>
                                    <article className='bg-red-900'>
                                        <img src={pokemon.sprites.front_default} />
                                        <h3>{pokemon.name}</h3>
                                    </article>
                                </li>
                            ))
                        }
                    </ul>
                </main>

            </div >
        </>
    )
}

export default App
