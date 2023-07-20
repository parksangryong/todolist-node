const express = require("express");
const app = express();
const PORT = 4000;
const cors = require("cors");
var mysql = require("mysql");

const db = mysql.createPool({
  host: "svc.sel4.cloudtype.app",
  user: "root",
  password: "33123asd",
  database: "testdb",
  port: 31341,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("test open");
});

app.get("/todo", (req, res) => {
  db.query(`select * from todo_table order by date desc`, (err, data) => {
    if (!err) {
      console.log(data);
      res.send(data);
    } else {
      console.log(err);
    }
  });
});

app.get("/todo/:tf", (req, res) => {
  const tf = req.params.tf;
  db.query(`select * from todo_table where complete=${tf}`, (err, data) => {
    if (!err) {
      //console.log(data)
      res.send(data);
    } else {
      console.log(err);
    }
  });
});

app.post("/todo", (req, res) => {
  console.log(req.body);
  const num = parseInt(req.body.num);
  const todo = req.body.todo;
  const date = req.body.date;
  db.query(
    `INSERT INTO todo_table VALUES (${num}, '${todo}', '${date}', 0)`,
    (err, data) => {
      if (!err) {
        console.log(data);
        res.send("추가되었습니다.");
      } else {
        console.log(err);
      }
    }
  );
});

app.put("/todo", (req, res) => {
  console.log(req.body);
  const num = parseInt(req.body.num);
  const todo = req.body.todo;
  const date = req.body.date;
  db.query(
    `update todo_table set todo='${todo}', date='${date}' where num = ${num}`,
    (err, data) => {
      if (!err) {
        console.log(data);
        res.send("수정되었습니다.");
      } else {
        console.log(err);
      }
    }
  );
});

app.delete("/todo", (req, res) => {
  console.log(req.body);
  const num = parseInt(req.body.num);
  db.query(`delete from todo_table where num=${num}`, (err, data) => {
    if (!err) {
      console.log(data);
      res.send("삭제되었습니다.");
    } else {
      console.log(err);
    }
  });
});

app.put("/todoall", (req, res) => {
  db.query(`update todo_table set complete=1`, (err, data) => {
    if (!err) {
      console.log(data);
      res.send("전체완료되었습니다.");
    } else {
      console.log(err);
    }
  });
});
app.put("/todoallx", (req, res) => {
  db.query(`update todo_table set complete=0`, (err, data) => {
    if (!err) {
      console.log(data);
      res.send("전체취소되었습니다.");
    } else {
      console.log(err);
    }
  });
});

app.put("/todocom", (req, res) => {
  const { num, complete } = req.body;

  db.query(
    `update todo_table set complete=${complete} where num=${num}`,
    (err, data) => {
      if (!err) {
        console.log(data);
        res.send("수정되었습니다.");
      } else {
        console.log(err);
      }
    }
  );
});

app.delete("/todoall", (req, res) => {
  db.query(`delete from todo_table`, (err, data) => {
    if (!err) {
      console.log(data);
      res.send("전체삭제되었습니다.");
    } else {
      console.log(err);
    }
  });
});

// board -------------------------------------------------------------------------

app.get("/id", (req, res) => {
  db.query(`select * from users`, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      res.send(err);
    }
  });
});
//id 조회

app.post("/login", (req, res) => {
  const { id, password } = req.body;

  db.query(
    `SELECT * FROM users WHERE id = '${id}' AND password = '${password}'`,
    (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        res.json({ success: true, message: "로그인 성공" });
      } else {
        res.json({
          success: false,
          message: "아이디 또는 비밀번호가 올바르지 않습니다.",
        });
      }
    }
  );
});
//로그인

app.post("/id", (req, res) => {
  console.log(req.body);
  const id = req.body.id;
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    `insert into users values ('${id}', '${username}', '${password}')`,
    (err, results) => {
      if (err) {
        res.json({ success: true, message: "중복됩니다." });
      } else if (!err) {
        res.json({ success: false, message: "회원가입 성공" });
      }
    }
  );
}); // 회원가입

app.put("/id", (req, res) => {
  console.log(req.body);
  const id = req.body.id;
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    `update users set username= '${username}', password='${password}',id='${id}' where id='${id}'`,
    (err, data) => {
      if (!err) {
        console.log("put 성공");
      } else {
        res.send(err);
      }
    }
  );
}); // 회원정보 수정

