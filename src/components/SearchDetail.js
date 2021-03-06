import React, {useState, useEffect, useRef} from 'react'
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import { useParams, Link } from 'react-router-dom'
import { getOneLocation } from '../services/location.services'
import { addFavorite, getFavorites, removeFavorite } from '../services/user.service'
import { getCurrentUser } from '../services/auth.service'

import Statistics from './Statistics'
import '../css/SearchDetail.css'

const SearchDetail = () => {
    const form = useRef()
    const [location, setLocation] = useState('')
    const [currentUser, setCurrentUser] = useState(undefined)
    const [favoriteLocations, setFavoriteLocations] = useState([])
    const [message, setMessage] = useState('')
    let { id } = useParams()

    useEffect(() => {
        getOneLocation(id).then(response => {
            setLocation(response.data)
            },
            (error) => {
                setMessage(error)
                setLocation(error)
            }
        )
        const user = getCurrentUser()
        if(user) {
            setCurrentUser(user)
            getFavorites().then(favorites => {
                setFavoriteLocations(favorites)
            },
            (error) => {
                setMessage(error)
                setFavoriteLocations(error)
            })
        }
    },[])

    const handleAddFavorite = e => {
        e.preventDefault()
        let user = currentUser.id
        let id = e.target.id.value

        addFavorite(user,id)
        .then(response => {
            // console.log(response.data)
            setMessage(response.data)
            window.location.reload()
        })
        .catch(err => setMessage(err))
    }

    const handleRemove = event => {
        event.preventDefault()
        let user = currentUser.id
        let id = (event.target.id.value)

        removeFavorite(user, id)
        .then(response => {
            // console.log(response.data)
            setMessage(response.data)
            window.location.reload()
        })
        .catch(err => setMessage(err))
    }

    return(
        <div className='main container'>
            {location ? (
                <div className='row header-container'>
                    <h3>{location.city}, {location.state} - {location.country}</h3>
                    {currentUser ? (
                        <>
                        {(favoriteLocations.length > 0 && favoriteLocations.some(existing => existing._id === location._id)) ? (
                            <Form ref={form} onSubmit={handleRemove}>
                                <Input type='hidden' value={location._id} name='id'/>
                                <Input type='submit' value='Remove from Favorite Locations' name='submit' className='waves-effect waves-light btn'/>
                            </Form>
                        ) : (
                            <Form ref={form} onSubmit={handleAddFavorite}>
                                <Input type='hidden' value={location._id} name='id'/>
                                <Input type='submit' value='Add to Favorite Locations' name='submit' className='waves-effect waves-light btn'/>
                            </Form>
                        )}
                        </>
                    ) : (
                        <div><Link to='/login'>Login</Link> or <Link to='/register'>Register</Link> to add to favorite locations!</div>
                    )}
                    <div className='row back-container'>
                        <Link to='/search' className='waves-effect waves-teal btn-flat'>Back to Map</Link>
                    </div>
                </div>
            ) : (
                <div className='progress'>
                    <span className='indeterminate'></span>
                </div>
            )}
            <div className='row statistics-container'>
                <Statistics
                    newCountry={location.country}
                    newCounty={location.county}
                    newRegion={location.state}
                />
            </div>
        </div>
    )
}

export default SearchDetail