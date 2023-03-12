const express = require('express');
const stockRouter = require("./routers/stock");
const cyptoRouter = require("./routers/cypto");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use("/stock", stockRouter);
app.use("/cypto", cyptoRouter);

app.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}!`);
})