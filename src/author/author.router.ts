import express from 'express';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import * as AuthorService from './author.service';

export const authorRouter = express.Router();

// GET: a list of all authors

authorRouter.get('/', async (req: Request, res: Response) => {
    try {
        const authors = await AuthorService.listAuthors();
        return res.status(200).json(authors);
    } catch (e: any) {
        return res.status(500).json(e.message);
    }
});

authorRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const author = await AuthorService.getAuthorById(id);
        if (author) {
            return res.status(200).json(author);
        } else {
            return res.status(404).json('Author not found');
        }
    } catch (e: any) {
        return res.status(500).json(e.message);
    }
});

authorRouter.post('/', body('firstName').isString(), body('lastName').isString(), async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), });
    }
    try {
        const author = await AuthorService.createAuthor(req.body);
        return res.status(201).json(author);
    } catch (e: any) {
        return res.status(500).json(e.message);
    }
});

authorRouter.put('/:id', body('firstName').isString(), body('lastName').isString(), async (req: Request, res: Response) => {
    const errors = validationResult(req);
    const id = parseInt(req.params.id, 10);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), });
    }
    // check if author exists
    if (!await AuthorService.getAuthorById(id)) {
        return res.status(404).json('Author not found');
    }
    try {
        const author = await AuthorService.updateAuthor(req.body, id);
        if (author) {
            return res.status(200).json(author);
        } else {
            return res.status(404).json('Author not found');
        }
    } catch (e: any) {
        return res.status(500).json(e.message);
    }
});

authorRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        // check if author exists
        const author = await AuthorService.getAuthorById(id);
        if (!author) {
            return res.status(404).json('Author not found');
        }
        const deletedAuthor = await AuthorService.deleteAuthor(id);
        if (deletedAuthor) {
            return res.status(200).json(`Author with id ${id} deleted`);
        }
    } catch (e: any) {
        return res.status(500).json(e.message);
    }
});