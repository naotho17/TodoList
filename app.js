require('dotenv').config();
// ①express,MySQLの読み込み
const express = require('express');
const mysql = require('mysql');
const app = express();

// ④フォームから送信された値を受け取れるようにする
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
// ③createConnectionメソッドでMySQLへ接続
// データベース名、PWなどを書く
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE
});

//②接続できていないときにエラーを表示する機能
connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('接続成功！！！');
});



// ②'/'のルーティング処理
app.get('/', (req, res) => {

    // 第一引数errorはクエリが失敗したときのエラー情報、
    // 第二引数resultsにはクエリの実行結果(ここでは取得したメモ情報)が入る
    connection.query(
      'SELECT * FROM items',
      (error, results) => {
        console.log(results);
        res.render('index.ejs', {items: results});
      }
    );
});


// ⑤メモ追加の処理のルーティング
app.post('/', (req, res) => {
  connection.query(
    'INSERT INTO items (name) VALUES (?)',
    [req.body.itemName],
    (error, results) => {
      res.redirect('/');
    }
  );
});

// ⑥メモ削除のためのルーティング
app.post('/:id', (req, res) => {
  //メモを削除する処理
  connection.query(
    'DELETE FROM items WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/');
    }
  );
  
});

app.listen(3000);