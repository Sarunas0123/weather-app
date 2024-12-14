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
    forecastday: forecastDay[];
  }
}

interface forecastDay {
  date: string;
  avgtemp_c: number;
  day: {
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
  },[country]);

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Semething went wrong! please try again.</div>
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
  function handleWeekdays(day){
    const d = new Date(day);
    const x = d.getDay();
    return x;
  }

  return (
    <div>
      <div>
        <input type="text" value={input} onChange={handleOnChange}></input>
        <button onClick={handleOnClick}>Click me!</button>
      </div>
      <div>
        {post && post.forecast.forecastDay.map()}
      </div>
    </div>
  );
}
