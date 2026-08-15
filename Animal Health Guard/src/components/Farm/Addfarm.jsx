import React, { useContext, useState } from "react";
import { FarmContext } from "../../context/FarmContext";
import { useNavigate } from "react-router-dom";
import "./AddFarm.css";

const AddFarm = () => {
  const { createFarm } = useContext(FarmContext);
  const navigate = useNavigate();

  const [farm, setFarm] = useState({
    farmName: "",
    farmType: "",
    location: "",
    size: "",
    numberOfAnimals: "",
  });

  const onChange = (e) => {
    setFarm({
      ...farm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createFarm(
      farm.farmName,
      farm.farmType,
      farm.location,
      Number(farm.size),
      Number(farm.numberOfAnimals)
    );

    setFarm({
      farmName: "",
      farmType: "",
      location: "",
      size: "",
      numberOfAnimals: "",
    });

    //navigate("/farms"); // Change this route if needed
  };

  return (
    <div className="addfarm-container">
      <h2 className="addfarm-title">Add New Farm</h2>

      <form className="addfarm-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Farm Name</label>
          <input
            type="text"
            name="farmName"
            value={farm.farmName}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Farm Type</label>
          <select
            name="farmType"
            value={farm.farmType}
            onChange={onChange}
            required
          >
            <option value="">Select Farm Type</option>
            <option value="dairy">dairy</option>
            <option value="poultry">poultry</option>
            <option value="goat">goat</option>
            <option value="sheep">sheep</option>
            <option value="pig">pig</option>
          </select>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={farm.location}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Farm Size (Acres)</label>
          <input
            type="number"
            name="size"
            value={farm.size}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Number of Animals</label>
          <input
            type="number"
            name="numberOfAnimals"
            value={farm.numberOfAnimals}
            onChange={onChange}
            required
          />
        </div>

        <button className="submit-btn" type="submit">
          Add Farm
        </button>

      </form>
    </div>
  );
};

export default AddFarm;