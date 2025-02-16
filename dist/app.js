"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => {
    res.send('Hello, Express with TypeScript!');
});
app.post('/update-data', (req, res) => {
    console.log(req.body)
    res.send('Hello, Express with TypeScript!d');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
