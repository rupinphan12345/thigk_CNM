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