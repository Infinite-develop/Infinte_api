const client = require('./connection.js')
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.listen(3300, () => {
    console.log("Sever is now listening at port 3000");
})

client.connect();
// alter table service_app.bookings
// alter id add generated always as identity;
app.get('/users', (req, res) => {
    client.query("Select * from service_app.users where id=" + req.query.id + "", (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})

app.post('/users', (req, res) => {
    const user = req.body;
    var datetime = new Date();
    var date = datetime.toISOString().slice(0, 10)
    console.log(datetime)
    let insertQuery = `INSERT INTO service_app.users(name, email, phone_number,password,created_at,updated_at, api_token, device_token)
                       values('${user.name}', '${user.email}', '${user.number}', '${user.password}', '${date}', '${date}', '${user.api_token}', '${user.device_token}')`

    client.query(insertQuery, (err, result) => {
        if (!err) {
            var repsonse = {
                status: 404,
                Success: 'Insertion was successful.'
            };
            res.send(repsonse);
        }
        else { console.log(err.message) }
    })
    client.end;
})

app.get('/login', (req, res) => {
    var email = req.query.email;
    var password = req.query.password;
    console.log("Select * from service_app.users where email='" + email + "' and password='" + password + "'");
    client.query("Select * from service_app.users where email='" + email + "' and password='" + password + "'", (err, result) => {
        if (!err) {
            // res.send(result.rows);
            if (result.rows.length) {
                console.log(result.rows);

                // res.sendStatus(200)
                var repsonse = {
                    status: 200,
                    res: result.rows,
                    Success: "Login Successfully !"
                };
                res.send(repsonse);

            }
            else {
                // res.sendStatus(404)
                var repsonse = {
                    status: 404,
                    Success: 'Wrong Credentials.'
                };
                res.send(repsonse);
            }
        }
    });
    client.end;
})

app.get('/category', (req, res) => {
    client.query("Select * from service_app.categories order by id desc", (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})

app.get('/individual_category', (req, res) => {
    var category_id = req.query.id;

    client.query("Select * from service_app.categories where id=" + category_id + "", (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})

app.get('/slides', (req, res) => {
    client.query("Select * from service_app.slides order by id desc", (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})

app.get('/services', (req, res) => {
    client.query("Select * FROM service_app.e_services as es join service_app.e_providers as ep on ep.id=es.e_provider_id join service_app.e_provider_types as pt on pt.id=ep.e_provider_type_id order by es.created_at desc limit 10", (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})

app.get('/individual_service', (req, res) => {
    var service_id = req.query.id;
    client.query("Select * FROM service_app.e_services as es join service_app.e_providers as ep on ep.id=es.e_provider_id join service_app.e_provider_types as pt on pt.id=ep.e_provider_type_id  where es.id=" + service_id + "", (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})

app.post('/booking', (req, res) => {
    const user = req.body;
    var datetime = new Date();
    var date = datetime.toISOString();
    console.log(datetime)
    let insertQuery = `INSERT INTO service_app.bookings(
        e_provider, e_service, options, quantity, user_id, booking_status_id, address, payment_id, coupon, taxes, booking_at, start_at, ends_at, hint, cancel, created_at, updated_at)
                       values('${user.e_provider}', '${user.e_service}', '${user.options}', '${user.quantity}', '${user.user_id}', '${user.booking_status_id}', '${user.address}', '${user.payment_id}', '${user.coupon}', '${user.taxes}', '${user.booking_at}', '${user.start_at}', '${user.ends_at}', '${user.hint}', '${user.cancel}', '${date}', '${date}')`

    client.query(insertQuery, (err, result) => {
        if (!err) {
            var repsonse = {
                status: 200,
                Success: 'Insertion was successful.'
            };
            res.send(repsonse);
        }
        else {
            console.log(err.message);
            res.send(err)
        }
    })
    client.end;
})

app.get('/allBookings', (req, res) => {
    client.query("SELECT * FROM service_app.bookings order by id desc", (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})

app.get('/upcomingBookings', (req, res) => {
    var datetime = new Date();
    console.log(datetime.toISOString().slice(0,10));
    var date = datetime.toISOString();

    client.query("SELECT * FROM service_app.bookings where booking_at>'"+date+"' order by id desc", (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
        else{
            res.send(err);
        }
    });
    client.end;
})

app.post('/createAddress', (req, res) => {
    const user = req.body;
    var datetime = new Date();
    var date = datetime.toISOString();
    console.log(datetime)
    let insertQuery = `INSERT INTO service_app.addresses(description, address, latitude, longitude, user_id, created_at, updated_at)
                       values('${user.description}', '${user.address}', ${user.latitude}, ${user.longitude}, '${user.user_id}', '${date}', '${date}')`;
                    //    console.log(insertQuery)

    client.query(insertQuery, (err, result) => {
        if (!err) {
            var repsonse = {
                status: 200,
                Success: 'Insertion was successful.'
            };
            res.send(repsonse);
        }
        else {
            console.log(err.message);
            res.send(err)
        }
    })
    client.end;
})

app.get('/individual_address', (req, res) => {
    var address_id = req.query.id;

    client.query("Select * from service_app.addresses where id=" + address_id + "", (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})

app.get('/allAddress', (req, res) => {
    var user_id = req.query.user_id;

    client.query("Select * from service_app.addresses where user_id=" + user_id + "", (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})

app.get('/delete_address', (req, res) => {
    var address_id = req.query.id;
    // console.log("DELETE from service_app.addresses where id=" + address_id + "");
    client.query("DELETE from service_app.addresses where id=" + address_id + "", (err, result) => {
        if (!err) {
            var repsonse = {
                status: 200,
                Success: 'Delete Record successful.'
            };
            res.send(repsonse);

        }
        else{
            res.send(err);
        }
    });
    client.end;
})

app.post('/updateAddress', (req, res) => {
    const address = req.body;
    var datetime = new Date();
    var date = datetime.toISOString();
    console.log(datetime)
    let insertQuery = `UPDATE service_app.addresses SET
	description='${address.description}', address='${address.address}', latitude=${address.latitude}, longitude=${address.longitude}
	WHERE id=${address.address_id}`;
                    //    console.log(insertQuery)

    client.query(insertQuery, (err, result) => {
        if (!err) {
            var repsonse = {
                status: 200,
                Success: 'Record update successful.',
                result:result
            };
            res.send(repsonse);
        }
        else {
            console.log(err.message);
            res.send(err)
        }
    })
    client.end;
})