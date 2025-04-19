import { faker } from "@faker-js/faker";

export const generateMockUsers = (uid, num = 10) => {
    const out = [];
    for (let i = 0; i < num; i++) {
        out.push({
            userId: uid,
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
    { name: "Technical Sales Specialist", category: "Other" },
    { name: "JavaScript Professional Course", category: "Frontend" },
    { name: "MySQL Backend Developer Course", category: "Backend" },
    { name: "HTML & CSS Developer Course", category: "Frontend" },
    { name: "React Professional Developer", category: "Frontend" }
];

export const generateMockProducts = (num = COURSE_LIST.length) => {
    return COURSE_LIST.slice(0, num).map((course) => ({
        name: course.name,
        category: course.category,
        price: Number(faker.commerce.price(100, 1000)),
        stock: faker.number.int({ min: 10, max: 500 }),
        sales: faker.number.int({ min: 50, max: 200 })
    }));
};

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

export const generateMockSales = (num = 5) => {
    const out = [];
    for (let i = 0; i < num; i++) {
        out.push({
            saleId: faker.string.uuid(),
            product: faker.commerce.productName(),
            quantity: faker.number.int({ min: 1, max: 100 }),
            totalAmount: Number(faker.commerce.price()),
            saleDate: faker.date.past().toISOString()
        });
    }
    return out;
};
