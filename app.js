const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser')
const port = process.env.PORT || 8080;///set env port (Public app)
const address = require('./public/config/config.js')
const value = require('./public/js/scripts.js')
const ejs = require('ejs')
///Set directory file
app.use('/public',express.static('public'))
///Set ejs
app.set('view engine','ejs')
///connect database
const pool = mysql.createPool(address)
///use in postman or enable to use body in form submit
app.use(bodyParser.urlencoded({ extended: false }));// create application/x-www-form-urlencoded parser
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.render('index')
    
    
})

app.get('/check',(req,res)=>{
    res.render('index')
    
    
})

app.post("/check",(req,res)=>{
    var lotnum = req.body.Lottery_number;
    let date = req.body.Lottery_number_date;
    pool.getConnection((err, connection)=>{
        if(err) throw err;
        connection.query(`SELECT * FROM lotterry_db WHERE (lottery = '${lotnum}') AND (date = '${date}');`,(err, result)=>{
            connection.release()
            
            if(result.length == 0) {
                var str = '';
                for(let i = 0; i <= 2;i++){
                    let con = lotnum[i+3];
                    str += con;
                    
                    
                }
                console.log(str)
                
                pool.getConnection((err,connection3)=>{
                    connection3.query(`SELECT * FROM lotterry_db WHERE (lottery = '${str}') AND (date = '${date}');`,(err,result)=>{
                        connection3.release()
                        let object = result[0];
                        if(result.length == 0){
                            res.render("index",{msg:"You don't get any prize lol"})
                        }
                        else{
                            res.render("index",{msg:`U got ${object.prize} prize  Date : ${object.date}`})
                        }
                    })
                })
                
            }
            else{
                ///console.log('OK')
                let object = result[0];
                res.render("index",{msg:`U got ${object.prize} prize  Date : ${object.date}`})
                
            }
        })
        
        if(!err){
           /// console.log("CONECTED")
        }
        else{
           // console.log("BADGATEWAY")
        }
        
    })
})


app.get('/admin',(req,res)=>{
    res.render('admin')
    
})

app.post('/admin', (req, res) => {
    pool.getConnection((err,connection1) => {
        if(err) throw err
        let num = req.body.Lottery_number_add;
        let date = req.body.Lottery_number_date;
        let type = req.body.Lottery_number_type
        console.log(num, date, type);
        connection1.query(`INSERT INTO lotterry_db (lottery ,prize,date) VALUES('${num}','${type}','${date}');`,(err,result1)=>{
            connection1.release()
            if(!err){
                res.render('admin',{msg:"Successfull"})
            }else{
                res.render('admin',{msg:"ERROR please try again"})
            }
        })
    })
   


})


app.get("/credit",(req,res)=>{
    res.render('credit')
})




















///set port
app.listen(port,'localhost',()=>{
    console.log("listening on port " + port);
});