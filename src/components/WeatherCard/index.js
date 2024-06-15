import {Component} from 'react'
import {Circles} from 'react-loader-spinner'
import './index.css'

const apiKey = 'f5ede61086f4d40c959379a6908f0c40'

class WeatherCard extends Component{

  state = {pinCode:'',zipCode:'',countryCode:'IN',lat:'',lon:'',weatherData:'',isLoading:true,lightTheme:true,errMsg:'',isError:false}

  componentDidUpdate(prevProps,prevState){
    if(prevState.zipCode !== this.state.zipCode){
        this.getGeoLocation()
    }
    if(prevState.lat !== this.state.lat || prevState.lon !== this.state.lon){
        this.getWeatherReport()
    }
  }

  getGeoLocation = async ()=>{
    this.setState({isLoading:true})
    const {zipCode,countryCode} = this.state
    const api = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${apiKey}`
    const response = await fetch(api)   
    if(response.ok){
      const data = await response.json()
      this.setState({countryCode:data.country,lat:data.lat,lon:data.lon,isLoading:false,errMsg:'',isError:false})
    }else{
        this.setState({isLoading:false,errMsg:"Enter Valid Zipcode",isError:true,weatherData:'',lat:'',lon:''})
    }
  }

  getWeatherReport = async ()=>{
    this.setState({isLoading:true})
    const{lat,lon} =  this.state
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    const response = await fetch(api)
    if(response.ok){
      const data = await response.json()
      this.setState({weatherData:data,isLoading:false})
    }else{
        this.setState({isLoading:false})
    }
  }

  onEnterPincode = (event)=>{
    this.setState({pinCode:event.target.value})
  }

  onPressEnter = (event)=>{
    if(event.key === 'Enter'){
        this.setState({zipCode:this.state.pinCode})
    }
  }

  onClickGetreport = ()=>{
    this.setState({zipCode:this.state.pinCode})
  }

  getCurrentDateTime = () => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
    return date.toLocaleDateString('en-US', options);
  };

  onClickTheme = ()=>{
    const{lightTheme } = this.state
    this.setState({lightTheme:!lightTheme})
  }

  formatTemperature = (kelvin) => (kelvin - 273.15).toFixed(2);

  onSuccessLoad = ()=>{
    const {isLoading,weatherData} = this.state
    if(isLoading){
        return <div className="loader-container" data-testid="loader">
        <Circles color="#ffffff" height="80" width="80" />
      </div>
    }
    const { main, name, weather, wind, sys } = weatherData;
    const { temp, feels_like, pressure, humidity, temp_min, temp_max } = main;
    const { icon, description } = weather[0];
    const { country, sunrise, sunset } = sys;
    const { speed, deg } = wind;

    return (
        <>
            <h1 className="title">Weather Report for {name}, {country}</h1>
            <p className="dateTime">{this.getCurrentDateTime()}</p>
            <div className='card1'>
                <div className="weatherMain">
                    <img className="weatherIcon" src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={description} />
                    <div>
                        <p className="temperature">{this.formatTemperature(temp)}°C</p>
                        <p className="weatherDescription">{description}</p>
                        <p className="feelsLike">Feels Like: {this.formatTemperature(feels_like)}°C</p>
                    </div>
                </div>
                <div className='pressureCard'>
                    <p className='pressure'>Pressure: {pressure} hPa</p>
                    <p className='pressure'>Humidity: {humidity}%</p>
                    <p className='pressure'>Wind Speed: {speed} m/s</p>
                    <p className='pressure'>Wind Direction: {deg}°</p>
                </div>
            </div>
            <hr className='weatherDetailsLine'/>
            <div className="weatherDetails">
                <p className='additionalData'>Min Temperature: {this.formatTemperature(temp_min)}°C</p>
                <p className='additionalData'>Max Temperature: {this.formatTemperature(temp_max)}°C</p>
                <p className='additionalData'>Sunrise: {new Date(sunrise * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}</p>
                <p className='additionalData'>Sunset: {new Date(sunset * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}</p>
            </div>
      </>
    );
  }


  render(){
    const{weatherData,lightTheme,errMsg,isError} = this.state
    return(
      <div className={`bgContainer ${!lightTheme && 'darkTheme'}`}>
        <div className='pincodeCard'>
            <label>ZIP CODE</label>
            <input className='inputEle' onKeyDown={this.onPressEnter} onChange={this.onEnterPincode} placeholder='Enter Pincode Here' type='text'/>
            {isError && <p>{errMsg}</p>}
            <div>
                <button onClick={this.onClickGetreport} className='getReportBtn' type='button'>Get Report</button>
                <button onClick={this.onClickTheme} className='getReportBtn' type='button'>{`${lightTheme ? "Dark":"Light"}`}</button>
            </div>
          </div>
        <div className='weatherCard'>
          {
            weatherData === "" ? 
            <h1>No Results.</h1>
             : 
            this.onSuccessLoad()
          }
        </div>
      </div>
    )
  }
}

export default WeatherCard