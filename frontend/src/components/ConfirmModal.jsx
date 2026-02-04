// src/components/ConfirmModal.jsx
import React from "react"

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal">
            <div className="content-modal">
                <p>{message}</p>
                <button onClick={onConfirm} style={{ marginRight: "10px" }}>
                    Sim
                </button>
                <button onClick={onCancel}>Não</button>
            </div>
        </div>
    )
}

export default ConfirmModal
