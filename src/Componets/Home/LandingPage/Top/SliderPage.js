import React from 'react'
import './sliderpage.css'

function SliderPage() {
    return (
        <div className="slider-container flex">
            <div className="slider-text flex">
                <h2>This is your destination to make zikr and gain blessings of almighty.</h2>
                <p>Lets heal our soul with zikr of allah and rasool(s.a.w).</p>
                <div className="flex quote-line">
                    <h3>"beshaq allah hi ke zikr se dilo ko karar milta hain"</h3>
                </div>
            </div>
            <div className="btn-user-interaction">
                <div className="user-sign-in flex">
                    <div className="try-now-box">
                        <button className="skip-btn btn"> {/*onClick={GuestSignIn}*/}
                            Try Now!
                        </button>
                    </div>
                    <div className="sign-in-with">
                        <button className="btn">
                            Sign In With Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SliderPage
