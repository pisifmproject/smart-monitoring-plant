const http = require("http");

console.log("Testing HMI endpoint...");

const options = {
  hostname: "localhost",
  port: 2000,
  path: "/api/lvmdp1/hmi",
  method: "GET",
  timeout: 5000,
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("\nResponse Body:");
    console.log(data);

    try {
      const json = JSON.parse(data);
      console.log("\nParsed JSON:");
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log("Not valid JSON");
    }
  });
});

req.on("error", (error) => {
  console.error("Request error:", error.message);
});

req.on("timeout", () => {
  console.error("Request timeout after 5 seconds");
  req.destroy();
});

req.end();
