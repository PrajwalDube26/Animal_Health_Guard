import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RecordContext } from "../../context/RecordContext";

import "./AddRecord.css";

const AddRecord = () => {

  const { farmId } = useParams();
  const navigate = useNavigate();

  const { createRecord } = useContext(RecordContext);

  const [type, setType] = useState("vaccination");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createRecord(
      farmId,
      type,
      description,
      date
    );

    navigate(`/getrecord/${farmId}`);
  };

  return (
    <div className="add-record-container">

      <div className="add-record-card">

        <h2>Add Record</h2>

        <form onSubmit={handleSubmit}>

          <label>Record Type</label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="vaccination">Vaccination</option>
            <option value="cleaning">Cleaning</option>
            <option value="visitor_entry">Visitor Entry</option>
            <option value="medicine">Medicine</option>
            <option value="feeding">Feeding</option>
            <option value="mortality">Mortality</option>
            <option value="egg_collection">Egg Collection</option>
          </select>

          <label>Description</label>

          <textarea
            rows="5"
            placeholder="Enter Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button type="submit">
            Add Record
          </button>

        </form>

      </div>

    </div>
  );
};

export default AddRecord;