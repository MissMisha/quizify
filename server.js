let express = require("express");
let mysql2 = require("mysql2");

let app = express();

let { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, } = require("@google/generative-ai");

let config = {
    host: "127.0.0.1",
    user: "root",
    password: "Misha@26",
    database: "nodequiz",
    dateStrings: true
}

const genAI = new GoogleGenerativeAI("AIzaSyCl7aOrZSpDPK_8NP-TI5FDnZj-ucft3ZE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

app.use(express.urlencoded("true"));
app.use(express.static("public")); // This line gives access to all files in public folder to localhost

var mysql = mysql2.createConnection(config);
mysql.connect(function (err) {
    if (err == null) {
        console.log("Database Connected successfully");
    }
    else {
        console.log(err.message);
    }
})



app.listen(2008, function (req, resp) {

    console.log("Server started :)");
})
app.get("/", function (req, resp) {
    let path = __dirname + "/public/index.html"
    resp.sendFile(path)
})

app.get("/login.html", function (req, resp) {
    
    let path = __dirname + "/public/login.html"
    resp.sendFile(path)
})

app.get("/signup", function (req, resp) {
    let path = __dirname + "/public/signup.html"
    resp.sendFile(path)
})
app.get("/dashboard.html", function (req, resp) {
    let path = __dirname + "/public/dashboard.html"
    resp.sendFile(path)
})

app.get("/quizpage", function (req, resp) {
    let path = __dirname + "/public/quizpage.html"
    resp.sendFile(path)
})

app.get("/adminpanel", function (req, resp) {
    let path = __dirname + "/public/adminpanel.html"
    resp.sendFile(path);
})
app.get("/mainquizpage", function (req, resp) {
    let path = __dirname + "/public/mainquizpage.html"
    resp.sendFile(path);
})

app.get("/result", function (req, resp) {
    let path = __dirname + "/public/result.html"
    resp.sendFile(path);
})

app.get("/post-question", function (req, resp) {
    console.log("helo");

    let qid = req.query.qid;
    let ques = req.query.ques;
    let ans = req.query.ans;
    let opt1 = req.query.opt1;
    let opt2 = req.query.opt2;
    let opt3 = req.query.opt3;
    let opt4 = req.query.opt4;
    let selSub = req.query.selSub;
    let selDiff = req.query.selDiff;
    let postMsg = req.query.postMsg;


    mysql.query("insert into questRecord values(?,?,?,?,?,?,?,?,?)", [null, ques, opt1, opt2, opt3, opt4, ans, selDiff, selSub], function (err) {
        if (err == null) {
            console.log("posted")
            resp.send("Posted Successfully :) ")

        }
        else
            console.log(err.message);
    })

})

app.get("/fetch-subjects", function (req, resp) {
    // console.log("API")
    mysql.query("select distinct subj from questRecord", function (err, jsonSubAry) {
        if (err == null) {
            resp.send(jsonSubAry)
            // console.log(JSON.stringify(jsonSubAry))
        }
        else {
            console.log(err)
        }
    })
})

app.get("/ques-manager", function (req, resp) {
    let path = __dirname + "/public/quesmanager.html"
    resp.sendFile(path);
})

app.get("/fetch-some-quest", function (req, resp) {
    console.log(req.query);
    mysql.query("select * from questRecord where subj=? and diff=? ", [req.query.subj, req.query.diff], function (err, jsonQuesAry) {

        if (err == null) {
            resp.send(jsonQuesAry)
            // console.log(jsonQuesAry)
        }
        else {
            console.log(err.message)
        }
    })

})

app.get("/create-ai-quiz", async function (req, resp) {
    
    let {subj, diff,count} = req.query;

    const input = `give me ${count} mcqs in an array of ${subj} of ${diff} level with keys question, array of options, correct_index in JSON format not string.`;

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
    };

    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    let result = await chatSession.sendMessage(input);
    // console.log(result.response  );

    let result2 = result.response.text();

    resp.send(result2)


})

