const http = require("http");

console.log("Testing HMI endpoint through Vite proxy...\n");

const options = {
  hostname: "localhost",
  port: 31,
  path: "/api/lvmdp1/hmi",
  method: "GET",
  timeout: 5000,
  headers: {
    Accept: "application/json",
  },
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);

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

      console.log("\n✓ Proxy is working correctly!");
      console.log(`✓ Current R: ${json.currentR} A`);
      console.log(`✓ Current S: ${json.currentS} A`);
      console.log(`✓ Current T: ${json.currentT} A`);
    } catch (e) {
      console.log("❌ Response is not valid JSON");
    }
  });
});

req.on("error", (error) => {
  console.error("❌ Request error:", error.message);
});

req.on("timeout", () => {
  console.error("❌ Request timeout after 5 seconds");
  req.destroy();
});

req.end();
