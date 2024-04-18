import React, { useEffect } from 'react'


import { useSelector } from 'react-redux'
import LoadIcon from './../images/loading.gif'

import Status from './../components/home/Status'
import Posts from './../components/home/Posts'

const Home = () => {

    const {homePosts} = useSelector(state => state)
    //console.log(homePosts)
    return (
        <div className="home row mx-0">
                <div className='col-md-8'>
                <Status/>

                {
                    homePosts.loading 
                    ? <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
                    : (homePosts.result === 0 && homePosts.posts.length === 0)
                        ? <h2 className="text-center">No Posts available</h2>
                        : <Posts />
                }
                </div> 

        </div>
    )
}

export default Home