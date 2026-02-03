// src/pages/ListaTarefas.jsx
import React, { useState, useEffect, useCallback } from "react"
import { getTarefas, createTarefa } from "../services/api"
import TarefaItem from "../components/TarefaItem"
import TarefaForm from "../components/TarefaForm"

function ListaTarefas() {
    const [tarefas, setTarefas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)

    const fetchTarefas = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getTarefas()
            setTarefas(data)
            setError(null)
        } catch (err) {
            setError("Falha ao carregar as tarefas. O backend está rodando?")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTarefas()
    }, [fetchTarefas])

    const handleCreateTarefa = async (tarefaData) => {
        try {
            await createTarefa(tarefaData)
            setShowForm(false)
            fetchTarefas()
        } catch (err) {
            console.error("Erro ao criar tarefa no componente ListaTarefas:", err)
            throw err
        }
    }

    if (loading) {
        return <div>Carregando tarefas...</div>
    }

    if (error) {
        return <div>Erro: {error}</div>
    }

    const totalCusto = tarefas.reduce((sum, tarefa) => sum + parseFloat(tarefa.custo), 0)
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    return (
        <div>
            <h1>Lista de Tarefas</h1>
            {showForm ? (
                <TarefaForm onSubmit={handleCreateTarefa} onClose={() => setShowForm(false)} />
            ) : (
                <div>
                    <button onClick={() => setShowForm(true)}>Incluir Nova Tarefa</button>
                </div>
            )}

            <ul>
                {tarefas.map((tarefa) => (
                    <TarefaItem key={tarefa.id} tarefa={tarefa} />
                ))}
            </ul>
            <hr />
            <div>
                <strong>Somatório dos Custos: {formatCurrency(totalCusto)}</strong>
            </div>
        </div>
    )
}

export default ListaTarefas
