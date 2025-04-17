import { db } from "./firebase"; // Import the Firestore instance
import {
    generateMockUsers,
    generateMockProducts,
    generateMockOrders,
    generateMockSales
} from "./mockData"; // Import mock data generators
import { collection, addDoc } from "firebase/firestore";

// Function to upload mock users to Firestore
const uploadMockUsers = async (users) => {
    const usersCollection = collection(db, "users"); // Reference to the "users" collection in Firestore
    try {
        // Use map and Promise.all to handle all asynchronous calls correctly
        await Promise.all(
            users.map(async (user) => {
                await addDoc(usersCollection, user); // Add each user document to Firestore
                console.log("User uploaded:", user); // Log the uploaded user
            })
        );
        console.log("Users uploaded successfully");
    } catch (e) {
        console.error("Error uploading users:", e);
    }
};

// Function to upload mock products to Firestore
const uploadMockProducts = async (products) => {
    const productsCollection = collection(db, "products");
    try {
        await Promise.all(
            products.map(async (product) => {
                await addDoc(productsCollection, product); // Add each product document to Firestore
            })
        );
        console.log("Products uploaded successfully");
    } catch (e) {
        console.error("Error uploading products:", e);
    }
};

// Function to upload mock orders to Firestore
const uploadMockOrders = async (orders) => {
    const ordersCollection = collection(db, "orders");
    try {
        await Promise.all(
            orders.map(async (order) => {
                await addDoc(ordersCollection, order); // Add each order document to Firestore
            })
        );
        console.log("Orders uploaded successfully");
    } catch (e) {
        console.error("Error uploading orders:", e);
    }
};

// Function to upload mock sales data to Firestore
const uploadMockSales = async (sales) => {
    const salesCollection = collection(db, "sales");
    try {
        await Promise.all(
            sales.map(async (sale) => {
                await addDoc(salesCollection, sale); // Add each sale document to Firestore
            })
        );
        console.log("Sales uploaded successfully");
    } catch (e) {
        console.error("Error uploading sales:", e);
    }
};

// Generate mock data
const users = generateMockUsers(5); // Generate 5 mock users
const products = generateMockProducts(5); // Generate 5 mock products
const orders = generateMockOrders(10); // Generate 10 mock orders
const sales = generateMockSales(5); // Generate 5 mock sales

// Function to upload all data
export const uploadData = async () => {
    console.log("Starting data upload...");
    await uploadMockUsers(users);
    await uploadMockProducts(products);
    await uploadMockOrders(orders);
    await uploadMockSales(sales);
    console.log("All data uploaded successfully");
};
