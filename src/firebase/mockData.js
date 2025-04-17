import { faker } from "@faker-js/faker";

// Function to generate mock users
export const generateMockUsers = (num = 10) => {
    const users = [];
    for (let i = 0; i < num; i++) {
        users.push({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            role: faker.helpers.arrayElement(["Admin", "User", "Moderator"]),
            status: faker.helpers.arrayElement(["Active", "Inactive"]),
            createdAt: faker.date.past()
        });
    }
    return users;
};

// Function to generate mock products
export const generateMockProducts = (num = 5) => {
    const products = [];
    for (let i = 0; i < num; i++) {
        products.push({
            name: faker.commerce.productName(),
            category: faker.commerce.department(),
            price: faker.commerce.price(),
            stock: faker.number.int({ min: 10, max: 100 }),
            sales: faker.number.int({ min: 100, max: 500 })
        });
    }
    return products;
};

// Function to generate mock orders
export const generateMockOrders = (num = 10) => {
    const orders = [];
    for (let i = 0; i < num; i++) {
        orders.push({
            orderId: faker.string.uuid(), // Updated this line
            customer: faker.person.fullName(),
            totalAmount: faker.commerce.price(),
            status: faker.helpers.arrayElement(["Pending", "Shipped", "Delivered"]),
            orderDate: faker.date.past()
        });
    }
    return orders;
};

// Function to generate mock sales data
export const generateMockSales = (num = 5) => {
    const sales = [];
    for (let i = 0; i < num; i++) {
        sales.push({
            saleId: faker.string.uuid(), // Updated this line
            product: faker.commerce.productName(),
            quantity: faker.number.int({ min: 1, max: 100 }),
            totalAmount: faker.commerce.price(),
            saleDate: faker.date.past()
        });
    }
    return sales;
};
