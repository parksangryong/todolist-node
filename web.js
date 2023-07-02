const express = require('express')
const app = express()
const PORT = process.env.PORT || 8001
var mysql = require('mysql')

const db = mysql.createPool({
    host : 'localhost',
    user: 'root',
    password : '33123asd',
    database : 'todo',
    port : 3306
})

app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.get('/todo' ,(req,res) => {
    db.query(`select * from todo_table order by date desc`, (err,data) => {
        if(!err){
            console.log(data)
            res.send(data)
        }else{
            console.log(err)
        }
    })
})

app.get('/todo/:tf' ,(req,res) => {
    const tf = req.params.tf
    db.query(`select * from todo_table where complete=${tf}`, (err,data) => {
        if(!err){
            //console.log(data)
            res.send(data)
        }else{
            console.log(err)
        }
    })
})

app.post('/todo', (req,res) => {
    console.log(req.body);
    const num = parseInt(req.body.num)
    const todo = req.body.todo
    const date = req.body.date
    db.query(`INSERT INTO todo_table VALUES (${num}, '${todo}', '${date}', 0)`, (err,data) =>{
        if(!err){
            console.log(data)
            res.send("추가되었습니다.")
        }else{
            console.log(err)
        }
    })
})

app.put('/todo', (req,res)=>{
    console.log(req.body);
    const num = parseInt(req.body.num)
    const todo = req.body.todo
    const date = req.body.date
    db.query(`update todo_table set todo='${todo}', date='${date}' where num = ${num}`, (err,data) =>{
        if(!err){
            console.log(data)
            res.send("수정되었습니다.")
        }else{
            console.log(err)
        }
    })
})

app.delete('/todo', (req,res)=>{
    console.log(req.body);
    const num = parseInt(req.body.num)
    db.query(`delete from todo_table where num=${num}`, (err,data) =>{
        if(!err){
            console.log(data)
            res.send("삭제되었습니다.")
        }else{
            console.log(err)
        }
    })
})

app.put('/todoall', (req,res)=>{
    db.query(`update todo_table set complete=1`, (err,data) =>{
        if(!err){
            console.log(data)
            res.send("전체완료되었습니다.")
        }else{
            console.log(err)
        }
    })
})
app.put('/todoallx', (req,res)=>{
    db.query(`update todo_table set complete=0`, (err,data) =>{
        if(!err){
            console.log(data)
            res.send("전체취소되었습니다.")
        }else{
            console.log(err)
        }
    })
})

app.put('/todocom', (req,res)=>{
    const {num,complete} = req.body

    db.query(`update todo_table set complete=${complete} where num=${num}`, (err,data) =>{
        if(!err){
            console.log(data)
            res.send("수정되었습니다.")
        }else{
            console.log(err)
        }
    })
})

app.delete('/todoall', (req,res)=>{
    db.query(`delete from todo_table`, (err,data) =>{
        if(!err){
            console.log(data)
            res.send("전체삭제되었습니다.")
        }else{
            console.log(err)
        }
    })
})

app.listen(PORT, () =>{
    console.log(`https://localhost:${PORT}`)
})