app.delete("/id", (req, res) => {
  console.log(req.body);
  const id = req.body.id;

  db.query(`delete from users where id='${id}' `, (err, data) => {
    if (!err) {
      console.log("delete 성공");
    } else {
      res.send(err);
    }
  });
}); // 회원탈퇴

app.get("/board", (req, res) => {
  db.query(`select * from boards order by id desc`, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
    }
  });
});
//게시판 전체 조회

app.get("/name/:name", (req, res) => {
  console.log(req.params);
  const name = req.params.name;
  db.query(`select * from boards where user_id = '${name}' `, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
    }
  });
});
//자기 게시판 전체 조회

app.get("/area/:area", (req, res) => {
  console.log(req.params);
  const area = req.params.area;
  db.query(
    `SELECT b.id, b.title, b.content, b.user_id, b.w_date FROM boards b JOIN users u ON b.user_id = u.id WHERE u.username = '${area}' `,
    (err, data) => {
      if (!err) {
        res.send(data);
      } else {
        res.send("검색 값이 없습니다.");
      }
    }
  );
});
//게시판 소속 검색

app.get("/title/:title", (req, res) => {
  console.log(req.params);
  const title = req.params.title;
  db.query(
    `select * from boards where title like '%${title}%' `,
    (err, data) => {
      if (!err) {
        res.send(data);
      } else {
        res.send("검색 값이 없습니다.");
      }
    }
  );
});
//게시판 제목 검색

app.get("/date/:date", (req, res) => {
  console.log(req.params);
  const w_date = req.params.date;
  db.query(`select * from boards where w_date = '${w_date}' `, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      res.send("검색 값이 없습니다.");
    }
  });
});
//게시판 날짜 검색

app.get("/num/:id", (req, res) => {
  console.log(req.params);
  const id = parseInt(req.params.id);
  db.query(`select * from boards where id = '${id}' `, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
    }
  });
});
//게시판 상세보기

app.post("/board", (req, res) => {
  console.log(req.body);
  const id = parseInt(req.body.id);
  const title = req.body.title;
  const content = req.body.content;
  const user_id = req.body.user_id;
  const w_date = req.body.w_date;

  db.query(
    `insert into boards values (${id}, '${title}', '${content}', '${user_id}', '${w_date}')`,
    (err, data) => {
      if (!err) {
        console.log("post 성공");
      } else {
        console.log(err);
      }
    }
  );
}); // 게시물 등록

app.put("/board", (req, res) => {
  console.log(req.body);
  const id = parseInt(req.body.id);
  const title = req.body.title;
  const content = req.body.content;

  db.query(
    `update boards set title= '${title}', content='${content}' where id=${id}`,
    (err, data) => {
      if (!err) {
        console.log("put 성공");
      } else {
        console.log(err);
      }
    }
  );
}); // 게시물 내용 수정

app.delete("/board", (req, res) => {
  console.log(req.body);
  const id = parseInt(req.body.id);

  db.query(`delete from boards where id=${id}`, (err, data) => {
    if (!err) {
      console.log("delete 성공");
    } else {
      console.log(err);
    }
  });
}); // 게시물 삭제

app.get("/allanswer", (req, res) => {
  console.log(req.params);
  db.query(`select * from answer order by id desc `, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      res.send(err);
    }
  });
});
//댓글 보기(게시판 번호조회)

app.get("/answer/:id", (req, res) => {
  console.log(req.params);
  const id = parseInt(req.params.id);
  db.query(
    `select * from answer where board_id = '${id}' order by id desc `,
    (err, data) => {
      if (!err) {
        res.send(data);
      } else {
        res.send(err);
      }
    }
  );
});
//댓글 보기(게시판 번호조회)

app.post("/answer", (req, res) => {
  console.log(req.body);
  const id = parseInt(req.body.id);
  const board_id = parseInt(req.body.board_id);
  const answer = req.body.answer;
  const date = req.body.date;
  const name = req.body.name;

  db.query(
    `insert into answer values ('${answer}', '${date}', ${board_id}, '${name}', ${id})`,
    (err, data) => {
      if (!err) {
        res.send("post 성공");
      } else {
        res.send(err);
      }
    }
  );
}); // 댓글 등록

