import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Header from "../components/common/Header";
import ProductsTable from "../components/products/ProductTable";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const uid = auth.currentUser?.uid;
            if (!uid) {
                console.warn("No user signed in; skipping products fetch");
                setLoading(false);
                return;
            }

            try {
                // Grab all docs for this user
                const q = query(collection(db, "products"), where("userId", "==", uid));
                const snap = await getDocs(q);
                const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

                // Keep only those with an imageUrl
                const withImage = list.filter((item) => !!item.imageUrl);

                // Aggregate duplicates by course name (summing stock & sales)
                const aggregated = Array.from(
                    withImage
                        .reduce((map, item) => {
                            if (!map.has(item.name)) {
                                // first time seeing this course
                                map.set(item.name, { ...item });
                            } else {
                                // duplicate add its numbers to the existing entry
                                const existing = map.get(item.name);
                                existing.stock += item.stock;
                                existing.sales += item.sales;
                            }
                            return map;
                        }, new Map())
                        .values()
                );

                console.log("🛍️ raw products:", list);
                console.log("✅ aggregated courses:", aggregated);

                setProducts(aggregated);
            } catch (err) {
                console.error("❌ error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Products" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading products…</div>
                ) : (
                    <ProductsTable products={products} />
                )}
            </main>
        </div>
    );
}
