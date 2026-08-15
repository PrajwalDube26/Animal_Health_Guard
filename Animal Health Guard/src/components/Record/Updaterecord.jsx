import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { RecordContext } from "../../context/RecordContext";
import "./Updaterecord.css";

const Updaterecord = ({
  show = true,
  onClose,
  record: propRecord,
  farmId: propFarmId,
}) => {
  const params = useParams();
  const currentFarmId = propFarmId || params.farmId;
  const currentRecordId = propRecord?._id || params.id;

  const { updateRecord, getRecordById, getRecordsByFarmId } =
    useContext(RecordContext);
  const navigate = useNavigate();

  const [type, setType] = useState("vaccination");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Helper to format date string to YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  // Populate or fetch record details
  useEffect(() => {
    if (propRecord) {
      setType(propRecord.type || "vaccination");
      setDescription(propRecord.description || "");
      setDate(formatDateForInput(propRecord.date));
      return;
    }

    if (currentRecordId) {
      setFetching(true);
      getRecordById(currentRecordId)
        .then((rec) => {
          if (rec) {
            setType(rec.type || "vaccination");
            setDescription(rec.description || "");
            setDate(formatDateForInput(rec.date));
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setFetching(false));
    }
  }, [propRecord, currentRecordId]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (currentFarmId) {
      navigate(`/getrecord/${currentFarmId}`);
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!type) {
      setErrorMsg("Please select a record type.");
      return;
    }

    if (!date) {
      setErrorMsg("Please select a date.");
      return;
    }

    setLoading(true);

    try {
      const updated = await updateRecord(
        currentFarmId,
        currentRecordId,
        type,
        description,
        date
      );

      if (updated) {
        setSuccessMsg("Record updated successfully!");
        if (currentFarmId) {
          await getRecordsByFarmId(currentFarmId);
        }
        setTimeout(() => {
          handleClose();
        }, 1100);
      } else {
        setErrorMsg("Failed to update record. Please try again.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setErrorMsg("An unexpected error occurred while updating the record.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="updateRecordModalLabel"
      aria-hidden={!show}
    >
      <div className="modal-backdrop-record" onClick={handleClose}></div>
      <div className="modal-dialog modal-dialog-centered update-record-dialog" role="document">
        <div className="modal-content update-record-modal">
          <div className="modal-header update-record-header">
            <div className="modal-title-wrapper">
              <h5 className="modal-title" id="updateRecordModalLabel">
                ✏ Update Record
              </h5>
              <p className="modal-subtitle">
                Update the record details for this farm
              </p>
            </div>
            <button
              type="button"
              className="btn-close-record"
              aria-label="Close"
              onClick={handleClose}
            >
              ✕
            </button>
          </div>

          {fetching ? (
            <div className="loading-state-record">
              <div className="spinner-record"></div>
              <p>Loading record details...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-body update-record-body">
                {errorMsg && (
                  <div className="custom-alert-record alert-danger" role="alert">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="custom-alert-record alert-success" role="alert">
                    {successMsg}
                  </div>
                )}

                {/* Record Type */}
                <div className="form-group-record">
                  <label htmlFor="recordType" className="form-label-record">
                    Record Type <span className="required-star">*</span>
                  </label>
                  <select
                    id="recordType"
                    className="form-control-record"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="vaccination">Vaccination</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="visitor_entry">Visitor Entry</option>
                    <option value="medicine">Medicine</option>
                    <option value="feeding">Feeding</option>
                    <option value="mortality">Mortality</option>
                    <option value="egg_collection">Egg Collection</option>
                  </select>
                </div>

                {/* Description */}
                <div className="form-group-record">
                  <label htmlFor="recordDescription" className="form-label-record">
                    Description
                  </label>
                  <textarea
                    id="recordDescription"
                    className="form-control-record textarea-record"
                    rows="4"
                    placeholder="Enter record details, observations, or dosage..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                {/* Date */}
                <div className="form-group-record">
                  <label htmlFor="recordDate" className="form-label-record">
                    Date <span className="required-star">*</span>
                  </label>
                  <input
                    type="date"
                    id="recordDate"
                    className="form-control-record"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer update-record-footer">
                <button
                  type="button"
                  className="btn-record btn-record-cancel"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-record btn-record-save"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Save Record"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Updaterecord;
