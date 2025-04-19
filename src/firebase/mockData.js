import { faker } from "@faker-js/faker";

export const generateMockUsers = (userId, num = 10) => {
    const out = [];
    for (let i = 0; i < num; i++) {
        out.push({
            userId,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            role: faker.helpers.arrayElement(["Admin", "User", "Moderator"]),
            status: faker.helpers.arrayElement(["Active", "Inactive"]),
            createdAt: faker.date.past().toISOString()
        });
    }
    return out;
};

const COURSE_LIST = [
    { name: "Technical Sales Specialist", category: "Other", price: 499 },
    { name: "JavaScript Professional Course", category: "Frontend", price: 599 },
    { name: "MySQL Backend Developer Course", category: "Backend", price: 549 },
    { name: "HTML & CSS Developer Course", category: "Frontend", price: 499 },
    { name: "React Professional Developer", category: "Frontend", price: 699 }
];

export const generateMockProducts = () =>
    COURSE_LIST.map((c) => ({
        name: c.name,
        category: c.category,
        price: c.price,
        stock: faker.number.int({ min: 10, max: 500 }),
        sales: faker.number.int({ min: 50, max: 200 })
    }));

export const generateMockOrders = (num = 10) => {
    const out = [];
    for (let i = 0; i < num; i++) {
        out.push({
            orderId: faker.string.uuid(),
            customer: faker.person.fullName(),
            totalAmount: Number(faker.commerce.price()),
            status: faker.helpers.arrayElement(["Pending", "Shipped", "Delivered"]),
            orderDate: faker.date.past().toISOString()
        });
    }
    return out;
};

export function generateMockSales(products, num = 10) {
    const sales = [];
    for (let i = 0; i < num; i++) {
        const prod = faker.helpers.arrayElement(products);
        sales.push({
            saleId: faker.string.uuid(),
            productId: prod.id,
            product: prod.name,
            quantity: faker.number.int({ min: 1, max: 5 }),
            totalAmount: Number(faker.commerce.price(100, 500)),
            saleDate: faker.date.recent(30)
        });
    }
    return sales;
}
