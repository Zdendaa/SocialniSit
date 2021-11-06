import React from 'react'
/* import swiper*/ 
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper.min.css'
import SwiperCore, { Pagination } from 'swiper';
import UserProfile from './UserProfile';
SwiperCore.use([Pagination]);


const SwiperOnlineFriends = ({users, type}) => {

    return (
        <>
            {
            type === 1 
            ?
                <div className="swiperOnline mobile">
                    <Swiper slidesPerView={6} spaceBetween={0} pagination={{"clickable": true}} className="mySwiper">
                    {users.map((user, index) => (
                            <SwiperSlide key={index} >
                                <UserProfile idOfUser={user._id} mobile={true} style={{width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover"}}/>
                            </SwiperSlide>
                    ))}
                    </Swiper> 
                </div>
            :
                <div className="onlineListOfUsers">
                    {users.map((user, index) => (
                        <div className="pc">
                            <UserProfile idOfUser={user._id} mobile={false} style={{width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover"}}/>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}

export default SwiperOnlineFriends
