// src/services/api.js
import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3001",
})

export const getTarefas = async () => {
    try {
        const response = await api.get("/tarefas")
        return response.data
    } catch (error) {
        console.error("Erro ao buscar tarefas:", error)
        throw error
    }
}

export const createTarefa = async (tarefaData) => {
    try {
        const response = await api.post("/tarefas", tarefaData)
        return response.data
    } catch (error) {
        console.error("Erro ao criar tarefa:", error)
        throw error
    }
}

export const updateTarefa = async (id, tarefaData) => {
    try {
        const response = await api.put(`/tarefas/${id}`, tarefaData)
        return response.data
    } catch (error) {
        console.error(`Erro ao atualizar tarefa ${id}:`, error)
        throw error
    }
}

export const deleteTarefa = async (id) => {
    try {
        const response = await api.delete(`/tarefas/${id}`)
        return response.data
    } catch (error) {
        console.error(`Erro ao excluir tarefa ${id}:`, error)
        throw error
    }
}

export const reorderTarefas = async (orderedTasks) => {
    try {
        const response = await api.patch("/tarefas/reordenar", { tarefas: orderedTasks })
        return response
    } catch (error) {
        console.error("Erro ao reordenar tarefas:", error)
        throw error
    }
}
