import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Web-compatible database interface
interface WebDB {
  transaction: (callback: (tx: WebTransaction) => void, error?: (error: any) => void, success?: () => void) => void;
}

interface WebTransaction {
  executeSql: (sql: string, params?: any[], callback?: (tx: any, result: any) => void) => void;
}

let db: SQLite.SQLiteDatabase | WebDB | undefined;

const generateId = (): string => {
  try {
    // Prefer secure UUID when available
    // @ts-ignore
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      // @ts-ignore
      return crypto.randomUUID();
    }
  } catch {}
  // Fallback: timestamp + random
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

export const getDb = () => {
  if (!db) {
    if (Platform.OS === 'web') {
      // Check if IndexedDB is available
      if (typeof window !== 'undefined' && window.indexedDB) {
        db = createWebDB();
      } else {
        // Fallback to in-memory storage for web
        db = createMemoryDB();
      }
    } else {
      // Use SQLite for native
      db = SQLite.openDatabase('vision.db');
    }
  }
  return db;
};

// Web database implementation using IndexedDB
const createWebDB = (): WebDB => {
  const dbName = 'vision_db';
  const version = 1;
  let indexedDB: IDBDatabase | null = null;

  const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not available'));
        return;
      }
      const request = window.indexedDB.open(dbName, version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('shops')) {
          db.createObjectStore('shops', { keyPath: 'shop_id' });
        }
        if (!db.objectStoreNames.contains('items')) {
          db.createObjectStore('items', { keyPath: 'item_id' });
        }
        if (!db.objectStoreNames.contains('requests')) {
          db.createObjectStore('requests', { keyPath: 'request_id' });
        }
        if (!db.objectStoreNames.contains('results')) {
          const resultsStore = db.createObjectStore('results', { keyPath: 'result_id' });
          resultsStore.createIndex('created_at', 'created_at', { unique: false });
        }
      };
    });
  };

  return {
    transaction: (callback, error, success) => {
      initDB().then((idb) => {
        indexedDB = idb;
        const transaction = idb.transaction(['shops', 'items', 'requests', 'results'], 'readwrite');
        
        const webTx: WebTransaction = {
          executeSql: (sql: string, params: any[] = [], callback?: (tx: any, result: any) => void) => {
            const storeName = getStoreNameFromSQL(sql);
            if (!storeName) {
              if (error) error(new Error('Unknown table in SQL'));
              return;
            }
            
            const store = transaction.objectStore(storeName);
            
            if (sql.toUpperCase().includes('INSERT INTO')) {
              handleInsert(store, sql, params, callback);
            } else if (sql.toUpperCase().includes('SELECT')) {
              handleSelect(store, sql, params, callback);
            } else if (sql.toUpperCase().includes('CREATE TABLE')) {
              // Tables are created in onupgradeneeded
              if (callback) callback(null, { rows: { _array: [] } });
            }
          }
        };
        
        callback(webTx);
        
        transaction.oncomplete = () => {
          if (success) success();
        };
        
        transaction.onerror = () => {
          if (error) error(transaction.error);
        };
      }).catch((err) => {
        if (error) error(err);
      });
    }
  };
};

// In-memory database fallback for web when IndexedDB is not available
const createMemoryDB = (): WebDB => {
  const memoryStore: { [key: string]: any[] } = {
    shops: [],
    items: [],
    requests: [],
    results: []
  };

  return {
    transaction: (callback, error, success) => {
      try {
        const webTx: WebTransaction = {
          executeSql: (sql: string, params: any[] = [], callback?: (tx: any, result: any) => void) => {
            const storeName = getStoreNameFromSQL(sql);
            if (!storeName) {
              if (error) error(new Error('Unknown table in SQL'));
              return;
            }
            
            if (sql.toUpperCase().includes('INSERT INTO')) {
              handleMemoryInsert(memoryStore, storeName, sql, params, callback);
            } else if (sql.toUpperCase().includes('SELECT')) {
              handleMemorySelect(memoryStore, storeName, sql, params, callback);
            } else if (sql.toUpperCase().includes('CREATE TABLE')) {
              // Tables are created automatically
              if (callback) callback(null, { rows: { _array: [] } });
            }
          }
        };
        
        callback(webTx);
        if (success) success();
      } catch (err) {
        if (error) error(err);
      }
    }
  };
};

