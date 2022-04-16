const client = require('./connection.js')
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.listen(3300, ()=>{
    console.log("Sever is now listening at port 3000");
})

client.connect();

app.get('/users', (req, res)=>{
    client.query("Select * from service_app.users where id="+req.query.id+"", (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

app.post('/users', (req, res)=> {
    const user = req.body;
    var datetime = new Date();
    var date = datetime.toISOString().slice(0,10)
    console.log(datetime)
    let insertQuery = `INSERT INTO service_app.users(name, email, phone_number,password,created_at,updated_at, api_token, device_token)
                       values('${user.name}', '${user.email}', '${user.number}', '${user.password}', '${date}', '${date}', '${user.api_token}', '${user.device_token}')`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})

app.get('/login', (req, res)=>{
    var email = req.query.email;
    var password = req.query.password;
    console.log("Select * from service_app.users where email='"+email+"' and password='"+password+"'");
    client.query("Select * from service_app.users where email='"+email+"' and password='"+password+"'", (err, result)=>{
        if(!err){
            // res.send(result.rows);
            if (result.rows.length) {
                console.log(result.rows);
               
                // res.sendStatus(200)
                var repsonse = {
                    status:200, 
                    res:result.rows, 
                    Success:"Login Successfully !"
                };
                res.send(repsonse);

             }
             else {
                // res.sendStatus(404)
                var repsonse = {
                    status:404, 
                    Success:'Wrong Credentials.'
                };
                res.send(repsonse);
             }
        }
    });
    client.end;
})


