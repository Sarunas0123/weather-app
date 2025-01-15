/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState} from 'react';
import './App.css'


const KEY = '00b476b4346a4f99a2d100453240312';
const BASE_URL = 'http://api.weatherapi.com/v1/';
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Post {
  location: {
    country: string;
    name?: string | number;
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
    if (!country) return;

    const fetchPosts = async () =>{
      setIsLoading(true);
      setError('');

      try{
        const response = await fetch(`${BASE_URL}/forecast.json?key=${KEY}&q=${country}&aqi=no&days=7`);
        const data = await response.json();

        if (data.error) {
          setError(data.error.message); // Handle API errors
          setPost(null);
        } else {
          setPost(data);
        }
      } 
      catch (e: any){
        setError(e.message || "Somethig went wrong, please try again!");
      }
      finally {
      setIsLoading(false);
      }

      console.log(post);
      

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
        <input name="text" className="input" type="text" value={input} onChange={handleOnChange}></input>
        <button onClick={handleOnClick} className="button" type="submit" >submit</button>
      </div>
      {error && <div className="error">{error}</div>}
      
      {post &&(
        <div>
          <div className="country-title">
          <h2>{post.location.name}</h2>
          <h3>{post.location.country}</h3>
          </div>
          <div className="week-container">
              {post && post.forecast.forecastday.map((value) =>{
                return (
                <div className="week-day" key={value.date}>
                  <h4 className="box-title">{weekdays[new Date(value.date).getDay()]}</h4>
                  <img src={value.day.condition.icon}></img>
                  <h5 className="box-temp">{Math.round(value.day.avgtemp_c)} °C</h5>
                  <h6 className="bpx-forecast">{value.day.condition.text}</h6>
                </div>
              )})}
          </div>
        </div>
      )}
      
    </div>
);
}
