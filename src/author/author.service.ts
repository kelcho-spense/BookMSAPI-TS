import { db } from "../utils/db.server";
import { BookWriteDTO } from "../book/book.service";

export type AuthorDTO = {
    id: number;
    firstName: string;
    lastName: string;
};

export const getAuthorById = async (id: number): Promise<AuthorDTO | null> => {
    return await db.author.findUnique({
        where: { id: id, },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            books: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    datePublished: true,
                },
            },
        },
    });
}

export const listAuthors = async (): Promise<AuthorDTO[]> => {
    return await db.author.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
        },
    });
};


export const createAuthor = async (author: Omit<AuthorDTO, "id">): Promise<AuthorDTO> => {
    const { firstName, lastName } = author;
    return await db.author.create({
        data: {
            firstName: firstName,
            lastName: lastName,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            createdAt: true,
        },
    });
};

export const updateAuthor = async (author: Omit<AuthorDTO, "id">, id: number): Promise<AuthorDTO | null> => {
    const { firstName, lastName } = author;
    return await db.author.update({
        where: { id: id },
        data: {
            firstName: firstName,
            lastName: lastName,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            updatedAt: true,
        },
    });
};

export const deleteAuthor = async (id: number): Promise<AuthorDTO | null> => {
    return await db.author.delete({
        where: { id: id },
    });
}