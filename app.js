import express from "express";
import path from "path";
import mailchimp from "@mailchimp/mailchimp_marketing";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
  apiKey: "13b1a39e1db43cafc73987374c6d6318-us9",
  server: "us9",
});

app.post("/", (req, res) => {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var mail = req.body.eMail;

  const userData = {
    firstName: firstName,
    lastName: lastName,
    email: mail,
  };

  const listId = "ab351cc2c9";

  //Uploading Data to the server
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: userData.email,
      status: "subscribed",
      merge_fields: {
        FNAME: userData.firstName,
        LNAME: userData.lastName,
      },
    });

    res.sendFile(__dirname + "/success.html");
    console.log(
      "Successfully added contact as an audience member. The contact's id is "
    );
  }
  run().catch((e) => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

//API key
// 13b1a39e1db43cafc73987374c6d6318-us9

//List id
//ab351cc2c9
