// src/components/ConfirmModal.jsx
import React from "react"

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    const modalStyle = {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "1000",
    }

    const contentStyle = {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "5px",
        textAlign: "center",
    }

    return (
        <div style={modalStyle}>
            <div style={contentStyle}>
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
