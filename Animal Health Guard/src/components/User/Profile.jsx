import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link } from 'react-router-dom';
import FeatchUser from "./Featchuser";

const Profile = () => {
    const { isloggedin } = useContext(UserContext);
    return (
        <>
            {isloggedin ? (
                <FeatchUser />
            ) : (
                <div className="login-message">
                    <button>
                        <Link to="/login">login</Link>
                    </button>
                    <button>
                        <Link to="/signup">signup</Link>
                    </button>
                </div>
            )}
        </>
    );
}

export default Profile;