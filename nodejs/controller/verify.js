const nav = require('./parent');
const path = __dirname + '/views/';
const chainwrite = require('../logic/chainwrite');
const fs = require('fs');
const chainread = require('../logic/chainread');
const jsdom = require("jsdom");
const jquery = require("jquery");
const config = require('../config');
const site = "verify";

module.exports = {


    async handleRequest(req, res) {

        let type = req.body.key;
        let approve = req.body.approve;
        let reject = req.body.reject;
        let item = req.body.item;
        let rating = req.body.rating;
        try {


            if (approve != undefined) {
                await chainwrite.verify(item, true, rating);
            } else {
                await chainwrite.verify(item, false, rating);
            }
        } catch (e) {
            console.log(e);
            this.loadPage(res);
        }

        this.loadPage(res);

    },
    async loadPage(res, err, done) {
        let view = nav.load(site);
        let votings = [];

        await chainread.votings().then(voting => {
            for (let i = 0; i < voting.rows.length; i++) {
                let row = voting.rows[i];
                if (row.voter == config.user) {
                    votings[row.itemKey] = row;
                }
            }
        });

        let items = chainread.items();
        await items.then(result => {

                let table = '<table class="table align-items-center table-flush">';
                table += `<tr>
                <th>Id</th>
                <th>Reporter</th>
                <th>Information</th>
                <th>Description</th>
                <th>Price</th>
                <th>Status</th>
                <th>Download</th>
                <th>Status</th>
                </tr>`;
                for (let i = 0; i < result.rows.length; i++) {
                    let row = result.rows[i];

                    if (votings[row.key] == undefined)
                        continue;

                    console.log(votings[row.key].key);

                    table += '<tr>';

                    //id
                    table += '<td>' + row.key + '</td>';
                    //reporter
                    table += '<td>' + row.reporter + '</td>';

                    //information
                    table += '<td><div class="label-ok">' + 'Votes: ' + row.votes + '<br> Quality: ' + row.rating + '</div></td>';

                    //description
                    table += '<td><div class="label-primary">' + row.description + '</div></td>';

                    //price
                    table += '<td><div class="label-primary">' + row.price + '</div></td>';


                    //Status
                    let accepted = row.accepts < 3 ? false : true;
                    table += '<td><div class="label-secondary ' + (accepted ? "text-green" : "text-orange") + '">' + (accepted ? "Verified" : "Pending") + '</div></td>';


                    table += '<td><a href="/download?user=' + row.reporter + '&hash=' + row.hash + '" class="btn btn-sm btn-primary">Download</a></td>';


                    if (votings[row.key].done == 0) {
                        //Download


                        table += '<td><form method="post" action="/verify">';
                        table += '<input type="hidden" name="item" value="' + row.key + '"/>';
                        table += '<input type="hidden" name="key" value="vote"/>';
                        table += '<label>Rating: </label>';
                        table += '<input type="text" name="rating" value="1"/>';
                        table += '<input type="submit" name="reject" class="btn btn-sm btn-danger" value="Reject">';
                        table += '<input type="submit" name="approve"  class="btn btn-sm btn-success" value="Approve">';
                        table += '</form></td>';
                    } else {
                        if (votings[row.key].approved) {
                            table += '<td><div class="label-primary text-green">Approved (Rating: ' + votings[row.key].rating + ')</div></td>';
                        } else {
                            table += '<td><div class="label-primary text-red">Rejected(' + votings[row.key].rating + ')</div></td>';
                        }


                    }

                    table += '</tr>';
                }
                table += '</table>';

                //place table;
                let view_dom = new jsdom.JSDOM(view);
                let $ = jquery(view_dom.window);
                $('.table-responsive').html(table);
                view = view_dom.serialize();

                //send page to user
                nav.deliver(res, view, err, done);
            },
            function (err) {
                console.log(err);
            }
        );
    }
};