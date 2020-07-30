import React, { useState, useEffect } from 'react';
import axios from 'axios';
import spinner from '../assets/spinner.gif';
import '../styles/CardComponent.css';

const TYPE_COLOURS = {
  bug: 'B1C12E',
  dark: '4F3A2D',
  dragon: '755EDF',
  electric: 'FCBC17',
  fairy: 'F4B1F4',
  fighting: '82351D',
  fire: 'E73B0C',
  flying: 'A3B3F7',
  ghost: '6060B2',
  grass: '74C236',
  ground: 'D3B357',
  ice: 'A3E7FD',
  normal: 'C8C4Bc',
  poison: '934594',
  psychic: 'ED4882',
  rock: 'B9A156',
  steel: 'B5B5C3',
  water: '3295F6'
}

const CardComponent = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${props.id}/`)
    .then(response => {
      setTypes([]);
      response.data.types.forEach(
        type => setTypes(types => [...types, type.type.name])
      );
    }).catch(error => {
      console.log(error);
    });
  }, [props.id])
  
  const pokemonCry = (name) => {
    let url = `https://play.pokemonshowdown.com/audio/cries/${name}.mp3`;
    let cry = new Audio(url);
    cry.volume = 0.2;
    cry.play();
  }

  return (
    <div
      key={props.index}
      className='card'
    >
      <h2 className='card__id'>{`#${props.id}`}</h2>
      {
        isLoading ? (
          <img className='card__spinner' src={spinner} alt='spinner'/>
        ) : null
      }
      <img
        className={'card__img'}
        src={`https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${props.idCallback()}.png?raw=true`}
        alt={props.name}
        onLoad={() => {setIsLoading(false)}}
      />
      <h2 className='card__label'>
        {props.name}
      </h2>
      <div className='card__types'>
      {
        types.map(
          type => (
            <p
              key={type}
              className='card__type'
              style={{ backgroundColor: `#${TYPE_COLOURS[type]}`}}
            >
              {type.toUpperCase()}
            </p>
      ))}
      </div>
      <button
        className='my-btn'
        onClick={(event) => pokemonCry(props.name)}
      >Cry</button>
    </div>
  );
}

export default CardComponent;