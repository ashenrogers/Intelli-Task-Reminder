import React from 'react';
import {Route,Switch} from 'react-router-dom';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Dashboard from '../dashboard/Dashboard';
import Alert from '../layout/Alert'
import PrivateRoute from '../routing/PrivateRoute';
import CreateProfile from '../profile-forms/CreateProfile';
import EditProfile from '../profile-forms/EditProfile';
import Profiles from '../profile/profiles';
import Profile from '../profiles/profile';
import Tasks from '../Tasks/Tasks';
import EditTask from '../Tasks/TaskUpdateForm';
import TaskForm from '../Tasks/TaskForm';
import NotFound from '../layout/notFound';
import VoiceForm from '../Tasks/VoiceForm';
import TaskReport from '../Tasks/TaskReport';
import RecycleBin from '../Tasks/RecycleBin';
import AdminLogin from '../admin/AdminLogin';

const Routes = ()=>{
    return (
            <section className="container">
                <Alert />
                <Switch>
                <Route exact path="/register" component={Register}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/admin" component={AdminLogin}/>
                <Route exact path="/profiles" component={Profiles}/>
                <Route exact path="/profile/:id" component={Profile}/>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
                <PrivateRoute exact path="/edit-profile" component={EditProfile}/>
                <PrivateRoute exact path="/tasks" component={Tasks}/>
                <PrivateRoute exact path="/edit-task/:id" component={EditTask}/>
                <PrivateRoute exact path="/create-task" component={TaskForm}/>
                <PrivateRoute exact path="/voice-task" component={VoiceForm}/>
                <PrivateRoute exact path="/task-report" component={TaskReport}/>
                <PrivateRoute exact path="/recyclebin" component={RecycleBin}/>
                <Route component={NotFound}/>
                </Switch>
            </section>
    )
}

export default Routes;


