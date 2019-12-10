const express = require("express");

const knex = require("./data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/accounts", (req, res) => {
    knex
    .select("*")
    .from("accounts")
    .then(accounts => {
        res.status(200)
        .json(accounts);
    })
    .catch(err => {
        console.log(err);
        res.status(500)
        .json({ errorMessage: "Error getting Accounts" });
    });
});

server.get("/accounts/:id", (req, res) => {
    const AccountId = req.params.id;
    knex
    .select("*")
    .from("accounts")
    .where("id" === AccountId)
    .first()
    .then(account => {
        if (account) {
            res.status(200)
            .json(accounts);
        } else {
            res.status(404)
            .json({ message: "Account does not exist. Try another id." });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500)
        .json({ errorMessage: "Error getting Account" });
    });
});

server.post("/accounts", (req, res) => {
    const newAccount = req.body;

    knex("accounts")
    .insert(newAccount, "id")
    .then(ids => {
        const id = ids[0];
        return knex("accounts")
        .select("id", "name", "budget")
        .where({ id })
        .first()
        .then(account => {
        res.status(200)
        .json(account);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500)
        .json({ errorMessage: "Error adding Account" });
    });
});

server.put("/accounts/:id", (req, res) => {
    const accountId = req.params.id;
    const changes = req.body;

    knex("accounts")
    .update(changes)
    .where(accountId)
    .then(count => {
        res.status(200)
        .json({ message: `${count} account(s) updated` });
    })
    .catch(err => {
        console.log(err);
        res.status(500)
        .json({ errorMessage: "Error updating Account" });
    });
});

server.delete("/accounts/:id", (req, res) => {
    const { id } = req.params;
    knex("accounts")
    .where({ id })
    .del()
    .then(count => {
        res.status(200)
        .json({ message: `${count} accounts(s) deleted` });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ errorMessage: "Error deleting the account" });
        });
});

module.exports = server;