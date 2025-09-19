import { FirebaseApp, initializeApp } from 'firebase/app';
import {
    addDoc,
    collection,
    Firestore,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query
} from 'firebase/firestore';

// TODO: move to env/secure storage before production
const firebaseConfig = {
  apiKey: 'AIzaSyBGwaCQ8xAzSLZBtzE4m4WpqAL-gy4wQN8',
  authDomain: 'vision-hackathon-97a29.firebaseapp.com',
  projectId: 'vision-hackathon-97a29',
  storageBucket: 'vision-hackathon-97a29.firebasestorage.app',
  messagingSenderId: '966823117694',
  appId: '1:966823117694:web:49aae5fc9feaca2f34e92f',
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

export const getFirebase = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  if (!db) {
    db = getFirestore(app);
  }
  return { app, db } as const;
};

export const dbCollections = {
  shops: 'shops',
  items: 'items',
  requests: 'requests',
  results: 'results',
} as const;

export const saveRequest = async (input_text: string, ai_answer: any) => {
  const { db } = getFirebase();
  const created_at = Date.now();
  const ref = await addDoc(collection(db, dbCollections.requests), {
    input_text,
    ai_answer,
    created_at,
  });
  return { request_id: ref.id, created_at };
};

export const saveResult = async (
  request_id: string,
  items: any[],
  method: string
) => {
  const { db } = getFirebase();
  const created_at = Date.now();
  const ref = await addDoc(collection(db, dbCollections.results), {
    request_id,
    items,
    method,
    created_at,
  });
  return { result_id: ref.id, created_at };
};

export const listRecentResults = async (max: number = 10) => {
  const { db } = getFirebase();
  const q = query(
    collection(db, dbCollections.results),
    orderBy('created_at', 'desc'),
    limit(max)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ result_id: d.id, ...d.data() }));
};


