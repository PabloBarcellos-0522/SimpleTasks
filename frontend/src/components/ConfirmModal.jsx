// src/components/ConfirmModal.jsx
import React, { useState } from "react"
import LoadingSpinner from "./LoadingSpinner"

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    const [loading, setLoading] = useState(false)

    const handleConfirm = async () => {
        setLoading(true)
        try {
            await onConfirm()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal">
            <div className="content-modal">
                <p>{message}</p>
                <button onClick={handleConfirm} style={{ marginRight: "10px" }} disabled={loading}>
                    {loading ? <LoadingSpinner /> : "Sim"}
                </button>
                <button onClick={onCancel} disabled={loading}>
                    Não
                </button>
            </div>
        </div>
    )
}

export default ConfirmModal
