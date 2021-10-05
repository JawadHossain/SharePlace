import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react/cjs/react.development'

import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner'
import PlaceList from '../components/PlaceList'

const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState()
    const { isLoading, error, sendRequest, clearError } = useHttpClient()

    const userId = useParams().userId

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/places/user/${userId}`
                )

                setLoadedPlaces(responseData.places)
            } catch (err) {}
        }
        fetchPlaces()
    }, [sendRequest, userId])
    // const loadedPlaces = DUMMY_PLACES.filter(
    //     (place) => place.creator === userId
    // )

    // Remove place to re-render place list
    const placeDeleteHandler = (deletedPlaceId) => {
        setLoadedPlaces((prevPlaces) =>
            prevPlaces.filter((place) => place.id !== deletedPlaceId)
        )
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}

            {!isLoading && loadedPlaces && (
                <PlaceList
                    items={loadedPlaces}
                    onDeletePlace={placeDeleteHandler}
                />
            )}
        </React.Fragment>
    )
}

export default UserPlaces
