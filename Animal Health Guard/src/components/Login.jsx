import React from "react";
import "./Login.css";

function Login()
{
    return(
        <div className="container">
            <div className="container-box">
                <h1>Login Form</h1>

                <form>
                    <label htmlFor="email">
                        email
                    </label>
                    <input type="email" name="email" placeholder="Enter email" required className="input" />

                    <label htmlFor="password">
                        password
                    </label>
                    <input type="password" name="password" placeholder="Enter Password" required className="input" />

                    <button type="submit" className="button">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;