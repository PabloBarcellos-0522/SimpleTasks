// src/components/TarefaForm.jsx
import React, { useState, useEffect } from "react"
import LoadingSpinner from "./LoadingSpinner"

function TarefaForm({ onSubmit, onClose, initialData }) {
    const [nome, setNome] = useState(initialData?.nome || "")
    const [custo, setCusto] = useState(initialData?.custo || "")
    const [data_limite, setDataLimite] = useState(
        initialData?.data_limite ? initialData.data_limite.split("T")[0] : "",
    )
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setNome(initialData?.nome || "")
        setCusto(initialData?.custo || "")
        setDataLimite(initialData?.data_limite ? initialData.data_limite.split("T")[0] : "")
        setError(null)
    }, [initialData])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!nome || !custo || custo === undefined || !data_limite) {
            setError("Todos os campos são obrigatórios.")
            return
        }
        if (isNaN(custo) || parseFloat(custo) < 0) {
            setError("Custo deve ser um número maior ou igual a zero.")
            return
        }

        setLoading(true)
        try {
            const dataToSubmit = {
                nome,
                custo: parseFloat(custo),
                data_limite,
            }
            if (initialData?.id) {
                await onSubmit(initialData.id, dataToSubmit)
            } else {
                await onSubmit(dataToSubmit)
            }
        } catch (err) {
            setError(err.response?.data?.error || "Erro ao salvar tarefa.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal">
            <form
                onSubmit={handleSubmit}
                style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}
                className="content-modal"
            >
                <h2>{initialData?.id ? "Editar Tarefa" : "Incluir Nova Tarefa"}</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <p>
                    <label>
                        Nome:
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </label>
                </p>
                <p>
                    <label>
                        Custo:
                        <input
                            type="number"
                            step="0.01"
                            value={custo}
                            onChange={(e) => setCusto(e.target.value)}
                        />
                    </label>
                </p>
                <p>
                    <label>
                        Data Limite:
                        <input
                            type="date"
                            value={data_limite}
                            onChange={(e) => setDataLimite(e.target.value)}
                        />
                    </label>
                </p>
                <button type="submit" disabled={loading}>
                    {loading ? <LoadingSpinner /> : "Salvar"}
                </button>
                <button type="button" onClick={onClose} disabled={loading}>
                    Cancelar
                </button>
            </form>
        </div>
    )
}

export default TarefaForm