const handleMemoryInsert = (store: { [key: string]: any[] }, tableName: string, sql: string, params: any[], callback?: (tx: any, result: any) => void) => {
  const data: any = {};
  if (tableName === 'requests') {
    data.request_id = params[0];
    data.input_text = params[1];
    data.ai_answer = params[2];
    data.created_at = params[3];
  } else if (tableName === 'results') {
    data.result_id = params[0];
    data.request_id = params[1];
    data.items_json = params[2];
    data.method = params[3];
    data.created_at = params[4];
    data.input_text = params[5] || 'Unknown request';
  }
  
  store[tableName].push(data);
  if (callback) callback(null, { rows: { _array: [] } });
};

const handleMemorySelect = (store: { [key: string]: any[] }, tableName: string, sql: string, params: any[], callback?: (tx: any, result: any) => void) => {
  let results = [...store[tableName]];
  
  // Apply WHERE clause if specified
  if (sql.includes('WHERE') && params.length > 0) {
    const whereField = sql.match(/WHERE\s+(\w+)\s*=\s*\?/i)?.[1];
    if (whereField) {
      results = results.filter((item: any) => item[whereField] === params[0]);
    }
  }
  
  // Apply LIMIT if specified
  if (sql.includes('LIMIT')) {
    const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1]);
      results = results.slice(0, limit);
    }
  }
  
  // Sort by created_at DESC if specified
  if (sql.includes('ORDER BY created_at DESC')) {
    results.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
  }
  
  if (callback) {
    callback(null, { 
      rows: { 
        _array: results,
        item: (index: number) => results[index]
      } 
    });
  }
};

const getStoreNameFromSQL = (sql: string): string | null => {
  if (sql.includes('shops')) return 'shops';
  if (sql.includes('items')) return 'items';
  if (sql.includes('requests')) return 'requests';
  if (sql.includes('results')) return 'results';
  return null;
};

const handleInsert = (store: IDBObjectStore, sql: string, params: any[], callback?: (tx: any, result: any) => void) => {
  const tableName = getStoreNameFromSQL(sql);
  if (!tableName) return;
  
  const data: any = {};
  if (tableName === 'requests') {
    data.request_id = params[0];
    data.input_text = params[1];
    data.ai_answer = params[2];
    data.created_at = params[3];
  } else if (tableName === 'results') {
    data.result_id = params[0];
    data.request_id = params[1];
    data.items_json = params[2];
    data.method = params[3];
    data.created_at = params[4];
    // For web compatibility, store input_text directly in results
    data.input_text = params[5] || 'Unknown request';
  }
  
  const request = store.add(data);
  request.onsuccess = () => {
    if (callback) callback(null, { rows: { _array: [] } });
  };
  request.onerror = () => {
    console.error('Insert error:', request.error);
  };
};

const handleSelect = (store: IDBObjectStore, sql: string, params: any[], callback?: (tx: any, result: any) => void) => {
  const request = store.getAll();
  request.onsuccess = () => {
    let results = request.result;
    
    // Handle JOIN queries by fetching from both stores
    if (sql.includes('LEFT JOIN')) {
      handleJoinQuery(sql, params, callback);
      return;
    }
    
    // Apply WHERE clause if specified
    if (sql.includes('WHERE') && params.length > 0) {
      const whereField = sql.match(/WHERE\s+(\w+)\s*=\s*\?/i)?.[1];
      if (whereField) {
        results = results.filter((item: any) => item[whereField] === params[0]);
      }
    }
    
    // Apply LIMIT if specified
    if (sql.includes('LIMIT')) {
      const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        const limit = parseInt(limitMatch[1]);
        results = results.slice(0, limit);
      }
    }
    
    // Sort by created_at DESC if specified
    if (sql.includes('ORDER BY created_at DESC')) {
      results.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
    }
    
    if (callback) {
      callback(null, { 
        rows: { 
          _array: results,
          item: (index: number) => results[index]
        } 
      });
    }
  };
  request.onerror = () => {
    console.error('Select error:', request.error);
  };
};

const handleJoinQuery = (sql: string, params: any[], callback?: (tx: any, result: any) => void) => {
  // For web, we'll store the input_text directly in results to avoid complex JOINs
  // This is a simplified approach that works with our current data structure
  if (callback) {
    callback(null, { 
      rows: { 
        _array: [],
        item: (index: number) => null
      } 
    });
  }
};

