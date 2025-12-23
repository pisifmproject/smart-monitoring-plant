import { db } from "./src/db/index";
import { dailyReportLVMDP1 } from "./src/db/schema";

(async () => {
  const result = await db.select().from(dailyReportLVMDP1).limit(1);

  if (result.length > 0) {
    console.log("Database Result for LVMDP 1:");
    console.log(JSON.stringify(result[0], null, 2));
  } else {
    console.log("No data found");
  }

  process.exit(0);
})();
