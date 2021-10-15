import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useContext } from 'react/cjs/react.development'

import Button from '../../shared/components/FormElements/Button'
import Input from '../../shared/components/FormElements/Input'
import Card from '../../shared/components/UIElements/Card/Card'
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from '../../shared/util/validators'

import './PlaceForm.css'

const UpdatePlace = () => {
    const auth = useContext(AuthContext)
    const history = useHistory()

    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [loadedPlace, setLoadedPlace] = useState()

    const placeId = useParams().placeId

    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        },
        false
    )

    // Fetch place details
    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/places/${placeId}`
                )

                setLoadedPlace(responseData.place)

                setFormData(
                    {
                        title: {
                            value: responseData.place.title,
                            isValid: true
                        },
                        description: {
                            value: responseData.place.description,
                            isValid: true
                        }
                    },
                    true
                )
            } catch (err) {}
        }
        fetchPlace()
    }, [sendRequest, placeId, setFormData])

    // Update Place
    const placeUpdateSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            await sendRequest(
                `http://localhost:5000/api/places/${placeId}`,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.token}`
                }
            )

            history.push(`/${auth.userId}/places`)
        } catch (err) {}
    }

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        )
    }

    if (!loadedPlace && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        )
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && (
                <form
                    className="place-form"
                    onSubmit={placeUpdateSubmitHandler}
                >
                    <Input
                        id="title"
                        element="input"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid title."
                        onInput={inputHandler}
                        initialValue={loadedPlace.title}
                        initialIsValid={true}
                    />
                    <Input
                        id="description"
                        element="textarea"
                        label="Description"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid description (at least 5 characters)."
                        onInput={inputHandler}
                        initialValue={loadedPlace.description}
                        initialIsValid={true}
                    />

                    <Button type="submit" disabled={!formState.isValid}>
                        UPDATE PLACE
                    </Button>
                </form>
            )}
        </React.Fragment>
    )
}

export default UpdatePlace
