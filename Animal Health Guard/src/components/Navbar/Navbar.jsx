import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const Navbar = () => {
    const { isloggedin } = useContext(UserContext);
    return (
        <>
            {isloggedin
                ? (
                    <div>
                        <button>
                            <Link to="/getfarm">Farm</Link>
                        </button>
                        <button>
                            <Link to="/showallalert">Alert</Link>
                        </button>
                        <button>
                            <Link to="/getalltrainingmodule">Training</Link>
                        </button>
                        <button>
                            <Link to="/profile">Profile</Link>
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