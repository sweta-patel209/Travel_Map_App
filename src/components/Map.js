import React, { useState, useEffect } from 'react'
import axios from 'axios';
import {
  withScriptjs,
  useLoadScript,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "@react-google-maps/api";
import StarRateIcon from '@material-ui/icons/StarRate';
//components
import Register from './User/Register';
import Login from './User/Login';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh'
}

const options = {
  disableDefaultUI: true,
  zoomControl: true
}

const Map = (props) => {
  //const currentUser = "";
  const[currentUser,setCurrentUser] = useState(null)
  const [selected, setSelected] = useState('')
  const [pins, setPins] = useState([])
  const [newPin, setNewPin] = useState(null)
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [rating, setRating] = useState(0);
  const [center, setCenter] = useState({
    lat: 48.8584,
    lng: 2.2945
  })

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAP_KEY,
    libraries: ["places"]
  })
  const [marker, setMarker] = useState({
    lat: 46,
    lng: 17
  })

  useEffect(() => {
    const getAllPins = async () => {
      try {
        const res = await axios.get('/pins')
        setPins(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getAllPins();
  }, [])
  useEffect(() => {
    setMarker({ lat: center.lat, lng: center.lng })
  }, [center])

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  const markerClick = (value) => {
    //set infowindow properties
    setSelected({
      id: value._id,
      lat: value.lat,
      lng: value.long

    })
    //to recenter the map 
    setCenter({
      lat: value.lat,
      lng: value.long
    })
    setCurrentPlaceId(value._id)
  }

  const addNewPin = (e) => {
    console.log(e.latLng.lat())
    console.log(e.latLng.lng())
    setNewPin({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    })

  }

  const InfoWindowCloseEvent = (value) => {
    setSelected(null)
  }

  const newPinSubmit = async (e) => {
    e.preventDefault();
    console.log('++++', newPin)
    const newPinObj = {
      username: currentUser.username,
      title: title,
      desc: desc,
      rating: rating,
      lat: parseFloat(newPin.lat),
      long: parseFloat(newPin.lng)
    }
    //we will post this object to add new pin in database
    try {
      //check proxy in package.json to know backend URL
      console.log('+++++++',newPinObj)
      let res = await axios.post("/pins", newPinObj)
      console.log(res)
      setPins([...pins, res.data])
      setNewPin(null)

    } catch (err) {
      console.log(err)
    }
  }

  const showRegisterForm = () => {
    setShowRegister(true)
  }

  const showLoginForm = () => {
    setShowLogin(true)
  }

  const registerCloseClick = () => {
    setShowRegister(false)
  }

  const loginCloseClick = () => {
    setShowLogin(false)
  }
  return (
    <div>
      {currentUser ? <div className='buttonContainer'>
        <div>Welcome {currentUser.username}</div>
        <button className='button logout' onClick={()=>setCurrentUser(null)}>Logout</button>
      </div>
        :
        <div className='buttonContainer'>
          <button className='button login' onClick={showLoginForm}>Login</button>          
          <button className='button register' onClick={showRegisterForm}>Register</button>
        </div>}

        { showRegister && <div className='registerContainer'>
         <Register registerCloseClick={registerCloseClick} setCurrentUser={setCurrentUser} />
         </div> }
        
         { showLogin && <div className='registerContainer'>
         <Login loginCloseClick={loginCloseClick} setCurrentUser={setCurrentUser} />
         </div> }

      <GoogleMap mapContainerStyle={mapContainerStyle}
        zoom={4}
        center={center}
        options={options}
        onDblClick={addNewPin}

      >
        {pins?.map((pin, index) => (
          <>
            {/* {console.log('+++++++++++',pin)} */}
            <>
              <Marker key={index} position={{ lat: pin.lat, lng: pin.long }}
                icon={{
                  // url: './marker.png',
                  url: pin?.username === currentUser?.username ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png" : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15) // this will start icon exact on click not above
                }}
                onClick={() => markerClick(pin)}
              />
            </>

            {currentPlaceId === pin._id ?
              (<InfoWindow
                position={{ lat: pin?.lat, lng: pin?.long }}
                onCloseClick={() => InfoWindowCloseEvent()}
              >
                <div className='card'>
                  <label>Place</label>
                  <h4 className="place">{pin.title}</h4>
                  <label>Review</label>
                  <p className="desc">{pin.desc}</p>
                  <label>Rating</label>
                  <div className="stars">

                    {Array(pin.rating).fill(<StarRateIcon className="star" />)}

                  </div>
                  <label>Information</label>
                  <span className='username'>Created By <b>{pin.username}</b> </span>
                  <span className='date'>{pin.createdAt} </span>
                </div>
              </InfoWindow>
              ) : null

            }
          </>
        ))

        }
        {console.log('NEW PIN', newPin)}
        {newPin &&
          <>
            <Marker position={{ lat: newPin.lat, lng: newPin.lng }}
              icon={{
                url: './marker.png',
                scaledSize: new window.google.maps.Size(30, 30),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15) // this will start icon exact on click not above
              }}
            // onClick={()=>markerClick(pin)}
            />
            <InfoWindow position={{ lat: newPin?.lat, lng: newPin?.lng }}
              onCloseClick={() => setNewPin(null)}>
              <>
                <form onSubmit={newPinSubmit}>
                  <label>Title</label>
                  <input placeholder='enter a title' onChange={(e) => setTitle(e.target.value)} />
                  <label>Review</label>
                  <textarea placeholder='say something abt this place' onChange={(e) => setDesc(e.target.value)} />
                  <label>Rating</label>
                  <select onChange={(e) => setRating(e.target.value)}>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                  </select>
                  <button className="submitButton" type='submit'>Add</button>
                </form>
              </>
            </InfoWindow>
          </>

        }

      </GoogleMap>

    </div>
  )
}



export default Map
