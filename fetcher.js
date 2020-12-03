const request = require("request");
const fs = require("fs");
const nodeArgs = process.argv;
const url = nodeArgs[2];
const filePath = nodeArgs[3];
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

request(url, (error, response, body) => {
  if (error) {
    console.log("error:", error.code);
    return rl.close();
  }
  // Print the error if one occurred
  // console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
  // console.log("body:", body); // Print the HTML for the Google homepage.
  else {
    fs.access(filePath, (err) => {
      if (!err) {
        rl.question(
          "file already exists, if you want to print contetc again type 'Y': ",
          (answer) => {
            if (answer === "Y") {
              fs.writeFile(filePath, body, () => {
                console.log(
                  `Downloaded and saved ${response.headers["content-length"]} bytes to ${filePath}`
                );
              });
            }
            return rl.close();
          }
        );
      } else {
        fs.writeFile(filePath, body, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log(
              `Downloaded and saved ${response.headers["content-length"]} bytes to ${filePath}`
            );
            return rl.close();
          }
        });
      }
    });
  }
});
