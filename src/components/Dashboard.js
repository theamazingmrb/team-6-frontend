import React, {useState, useEffect, useRef} from 'react'
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import { getFavorites, getHistory, getPrimaryLocation, editPrimary } from '../services/user.service'
import { getCurrentUser } from '../services/auth.service'
import Statistics from './Statistics'
      
const Dashboard = () => {
    const form = useRef()
    const [currentUser, setCurrentUser] = useState(undefined)
    const [userDashboard, setUserDashboard] = useState(undefined)
    const [searchHistory, setSearchHistory] = useState(undefined)
    const [primaryLocation, setPrimaryLocation] = useState(undefined)

    useEffect(()=> {
        const user = getCurrentUser()
        if(user) {
          setCurrentUser(user)
          getFavorites().then(favorites => setUserDashboard(favorites))
          getHistory().then(history => setSearchHistory(history))
          getPrimaryLocation().then(location => setPrimaryLocation(location))
        }
      }, [])

    const handleSubmit = (event) => {
        event.preventDefault()
        let user = currentUser.id
        
        let id = (event.target.id.value)
        let city = (event.target.city.value)
        let userState = (event.target.userState.value)
        let country = (event.target.country.value)
        let county = (event.target.county.value)

        editPrimary(user,id,city,userState,country,county)
        .then(response => {
            console.log(response.data)
        })
        .catch(err => console.log(err))

        window.location.reload()
    }

    return(
        <>
        {currentUser ? (
        <div>
            <h1>Dashboard - {currentUser.username}</h1>
            {primaryLocation ? (
                <div>
                    <h3>My Primary Location</h3>
                    <div>
                        <h4>{primaryLocation.city}, {primaryLocation.state} - {primaryLocation.country}</h4>
                    </div>
                </div>
            ) : (
                <div>No Primary Location set</div>
            )}
        </div>
        ) : (
            <div>Loading...</div>
        )}
        {userDashboard ? (
        <div>
            {/* {console.log(userDashboard)} */}
            {userDashboard.length > 0 ? (
                <div>
                <h2>My Locations</h2>
                <div>
                    {userDashboard.map(favorite=> (
                        <div key={favorite._id}>
                            <h4>{favorite.city}, {favorite.state} - {favorite.country}</h4>
                            <Form onSubmit={handleSubmit} ref={form}>
                                <Input 
                                    type='hidden'
                                    value={favorite._id}
                                    name='id'
                                />
                                <Input 
                                    type='hidden'
                                    value={favorite.city}
                                    name='city'
                                />
                                <Input 
                                    type='hidden'
                                    value={favorite.state}
                                    name='userState'
                                />
                                <Input 
                                    type='hidden'
                                    value={favorite.country}
                                    name='country'
                                />
                                <Input 
                                    type='hidden'
                                    value={favorite.county}
                                    name='county'
                                />
                                <Input 
                                    type='submit'
                                    value='Set as Primary Location'
                                    name='submit'
                                />
                            </Form>
                        </div>
                    ))}
                </div>
                </div>
            ) : (
                <div>No Favorites to Display!</div>
            )}
        </div>
        ) : (
            <div>Loading...</div>
        )}
        {searchHistory ? (
        <div>
            Search History
            {/* {console.log(searchHistory)} */}
            {searchHistory.length > 0 ? (
                <div>
                <ul>
                    {searchHistory.map((history, index)=> (
                        <li key={index}>{history.city}, {history.state}, {history.country}</li>
                    ))}
                </ul>
                </div>
            ) : (
                <div>No Search History to Display!</div>
            )}
        </div>
        ) : (
            <div>Loading...</div>
        )}
        <Statistics />

        </>

    )
}

export default Dashboard