import React from "react";
import {Link} from 'react-router-dom'
import Login from "./Login";
import Signup from "./Signup"

const Navbar=()=>{
    const isauthenticated=1; 
    return(
        <>
            {isauthenticated 
                ? (
                    <div>
                        <button>
                            <Link to="/login">Login</Link>
                        </button>
                        <button>
                            <Link to="/signup">Signup</Link>
                        </button>
                    </div>
                  )
                : (
                    <div>
                        <button>
                            <Link to="/logout">LogOut</Link>
                        </button>
                    </div>
                  )
            }
        </>
    );
}

export default Navbar;