export const initLocalDb = async () => {
  const db = getDb();
  
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS shops (
            shop_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            location TEXT,
            website TEXT,
            contact_info TEXT
          );`
        );
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS items (
            item_id TEXT PRIMARY KEY,
            shop_id TEXT,
            name TEXT NOT NULL,
            category TEXT,
            price REAL,
            availability TEXT,
            type TEXT CHECK(type IN ('product','tool')),
            FOREIGN KEY (shop_id) REFERENCES shops(shop_id)
          );`
        );
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS requests (
            request_id TEXT PRIMARY KEY,
            input_text TEXT NOT NULL,
            ai_answer TEXT,
            created_at INTEGER
          );`
        );
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS results (
            result_id TEXT PRIMARY KEY,
            request_id TEXT,
            items_json TEXT,
            method TEXT,
            created_at INTEGER,
            input_text TEXT,
            FOREIGN KEY (request_id) REFERENCES requests(request_id)
          );`
        );
      },
      (error) => {
        console.error('DB init error:', error);
        reject(error);
      },
      () => {
        console.log('DB initialized successfully');
        resolve();
      }
    );
  });
};

export const saveLocalRequestAndResult = async (
  input_text: string,
  ai_answer: any,
  items: any[],
  method: string
) => {
  const db = getDb();
  const request_id = generateId();
  const result_id = generateId();
  const created_at = Date.now();

  return new Promise<{ request_id: string; result_id: string; created_at: number }>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO requests (request_id, input_text, ai_answer, created_at) VALUES (?, ?, ?, ?);`,
          [request_id, input_text, JSON.stringify(ai_answer), created_at]
        );
        tx.executeSql(
          `INSERT INTO results (result_id, request_id, items_json, method, created_at, input_text) VALUES (?, ?, ?, ?, ?, ?);`,
          [result_id, request_id, JSON.stringify(items), method, created_at, input_text]
        );
      },
      (error) => {
        console.error('Save error:', error);
        reject(error);
      },
      () => {
        resolve({ request_id, result_id, created_at });
      }
    );
  });
};

export const loadRecentLocalResults = async (max: number = 10) => {
  const db = getDb();
  
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT result_id, request_id, items_json, method, created_at FROM results ORDER BY created_at DESC LIMIT ?;`,
          [max],
          (_, { rows }) => {
            const results = rows._array.map((r: any) => ({
              result_id: r.result_id,
              request_id: r.request_id,
              items: JSON.parse(r.items_json ?? '[]'),
              method: r.method,
              created_at: r.created_at,
              input_text: r.input_text, // Add this for compatibility
            }));
            resolve(results);
          }
        );
      },
      (error) => {
        console.error('Load recent error:', error);
        reject(error);
      }
    );
  });
};

export const loadResultDetail = async (result_id: string) => {
  const db = getDb();
  
  return new Promise<any | null>((resolve, reject) => {
    db.transaction(
      (tx) => {
        // First try to select from results (input_text is stored there for web compatibility)
        tx.executeSql(
          `SELECT result_id, request_id, items_json, method, created_at, input_text FROM results WHERE result_id = ? LIMIT 1;`,
          [result_id],
          (_, { rows }) => {
            if (rows.length === 0) {
              resolve(null);
              return;
            }
            const base = rows.item(0);
            const output: any = {
              result_id: base.result_id,
              request_id: base.request_id,
              items: JSON.parse(base.items_json ?? '[]'),
              method: base.method,
              created_at: base.created_at,
              input_text: base.input_text,
              ai_answer: null,
            };

            // Optionally fetch ai_answer from requests if available (native sqlite supports this fine)
            tx.executeSql(
              `SELECT ai_answer FROM requests WHERE request_id = ? LIMIT 1;`,
              [base.request_id],
              (_, { rows: r2 }) => {
                if (r2.length > 0) {
                  const a = r2.item(0).ai_answer;
                  output.ai_answer = a ? JSON.parse(a) : null;
                }
                resolve(output);
              }
            );
          }
        );
      },
      (error) => {
        console.error('Load detail error:', error);
        reject(error);
      }
    );
  });
};


