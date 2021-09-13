import React from 'react'
import UsersList from '../components/UsersList'

const Users = () => {
    const USERS = [
        {
            id: 'u1',
            name: 'Jawad Hossain',
            image: 'https://images.unsplash.com/photo-1631466266525-53e979c9e29b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80',
            places: 3
        }
    ]

    return <UsersList items={USERS} />
}

export default Users
