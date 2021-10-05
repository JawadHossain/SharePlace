import { useState, useCallback, useRef, useEffect } from 'react'

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

    const activeHttpRequests = useRef([]) // value not affected when re rendered. stored.

    // useCallback with no dependencies used to prevent infinite loops when component where used is recreated
    const sendRequest = useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {
            setIsLoading(true)

            const httpAbortCtrl = new AbortController()
            activeHttpRequests.current.push(httpAbortCtrl)

            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                    signal: httpAbortCtrl.signal
                })

                const responseData = await response.json()

                // remove current request from list
                activeHttpRequests.current = activeHttpRequests.current.filter(
                    (reqCtrl) => reqCtrl !== httpAbortCtrl
                )

                if (!response.ok) {
                    throw new Error(responseData.message)
                }
                setIsLoading(false)

                return responseData
            } catch (err) {
                setError(err.message)
                setIsLoading(false)
                throw err
            }
        },
        []
    )

    const clearError = () => {
        setError(null)
    }

    // useEffect cleanup function to abort requests on component Unmount
    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort())
        }
    }, [])

    return { isLoading, error, sendRequest, clearError }
}
