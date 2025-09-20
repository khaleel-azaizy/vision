import { FirebaseApp, initializeApp } from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
} from 'firebase/auth';
import {
    addDoc,
    collection,
    doc,
    Firestore,
    getDoc,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    setDoc,
    updateDoc,
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
let authInitialized = false;

export const getFirebase = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  if (!db) {
    db = getFirestore(app);
  }
  return { app, db } as const;
};

export const getAuthInstance = () => {
  const { app } = getFirebase();
  const auth = getAuth(app);
  if (!authInitialized) {
    // Ensure persistence defaults are set by platform (Expo web/native handled by SDK)
    authInitialized = true;
  }
  return auth;
};

export const onAuthChanged = (cb: (user: User | null) => void) => onAuthStateChanged(getAuthInstance(), cb);

export const registerWithEmail = async (email: string, password: string) => {
  const cred = await createUserWithEmailAndPassword(getAuthInstance(), email, password);
  return cred.user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(getAuthInstance(), email, password);
  return cred.user;
};

export const signOutUser = async () => signOut(getAuthInstance());

export const dbCollections = {
  shops: 'shops',
  items: 'items',
  requests: 'requests',
  results: 'results',
} as const;

export interface ShopDoc {
  shop_id: string;
  name: string;
  location?: string;
  city?: string;
  lat?: number;
  lng?: number;
  website?: string;
  contact_info?: string;
  sampleItems?: Array<{ name: string; price: string; category: string }>;
}

export interface ItemDoc {
  item_id: string;
  shop_id: string;
  name: string;
  category: 'product' | 'tool' | string;
  price: number | string;
  availability?: string;
  type?: 'product' | 'tool';
  url?: string;
}

export const saveRequest = async (input_text: string, ai_answer: any) => {
  const { db } = getFirebase();
  const auth = getAuthInstance();
  const created_at = Date.now();
  const ref = await addDoc(collection(db, dbCollections.requests), {
    input_text,
    ai_answer,
    created_at,
    uid: auth.currentUser?.uid ?? null,
  });
  return { request_id: ref.id, created_at };
};

export const saveResult = async (
  request_id: string,
  items: any[],
  method: string,
  title?: string
) => {
  const { db } = getFirebase();
  const auth = getAuthInstance();
  const created_at = Date.now();
  const ref = await addDoc(collection(db, dbCollections.results), {
    request_id,
    items,
    method,
    title,
    created_at,
    uid: auth.currentUser?.uid ?? null,
  });
  return { result_id: ref.id, created_at };
};

export const listRecentResults = async (max: number = 10, uid?: string | null) => {
  const { db } = getFirebase();
  const auth = getAuthInstance();
  const userId = uid ?? auth.currentUser?.uid ?? null;
  const base = collection(db, dbCollections.results);
  // Minimal client-side filter when uid is null; in production use where('uid','==',userId)
  const qy = query(base, orderBy('created_at', 'desc'), limit(max));
  const snapshot = await getDocs(qy);
  const all = snapshot.docs.map((d) => ({ result_id: d.id, ...d.data() } as any));
  return userId ? all.filter((r) => r.uid === userId) : all;
};

// Shops & Items catalog (for AI input)
export const listShops = async (): Promise<ShopDoc[]> => {
  const { db } = getFirebase();
  const snapshot = await getDocs(collection(db, dbCollections.shops));
  return snapshot.docs.map((d) => ({ shop_id: d.id, ...(d.data() as any) })) as ShopDoc[];
};

export const listItems = async (max?: number): Promise<ItemDoc[]> => {
  const { db } = getFirebase();
  const base = collection(db, dbCollections.items);
  const qy = max ? query(base, limit(max)) : base;
  const snapshot = await getDocs(qy);
  return snapshot.docs.map((d) => ({ item_id: d.id, ...(d.data() as any) })) as ItemDoc[];
};

