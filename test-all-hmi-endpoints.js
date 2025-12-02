const http = require("http");

async function testEndpoint(panelId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 2000,
      path: `/api/lvmdp${panelId}/hmi`,
      method: "GET",
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve({ panelId, status: res.statusCode, data: json });
        } catch (e) {
          resolve({
            panelId,
            status: res.statusCode,
            error: "Invalid JSON",
            raw: data,
          });
        }
      });
    });

    req.on("error", (error) => {
      reject({ panelId, error: error.message });
    });

    req.on("timeout", () => {
      req.destroy();
      reject({ panelId, error: "Timeout" });
    });

    req.end();
  });
}

async function testAll() {
  console.log("=== Testing All HMI Endpoints ===\n");

  for (let i = 1; i <= 4; i++) {
    try {
      const result = await testEndpoint(i);
      console.log(`LVMDP ${result.panelId}:`);
      console.log(`  Status: ${result.status}`);
      if (result.data) {
        console.log(`  Current R: ${result.data.currentR} A`);
        console.log(`  Current S: ${result.data.currentS} A`);
        console.log(`  Current T: ${result.data.currentT} A`);
        console.log(`  Voltage R-S: ${result.data.voltageRS} V`);
        console.log(`  Voltage S-T: ${result.data.voltageST} V`);
        console.log(`  Voltage T-R: ${result.data.voltageTR} V`);
      } else {
        console.log(`  Error: ${result.error}`);
        console.log(`  Raw: ${result.raw}`);
      }
      console.log();
    } catch (err) {
      console.log(`LVMDP ${err.panelId}:`);
      console.log(`  ❌ Error: ${err.error}\n`);
    }
  }
}

testAll();