app.get("/del-ques", function (req, resp) {


    mysql.query("delete from questRecord where qid=? ", [req.query.qid], function (err, result) {

        if (err == null) {
            resp.send(JSON.stringify(result));

        }
        else {
            console.log(err.message)
        }
    })

})
app.get("/fetch-edit", function (req, resp) {
    mysql.query("select * from questRecord where qid=? ", [req.query.qid], function (err, fetchAry) {
        if (err) {
            console.log(err.message)
        }
        else {
            console.log(fetchAry.length)
            resp.send(fetchAry)
        }
    })
})

app.get("/do-update", function (req, resp) {
    console.log(req.query);

    let qid = req.query.hdn;
    let ques = req.query.ques;
    let ans = req.query.ans;
    let opt1 = req.query.opt1;
    let opt2 = req.query.opt2;
    let opt3 = req.query.opt3;
    let opt4 = req.query.opt4;
    let selSub = req.query.selSub;
    let selDiff = req.query.selDiff;
    let postMsg = req.query.postMsg;


    mysql.query("update questRecord set ques=?,opt1=?,opt2=?,opt3=?,opt4=?,ans=?,diff=?,subj=? where qid=?", [ques, opt1, opt2, opt3, opt4, ans, selDiff, selSub, qid], function (err) {
        if (err == null) {
            console.log("posted")
            resp.send("Updated Successfully :) ")

        }
        else
            console.log(err.message);
    })

})

app.get("/fetch-options", function (req, resp) {

    mysql.query("select * from questRecord where qid=?", [req.query.qid], function (err, result) {

        if (err == null) {
            console.log(result)
            resp.send(result)
        }
        else {
            console.log(err.message)
        }
    })
})

app.get("/save-users", function (req, resp) {
    console.log(req.query);
    let email=req.query.txtEmail;
    mysql.query("insert into quizUsers values(?,?,?)", [req.query.txtName, req.query.txtEmail, req.query.txtPwd], function (err) {

        if (err == null && email!='')
        {
            resp.send("Signup Successfull")
            console.log("Signup Successfull")
        }
        else {
            console.log(err);
        }
    })
})

app.get("/find-user", function (req, resp) {
    console.log(req.query);
    

    mysql.query("select * from quizUsers where email=? and pwd=?", [req.query.txtEmail, req.query.txtPwd], function (err, jsonArray) {
        // console.log(jsonArray.length)
        if (err != null) {
            console.log("Error")
            resp.send(err.message);

        }
        else {

            if (jsonArray.length == 1) 
            {
                console.log("Success")
                resp.send("Logged in Successfully");
            }
            else
            {
                console.log("Invalid")
                resp.send("Invalid User")
            }
        }

    })
})

app.get("/check-pwd", function (req, resp) {
    console.log(req.query);
    let pwd = req.query.txtPwd
    mysql.query("select pwd from quizUsers where email=?", [req.query.txtEmail], function (err, result) {
        console.log(result)
        if (err != null) {
            resp.send(err);

        }
        else
            if (result != pwd) {
                resp.send("Wrong Password");
            }


    })
})
app.get("/store-data",function(req,resp){
    let uid=req.query.uid;
    let subj=req.query.subj;
    let level=req.query.level;
    let marks=req.query.marks;
    let totalmarks=req.query.totalmarks;
    

    mysql.query("insert into userTestRecord values(?,?,?,?,?)",[uid,subj,level,marks,totalmarks],function(err){
        if (err == null)
            {
                resp.send("Saved Successfully")
                console.log("Saved Successfully")
            }
            else {
                console.log(err);
            }
    })

})
app.get("/fetch-stored-data",function(req,resp){

    mysql.query("select * from userTestRecord where uid=?",[req.query.email],function(err,result){
        if(err!=null){
           resp.send(err.statusText)
        }
        else
        if(result.length!=null){
            resp.send(result)
            console.log(result)
        }
    })
})

