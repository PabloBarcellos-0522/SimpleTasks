// src/components/TarefaItem.jsx
import React from "react"

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

    return (
        <li className={custo >= 1000 ? "task-item item-gold" : "task-item"}>
            <span>{nome}</span>
            <span>{formatCurrency(custo)}</span>
            <span>{formatDate(data_limite)}</span>
            <div>
                <button onClick={() => onEdit(tarefa)}>Editar</button>
                <button onClick={() => onDelete(id)}>Excluir</button>
                <button onClick={() => onMoveUp(id)} disabled={isFirst}>
                    ↑
                </button>
                <button onClick={() => onMoveDown(id)} disabled={isLast}>
                    ↓
                </button>
            </div>
        </li>
    )
}

export default TarefaItem
