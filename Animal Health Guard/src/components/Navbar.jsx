import React from "react";
import Login from "./Login";
import Signup from "./Signup"

const Navbar=()=>{
    const isauthenticated=0; 
    return(
        <>
            {isauthenticated 
                ? (
                    <div>
                        <button>
                            Login
                        </button>
                        <button>
                            signup
                        </button>
                    </div>
                  )
                : (
                    <div>
                        <button>
                            LogOut
                        </button>
                    </div>
                  )
            }
        </>
    );
}

export default Navbar;