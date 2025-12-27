import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = { users: [], sortName: true };
    }

    render() {
        return (
            <div>
                <Grid item xs={12} md={12} lg={12}>
                    <Paper>

                    </Paper>
                </Grid>
            </div>
        )
    }
}

export default Profile;