// Seed 5 shops each with 30 items
export const seedSampleCatalog = async (): Promise<{ shops: number; items: number }> => {
  const { db } = getFirebase();

  const shopTemplates: Array<Pick<ShopDoc, 'name' | 'location' | 'city' | 'lat' | 'lng' | 'website' | 'contact_info'>> = [
    { name: 'Tamra Hardware & Tools', location: 'Al-Balad', city: 'Tamra', lat: 32.855, lng: 35.204, website: 'tamrahardware.local', contact_info: '+972-4-000-0001' },
    { name: 'Sakhnin Builders Mart', location: 'Industrial Zone', city: 'Sakhnin', lat: 32.864, lng: 35.296, website: 'sakhninbuilders.local', contact_info: '+972-4-000-0002' },
    { name: 'Arraba Crafts & Supplies', location: 'Market Street', city: 'Arraba', lat: 32.851, lng: 35.337, website: 'arrabacrafts.local', contact_info: '+972-4-000-0003' },
    { name: 'Kafr Manda Tool Depot', location: 'Central Avenue', city: 'Kafr Manda', lat: 32.807, lng: 35.258, website: 'kafrmandatools.local', contact_info: '+972-4-000-0004' },
    { name: 'Shefa-Amr Fresh Market', location: 'Old City', city: 'Shefa-Amr', lat: 32.805, lng: 35.171, website: 'shefaamrmarket.local', contact_info: '+972-4-000-0005' },
  ];

  const createdShopIds: string[] = [];
  for (const s of shopTemplates) {
    const newShopRef = doc(collection(db, dbCollections.shops));
    const shop_id = newShopRef.id;
    const payload = { shop_id, name: s.name, location: s.location, city: s.city, lat: s.lat, lng: s.lng, website: s.website, contact_info: s.contact_info } as ShopDoc;
    await setDoc(newShopRef, payload);
    createdShopIds.push(shop_id);
  }

  // Shop-specific product catalogs
  const shopCatalogs = [
    // Downtown Hardware - General hardware store
    [
      'Cordless Drill 18V', 'Hammer 16oz', 'Screwdriver Set 6pc', 'Level 24in', 'Tape Measure 25ft',
      'Pliers Set 4pc', 'Wrench Set 8pc', 'Utility Knife', 'Safety Glasses', 'Work Gloves',
      'Wood Screws 2in', 'Drywall Screws 1-1/4in', 'Wood Glue 8oz', 'Caulk White', 'Duct Tape',
      'Extension Cord 25ft', 'Power Strip 6-outlet', 'Light Bulb LED 60W', 'Batteries AA 4pk', 'Flashlight LED',
      'Door Hinge 3-1/2in', 'Door Knob Brass', 'Deadbolt Lock', 'Door Stop Rubber', 'Weather Stripping',
      'Pipe Wrench 10in', 'Plunger Rubber', 'Drain Snake 25ft', 'Pipe Tape Teflon', 'Pipe Fitting 1/2in'
    ],
    // Mountain Lumber Co - Lumber and building materials
    [
      '2x4 Stud 8ft', '2x6 Board 8ft', '2x8 Board 8ft', '2x10 Board 8ft', '2x12 Board 8ft',
      'Plywood 4x8 1/2in', 'Plywood 4x8 3/4in', 'OSB 4x8 7/16in', 'MDF 4x8 1/2in', 'Particle Board 4x8',
      'Pine Trim 1x4 8ft', 'Oak Trim 1x4 8ft', 'Cedar Fence Board 6ft', 'Deck Board 5/4x6 8ft', 'Rail Cap 2x6 8ft',
      'Post Anchor Metal', 'Joist Hanger Galvanized', 'Lag Bolt 1/2in 6in', 'Carriage Bolt 3/8in 4in', 'Washer Flat 1/2in',
      'Concrete Mix 80lb', 'Rebar 3/8in 20ft', 'Wire Mesh 4x8', 'Gravel 1/2 ton', 'Sand Fine 1/2 ton',
      'Tar Paper 36in', 'Shingles Asphalt 3-tab', 'Flashing Aluminum', 'Gutter 5in 10ft', 'Downspout 3x4 10ft'
    ],
    // Crafts Corner - Arts and crafts supplies
    [
      'Acrylic Paint Set 12pc', 'Paint Brush Set 10pc', 'Canvas 16x20', 'Easel Wooden', 'Palette Plastic',
      'Clay Modeling 2lb', 'Pottery Wheel Mini', 'Glaze Ceramic 8oz', 'Kiln Small', 'Apron Canvas',
      'Scissors Fabric 8in', 'Cutting Mat 18x24', 'Rotary Cutter', 'Ruler Quilting 6in', 'Pins Straight 100ct',
      'Thread Cotton Assorted', 'Fabric Cotton 1yd', 'Pattern Dress Size M', 'Zipper 12in', 'Buttons Assorted 50ct',
      'Beads Glass Mixed', 'Wire Jewelry 20ga', 'Pliers Jewelry Set', 'Chain Silver 24in', 'Earring Hooks 25pr',
      'Paper Cardstock White', 'Stamps Rubber 6pc', 'Ink Pad Black', 'Embossing Powder', 'Heat Gun Craft'
    ],
    // Quick Mart Tools - Discount tools and supplies
    [
      'Drill Bit Set 21pc', 'Socket Set 1/4in 40pc', 'Ratcheting Wrench Set 8pc', 'Vise Grip 10in', 'Channel Lock 12in',
      'Hacksaw Frame', 'Hacksaw Blade 12in', 'File Set 4pc', 'Chisel Set 6pc', 'Mallet Rubber',
      'Clamp Set 4pc', 'Speed Square 7in', 'Compass Beam', 'Carpenter Pencil', 'Chalk Line',
      'Paint Tray Disposable', 'Roller Cover 9in', 'Paint Brush 2in', 'Drop Cloth 9x12', 'Masking Tape',
      'Sandpaper 60 grit', 'Sandpaper 120 grit', 'Sandpaper 220 grit', 'Steel Wool Fine', 'Tack Cloth',
      'Shop Towels 50ct', 'Cleaning Rags 25ct', 'Trash Bags Heavy Duty', 'Zip Ties 100ct', 'Bungee Cord 24in'
    ],
    // Fresh Market Foods - Apple pie ingredients and kitchen supplies
    [
      'Organic Apples 3lb bag', 'Granny Smith Apples 3lb bag', 'All-Purpose Flour 5lb', 'Granulated Sugar 4lb', 'Brown Sugar 2lb',
      'Powdered Sugar 2lb', 'Ground Cinnamon 2.37oz', 'Ground Nutmeg 1.1oz', 'Unsalted Butter 1lb', 'Salt 26oz',
      'Eggs Large dozen', 'Vanilla Extract 2oz', 'Pre-made Pie Crust 2pk', 'Pie Crust Mix 12oz', 'Cornstarch 16oz',
      'Lemon Juice 12oz', 'Baking Powder 8.1oz', 'Baking Soda 16oz', 'Parchment Paper 60 sq ft', 'Aluminum Foil 75 sq ft',
      'Light Brown Sugar 2lb', 'Dark Brown Sugar 2lb', 'Heavy Cream 1 pint', 'Apple Cider Vinegar 16oz', 'Caramel Sauce 12oz',
      'Pie Dish 9in', 'Rolling Pin Wooden', 'Pastry Blender', 'Cooling Rack', 'Pastry Brush Silicone'
    ]
  ];

  let itemsCreated = 0;
  for (let shopIndex = 0; shopIndex < createdShopIds.length; shopIndex++) {
    const shop_id = createdShopIds[shopIndex];
    const catalog = shopCatalogs[shopIndex];
    
    for (let i = 0; i < 30; i++) {
      const productName = catalog[i] || `Generic Item ${i + 1}`;
      const isTool = shopIndex === 0 || shopIndex === 3 || (shopIndex === 1 && i % 3 === 0) || (shopIndex === 4 && i >= 25); // More tools for hardware/tools stores, kitchen tools for food store
      const type: 'product' | 'tool' = isTool ? 'tool' : 'product';
      const category = type;
      
      // Price varies by shop type and item type
      let price: number;
      if (shopIndex === 0) price = isTool ? 25 + (i % 10) * 5 : 8 + (i % 8) * 2; // Downtown Hardware
      else if (shopIndex === 1) price = isTool ? 35 + (i % 8) * 8 : 12 + (i % 12) * 3; // Mountain Lumber
      else if (shopIndex === 2) price = isTool ? 15 + (i % 6) * 4 : 5 + (i % 10) * 2; // Crafts Corner
      else if (shopIndex === 3) price = isTool ? 12 + (i % 8) * 3 : 6 + (i % 6) * 2; // Quick Mart Tools
      else price = isTool ? 8 + (i % 6) * 2 : 3 + (i % 8) * 1; // Fresh Market Foods
      
      const availability = 'In Stock';

      const newItemRef = doc(collection(db, dbCollections.items));
      const item_id = newItemRef.id;
      const payload: ItemDoc = {
        item_id,
        shop_id,
        name: productName,
        category,
        price: Number(price.toFixed(2)),
        availability,
        type,
      };
      await setDoc(newItemRef, payload);
      itemsCreated += 1;
    }
  }

  return { shops: createdShopIds.length, items: itemsCreated };
};

export const getResultById = async (result_id: string) => {
  const { db } = getFirebase();
  const ref = doc(db, dbCollections.results, result_id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { result_id: snap.id, ...(snap.data() as any) };
};

export const updateResultItemsCloud = async (
  result_id: string,
  items: any[],
  method?: string
) => {
  const { db } = getFirebase();
  const ref = doc(db, dbCollections.results, result_id);
  const payload: any = { items, updated_at: Date.now() };
  if (method) payload.method = method;
  await updateDoc(ref, payload);
};


