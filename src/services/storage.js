import { openDB } from 'idb';

const DB_NAME = 'payment-tracker-db';
const STORE_NAME = 'transactions';

const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp');
            }
        },
    });
};

export const saveTransaction = async (data) => {
    const db = await initDB();
    return db.add(STORE_NAME, {
        ...data,
        timestamp: new Date().toISOString()
    });
};

export const getTransactions = async () => {
    const db = await initDB();
    return db.getAllFromIndex(STORE_NAME, 'timestamp');
};

export const getTodayStats = async () => {
    const db = await initDB();
    const all = await db.getAllFromIndex(STORE_NAME, 'timestamp');

    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = all.filter(t => t.timestamp.startsWith(today));

    return {
        count: todayTransactions.length,
        transactions: todayTransactions.reverse() // Newest first
    };
};

export const getAllStats = async () => {
    const db = await initDB();
    const all = await db.getAllFromIndex(STORE_NAME, 'timestamp');
    return {
        count: all.length,
        recent: all.reverse().slice(0, 5)
    };
};
