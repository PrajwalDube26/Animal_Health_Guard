import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { RecordContext } from "../../context/RecordContext";
import Updaterecord from "./Updaterecord";
import "./GetRecord.css";

const GetRecord = () => {
    const { farmId } = useParams();

    const {
        records,
        getRecordsByFarmId,
        deleteRecord,
    } = useContext(RecordContext);

    const [editingRecord, setEditingRecord] = useState(null);

    useEffect(() => {
        getRecordsByFarmId(farmId);
    }, [farmId]);

    return (
        <div className="record-container">

            {/* Header */}
            <div className="record-header">

                <h2>🌾 Farm Records</h2>

                <div className="header-btns">

                    <Link
                        to={`/addrecord/${farmId}`}
                        className="add-btn"
                    >
                        ➕ Add Record
                    </Link>

                    <Link
                        to={`/getsinglefarm/${farmId}`}
                        className="add-btn farm-btn"
                    >
                        🚜 View Farm
                    </Link>

                </div>

            </div>

            {/* No Records */}
            {records.length === 0 ? (

                <h3 className="no-record">
                    No Records Found
                </h3>

            ) : (

                <div className="record-grid">

                    {records.map((record) => (

                        <div
                            className="record-card"
                            key={record._id}
                        >

                            <h3>{record.type}</h3>

                            <p>
                                <strong>Description</strong>
                                <span>{record.description}</span>
                            </p>

                            <p>
                                <strong>Date</strong>
                                <span>
                                    {new Date(record.date).toLocaleDateString()}
                                </span>
                            </p>

                            <div className="record-actions">

                                <button
                                    className="edit-btn"
                                    onClick={() => setEditingRecord(record)}
                                >
                                    ✏ Edit
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => {
                                        if (
                                            window.confirm(
                                                "Are you sure you want to delete this record?"
                                            )
                                        ) {
                                            deleteRecord(
                                                farmId,
                                                record._id
                                            );
                                        }
                                    }}
                                >
                                    🗑 Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

            {/* Updaterecord Pop-up Modal */}
            <Updaterecord
                show={!!editingRecord}
                record={editingRecord}
                farmId={farmId}
                onClose={() => setEditingRecord(null)}
            />

        </div>
    );
};

export default GetRecord;