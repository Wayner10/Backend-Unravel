const express = require("express");
const app = express();
const port = 4000;
const placesRouter = require("./src/routes/places");
const usersRouter = require("./src/routes/users");
const categoriesRouter = require("./src/routes/categories");
const regionsRouter = require("./src/routes/regions");
const reviewsRouter = require("./src/routes/reviews");

app.use(express.json()); // Middleware para analizar cuerpos JSON
app.use("/api", placesRouter);
app.use("/api", usersRouter);
app.use("/api", categoriesRouter);
app.use("/api", regionsRouter);
app.use("/api", reviewsRouter);

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
