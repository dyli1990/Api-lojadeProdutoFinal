const express = require("express");
const transacaoSchema = require("../models/transacao");

const router = express.Router();

//create transacao
/**
 * @swagger
 * components:
 *  schemas:
 *    transacao:
 *     type: object
 *     properties:
 *       valor: 
 *        type: number
 *        description: preco
 *       forma_de_pagamento: 
 *        type: string
 *        description: tipo de pagamento
 *       data: 
 *        type: number
 *        description: data
 *       item:
 *        type: string
 *        description: inventario
 *     required:
 *        -valor
 *        -forma_de_pagamento
 *        -item
 *     ejemplo:
 *         valor: 
 *         forma_de_pagamento: 
 *         data:
 *         preco: 
 */

/**
 * @swagger
 * /api/transacao:
 *  post: 
 *   summary: transação efetuada
 *   tags: [transacao]
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *       schema:
 *        type: object
 *        $ref: '#/components/schemas/transacao'
 *   responses:
 *    200:
 *     description: transação efetuada
 */

router.post("/transacao", async (req, res) => {
    const transacao = transacaoSchema(req.body);
    const item = (req.body.item);
    const erros = []
    transacao

    try {
        if (!req.body.valor || req.body.valor == null) {
            erros.push("Inserir o valor")
        }

        if (typeof req.body.valor == "string") {
            erros.push("Informar o valor numerico")
        }

        if (!req.body.forma_de_pagamento || req.body.forma_de_pagamento == null) {
            erros.push("Inserir a forma de pagamento")
        }

        if (typeof req.body.forma_de_pagamento == "number") {
            erros.push("forma de pagamento errada")
        }

        if (item.length < 24 || item.length > 24) {
            erros.push("Produto não existe")
        }

        if (erros.length > 0) {
            res.status(400)
            res.send(erros)
            return
        }
        else {
            await transacao.save()
            return res.status(201).send("Transacao foi realizada con sucesso")
        }

    }
    catch (error) {

        return res.status(400).send("É obrigatorio inserir o Item")
    }

});

// get all transacao
/**
 * @swagger
 * /api/transacao:
 *  get: 
 *   summary: mostrar todas as transações
 *   tags: [transacao]
 *   responses:
 *    200:
 *     description: Todas as transações
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *        $ref: '#/components/schemas/transacao'
 */
router.get("/transacao", (req, res) => {
    transacaoSchema
        .find()
        .populate('item')
        .then((data) => res.status(200).json(data))
        .catch((error) => res.json({ message: error }));
});

// get a transacao
/**
 * @swagger
 * /api/transacao/{id}:
 *  get: 
 *   summary: Mostrar transação
 *   tags: [transacao]
 *   parameters:
 *   - in: path
 *     name: id
 *     schema:
 *      type: string
 *     required: true
 *   responses:
 *    200:
 *     description: Transação actualizada com sucesso
 *     content: 
 *      application/json:
 *       schema:
 *        type: object
 *        $ref: '#/components/schemas/transacao'
 *    404:
 *      description: transação no encontrado
 */
router.get("/transacao/:id", (req, res) => {
    const { id } = req.params;
    transacaoSchema
        .findById(id)
        .populate('item')
        .then((data) => res.json(data))
        .catch((error) => res.status(404).send("Transacao não encontrada"));
});

//update a transacao
/**
 * @swagger
 * /api/transacao/{id}:
 *  put: 
 *   summary: transação atualizada
 *   tags: [transacao]
 *   parameters:
 *   - in: path
 *     nome: id
 *     schema:
 *      type: string
 *     required: true
 *     description: id do produto
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       $ref: '#/components/schemas/transacao'
 *   responses:
 *    200:
 *     description: transação atualizada
 *    404:
 *      description: Transacao não encontrada
 */

router.put("/transacao/:id", async (req, res) => {
    const { id } = req.params;
    const { valor, forma_de_pagamento, item } = transacaoSchema(req.body);
    const erros = []

    try {
        if (typeof req.body.valor == "string") {
            erros.push("Valor errado")
        }

        if (typeof req.body.forma_de_pagamento == "number") {
            erros.push("Forma de pagamento errrada")
        }

        if (erros.length > 0) {
            res.status(404)
            res.send(erros)
        }

        else {
            await transacaoSchema.updateOne({ _id: id }, { $set: { valor, forma_de_pagamento, item } })
            res.status(200).json("Transacao actualizada com sucesso")
        }
    }

    catch { res.status(404).send("Transacao não encontrada") };

});

// delete a transacao
/**
 * @swagger
 * /api/transacao/{id}:
 *  delete: 
 *   summary: Apagar uma transação
 *   tags: [transacao]
 *   parameters:
 *   - in: path
 *     nome: id
 *     schema:
 *      type: string
 *     required: true
 *     description: id da transação
 *   responses:
 *    200:
 *     description: transação deletada com sucesso
 *    404:
 *      description: Transação não encontrada
 */
router.delete("/transacao/:id", (req, res) => {
    const { id } = req.params;
    transacaoSchema
        .remove({ _id: id })
        .then((data) => await = res.status(200).send("transação deletada com sucesso"))
        .catch((error) => res.status(404).send("Transação não encontrada"));
});

module.exports = router;
