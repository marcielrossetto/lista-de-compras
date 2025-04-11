import express from "express";
import httpStatus from "http-status";

const app = express();
app.use(express.json());

const items = [];
let nextId = 1;

// Adicionar item
app.post("/items", (req, res) => {
    const { name, quantity, type } = req.body;
    
    if (!name || !quantity || !type) {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Todos os campos são obrigatórios!");   
    }

    if (items.some(item => item.name === name)) {
        return res.status(httpStatus.CONFLICT).send("Este item já está na lista!");
    }

    const newItem = {
        id: nextId++,
        name,
        quantity,
        type
    };

    items.push(newItem);

    return res.status(httpStatus.CREATED).json(newItem);
});


// Obter todos os itens ou filtrar por tipo
app.get("/items", (req, res) => {
    const { type } = req.query;

    if (type) {
        const filteredItems = items.filter(item => item.type === type);
        return res.status(httpStatus.OK).json(filteredItems);
    }

    return res.status(httpStatus.OK).json(items);
});

app.get("/items/:id", (req, res) => {  
    const { id } = req.params;

    const itemId = parseInt(id);
    if (!Number.isInteger(itemId) || itemId <= 0) {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).send("O ID deve ser um número inteiro positivo!");
    }

    const item = items.find(i => i.id === itemId);
    if (!item) {
        return res.status(httpStatus.NOT_FOUND).send("Item não encontrado!");
    }

    return res.status(httpStatus.OK).json(item);
});




// Rota padrão
app.get("/", (req, res) => {
    res.status(httpStatus.OK).send("API de lista de compras está rodando");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
