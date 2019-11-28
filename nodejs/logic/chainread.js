const config = require('../config');
const {Api, JsonRpc, RpcError} = require('eosjs');
const fetch = require('node-fetch');
const rpc = new JsonRpc('http://' + config.Nodeos.ip + ':' + config.Nodeos.port, {fetch});

module.exports = {

    //CHAIN READ
    async applications() {
        return await rpc.get_table_rows({
            "json": true,
            "code": "reporting",
            "scope": "reporting",
            "table": "application",
            "limit": 100
        });
    },
    async blamings() {
        return await rpc.get_table_rows({
            "json": true,
            "code": "reporting",
            "scope": "reporting",
            "table": "blaming",
            "reverse": true
        });
    },
    async items() {
        return await rpc.get_table_rows({
            "json": true,
            "code": "reporting",
            "scope": "reporting",
            "table": "item",
            "reverse": true
        });
    },
    async warnings() {
        return await rpc.get_table_rows({
            "json": true,
            "code": "reporting",
            "scope": "reporting",
            "table": "warning",
            "reverse": true
        });
    },
    async items_byKey(key) {
        return await rpc.get_table_rows({
            "json": true,
            "code": "reporting",
            "scope": "reporting",
            "table": "item",
            "lower_bound": key,
            "upper_bound": key,
            "limit": 1,
            "reverse": true
        });
    },
    async orders() {
        return await rpc.get_table_rows({
            "json": true,
            "code": "reporting",
            "scope": "reporting",
            "table": "order"
        });
    },
    async users() {
        return await rpc.get_table_rows({
            "json": true,
            "code": "reporting",
            "scope": "reporting",
            "table": "users"
        });
    },
    async users_byUser(user) {
        return await rpc.get_table_rows({
            "json": true,
            "code": "reporting",
            "scope": "reporting",
            "table": "users",
            "lower_bound": user,
            "limit": 1
        });
    },
    async votings() {
        return await rpc.get_table_rows({
            "json": true,
            "code": "reporting",
            "scope": "reporting",
            "table": "voteassign"
        });
    },
    async votingbs() {
        return await rpc.get_table_rows({
            "json": true,
            "code": "reporting",
            "scope": "reporting",
            "table": "votingb"
        });
    }


};