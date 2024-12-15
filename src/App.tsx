/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './App.css'

<script src="https://kit.fontawesome.com/f36a1192d8.js" crossOrigin="anonymous"></script>

const KEY = '00b476b4346a4f99a2d100453240312';
const BASE_URL = 'http://api.weatherapi.com/v1/';
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Post {
  location: {
    country: string;
    name: string;
  }
  forecast: {
    forecastday: ForecastDay[];
  }
}

interface ForecastDay {
  date: string;
  day: {
    avgtemp_c: number;
    condition: {
      icon: string;
      text: string;
    }

  }
}



export default function App():any {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [country, setCountry] = useState<string>("");
  const [input, setInput] = useState<string>("");


  useEffect(() =>{
    const fetchPosts = async () =>{
      if (!country) return;
      setIsLoading(true);

      try{
        const response = await fetch(`${BASE_URL}/forecast.json?key=${KEY}&q=${country}&aqi=no&days=7`);
        const data = await response.json();
        setPost(data);
      } 
      catch (e: any){
        setError(e.message || "Somethig went wrong, please try again!");
      }
      finally {
      setIsLoading(false);
      }
      

    };
    fetchPosts();
    
  }, [country]);

  if (isLoading) {
    return <div>Loading...</div>
  }
  function handleOnChange(event: any){
    setInput(event.target.value);
  }

  function handleOnClick() {
    setCountry(input);
    setInput("");
  }

  return (
    <div>
      <div className="search-bar">
        <input className="input" type="text" value={input} onChange={handleOnChange}></input>
        <button onClick={handleOnClick} className="button" type="submit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg></button>
      </div>
      {error && <div className="error">{error}</div>}
      {post &&(
        <div>
          <div className="country-title">
          <h2>{post.location.name}</h2>
          <h3>{post.location.country}</h3>
          </div>
          <div className="week-container">
              {post && post.forecast.forecastday.map((value, index) =>{
                return (
                <div className="week-day" key={index}>
                  <h4>{weekdays[new Date(value.date).getDay()]}</h4>
                  <img src={value.day.condition.icon}></img>
                  <h5>{Math.round(value.day.avgtemp_c)} °C</h5>
                  <h6>{value.day.condition.text}</h6>
                </div>
              )})}
          </div>
        </div>
      )}
      
    </div>
);
}
