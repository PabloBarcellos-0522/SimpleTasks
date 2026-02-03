// src/pages/ListaTareades.jsx
import React, { useState, useEffect } from "react"
import { getTarefas } from "../services/api"
import TarefaItem from "../components/TarefaItem"

function ListaTarefas() {
    const [tarefas, setTarefas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchTarefas() {
            try {
                const data = await getTarefas()
                setTarefas(data)
            } catch (err) {
                setError("Falha ao carregar as tarefas. O backend está rodando?")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchTarefas()
    }, [])

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
            <ul>
                {tarefas.map((tarefa) => (
                    <TarefaItem key={tarefa.id} tarefa={tarefa} />
                ))}
            </ul>
            <div>
                <button>Incluir Nova Tarefa</button>
            </div>
            <hr />
            <div>
                <strong>Somatório dos Custos: {formatCurrency(totalCusto)}</strong>
            </div>
        </div>
    )
}

export default ListaTarefas
