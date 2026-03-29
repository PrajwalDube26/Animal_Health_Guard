import React from "react";

function Signup()
{
    return(
        <div className="container">
            <div className="container-box">
                <h1>SignUp</h1>

                <form>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" placeholder="Enter Username" required className="input"/>

                    <label htmlFor="email">email</label>
                    <input type="email" name="email" placeholder="Enter email" required className="input"/>

                    <label htmlFor="password">password</label>
                    <input type="password" name="password" placeholder="Enter password" required className="input"/>

                    <label htmlFor="conform-password">conform-password</label>
                    <input type="password" name="conform-password" placeholder="conform-password" required className="input"/>

                    <button type="submit" className="button">Sign Up</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;