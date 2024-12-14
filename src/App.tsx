/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import './App.css'

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



export default function App() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [country, setCountry] = useState<string>("London");
  const [input, setInput] = useState<string>("");

  useEffect(() =>{
    const fetchPosts = async () =>{
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
      
      console.log(post);

    };
    console.log(post);
    fetchPosts();
  }, [country]);

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Semething went wrong! please try again.</div>
  }
  if (error == "400") {
    <div>
      <input className="input" type="text" value={input} onChange={handleOnChange}></input>
      <button onClick={handleOnClick} className="button">Search</button>)
    </div>
  }
  if (!post) {
    return <div>No weather data awailable</div>
  }
  function handleOnChange(event: any){
    setInput(event.target.value);
  }

  function handleOnClick() {
    setCountry(input);
    setInput("");
  }
  function handleWeekdays(day: any){
    const d = new Date(day);
    const x = d.getDay();
    return x;
  }

  return (
    <div>
      <div className="search-bar">
        <input className="input" type="text" value={input} onChange={handleOnChange}></input>
        <button onClick={handleOnClick} className="button">Search</button>
        <h2>{post.location.name}</h2>
        <h3>{post.location.country}</h3>
      </div>
      <div className="week-container">
        {post && post.forecast.forecastday.map((value, index) =>{
          return (
          <div className="week-day" key={index}>
            <h4>{weekdays[handleWeekdays(value.date)]}</h4>
            <img src={value.day.condition.icon}></img>
            <h5>{Math.round(value.day.avgtemp_c)} °C</h5>
            <h6>{value.day.condition.text}</h6>
          </div>
        )})}
      </div>
    </div>
  );
}
