import { db } from '../src/utils/db.server';
import { faker } from '@faker-js/faker'

type Author = {
    firstName: string;
    lastName: string;
}
type Book = {
    title: string;
    description: string;
    datePublished: string;
}

const authorsData = Array.from({ length: 50 }).map(() => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
}));

const booksData = Array.from({ length: 100 }).map(() => ({
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    datePublished: faker.date.past().toISOString(),
}));

async function seed() {
    const ids: number[] = [];
    let availableIds = [...ids];
    function getRandomAuthorId() {
        if (availableIds.length === 0) {
            availableIds = [...ids];
        }
        const randomIndex = Math.floor(Math.random() * availableIds.length);
        const selectedId = availableIds[randomIndex];
        availableIds.splice(randomIndex, 1);
        return selectedId;
    }
    // fill ids with author ids
    await Promise.all(
        authorsData.map(async (author) => {
            const newAuthor = await db.author.create({
                data: {
                    firstName: author.firstName,
                    lastName: author.lastName,
                },
            });
            ids.push(newAuthor.id);
        })

    );
    // fill books with books
    await Promise.all(
        booksData.map(async (book) => {
            return db.book.create({
                data: {
                    ...book,
                    authorId: getRandomAuthorId(),
                },
            });
        })
    );
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });

