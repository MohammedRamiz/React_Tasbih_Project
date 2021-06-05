import React from 'react'

const SignIn = props =>{
    return (
        <div className="user-sign-in flex">
            <button onClick={props.click}>Sign In With Google</button>
            <button className='skip-btn' onClick={props.skip}>Enter As Guest</button>
        </div>
    )
}

export default  SignIn
