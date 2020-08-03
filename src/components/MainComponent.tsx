import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import CardComponent from './CardComponent';
import StatsComponent from './StatsComponent';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/MainComponent.css';
import { Button } from 'react-bootstrap';

const idLimit = 493;

const MainComponent = () => {

  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [currentId, setCurrentId] = useState<number>(1);
  const [searchError, setSearchError] = useState<boolean>(false);

  const idCallback = () => {
    return currentId;
  }

  const handleSearch = (event: any) => {
    event.preventDefault();

    const searchValue = event.target.search.value.toLowerCase();
    const parsed = parseInt(searchValue);
    if (!isNaN(parsed)) {
      if (parsed <= idLimit) {
        if (parsed > pokemonList.length) {
          const limitFactor = Math.floor((parsed - pokemonList.length)/20) + 1
          const limit = pokemonList.length + limitFactor*20 <= idLimit ? limitFactor*20 : idLimit - pokemonList.length
          axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${pokemonList.length}&limit=${limit}`)
          .then(response => {
            setPokemonList(list => [...list, ...response.data.results]);
          }).catch(err => {
            setSearchError(true);
          });
        } else {
          setCurrentId(parsed);
        }
      } else {
        setSearchError(true);
      }
    } else {
      const foundPokemon = pokemonList.find(pokemon => pokemon.name === searchValue);
      if (foundPokemon) {
        setCurrentId(pokemonList.indexOf(foundPokemon) + 1);
      } else {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${searchValue}`)
        .then(response => {
          if (response.data.id > pokemonList.length && response.data.id <= idLimit) {
            const limitFactor = Math.floor((response.data.id - pokemonList.length)/20) + 1
            const limit = pokemonList.length + limitFactor*20 <= idLimit ? limitFactor*20 : idLimit - pokemonList.length
            axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${pokemonList.length}&limit=${limit}`)
            .then(response => {
              setCurrentId(response.data.id);
              setPokemonList(list => [...list, ...response.data.results]);
            }).catch(err => {
              setSearchError(true);
            });
          } else {
            setSearchError(true)
          }
        }).catch(err => {
          setSearchError(true);
        })
      }
    }
    setTimeout(() => setSearchError(false), 500);
  }

  const searchChange = ():void => {
    setSearchError(false);
  }

  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=${idLimit}`)
    .then(response => {
      setPokemonList(response.data.results);
    })
    .catch(error => {
      console.log(error);
    });
  }, []);

  // useEffect(() => {
  //   if (currentId % 20 === 0 && (currentId === pokemonList.length)) {
  //     axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${(currentId/20) * 20}&limit=20`)
  //     .then(response => {
  //       setPokemonList(list => [...list, ...response.data.results]);
  //       setIsLoading(false);
  //     })
  //     .catch(error => {
  //       setIsLoading(true);
  //       console.log(error);
  //     });
  //   }
  // }, [currentId, pokemonList, types]);

  let searchInputStyle = searchError ? 'pokedex__search pokedex__search--error' : 'pokedex__search';
  return (
    <div className='pokedex-container'>
      <div className='pokedex'>
        <form
          className='pokedex__form'
          onSubmit={event => handleSearch(event)}
        >
          <input
            autoComplete="off"
            className={searchInputStyle}
            name='search'
            placeholder='Search by Name or ID...'
            onChange={() => searchChange()}
          />
        </form>
        <Button
          className='random-btn'
          onClick={() => setCurrentId(Math.floor(Math.random() * Math.floor(idLimit) + 1))}
        >Surprise Me</Button>

        <div className='pokedex__info'>
          <StatsComponent id={currentId} idCallback={() => idCallback()}/>

          <Carousel
            className='pokedex__carousel'
            onChange={event => setCurrentId(event + 1)}
            selectedItem={currentId - 1}
            showArrows
            showIndicators={false}
            showStatus={false}
            showThumbs={false}
            useKeyboardArrows
          >
          {
            pokemonList?.map((pokemon, index) => {
              return (
                <CardComponent
                  key={index}
                  id={index + 1}
                  name={pokemon.name}
                  idCallback={() => idCallback()}
                />
              )
            })
          }
          </Carousel>
        </div>
      </div>
    </div>
  )
}

export default MainComponent;