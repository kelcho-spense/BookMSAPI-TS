
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { updateBook, createBook, listBooks, getBookById, deleteBook } from './book.service';

//get book by id
export const getBookByIdController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const book = await getBookById(id);
        if (!book) {
            return res.status(404).json('Book not found');
        }
        return res.status(200).json(book);
    } catch (e: any) {
        return res.status(500).json(e.message);
    }
}
