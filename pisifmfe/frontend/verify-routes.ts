// Script to verify all routes in router config have valid components
import router from "./src/router";

const allRoutes = router.getRoutes();

console.log(`\n📋 Total routes: ${allRoutes.length}\n`);

let missingComponents = 0;

allRoutes.forEach((route) => {
  const hasComponent = !!route.component || route.redirect;
  const status = hasComponent ? "✅" : "❌";

  if (!hasComponent) {
    missingComponents++;
    console.log(
      `${status} ${route.path} (${route.name || "unnamed"}) - NO COMPONENT`
    );
  }
});

console.log(
  `\n📊 Summary: ${allRoutes.length - missingComponents}/${
    allRoutes.length
  } routes have components`
);

if (missingComponents > 0) {
  console.log(`\n⚠️  ${missingComponents} routes are missing components!`);
  process.exit(1);
} else {
  console.log(`\n✅ All routes are valid!`);
  process.exit(0);
}
