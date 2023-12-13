import express from 'express';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import * as BookService from './book.service';
import * as AuthorService from '../author/author.service';

export const bookRouter = express.Router();
bookRouter.get('/', async (req: Request, res: Response) => {
    try {
        const books = await BookService.listBooks();
        if (!books) {
            return res.status(404).json('Books not found');
        }
        return res.status(200).json(books);
    } catch (e: any) {
        return res.status(500).json(e.message);
    }
});

bookRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const book = await BookService.getBookById(id);
        if (!book) {
            return res.status(404).json('Book not found');
        }
        return res.status(200).json(book);
    } catch (e: any) {
        return res.status(500).json(e.message);
    }
});

bookRouter.post('/',
    body('title').isString().withMessage("Required type string"),
    body('authorId').isInt().withMessage("Required type integer"),
    body("description").isString().withMessage("Required type string"),
    body("datePublished").isDate().toDate().withMessage("Required type date"),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), });
        }
        //check if author exists
        if (!await AuthorService.getAuthorById(req.body.authorId)) {
            return res.status(400).json('Author not found');
        }
        try {
            const book = await BookService.createBook(req.body);
            return res.status(201).json(book);
        } catch (e: any) {
            return res.status(500).json(e.message);
        }
    });

// bookRouter.put('/:id', body('title').isString(), body('authorId').isInt(), body("description").isString(), body("datePublished").isDate(), async (req: Request, res: Response) => {
//     const errors = validationResult(req);
//     const id = parseInt(req.params.id, 10);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array(), });
//     }
//     //check if book exists
//     if (!await BookService.getBookById(id)) {
//         return res.status(404).json('Book not found');
//     }
//     try {
//         const book = await BookService.updateBook(req.body, id);
//         return res.status(200).json(book);
//     } catch (e: any) {
//         return res.status(500).json(e.message);
//     }
// });

// bookRouter.delete('/:id', async (req: Request, res: Response) => {
//     const id = parseInt(req.params.id, 10);
//     //check if book exists
//     if (!await BookService.getBookById(id)) {
//         return res.status(404).json('Book not found');
//     }
//     try {
//         await BookService.deleteBook(id);
//         return res.status(200).json(`Book with id ${id} deleted`);
//     } catch (e: any) {
//         return res.status(500).json(e.message);
//     }
// });