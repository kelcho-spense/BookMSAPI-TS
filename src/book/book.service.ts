import { db } from "../utils/db.server";
import type { AuthorDTO } from "../author/author.service";

type BookReadDTO = {
    id: number;
    title: string;
    author?: AuthorDTO;
    description: string | null;
    datePublished: Date | null;
};
export type BookWriteDTO = {
    title: string;
    authorId: number;
    description: string | null;
    datePublished: Date;
};

export const listBooks = async (): Promise<BookReadDTO[] | null> => {
    return await db.book.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            datePublished: true,
            author: false,
        },
    });
}

export const getBookById = async (id: number): Promise<BookReadDTO | null> => {
    return await db.book.findUnique({
        where: { id: id, },
        select: {
            id: true,
            title: true,
            description: true,
            datePublished: true,
            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });
}

export const createBook = async (book: BookWriteDTO): Promise<BookReadDTO> => {
    const { title, description, datePublished, authorId } = book;
    const parsedDate: Date = new Date(datePublished);
    return await db.book.create({
        data: { title, description, datePublished: parsedDate, authorId },
        select: {
            id: true,
            title: true,
            description: true,
            datePublished: true,
            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });
}


export const updateBook = async (book: Omit<BookWriteDTO, "id">, id: number): Promise<BookReadDTO | null> => {
    const { title, description, datePublished, authorId } = book;
    return await db.book.update({
        where: { id: id },
        data: { title, description, datePublished, authorId },
        select: {
            id: true,
            title: true,
            description: true,
            datePublished: true,
            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });
}

export const deleteBook = async (id: number): Promise<void> => {
    await db.book.delete({
        where: { id: id },
    });
}