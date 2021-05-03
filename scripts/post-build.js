require("dotenv").config();

const { exec } = require("child_process");

const BUILD_DIR = process.env.BUILD_DIR;

console.log("BUILD_DIR",BUILD_DIR);

exec(`rm -r ${BUILD_DIR}`, (err) => {
  if (err) {
    console.log("error", err);
    process.exit(1);
  }
  exec(`cp -a ./build ${BUILD_DIR}`, (err) => {
    if (err) {
      console.log("error", err);
      process.exit(1);
    }
    console.log("done");
  });
});
