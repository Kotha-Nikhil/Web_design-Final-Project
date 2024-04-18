import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import { fetch } from './../utils/fetchData'

const Admin = () => {

  return (
    <div>
      <div style={{ paddingTop: '30px', paddingBottom: '30px' }}>
        <Box sx={{ paddingX: '30px' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" fontWeight="bold" sx={{ color: "#222", marginBottom: "5px" }}>DASHBOARD</Typography>
            <Typography variant="h6" sx={{ color: "#DC143C", marginRight: "30px" }}>Welcome</Typography>
          </Box>
        </Box>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <div className="card text-white bg-dark mb-3" style={{ maxWidth: '18rem' }}>
              <div className="card-header">Accounts Registered</div>
              <div className="card-body">
                <h3 className="card-title">Total: 12</h3>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card text-white bg-dark mb-3" style={{ maxWidth: '18rem' }}>
              <div className="card-header">Posts</div>
              <div className="card-body">
                <h3 className="card-title">Total: 25</h3>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card text-white bg-dark mb-3" style={{ maxWidth: '18rem' }}>
              <div className="card-header">Total Likes</div>
              <div className="card-body">
                <h3 className="card-title">Total: 43</h3>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card text-white bg-dark mb-3" style={{ maxWidth: '18rem' }}>
              <div className="card-header">Total Comments</div>
              <div className="card-body">
                <h3 className="card-title">Total: 58</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ul className="nav" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
        <li className="nav-item dropdown" style={{ opacity: 1 }}>
          <span
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            style={{ color: "#222" }}
          >
            Account
          </span>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <div className="dropdown-divider"></div>
            <Link className="dropdown-item" to="/" style={{ color: "#222" }}>
              Logout
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Admin;