app.put("/answer", (req, res) => {
  console.log(req.body);
  const id = parseInt(req.body.id);
  const answer = req.body.answer;

  db.query(
    `update answer set answer= '${answer}' where id=${id}`,
    (err, data) => {
      if (!err) {
        res.send("put 성공");
      } else {
        res.send(err);
      }
    }
  );
}); // 댓글 수정

app.delete("/answer", (req, res) => {
  console.log(req.body);
  const id = parseInt(req.body.id);

  db.query(`delete from answer where id=${id}`, (err, data) => {
    if (!err) {
      res.send("delete 성공");
    } else {
      res.send(err);
    }
  });
}); // 댓글 삭제

// book ---------------------------------------------------------------------------

app.post("/booklogin", (req, res) => {
  const { username, password } = req.body;

  db.query(
    `SELECT * FROM book_users WHERE username = '${username}' AND password = '${password}'`,
    (err, data) => {
      if (err) throw err;

      if (data.length > 0) {
        res.json({ success: true, message: "로그인 성공", data: data });
      } else {
        res.json({
          success: false,
          message: "아이디 또는 비밀번호가 올바르지 않습니다.",
        });
      }
    }
  );
});
//로그인하기

app.post("/bookid", (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    `insert into book_users (username, email, password) values ('${username}', '${email}', '${password}')`,
    (err, results) => {
      if (err) {
        res.json({ success: true, message: "중복됩니다." });
      } else if (!err) {
        res.json({ success: false, message: "회원가입 성공" });
      }
    }
  );
}); // 회원가입

app.put("/bookid", (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    `update book_users set email= '${email}', password='${password}' where username='${username}'`,
    (err, data) => {
      if (!err) {
        res.send("회원정보 수정 완료");
      } else {
        res.send(err);
      }
    }
  );
}); // 회원정보 수정

app.delete("/bookid", (req, res) => {
  console.log(req.body);
  const username = req.body.username;

  db.query(
    `delete from book_users where username='${username}' `,
    (err, data) => {
      if (!err) {
        res.send(username + "의 회원정보 삭제");
      } else {
        res.send(err);
      }
    }
  );
}); // 회원탈퇴

app.get("/book", (req, res) => {
  db.query(`select * from book order by id desc`, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      res.send(err);
    }
  });
});
//책 목록 조회

app.get("/bookinfo/:id", (req, res) => {
  console.log(req.params);
  const id = parseInt(req.params.id);

  db.query(`select * from book where id =${id}`, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      res.send(err);
    }
  });
});
//책 상세보기

app.post("/book", (req, res) => {
  console.log(req.body);
  const title = req.body.title;
  const author = req.body.author;
  const description = req.body.description;
  const price = parseInt(req.body.description);
  const image_url = req.body.image_url;
  const seller_id = req.body.seller_id;

  db.query(
    `INSERT INTO books (title, author, description, price, image_url, seller_id) VALUES ('${title}', '${author}', '${description}', ${price}, '${image_url}', '${seller_id}');`,
    (err, results) => {
      if (err) {
        res.send(err);
      } else if (!err) {
        res.send("등록 성공");
      }
    }
  );
}); // 책 등록

app.put("/book", (req, res) => {
  console.log(req.body);
  const id = parseInt(req.body.id);
  const title = req.body.title;
  const author = req.body.author;
  const description = req.body.description;
  const price = parseInt(req.body.description);
  const image_url = req.body.image_url;

  db.query(
    `update book set title= '${title}', author='${author}',description='${description}', price=${price}, image_url='${image_url}' where id=${id}`,
    (err, data) => {
      if (!err) {
        res.send("put 성공");
      } else {
        res.send(err);
      }
    }
  );
}); // 책 내용 수정

app.delete("/book", (req, res) => {
  console.log(req.body);
  const id = parseInt(req.body.id);

  db.query(`delete from book where id=${id} `, (err, data) => {
    if (!err) {
      res.send("delete 성공");
    } else {
      res.send(err);
    }
  });
}); // 책 삭제

app.listen(PORT, () => {
  console.log(`https://localhost:${PORT}`);
});
