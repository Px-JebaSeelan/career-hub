import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import UsersList from './components/Users/UsersList'
import Register from './components/Common/Register'
import ProfileEditRecruiter from './components/Common/Profileedit_recruiter'
import ProfileEditApplicant from './components/Common/Profileedit_applicant'
import Navbar from './components/templates/Navbar'
import ApplicantNavbar from './components/templates/Applicant_navbar'
import Profile from './components/Users/Profile'
import Login from './components/Common/Login'
import RecruiterNavbar from './components/templates/Recruiter_navbar';
import AddJob from './components/Common/Add_jobs';
import ViewJobListings from './components/Common/Joblistings';
import ViewJobListingsApplicant from './components/Common/View_job_listings_applicant';
import JobInfo from './components/Common/Job_info';
import MyApplications from './components/Common/my_applications';
import JobApplicationInfo from './components/Common/job_application_info_rec';
import EditJob from './components/Common/Edit-job';
import MyEmployees from './components/Common/my_employees';
import RateApplicant from './components/Common/rate_my_employee';
import Home from './components/Common/Home';
import axios from 'axios';

// Check for token to keep user logged in
if (localStorage.getItem('token')) {
  axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token');
}

class App extends React.Component {
  render() {
    let user_type = localStorage.getItem('user_type');
    let navbar = null;

    if (user_type === "applicant") {
      navbar = <ApplicantNavbar />;
    }
    else if (user_type === "recruiter") {
      navbar = <RecruiterNavbar />;
    }
    else {
      navbar = <Navbar />
    }
    return (
      <Router>
        <div className="container">
          {navbar}
          <br />
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />

          <Route path="/users" exact component={UsersList} />
          <Route path="/profile" component={Profile} />
          <Route path="/profileedit_applicant" component={ProfileEditApplicant} />
          <Route path="/profileedit_recruiter" component={ProfileEditRecruiter} />
          <Route path="/addjob" component={AddJob} />
          <Route path="/edit-job/:id" component={EditJob} />
          <Route exact path="/job-listings" component={ViewJobListings} />
          <Route path="/job-listings/:id" component={JobApplicationInfo} />
          <Route path="/search_job" component={ViewJobListingsApplicant} />
          <Route path="/job_apply/:id" component={JobInfo} />
          <Route path="/my_applications" component={MyApplications} />
          <Route exact path="/my-employees" component={MyEmployees} />
          <Route path="/my-employees/:id" component={RateApplicant} />
        </div>
      </Router>
    );
  }
}

export default App;