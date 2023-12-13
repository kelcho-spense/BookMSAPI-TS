import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { authorRouter } from './author/author.router';
import { bookRouter } from './book/book.router';

dotenv.config();
if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10); // 10 is the radix parameter

const app = express();
//middlewares
app.use(cors());
app.use(express.json());

//routes
// app.use('/api/', (req, res) => {
//     res.send('Hello🙋‍♂️🙋‍♀️ Welcome to Book Management System');
// });
app.use('/api/authors', authorRouter);
app.use('/api/books', bookRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});