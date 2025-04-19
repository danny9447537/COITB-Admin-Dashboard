import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import {
    generateMockUsers,
    generateMockProducts,
    generateMockOrders,
    generateMockSales
} from "./mockData";

// Upload helpers with per‐item logging
const uploadMockUsers = async (users) => {
    const col = collection(db, "users");
    for (const u of users) {
        try {
            await addDoc(col, u);
            console.log("✔️ user uploaded:", u);
        } catch (e) {
            console.error("❌ failed to upload user:", u, e);
        }
    }
};

const uploadMockProducts = async (products) => {
    const col = collection(db, "products");
    for (const p of products) {
        try {
            await addDoc(col, p);
            console.log("✔️ product uploaded:", p);
        } catch (e) {
            console.error("❌ failed to upload product:", p, e);
        }
    }
};

const uploadMockOrders = async (orders) => {
    const col = collection(db, "orders");
    for (const o of orders) {
        try {
            await addDoc(col, o);
            console.log("✔️ order uploaded:", o);
        } catch (e) {
            console.error("❌ failed to upload order:", o, e);
        }
    }
};

const uploadMockSales = async (sales) => {
    const col = collection(db, "sales");
    for (const s of sales) {
        try {
            await addDoc(col, s);
            console.log("✔️ sale uploaded:", s);
        } catch (e) {
            console.error("❌ failed to upload sale:", s, e);
        }
    }
};

// Main entry: accepts the signed‑in user’s UID
export const uploadData = async (uid) => {
    console.log("Starting mock data upload for UID:", uid);

    // generate and tag each record with userId
    const users = generateMockUsers(uid, 5);
    const products = generateMockProducts(5).map((p) => ({ userId: uid, ...p }));
    const orders = generateMockOrders(10).map((o) => ({ userId: uid, ...o }));
    const sales = generateMockSales(5).map((s) => ({ userId: uid, ...s }));

    await uploadMockUsers(users);
    await uploadMockProducts(products);
    await uploadMockOrders(orders);
    await uploadMockSales(sales);

    console.log("🎉 All mock data uploaded.");
};
