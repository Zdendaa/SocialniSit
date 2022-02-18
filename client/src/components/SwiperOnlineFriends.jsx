import React from 'react'
/* import swiper*/ 
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper.min.css'
import SwiperCore, { Pagination } from 'swiper';
import UserProfile from './UserProfile';
SwiperCore.use([Pagination]);


const SwiperOnlineFriends = ({ users, type, classBorderRadius }) => {
    return (
        <>
            {
            type === 1 
            ?
                <div className={`swiperOnline ${classBorderRadius ? classBorderRadius : "mobile"}`} >
                    <Swiper slidesPerView={6} spaceBetween={0} pagination={{"clickable": true}} className="mySwiper">
                    {users?.map((user) => (
                            <SwiperSlide key={user._id} >
                                <UserProfile key={user._id} idOfUser={user._id} mobile={true} style={{width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover"}} />
                            </SwiperSlide>
                    ))}
                    </Swiper> 
                </div>
            :
                <div className="onlineListOfUsers">
                    {users?.map((user) => (
                        <div className="pc" key={user._id} >
                            <UserProfile key={user._id} idOfUser={user._id} mobile={false} style={{width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover"}}/>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}

export default SwiperOnlineFriends
