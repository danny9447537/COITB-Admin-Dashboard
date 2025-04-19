// src/firebase/dataUpload.js

import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import {
    generateMockUsers,
    generateMockProducts,
    generateMockOrders,
    generateMockSales
} from "./mockData";

export const uploadData = async (userId) => {
    console.log("↪️ uploadData() start for user:", userId);

    // 1) USERS
    {
        const usersQ = query(collection(db, "users"), where("userId", "==", userId));
        const usersSnap = await getDocs(usersQ);
        if (usersSnap.empty) {
            console.log("⏳ seeding users…");
            for (const u of generateMockUsers(userId, 10)) {
                await addDoc(collection(db, "users"), u);
            }
            console.log("✅ users seeded");
        } else {
            console.log("⛔ users exist, skipping");
        }
    }

    // 2) PRODUCTS (seed if empty, otherwise update price)
    {
        const prodCo = collection(db, "products");
        const prodQ = query(prodCo, where("userId", "==", userId));
        const prodSnap = await getDocs(prodQ);
        const desired = generateMockProducts(); // array of { name, category, price, stock, sales }

        if (prodSnap.empty) {
            console.log("⏳ seeding products…");
            for (const p of desired) {
                await addDoc(prodCo, { ...p, userId });
            }
            console.log("✅ products seeded");
        } else {
            console.log("🔄 updating existing product prices…");
            for (const docSnap of prodSnap.docs) {
                const data = docSnap.data();
                const match = desired.find((p) => p.name === data.name);
                if (match && data.price !== match.price) {
                    await updateDoc(doc(db, "products", docSnap.id), {
                        price: match.price
                    });
                    console.log(`  ↪️ updated "${match.name}" price to $${match.price}`);
                }
            }
            console.log("✅ existing product prices updated");
        }
    }

    // 3) ORDERS
    {
        const ordersQ = query(collection(db, "orders"), where("userId", "==", userId));
        const ordersSnap = await getDocs(ordersQ);
        if (ordersSnap.empty) {
            console.log("⏳ seeding orders…");
            for (const o of generateMockOrders(10)) {
                await addDoc(collection(db, "orders"), { ...o, userId });
            }
            console.log("✅ orders seeded");
        } else {
            console.log("⛔ orders exist, skipping");
        }
    }

    // 4) SALES
    {
        const salesQ = query(collection(db, "sales"), where("userId", "==", userId));
        const salesSnap = await getDocs(salesQ);
        if (salesSnap.empty) {
            console.log("⏳ seeding sales…");
            // fetch product ids/names to tie sales to
            const prodDocs = await getDocs(
                query(collection(db, "products"), where("userId", "==", userId))
            );
            const prodList = prodDocs.docs.map((d) => ({
                id: d.id,
                name: d.data().name
            }));
            for (const s of generateMockSales(prodList, 20)) {
                await addDoc(collection(db, "sales"), { ...s, userId });
            }
            console.log("✅ sales seeded");
        } else {
            console.log("⛔ sales exist, skipping");
        }
    }

    console.log("🎉 uploadData() complete");
};
