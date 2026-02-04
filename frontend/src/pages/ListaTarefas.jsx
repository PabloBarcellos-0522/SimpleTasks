// src/pages/ListaTarefas.jsx
import React, { useState, useEffect, useCallback } from "react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import {
    getTarefas,
    createTarefa,
    updateTarefa,
    deleteTarefa,
    reorderTarefas,
} from "../services/api"
import TarefaItem from "../components/TarefaItem"
import TarefaForm from "../components/TarefaForm"
import ConfirmModal from "../components/ConfirmModal"

function ListaTarefas() {
    const [tarefas, setTarefas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editingTask, setEditingTask] = useState(null)
    const [deletingTaskId, setDeletingTaskId] = useState(null)

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

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

    const handleUpdateTarefa = async (id, tarefaData) => {
        try {
            await updateTarefa(id, tarefaData)
            setEditingTask(null)
            setShowForm(false)
            fetchTarefas()
        } catch (err) {
            console.error("Erro ao atualizar tarefa no componente ListaTarefas:", err)
            throw err
        }
    }

    const handleDeleteRequest = (id) => {
        setDeletingTaskId(id)
    }

    const handleConfirmDelete = async () => {
        try {
            await deleteTarefa(deletingTaskId)
            setDeletingTaskId(null)
            fetchTarefas()
        } catch (err) {
            console.error("Erro ao excluir tarefa:", err)
            setError("Falha ao excluir tarefa.")
        }
    }

    const handleCancelDelete = () => {
        setDeletingTaskId(null)
    }

    const handleEdit = (tarefa) => {
        setEditingTask(tarefa)
        setShowForm(true)
    }

    const handleDragEnd = async (event) => {
        const { active, over } = event

        if (active.id !== over.id) {
            setTarefas((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)

                const newOrderedTarefas = arrayMove(items, oldIndex, newIndex).map(
                    (tarefa, index) => ({ ...tarefa, ordem: index + 1 }),
                )

                const orderedData = newOrderedTarefas.map((t) => ({
                    id: t.id,
                    ordem: t.ordem,
                }))

                try {
                    reorderTarefas(orderedData)
                } catch (err) {
                    console.error("Erro ao reordenar tarefas no frontend:", err)
                    setError("Falha ao reordenar tarefas.")
                    fetchTarefas()
                }

                return newOrderedTarefas
            })
        }
    }

    const handleMove = async (id, direction) => {
        const newTarefas = [...tarefas]
        const index = newTarefas.findIndex((t) => t.id === id)

        if (index === -1) return

        const targetIndex = direction === "up" ? index - 1 : index + 1

        if (targetIndex < 0 || targetIndex >= newTarefas.length) return
        ;[newTarefas[index].ordem, newTarefas[targetIndex].ordem] = [
            newTarefas[targetIndex].ordem,
            newTarefas[index].ordem,
        ]
        ;[newTarefas[index], newTarefas[targetIndex]] = [newTarefas[targetIndex], newTarefas[index]]

        setTarefas(newTarefas)

        const orderedData = newTarefas.map((t) => ({ id: t.id, ordem: t.ordem }))

        try {
            if (200 >= (await reorderTarefas(orderedData)).status >= 300) {
                fetchTarefas()
            }
        } catch (err) {
            console.error("Erro ao reordenar tarefas:", err)
            setError("Falha ao reordenar tarefas.")
            fetchTarefas()
        }
    }

    const handleMoveUp = (id) => handleMove(id, "up")
    const handleMoveDown = (id) => handleMove(id, "down")

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
            {showForm && (
                <TarefaForm
                    onSubmit={editingTask ? handleUpdateTarefa : handleCreateTarefa}
                    onClose={() => {
                        setShowForm(false)
                        setEditingTask(null)
                    }}
                    initialData={editingTask}
                />
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={tarefas.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <ul>
                        {tarefas.map((tarefa, index) => (
                            <TarefaItem
                                key={tarefa.id}
                                tarefa={tarefa}
                                onEdit={handleEdit}
                                onDelete={handleDeleteRequest}
                                onMoveUp={handleMoveUp}
                                onMoveDown={handleMoveDown}
                                isFirst={index === 0}
                                isLast={index === tarefas.length - 1}
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>

            <div>
                <button
                    className="insert-btn"
                    onClick={() => {
                        setShowForm(true)
                        setEditingTask(null)
                    }}
                >
                    Incluir Nova Tarefa
                </button>
            </div>

            <hr />
            <div>
                <strong>Somatório dos Custos: {formatCurrency(totalCusto)}</strong>
            </div>

            {deletingTaskId && (
                <ConfirmModal
                    message="Tem certeza que deseja excluir esta tarefa?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    )
}

export default ListaTarefas
