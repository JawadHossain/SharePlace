import React, { useEffect, useState } from 'react'

import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner'
import UsersList from '../components/UsersList'
import { useHttpClient } from '../../shared/hooks/http-hook'

const Users = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [loadedUsers, setLoadedUsers] = useState()

    useEffect(() => {
        // useEffect doesn't recommend using async fuction, hence this
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users'
                )
                setLoadedUsers(responseData.users)
            } catch (err) {}
        }
        fetchUsers()
    }, [sendRequest])

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner asOverlay />
                </div>
            )}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
        </React.Fragment>
    )
}

export default Users
