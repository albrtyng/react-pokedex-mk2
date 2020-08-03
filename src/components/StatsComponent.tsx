import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProgressBar } from 'react-bootstrap';
import '../styles/StatsComponent.css';

interface Props {
  id: number,
  idCallback: Function
}

const StatsComponent = (props: Props) => {
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [stats, setStats] = useState<{[key: string]: number}>({
    hp: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    'special-attack': 0,
    'special-defense': 0
  });

  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${props.id}/`)
    .then(response => {
      setHeight(Math.round((response.data.height * 0.328084 + 0.00001) * 100) / 100);
      setWeight(Math.round((response.data.weight * 0.220462 + 0.00001) * 100) / 100);
      response.data.stats.forEach((stat: any) => {
        setStats(stats => ({
          ...stats,
          [stat.stat.name]: stat.base_stat
        }));
      });
    })
  }, [props.id]);

  useEffect(() => {}, [stats]);

  return (
    <div className='stats'>
      <div className='stats__stat'>
        <h2 className='stats__label'>height</h2>
        <p>{height} ft</p>
      </div>
      <div className='stats__stat'>
        <h2 className='stats__label'>weight</h2>
        <p>{weight} lbs</p>
      </div>
      {
        Object.keys(stats).map(key => (
          <div key={key} className='stats__stat'>
            <h2 className='stats__label'>{key}</h2>
            <ProgressBar striped now={stats[key]} style={{flexGrow: 1}}/>
          </div>
        ))
      }
    </div>
  )
}

export default StatsComponent;
