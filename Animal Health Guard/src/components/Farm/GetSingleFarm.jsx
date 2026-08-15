import { useContext, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FarmContext } from "../../context/FarmContext";
import "./GetSingleFarm.css";


const GetSingleFarm = () => {
    const { id } = useParams();
    const { farms, getFarmById, deleteFarm, updateFarm } = useContext(FarmContext);

    const navigate = useNavigate();

    const handledeleteFarm = () => {
        if (confirm("Are you sure you want to delete this farm?")) {
            deleteFarm(id);
        }
        // const a = prompt("Farm deleted successfully");
        // alert(a);
    }

    const handleEditFarm = () => {
        // const a = prompt("Farm deleted successfully");
        // updateFarm(id);
    }


    useEffect(() => {
        getFarmById(id);
    }, [id]);

    return (
        <>
            <div className="getfarm-container">

                {farms.length === 0 ? (
                    <p className="no-farm">No Farms Found</p>
                ) : (
                    <div className="farm-grid">
                        {farms.map((farm) => (
                            <div className="farm-card" key={farm._id}>
                                <h3>{farm.farmName}</h3>

                                <div className="farm-details">
                                    <p>
                                        <strong>Farm Type:</strong> {farm.farmType}
                                    </p>

                                    <p>
                                        <strong>Location:</strong> {farm.location}
                                    </p>

                                    <p>
                                        <strong>Size:</strong> {farm.size}
                                    </p>

                                    <p>
                                        <strong>Animals:</strong> {farm.numberOfAnimals}
                                    </p>

                                    <p>
                                        <strong>Created:</strong>{" "}
                                        {new Date(farm.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                        ))}
                        <div className="farm-actions">

                            <button
                                className="delete-btn"
                                onClick={handledeleteFarm}
                            >
                                🗑 Delete Farm
                            </button>

                            <button
                                className="edit-btn"
                                onClick={handleEditFarm}
                            >
                                ✏ Edit Farm
                            </button>

                            <Link className="action-link add-btn" to={`/addrecord/${id}`}>
                                ➕ Add Record
                            </Link>

                            <Link className="action-link record-btn" to={`/getrecord/${id}`}>
                                📋 Show Farm Records
                            </Link>

                        </div>

                    </div>
                )}
            </div>
        </>
    );
};

export default GetSingleFarm;