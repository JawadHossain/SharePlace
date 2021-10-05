import React, { useState, useContext } from 'react'

import { AuthContext } from '../../shared/context/auth-context'
import Button from '../../shared/components/FormElements/Button'
import Input from '../../shared/components/FormElements/Input'
import Card from '../../shared/components/UIElements/Card/Card'
import ErroModal from '../../shared/components/UIElements/ErrorModal/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner'

import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'

import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from '../../shared/util/validators'

import './Auth.css'

const Auth = () => {
    const auth = useContext(AuthContext)
    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            }
        },
        false
    )
    const [isLoginMode, setIsLoginMode] = useState(true)

    const { isLoading, error, sendRequest, clearError } = useHttpClient()

    const authSubmitHandler = async (event) => {
        event.preventDefault()

        if (isLoginMode) {
            // log in
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                )
                auth.login(responseData.user.id)
            } catch (err) {}
        } else {
            // sign up
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/signup',
                    'POST',
                    JSON.stringify(
                        {
                            name: formState.inputs.email.value,
                            email: formState.inputs.email.value,
                            password: formState.inputs.password.value
                        },
                        {
                            'Content-Type': 'application/json'
                        }
                    )
                )

                auth.login(responseData.user.id)
            } catch (err) {}
        }
    }

    const switchModeHandler = () => {
        if (!isLoginMode) {
            // will switch to login mode so remove name
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined
                },
                formState.inputs.email.isValid &&
                    formState.inputs.password.isValid
            )
        } else {
            // will switch to sign up mode so add name
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: '',
                        isValid: false
                    }
                },
                false
            )
        }

        setIsLoginMode((prevMode) => !prevMode)
    }

    return (
        <React.Fragment>
            <ErroModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner asOverlay />
                </div>
            )}
            <Card className="authentication">
                <h2>Login Required</h2>
                <hr />

                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                            element="input"
                            id="name"
                            type="text"
                            label="Your Name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a name."
                            onInput={inputHandler}
                        />
                    )}

                    <Input
                        element="input"
                        id="email"
                        type="email"
                        label="E-mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email address."
                        onInput={inputHandler}
                    />

                    <Input
                        element="input"
                        id="password"
                        type="password"
                        label="password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password, at least 6 characters."
                        onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button>
                </form>

                <Button inverse onClick={switchModeHandler}>
                    SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
                </Button>
            </Card>
        </React.Fragment>
    )
}

export default Auth
