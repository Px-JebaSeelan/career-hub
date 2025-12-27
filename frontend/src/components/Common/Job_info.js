import React, { Component } from 'react';
import axios from 'axios';
import API_URL from '../../api_config';

export default class Job_info extends Component {

    constructor(props) {
        super(props);

        this.state = {
            applied_jobs: [],
            job: [],
            currentjob: [],
            sop: '',
            isApplied: false,
            status: 'not applied',
            applicant_data: null,
        }
        this.onChangesop = this.onChangesop.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangesop(event) {
        this.setState({ sop: event.target.value });
    }

    componentDidMount() {
        if (localStorage.getItem('user_type') !== "applicant" && localStorage.getItem("isloggedin") !== true) {
            alert("please log in");
        }
        else {
            // Check if application exists
            axios.post(API_URL + '/application/app_p_or_n', { id: this.props.match.params.id, applicant_email: localStorage.getItem("user_email") })
                .then(res => {
                    if (res.data && res.data.length > 0) {
                        this.setState({ isApplied: true });
                    }
                })
                .catch(err => {
                    console.log(err);
                });

            // Get Job
            axios.post(API_URL + '/job/get_a_job_by_id', { id: this.props.match.params.id })
                .then(res => {
                    this.setState({ job: res.data });
                })
                .catch(err => {
                    console.log(err)
                });

            // Get Applicant Data
            const applicant_ka_data = {
                applicant_ka_email: localStorage.getItem("user_email")
            }
            axios.post(API_URL + '/applicant/get_an_applicant_by_email', applicant_ka_data)
                .then(res => {
                    this.setState({ applicant_data: res.data });
                })
                .catch(err => {
                    console.log(err)
                });
        }
    }

    async onSubmit(e) {
        e.preventDefault();

        //         this.setState({lololol: true});
        //     })
        //     .catch(err =>
        //         {
        //             // if(err.response.data.message)
        //             // alert(err.response.data.message);
        //             console.log(err)
        //         });
        var veer = true;

        if (this.state.sop.split(' ').length > 250) {
            window.alert("word limit crossed");
            veer = false;
        }
        else if (veer && this.state.sop === '') {
            window.alert("enter statement of purpose");
        }
        else if (this.state.applicant_data.application_count > 20) {
            alert("max application limit reached");
        }
        else {




            const yoyo = {
                sop: this.state.sop,
                email_recruiter: this.state.job.email_recruiter,
                name_recruiter: this.state.job.name_recruiter,
                deadline_of_application: this.state.job.deadline_of_application,
                job_salary_per_month: this.state.job.salary_per_month,
                status_of_job: this.state.job.status,
                job_id: this.state.job._id,
                applicant_email: localStorage.getItem("user_email"),
                status: "applied",
                job_title: this.state.job.title,
                name_applicant: localStorage.getItem("user_name"),
                skills: this.state.applicant_data.list_of_languages,
                education: this.state.applicant_data.education,
                job_type: this.state.job.type_of_job,
                rating: this.state.applicant_data.rating,
            }
            console.log(yoyo);
            await axios.post(API_URL + '/application/addapplication', yoyo)
                .then(res => {
                    console.log(res.data);
                    // this.setState({jobs: res.data});

                })
                .catch(err => {
                    console.log(err)
                });


            await axios.post(API_URL + '/applicant/increment_application_count', { email: localStorage.getItem("user_email") })
                .then(res => {
                    console.log(res.data);
                    // this.setState({jobs: res.data});

                })
                .catch(err => {

                    console.log(err)
                });

            this.setState({
                sop: ''
            });
            this.props.history.push('/search_job');
        }
    }

    // apply_job(e){
    //     const datadata = {
    //         applicant_email: localStorage.getItem('user_email'),
    //         recruiter_email: this.state.job.email_recruiter,
    //         job_id: this.props.match.params.id,

    //     }
    //     const u = this.props.match.params.yoyo;
    //     console.log(u)
    // }

    // componentDidMount() {
    //     const u = this.props.match.params.yoyo;
    //     console.log(u)
    // }

    render() {

        return (

            <div>
                {/* {
                    const kaha_jana = {
                        pathname: "/search_job"
                    }
                } */}
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Statement of Purpose (SOP): </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.sop}
                            onChange={this.onChangesop}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="submit"
                            value={this.state.isApplied ? "Applied" : "Apply"}
                            className="btn btn-primary"
                            disabled={this.state.isApplied}
                        />
                    </div>
                </form>
            </div>
        )


    }
}
