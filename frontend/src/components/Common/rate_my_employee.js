import React, { Component } from 'react';
import axios from 'axios';
import API_URL from '../../api_config';

export default class Rate_applicant extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rating: 5,
        }
        this.onChangerating = this.onChangerating.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangerating(event) {
        this.setState({ rating: event.target.value });
    }

    componentDidMount() {
        // Did mount logic was empty/logging or calling broken routes in original
    }

    async onSubmit(e) {
        e.preventDefault();

        // Check if user is logged in?
        const applicantEmail = this.props.match.params.id;

        try {
            // First get current rating data
            const res = await axios.post(API_URL + '/applicant/get_an_applicant_by_email', { applicant_ka_email: applicantEmail });

            let ratecount = res.data.rate_count || 0;
            let rate = res.data.rating || 0;

            // Calculate new rating average
            let newrating = ((rate * ratecount) + parseInt(this.state.rating)) / (ratecount + 1);

            // Update rating
            const doupdate = {
                email: applicantEmail,
                rate_count: ratecount + 1,
                rating: newrating
            };

            await axios.post(API_URL + '/applicant/rate_an_applicant', doupdate);
            alert("Rating submitted successfully!");
            this.props.history.push('/my-employees');

        } catch (err) {
            console.error("Error rating applicant:", err);
            alert("Error submitting rating");
        }
    }


    render() {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
                <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '500px' }}>
                    <h2 style={{ textAlign: 'center' }}>Rate Employee</h2>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Rating (0-5): </label>
                            <select className="form-input" onChange={this.onChangerating} value={this.state.rating}>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <input type="submit" value="Submit Rating" className="btn-primary" style={{ width: '100%' }} />
                        </div>
                    </form>
                </div>

                <style>{`
                   .form-group {
                       margin-bottom: 1rem;
                   }
                   .form-input {
                       width: 100%;
                       padding: 0.5rem;
                       border-radius: var(--radius-md);
                       border: 1px solid var(--border);
                   }
               `}</style>
            </div>
        )
    }
}
