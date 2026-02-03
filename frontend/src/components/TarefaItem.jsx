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

function TarefaItem({ tarefa }) {
    const { nome, custo, data_limite } = tarefa

    const itemStyle = {
        backgroundColor: custo >= 1000 ? "yellow" : "transparent",
        padding: "10px",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    }

    return (
        <li style={itemStyle}>
            <span>{nome}</span>
            <span>{formatCurrency(custo)}</span>
            <span>{formatDate(data_limite)}</span>
            <div>
                <button>Editar</button>
                <button>Excluir</button>
                {/* Botões de reordenação serão adicionados aqui */}
            </div>
        </li>
    )
}

export default TarefaItem
