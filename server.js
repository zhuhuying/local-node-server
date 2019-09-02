const express = require('express') ;//引入express框架
const mysql = require('mysql');
const app = express();

var secretkey = 'secretkey';

var bodyParser = require('body-parser');
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));


var conn = mysql.createConnection({
    host: 'localhost',
    port:'3306',
    user: 'root',
    password: '123',
    database: 'music',
});
app.all('*',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

var server = app.listen(4000,function(){
    var host = server.address().address
    var port = server.address().port
    console.log('server start')
});

conn.connect(function(error){
    if(!!error) console.log('connect error');
    else console.log('connected');
});


app.post('/user/login', (req,res) => {   //登录请求
    var name = req.body.username;
    var passwd = req.body.userpassword;
    var userStr = `SELECT userpassword,Uid FROM user WHERE username="${name}" `;
    conn.query(userStr,function(err,rows){
        var result = JSON.stringify(rows)
        result = JSON.parse(result);
        if(result.length >0){
        if(result[0].userpassword !== passwd){
            console.log( result[0].userpassword )
            console.log( passwd)
            res.send({
                msg: 100,    //密码错误返回
            })
        }else{
            res.json({
                msg: 200,
                uid: result[0].Uid  //登录成功返回
            })
        }}else{
            res.send({
                msg: 150     //用户名不存在返回
            })
        }
    })
})

app.post('/user/username',function(req,res){
    var uid = req.body.Uid
    conn.query(`SELECT username FROM user WHERE Uid="${uid}"`,function(err,result){
    var result1 = JSON.stringify(result)
    result1 = JSON.parse(result1)
    console.log('1',result1)
        if(!!err) console.log('usererror');
        else {
               res.send(result1)
        } 
    
    })
});


app.post('/user/register',function(req,res){  //注册请求
    var name = req.body.username;
    var passwd = req.body.userpassword;
    var json = {};
    var userStr = `select username from user where username="${name}"`;
    conn.query(userStr,function(err,result){
        var result1 = JSON.stringify(result);
        result1 = JSON.parse(result1);
        console.log( result1.length )
        console.log( name)
        if(err) throw err;
        if(result1.length > 0){
            json.message= '注册失败用户已经存在';
            json.msg = 100;
        }else{
            json.message = '请求成功';
            json.msg = 200;
            var insertStr = `insert into user (Uid,username, userpassword) values (${null},"${name}", "${passwd}")`;
            console.log(insertStr)
            conn.query(insertStr,function(err,res){
                if(err) throw err;
            })
        }
        res.send(JSON.stringify(json))
    })
})

app.post('/song/collectlist',function(req,res){
    var uid = req.body.Uid
    conn.query(`SELECT songid,songname,songartist FROM song WHERE Uid="${uid}"`,function(err,result){
    var result1 = JSON.stringify(result)
    result1 = JSON.parse(result1)
    console.log('1',result1)
        if(!!err) console.log('usererror');
        else {
               res.send(result1)
        } 
    
    })
});
app.post('/song/collect',function(req,res){
    var uid = req.body.Uid;
    var songid =req.body.songid;
    var songstr = `SELECT * FROM song WHERE  Uid="${uid}" and songid="${songid}"`
    conn.query(songstr,function(err,result){
        var result1 = JSON.stringify(result)
        result1 = JSON.parse(result1);
        console.log( result1.length )
        if(err) throw err;
        if( result1.length > 0){
            res.send({
                msg: 100    //该用户已收藏
            })
        }else{
            conn.query('INSERT INTO song SET ?',req.body,function(err,rows){
            if(err) throw err;
            res.send({
                msg: 200
            })
            })
        }
    })   
        
 })





