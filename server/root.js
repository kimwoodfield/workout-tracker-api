const app = require("./server");
const port = 3000;

app.listen(process.env.PORT || "3000", () => {
    console.log(`Server is running on port: ${process.env.PORT || port}`);
});