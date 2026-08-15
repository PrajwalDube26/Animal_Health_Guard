import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FarmContext } from "../../context/FarmContext";
import "./GetFarm.css";

const GetFarm = () => {
  const navigate = useNavigate();

  const { farms, getUserFarms } = useContext(FarmContext);

  // Navigate to Single Farm Page
  const clickHandler = (id) => {
    navigate(`/getsinglefarm/${id}`);
  };

  // Get all farms when page loads
  useEffect(() => {
    getUserFarms();
  }, []);

  return (
    <>
      {/* Header */}
      <div className="getfarm-header">
        <h1>🌾 My Farms</h1>

        <Link to="/addfarm" className="add-farm-btn">
          ➕ Add Farm
        </Link>
      </div>

      {/* Farm Container */}
      <div className="getfarm-container">

        {farms.length === 0 ? (
          <p className="no-farm">No Farms Found</p>
        ) : (
          <div className="farm-grid">

            {farms.map((farm) => (
              <div
                className="farm-card"
                key={farm._id}
                onClick={() => clickHandler(farm._id)}
              >

                {/* Farm Name */}
                <h3>{farm.farmName}</h3>

                {/* Farm Details */}
                <div className="farm-details">

                  <p>
                    <strong>Farm Type</strong>
                    <span>{farm.farmType}</span>
                  </p>

                  <p>
                    <strong>Location</strong>
                    <span>{farm.location}</span>
                  </p>

                  <p>
                    <strong>Size</strong>
                    <span>{farm.size}</span>
                  </p>

                  <p>
                    <strong>Animals</strong>
                    <span>{farm.numberOfAnimals}</span>
                  </p>

                  <p>
                    <strong>Created</strong>
                    <span>
                      {new Date(farm.createdAt).toLocaleDateString()}
                    </span>
                  </p>

                </div>

                {/* View Farm Button */}
                <div className="farm-card-footer">

                  <button
                    className="view-farm-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      clickHandler(farm._id);
                    }}
                  >
                    🚜 View Farm
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </>
  );
};

export default GetFarm;