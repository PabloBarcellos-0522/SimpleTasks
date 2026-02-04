require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")

const app = express()
const port = process.env.PORT || 3001

app.use(
    cors({
        origin: ["http://localhost:5173", "https://simple-tasks-mauve.vercel.app"],
    }),
)
app.use(express.json())

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
})

app.get("/", (req, res) => {
    res.send("Hello from the backend!")
})

// GET /tarefas: Listar todas as tarefas ordenadas por 'ordem'
app.get("/tarefas", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM tarefas ORDER BY ordem")
        res.json(result.rows)
    } catch (err) {
        console.error("Erro ao buscar tarefas:", err)
        res.status(500).json({ error: "Erro interno do servidor ao buscar tarefas." })
    }
})

// Função de validação de entrada
function isInputInvalid(req, res) {
    const { nome, custo, data_limite } = req.body
    if (!nome || custo === undefined || !data_limite) {
        res.status(400).json({ error: "Nome, Custo e Data-limite são obrigatórios." })
        return true
    }
    if (isNaN(custo) || parseFloat(custo) < 0) {
        res.status(400).json({ error: "Custo deve ser um número maior ou igual a zero." })
        return true
    }
    const dateObj = new Date(data_limite)
    if (isNaN(dateObj.getTime())) {
        res.status(400).json({ error: "Data-limite inválida." })
        return true
    }
    return false
}

// POST /tarefas: Criar uma nova tarefa
app.post("/tarefas", async (req, res) => {
    if (isInputInvalid(req, res)) return

    const { nome, custo, data_limite } = req.body
    try {
        const existingTask = await pool.query("SELECT id FROM tarefas WHERE nome = $1", [nome])
        if (existingTask.rows.length > 0) {
            return res.status(409).json({ error: "Já existe uma tarefa com este nome." })
        }

        const maxOrderResult = await pool.query("SELECT MAX(ordem) FROM tarefas")
        const nextOrder = (maxOrderResult.rows[0].max || 0) + 1

        const result = await pool.query(
            "INSERT INTO tarefas (nome, custo, data_limite, ordem) VALUES ($1, $2, $3, $4) RETURNING *",
            [nome, parseFloat(custo), data_limite, nextOrder],
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error("Erro ao criar tarefa:", err)
        res.status(500).json({ error: "Erro interno do servidor ao criar tarefa." })
    }
})

// PUT /tarefas/:id: Editar uma tarefa existente
app.put("/tarefas/:id", async (req, res) => {
    if (isInputInvalid(req, res)) return

    const { id } = req.params
    const { nome, custo, data_limite } = req.body

    try {
        const existingTask = await pool.query(
            "SELECT id FROM tarefas WHERE nome = $1 AND id <> $2",
            [nome, id],
        )
        if (existingTask.rows.length > 0) {
            return res.status(409).json({ error: "Já existe outra tarefa com este nome." })
        }

        const result = await pool.query(
            "UPDATE tarefas SET nome = $1, custo = $2, data_limite = $3 WHERE id = $4 RETURNING *",
            [nome, parseFloat(custo), data_limite, id],
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Tarefa não encontrada." })
        }

        res.json(result.rows[0])
    } catch (err) {
        console.error("Erro ao atualizar tarefa:", err)
        res.status(500).json({ error: "Erro interno do servidor ao atualizar tarefa." })
    }
})

// DELETE /tarefas/:id: Excluir uma tarefa
app.delete("/tarefas/:id", async (req, res) => {
    const { id } = req.params

    try {
        const result = await pool.query("DELETE FROM tarefas WHERE id = $1 RETURNING *", [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Tarefa não encontrada." })
        }

        res.status(204).send() // No Content
    } catch (err) {
        console.error("Erro ao excluir tarefa:", err)
        res.status(500).json({ error: "Erro interno do servidor ao excluir tarefa." })
    }
})

// PUT /tarefas/reordenar: Atualiza a ordem de múltiplas tarefas
app.patch("/tarefas/reordenar", async (req, res) => {
    const { tarefas } = req.body // Espera um array [{id, ordem}]

    if (!Array.isArray(tarefas) || tarefas.length === 0) {
        return res
            .status(400)
            .json({ error: "O corpo da requisição deve conter um array de tarefas." })
    }

    const client = await pool.connect()
    try {
        await client.query("BEGIN")
        await client.query("SET CONSTRAINTS ALL DEFERRED")

        for (const tarefa of tarefas) {
            if (tarefa.id === undefined || tarefa.ordem === undefined) {
                throw new Error('Cada tarefa no array deve ter "id" e "ordem".')
            }
            await client.query("UPDATE tarefas SET ordem = $1 WHERE id = $2", [
                tarefa.ordem,
                tarefa.id,
            ])
        }

        await client.query("COMMIT")
        res.status(200).json({ message: "Ordem das tarefas atualizada com sucesso." })
    } catch (err) {
        await client.query("ROLLBACK")
        console.error("Erro ao reordenar tarefas:", err)
        res.status(500).json({ error: "Erro interno do servidor ao reordenar tarefas." })
    } finally {
        client.release()
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
