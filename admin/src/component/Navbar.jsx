import React,{useContext} from "react";
import {Link} from 'react-router-dom';

const Navbar=()=>{
    return(
        <>
            <div>
                <button>
                    <Link to="/createalert">Create Alert</Link>
                </button>
            </div>
                  
        </>
    );
}

export default Navbar;