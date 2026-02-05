// src/components/TarefaItem.jsx
import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value)
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    const adjustedDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000)
    return new Intl.DateTimeFormat("pt-BR").format(adjustedDate)
}

function TarefaItem({ tarefa, onEdit, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
    const { id, nome, custo, data_limite } = tarefa
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: tarefa.id,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "none",
    }

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={`${custo >= 1000 ? "task-item item-gold" : "task-item"} ${
                isDragging ? "dragging" : ""
            }`}
        >
            <div className="drag-handle" {...listeners}>
                ☰
            </div>
            <span>{nome}</span>
            <div>
                <span>{formatCurrency(custo)}</span>
                <span>{formatDate(data_limite)}</span>
            </div>
            <div className="task-actions">
                <button onClick={() => onEdit(tarefa)}>Editar</button>
                <button onClick={() => onDelete(id)}>Excluir</button>
                <div className="move-buttons">
                    <button onClick={() => onMoveUp(id)} disabled={isFirst}>
                        ↑
                    </button>
                    <button onClick={() => onMoveDown(id)} disabled={isLast}>
                        ↓
                    </button>
                </div>
            </div>
        </li>
    )
}

export default TarefaItem
