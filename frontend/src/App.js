import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom'
import NewPlace from './places/pages/NewPlace'
import UpdatePlace from './places/pages/UpdatePlace'
import UserPlaces from './places/pages/UserPlaces'
import MainNavigation from './shared/components/Navigation/MainNavigation'
import Auth from './users/pages/Auth'
import Users from './users/pages/Users'
import { AuthContext } from './shared/context/auth-context'
import { useAuth } from './shared/hooks/auth-hook'

function App() {
    const { userId, token, login, logout } = useAuth()

    let routes

    if (token) {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users />
                </Route>

                <Route path="/places/new" exact>
                    <NewPlace />
                </Route>

                <Route path="/places/:placeId" exact>
                    <UpdatePlace />
                </Route>

                <Route path="/:userId/places" exact>
                    <UserPlaces />
                </Route>

                <Redirect to="/" />
            </Switch>
        )
    } else {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users />
                </Route>

                <Route path="/:userId/places" exact>
                    <UserPlaces />
                </Route>

                <Route path="/auth" exact>
                    <Auth />
                </Route>

                <Redirect to="/auth" />
            </Switch>
        )
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                token: token,
                userId: userId,
                login: login,
                logout: logout
            }}
        >
            <Router>
                <MainNavigation />
                <main>{routes}</main>
            </Router>
        </AuthContext.Provider>
    )
}

export default App
