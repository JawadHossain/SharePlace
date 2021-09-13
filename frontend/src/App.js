import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom'
import NewPlace from './places/pages/NewPlace'
import UserPlaces from './places/pages/UserPlaces'
import MainNavigation from './shared/components/Navigation/MainNavigation'
import Users from './users/pages/Users'

function App() {
    return (
        <Router>
            <MainNavigation />
            <main>
                {/* Switch instructs react router that inside this switch block whenever
                    it encouters a fitting path it should not evaluate the lines thereafter to prevent
                    unwanted redirects*/}
                <Switch>
                    <Route path="/" exact>
                        <Users />
                    </Route>

                    <Route path="/places/new" exact>
                        <NewPlace />
                    </Route>

                    <Route path="/:userId/places" exact>
                        <UserPlaces />
                    </Route>

                    <Redirect to="/" />
                </Switch>
            </main>
        </Router>
    )
}

export default App
