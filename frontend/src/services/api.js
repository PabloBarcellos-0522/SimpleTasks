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
