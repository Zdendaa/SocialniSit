import React from 'react'
/* import swiper*/ 
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper.min.css'
import SwiperCore, { Pagination } from 'swiper';
SwiperCore.use([Pagination]);


const SwiperOnlineFriends = ({users, type}) => {

    return (
        
        <>
            {type === 1 
                ?
                    <div className="swiperOnline mobile">
                        <Swiper slidesPerView={6} spaceBetween={0} pagination={{"clickable": true}} className="mySwiper">
                        {users.map((user, index) => (
                                <SwiperSlide key={index}><img style={{width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover"}} src="img/anonymous.png" alt="" /></SwiperSlide>
                        ))}
                        </Swiper> 
                    </div>
                :
                <div className="onlineListOfUsers">
                    {users.map((user, index) => (
                        <div className="pc">
                            <img style={{width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover"}} src="img/anonymous.png" alt="" />
                            <span>{user.username}</span>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}

export default SwiperOnlineFriends
