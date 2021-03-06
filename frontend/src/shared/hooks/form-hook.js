import { useCallback, useReducer } from 'react'

const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true
            for (const inputId in state.inputs) {
                // check if input is not undefined
                if (!state.inputs[inputId]) {
                    continue
                }

                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: {
                        value: action.value,
                        isValid: action.isValid
                    }
                },
                isValid: formIsValid
            }
        case 'SET_DATA':
            return {
                inputs: action.inputs,
                isValid: action.formIsValid
            }
        default:
            return state
    }
}

export const useForm = (initialInputs, initialFormValidity) => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity
    })

    // useCallback to prevent function recreation on component re-render
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            inputId: id,
            value: value,
            isValid: isValid
        })
    }, [])

    // Update formState. Helpful when fetching place data for edit
    const setFormData = useCallback((inputData, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity
        })
    }, [])

    return [formState, inputHandler, setFormData]
}
