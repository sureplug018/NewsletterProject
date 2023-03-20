const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("Public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");   
});
    
app.post("/", function(req, res){
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;

    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };  

    const jsonData = JSON.stringify(data);
    
    const url = "https://us21.api.mailchimp.com/3.0/lists/a868bf3a42";

    const options = {
        method: "POST",
        auth: "sureplug:82faa15b89c7730b46ec9a32f5846396-us21"
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();  

});

app.post("/failure", function(req, res){
    res.redirect("/");
})



app.listen(process.env.PORT || 3000, function(){
    console.log("app is running on port 3000....");
});

// api key
// 82faa15b89c7730b46ec9a32f5846396-us21

// audience id
// a868bf3a42

// rep 
// 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