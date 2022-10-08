//INDEX.JS

const express = require("express");
const multer = require("multer");

const app = express();
const port = 3000;
const upload = multer();

app.use(express.json({ extended: false }));
app.use(express.static("./view"));
app.set("view engine", "ejs");
app.set("views", "./view");

const AWS = require('aws-sdk');
const { response } = require("express");
const config = new AWS.Config({
    accessKeyId: 'AKIAVIBUDBQK6FG6POWH',
    secretAccessKey: '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',
    region: 'ap-southeast-1'
});

AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();

const tableName = "BaiBao"

app.get("/", (req, res) => {
    const params = {
        TableName: tableName
    }

    docClient.scan(params, (error, data) => {
        if (error) {
            response.send('Loi server')
        } else {
            return res.render("index", { data: data.Items });
        }
    })

});

app.post("/", upload.fields([]), (req, res) => {
    const { maBaiBao, tenBaiBao, chiSoISBN, soTrang, namSanXuat } = req.body;

    const params = {
        TableName: tableName,
        Item: {
            "maBaiBao": maBaiBao,
            "tenBaiBao": tenBaiBao,
            "chiSoISBN": chiSoISBN,
            "soTrang": parseInt(soTrang),
            "namSanXuat": namSanXuat,
        }
    }


    docClient.put(params, (err, data) => {
        if (err) {
            return res.send('loi server')
        } else {
            return res.redirect("/");
        }
    })
});

app.get("/add", (req, res) => {

    return res.render("form", {});

});

app.post("/delete", upload.fields([]), (req, res) => {
    const { maBaiBao } = req.body;

    const params = {
        TableName: tableName,
        Key: {
            "maBaiBao": maBaiBao
        }
    }

    docClient.delete(params, (err, data) => {
        if (err) {
            return res.send("loi Server")
        } else {
            return res.redirect("/");

        }
    })

});




app.listen(port, () => {
    console.log("listening on port : ", port);
});



//package.json
{
    "name": "thigiuak-phandinhnhat",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "start": "nodemon index.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC",
    "dependencies": {
      "aws-sdk": "^2.1227.0",
      "ejs": "^3.1.8",
      "express": "^4.18.1",
      "multer": "^1.4.5-lts.1",
      "nodemon": "^2.0.20"
  }
}

//INDEX.EJS
  
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="index.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</head>

<body>
    <div class="container">
        <table class="table">
            <h1 class="header">Danh Sach Bai Bao</h1>
            <form id="add" action="/add" method="GET" enctype="multipart/form-data">
                <button type="submit" class="btn btn-primary">them mon hoc</button>
            </form>
            <tr>
                <th>STT</th>
                <th>Ten Bai Bao</th>
                <th>Chi So ISBN</th>
                <th>So Trang</th>
                <th>Nam San Xuat</th>
                <th>actions</th>
            </tr>

            <%for(let i = 0; i < data.length; i++) {%>
                <tr>
                    <td>
                        <%=i+1%>
                    </td>
                    <td>
                        <%=data[i].tenBaiBao%>
                    </td>
                    <td>
                        <%=data[i].chiSoISBN%>
                    </td>
                    <td>
                        <%=data[i].soTrang%>
                    </td>
                    <td>
                        <%=data[i].namSanXuat%>
                    </td>
                    <td>
                        <form action="/delete" method="POST" enctype="multipart/form-data">
                            <input type="hidden" name="maBaiBao" value="<%=data[i].maBaiBao%>" />
                            <button type="submit" class="btn btn-danger">delete</button>
                        </form>
                    </td>
                    <%}%>
                </tr>
        </table>
    </div>
</body>

</html>


//FORM.EJS
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="index.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</head>

<body>
    <div class="container">
        <div style="display: flex;justify-content: center;">
            <form action="/" method="POST" enctype="multipart/form-data" id="formBaiBao">
                <label for="maBaiBao">Ma Bai Bao</label><br />
                <input type="text" id="maBaiBao" name="maBaiBao" required="required"/><br />
                <label for="tenBaiBao">Ten Bai Bao</label><br />
                <input type="text" id="tenBaiBao" name="tenBaiBao" /><br />
                <label for="chiSoISBN">Chi So ISBN</label><br />
                <input type="text" id="chiSoISBN" name="chiSoISBN" /><br />
                <label for="soTrang">So Trang</label><br />
                <input type="text" id="soTrang" name="soTrang" pattern="[0-9]{1}" title="phải là số dương" /><br />
                <label for="namSanXuat">Nam San Xuat</label><br />
                <input type="text" id="namSanXuat" name="namSanXuat" pattern="[0-9]{1}" title="phải là số dương"/><br />
                <button class="btn btn-primary" type="submit">Add</button>
            </form>
        </div>
    </div>
</body>

</html>