import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AIResponse, ANSWER_FORMAT, callAIService } from '@/services/aiService';
import { listItems, listShops, saveRequest, saveResult, updateResultItemsCloud } from '@/services/firebase';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Easing, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface Product {
  id: string;
  name: string;
  price: string;
  store: string;
  category: 'product' | 'tool';
  description: string;
  availability: string;
  owned?: boolean;
  alternatives?: ProductAlternative[];
}

interface ProductAlternative {
  name: string;
  price: string;
  store: string;
  description: string;
  availability: string;
  url?: string;
}

function ProductCard({ 
  product, 
  colors, 
  onProductUpdate,
  onToggleOwned,
  distanceText,
}: { 
  product: Product; 
  colors: any; 
  onProductUpdate: (productId: string, updatedProduct: Product) => void;
  onToggleOwned: (productId: string) => void;
  distanceText?: string;
}) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState<number | null>(null);

  return (
    <ThemedView style={[styles.productCard, { backgroundColor: colors.surface }]}>
      <ThemedView style={styles.productHeader}>
        <ThemedView style={styles.productInfo}>
          <ThemedText style={[styles.productName, { color: colors.text }]}>{product.name}</ThemedText>
          <ThemedText style={[styles.productDescription, { color: colors.textSecondary }]}>{product.description}</ThemedText>
        </ThemedView>
        <ThemedView style={[styles.productCategory, { 
          backgroundColor: product.category === 'product' ? colors.success + '15' : colors.warning + '15' 
        }]}>
          <Ionicons 
            name={product.category === 'product' ? 'cube' : 'construct'} 
            size={20} 
            color={product.category === 'product' ? colors.success : colors.warning} 
          />
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.productDetails}>
        <ThemedView style={styles.detailRow}>
          <Ionicons name="storefront" size={16} color={colors.textTertiary} />
          <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>{product.store}</ThemedText>
        </ThemedView>
        {distanceText ? (
          <ThemedView style={styles.detailRow}>
            <Ionicons name="location" size={16} color={colors.textTertiary} />
            <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>{distanceText}</ThemedText>
          </ThemedView>
        ) : null}
        <ThemedView style={styles.detailRow}>
          <Ionicons name="pricetag" size={16} color={colors.textTertiary} />
          <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>{product.price}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.detailRow}>
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>{product.availability}</ThemedText>
        </ThemedView>
        <TouchableOpacity
          style={[styles.detailRow, { justifyContent: 'flex-start' }]}
          onPress={() => onToggleOwned(product.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={product.owned ? 'checkbox' : 'square-outline'}
            size={18}
            color={product.owned ? colors.primary : colors.textTertiary}
          />
          <ThemedText style={[styles.detailText, { color: product.owned ? colors.primary : colors.textSecondary }]}>
            I already have this
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {product.alternatives && product.alternatives.length > 0 && (
        <TouchableOpacity 
          style={styles.alternativesToggle}
          onPress={() => setShowAlternatives(!showAlternatives)}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.alternativesToggleText, { color: colors.primary }]}>
            {showAlternatives ? 'Hide' : 'Show'} {product.alternatives.length} alternatives
          </ThemedText>
          <Ionicons 
            name={showAlternatives ? 'chevron-up' : 'chevron-down'} 
            size={16} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      )}

      {showAlternatives && product.alternatives && product.alternatives.length > 0 && (
        <ThemedView style={styles.alternativesContainer}>
          {product.alternatives.map((alt, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.alternativeCard, 
                { 
                  backgroundColor: selectedAlternative === index ? colors.primary + '15' : colors.backgroundSecondary, 
                  borderColor: selectedAlternative === index ? colors.primary : colors.border,
                  borderWidth: selectedAlternative === index ? 2 : 1
                }
              ]}
              onPress={() => setSelectedAlternative(selectedAlternative === index ? null : index)}
              activeOpacity={0.7}
            >
              <ThemedView style={styles.alternativeHeader}>
                <ThemedView style={styles.alternativeInfo}>
                  <ThemedText style={[styles.alternativeName, { color: colors.text }]}>{alt.name}</ThemedText>
                  <ThemedText style={[styles.alternativeDescription, { color: colors.textSecondary }]}>{alt.description}</ThemedText>
                </ThemedView>
                <ThemedView style={[styles.selectionIndicator, { 
                  backgroundColor: selectedAlternative === index ? colors.primary : 'transparent',
                  borderColor: colors.primary,
                  borderWidth: 2
                }]}>
                  {selectedAlternative === index && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </ThemedView>
              </ThemedView>
              <ThemedView style={styles.alternativeDetails}>
                <ThemedView style={styles.detailRow}>
                  <Ionicons name="storefront" size={14} color={colors.textTertiary} />
                  <ThemedText style={[styles.detailText, { color: colors.textSecondary, fontSize: 12 }]}>{alt.store}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.detailRow}>
                  <Ionicons name="pricetag" size={14} color={colors.textTertiary} />
                  <ThemedText style={[styles.detailText, { color: colors.textSecondary, fontSize: 12 }]}>{alt.price}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.detailRow}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                  <ThemedText style={[styles.detailText, { color: colors.textSecondary, fontSize: 12 }]}>{alt.availability}</ThemedText>
                </ThemedView>
              </ThemedView>
            </TouchableOpacity>
          ))}
          
          {selectedAlternative !== null && (
            <TouchableOpacity 
              style={[styles.useAlternativeButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                const selectedAlt = product.alternatives![selectedAlternative!];
                
                // Create updated product with alternative data
                const updatedProduct: Product = {
                  ...product,
                  name: selectedAlt.name,
                  store: selectedAlt.store,
                  price: selectedAlt.price,
                  availability: selectedAlt.availability,
                  description: selectedAlt.description,
                };
                
                // Update the product in the parent component
                onProductUpdate(product.id, updatedProduct);
                
                // Reset selection state
                setSelectedAlternative(null);
                setShowAlternatives(false);
                
                Alert.alert(
                  'Product Updated',
                  `The product has been replaced with: ${selectedAlt.name}`,
                  [{ text: 'OK' }]
                );
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <ThemedText style={styles.useAlternativeButtonText}>Use This Alternative</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      )}
    </ThemedView>
  );
}

export default function ResultScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { userRequest } = useLocalSearchParams();
  // Base products from AI
  const [products, setProducts] = useState<Product[]>([]);
  // Precomputed plan variants derived from base + alternatives
  const [planLowest, setPlanLowest] = useState<Product[] | null>(null);
  const [planFewest, setPlanFewest] = useState<Product[] | null>(null);
  const [planBoth, setPlanBoth] = useState<Product[] | null>(null);
  const [optimizeMode, setOptimizeMode] = useState<'none' | 'lowest' | 'fewestShops' | 'both'>('none');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalCost, setTotalCost] = useState(0);
  const [originalTotalCost, setOriginalTotalCost] = useState(0);
  const [resultId, setResultId] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Function to handle product updates when alternatives are selected (and persist to Firestore)
  const handleProductUpdate = async (productId: string, updatedProduct: Product) => {
    // Compute the updated list first so we can persist the exact items
    const updatedProducts = products.map(p => p.id === productId ? updatedProduct : p);

    // Update UI state
    setProducts(updatedProducts);
    const newTotal = updatedProducts.reduce((sum, product) => {
      if (product.owned) return sum; // exclude owned
      const price = parseFloat(product.price.replace(/[^0-9.-]+/g, ''));
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
    setTotalCost(newTotal);

    // Do not auto-persist; will save on user action
  };

  const progressMessages = [
    'Analyzing your request…',
    'Finding nearby shops…',
    'Comparing prices across sources…',
    'Selecting the best value options…',
    'Finalizing your plan…',
  ];

  useEffect(() => {
    // Simulate AI processing
    processAIRequest(userRequest as string);
  }, [userRequest]);
  // Optional: get device coords for distance sorting (web safe no-op if blocked)
  useEffect(() => {
    if (!navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCoords(null),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  const distanceKm = (a: { lat?: number; lng?: number }) => {
    if (!coords || a.lat == null || a.lng == null) return Number.POSITIVE_INFINITY;
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad((a.lat as number) - coords.lat);
    const dLon = toRad((a.lng as number) - coords.lng);
    const lat1 = toRad(coords.lat);
    const lat2 = toRad(a.lat as number);
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  };

  // Use products directly since we removed plan selector and sorting
  const sortedProducts = products;

  // Rotate progress messages while loading
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setMessageIndex((idx) => (idx + 1) % progressMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [loading]);

  // Animate progress bar loop
  useEffect(() => {
    if (!loading) return;
    const loop = Animated.loop(
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    progressAnim.setValue(0);
    loop.start();
    return () => loop.stop();
  }, [loading, progressAnim]);

  // Pulse animation for skeletons
  useEffect(() => {
    if (!loading) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [loading, pulseAnim]);

  const processAIRequest = async (request: string) => {
    setLoading(true);
    
    try {
      // Load catalog from Firestore to guide AI (optional)
      const [shops, items] = await Promise.all([
        listShops().catch(() => []),
        listItems(100).catch(() => []),
      ]);

      // Convert Firestore shops to AI ShopData with sample items
      const shopsData = shops.map((s) => ({
        name: `${s.name} (${s.city ?? s.location ?? ''} lat:${s.lat ?? ''} lng:${s.lng ?? ''})`,
        url: s.website ?? '',
        categories: [],
        sampleItems: items
          .filter((it) => it.shop_id === s.shop_id)
          .slice(0, 30)
          .map((it) => ({
            name: it.name,
            price: typeof it.price === 'number' ? `$${it.price.toFixed(2)}` : String(it.price),
            category: (it.type ?? it.category ?? '').toString(),
          })),
      }));

      // Use the DeepSeek API to process the request
      const aiResponse: AIResponse = await callAIService({
        userRequest: request,
        answerFormat: ANSWER_FORMAT,
        shopsData,
      });
      
      // Convert AI response to our Product interface
      const productsWithIds: Product[] = aiResponse.products.map((product, index) => ({
        ...product,
        id: (index + 1).toString(),
        owned: false,
      }));
      
      setProducts(productsWithIds);
      // Recalculate based on parsed items (in case AI total differs) and excluding owned
      const initialTotal = productsWithIds.reduce((sum, product) => {
        const price = parseFloat(product.price.replace(/[^0-9.-]+/g, ''));
        return sum + (isNaN(price) ? 0 : price);
      }, 0);
      setTotalCost(initialTotal);
      // Precompute plans from AI response
      computePlans(productsWithIds);
      setOriginalTotalCost(aiResponse.totalCost);

      // Defer persistence until user taps Save
      const req = await saveRequest(request, { meta: 'created', total: initialTotal });
      setRequestId(req.request_id);
    } catch (error) {
      console.error('Error processing AI request:', error);
      Alert.alert('Error', 'Failed to process your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Price parsing helpers
  const parsePrice = (text: string): number => {
    const n = parseFloat(String(text).replace(/[^0-9.-]+/g, ''));
    return isNaN(n) ? 0 : n;
  };
  const parseCandidatePrice = (text: string): number => {
    const n = parseFloat(String(text).replace(/[^0-9.-]+/g, ''));
    // Treat invalid or non-positive prices as not viable for optimization
    return isNaN(n) || n <= 0 ? Number.POSITIVE_INFINITY : n;
  };

  // Build candidate list (main + alternatives)
  type Candidate = {
    name: string;
    store: string;
    price: number;
    availability: string;
    description: string;
  };

  const getCandidatesForProduct = (p: Product): Candidate[] => {
    const candidates: Candidate[] = [];
    // Main
    const mainPrice = parseCandidatePrice(p.price);
    if (p.store && isFinite(mainPrice)) {
      candidates.push({
        name: p.name,
        store: p.store,
        price: mainPrice,
        availability: p.availability,
        description: p.description,
      });
    }
    // Alternatives
    if (p.alternatives && p.alternatives.length > 0) {
      for (const alt of p.alternatives) {
        const priceNum = parseCandidatePrice(alt.price);
        if (!alt.store || !isFinite(priceNum)) continue;
        candidates.push({
          name: alt.name,
          store: alt.store,
          price: priceNum,
          availability: alt.availability,
          description: alt.description,
        });
      }
    }
    return candidates;
  };

  const buildProductFromCandidate = (orig: Product, c: Candidate): Product => ({
    ...orig,
    name: c.name,
    store: c.store,
    price: `$${c.price.toFixed(2)}`,
    availability: c.availability,
    description: c.description,
  });

  // Compute all three plans deterministically from current base products
  const computePlans = (base: Product[]) => {
    const candidatesPerProduct = base.map(getCandidatesForProduct);

    // Lowest total plan
    const lowest: Product[] = base.map((p, i) => {
      if (p.owned) return p;
      const cands = candidatesPerProduct[i];
      if (!cands || cands.length === 0) return p;
      const best = cands.reduce((a, b) => (a.price <= b.price ? a : b));
      return buildProductFromCandidate(p, best);
    });

    // Fewest shops plan (greedy set cover with cost tie-break)
    const allStores = new Set<string>();
    const storeToIndices = new Map<string, { idx: number; cand: Candidate }[]>();
    for (let i = 0; i < base.length; i += 1) {
      if (base[i].owned) continue;
      const cands = candidatesPerProduct[i];
      if (!cands || cands.length === 0) continue;
      for (const c of cands) {
        allStores.add(c.store);
        const arr = storeToIndices.get(c.store) ?? [];
        arr.push({ idx: i, cand: c });
        storeToIndices.set(c.store, arr);
      }
    }
    const unassigned = new Set<number>(base.map((_, i) => i).filter(i => !base[i].owned));
    const pickForIndex: Map<number, Candidate> = new Map();
    while (unassigned.size > 0) {
      let bestStore: string | null = null;
      let bestCoverage = -1;
      let bestCoverageCost = Number.POSITIVE_INFINITY;
      for (const s of Array.from(allStores).sort()) {
        const pairs = (storeToIndices.get(s) ?? []).filter(x => unassigned.has(x.idx));
        const coverage = pairs.length;
        if (coverage === 0) continue;
        const coverageCost = pairs.reduce((sum, x) => sum + x.cand.price, 0);
        if (coverage > bestCoverage || (coverage === bestCoverage && coverageCost < bestCoverageCost)) {
          bestStore = s; bestCoverage = coverage; bestCoverageCost = coverageCost;
        }
      }
      if (!bestStore) break;
      const pairs = (storeToIndices.get(bestStore) ?? []).filter(x => unassigned.has(x.idx));
      for (const { idx, cand } of pairs) {
        const cheapestForStore = (storeToIndices.get(bestStore) ?? [])
          .filter(x => x.idx === idx)
          .map(x => x.cand)
          .reduce((a, b) => (a.price <= b.price ? a : b), cand);
        pickForIndex.set(idx, cheapestForStore);
        unassigned.delete(idx);
      }
    }
    const fewest: Product[] = base.map((p, i) => {
      if (p.owned) return p;
      const assigned = pickForIndex.get(i);
      if (assigned) return buildProductFromCandidate(p, assigned);
      const cands = candidatesPerProduct[i];
      if (!cands || cands.length === 0) return p;
      const cheapest = cands.reduce((a, b) => (a.price <= b.price ? a : b));
      return buildProductFromCandidate(p, cheapest);
    });

    // Both: use fewest, then try to reduce cost within same store set
    const storesSet = new Set(fewest.filter(u => !u.owned && u.store).map(u => u.store));
    const both: Product[] = fewest.map((p, i) => {
      if (p.owned) return p;
      const candsAll = candidatesPerProduct[i] ?? [];
      const within = candsAll.filter(c => storesSet.has(c.store));
      if (within.length === 0) return p;
      const currentPrice = parsePrice(p.price);
      const cheaper = within.reduce((a, b) => (a.price <= b.price ? a : b));
      if (cheaper.price < currentPrice) return buildProductFromCandidate(p, cheaper);
      return p;
    });

    setPlanLowest(lowest);
    setPlanFewest(fewest);
    setPlanBoth(both);
  };

  // Optimize choices using alternatives
  const handleOptimize = async (mode: 'lowest' | 'fewestShops' | 'both') => {
    setOptimizeMode(mode);
    setOptimizing(true);
    try {
      const updated: Product[] = [];
      const candidatesPerProduct = products.map(getCandidatesForProduct);

      if (mode === 'lowest') {
        for (let i = 0; i < products.length; i += 1) {
          const p = products[i];
          if (p.owned) { updated.push(p); continue; }
          const cands = candidatesPerProduct[i];
          if (!cands || cands.length === 0) { updated.push(p); continue; }
          const best = cands.reduce((a, b) => (a.price <= b.price ? a : b));
          updated.push(buildProductFromCandidate(p, best));
        }
        setProducts(updated);
      } else {
        // Fewest shops (greedy set cover) possibly refined for cost
        const allStores = new Set<string>();
        const storeToIndices = new Map<string, { idx: number; cand: Candidate }[]>();
        for (let i = 0; i < products.length; i += 1) {
          if (products[i].owned) continue;
          const cands = candidatesPerProduct[i];
          if (!cands || cands.length === 0) continue;
          for (const c of cands) {
            allStores.add(c.store);
            const arr = storeToIndices.get(c.store) ?? [];
            arr.push({ idx: i, cand: c });
            storeToIndices.set(c.store, arr);
          }
        }
        const unassigned = new Set<number>(products.map((_, i) => i).filter(i => !products[i].owned));
        const chosenStores: Set<string> = new Set();
        const pickForIndex: Map<number, Candidate> = new Map();

        while (unassigned.size > 0) {
          let bestStore: string | null = null;
          let bestCoverage = -1;
          let bestCoverageCost = Number.POSITIVE_INFINITY;
          const storeList = Array.from(allStores).sort(); // deterministic tie-breaker
          for (const s of storeList) {
            const pairs = (storeToIndices.get(s) ?? []).filter(x => unassigned.has(x.idx));
            const coverage = pairs.length;
            if (coverage === 0) continue;
            const coverageCost = pairs.reduce((sum, x) => sum + x.cand.price, 0);
            if (
              coverage > bestCoverage ||
              (coverage === bestCoverage && coverageCost < bestCoverageCost)
            ) {
              bestStore = s; bestCoverage = coverage; bestCoverageCost = coverageCost;
            }
          }
          if (!bestStore) break;
          chosenStores.add(bestStore);
          const pairs = (storeToIndices.get(bestStore) ?? []).filter(x => unassigned.has(x.idx));
          for (const { idx, cand } of pairs) {
            // Assign cheapest for this store for that product
            const cheapestForStore = (storeToIndices.get(bestStore) ?? [])
              .filter(x => x.idx === idx)
              .map(x => x.cand)
              .reduce((a, b) => (a.price <= b.price ? a : b), cand);
            pickForIndex.set(idx, cheapestForStore);
            unassigned.delete(idx);
          }
        }
        // Assign remaining with cheapest overall
        for (let i = 0; i < products.length; i += 1) {
          const p = products[i];
          if (p.owned) { updated.push(p); continue; }
          const assigned = pickForIndex.get(i);
          if (assigned) {
            updated.push(buildProductFromCandidate(p, assigned));
          } else {
            const cands = candidatesPerProduct[i];
            if (cands && cands.length > 0) {
              const cheapest = cands.reduce((a, b) => (a.price <= b.price ? a : b));
              updated.push(buildProductFromCandidate(p, cheapest));
            } else {
              // No valid candidates, keep original
              updated.push(p);
            }
          }
        }
        if (mode === 'both') {
          // Improve cost without increasing store count
          const storesSet = new Set(updated.filter(u => !u.owned && u.store).map(u => u.store));
          for (let i = 0; i < products.length; i += 1) {
            const p = updated[i];
            if (p.owned) continue;
            const candsAll = candidatesPerProduct[i];
            const cands = (candsAll ?? []).filter(c => storesSet.has(c.store));
            if (cands.length > 0) {
              const currentPrice = parsePrice(p.price);
              const cheaper = cands.reduce((a, b) => (a.price <= b.price ? a : b));
              if (cheaper.price < currentPrice) {
                updated[i] = buildProductFromCandidate(p, cheaper);
              }
            }
          }
        }
        setProducts(updated);
      }
      // Recompute totals excluding owned
      const newTotal = updated.reduce((sum, p) => sum + (p.owned ? 0 : parsePrice(p.price)), 0);
      setTotalCost(newTotal);
    } finally {
      setOptimizing(false);
    }
  };

  const handleBackToHome = () => {
    router.back();
  };

  const handleNewPlan = () => {
    router.push('/(main)/create');
  };

  const handleToggleOwned = (productId: string) => {
    const updated = products.map(p => p.id === productId ? { ...p, owned: !p.owned } : p);
    setProducts(updated);
    const newTotal = updated.reduce((sum, product) => {
      if (product.owned) return sum;
      const price = parseFloat(product.price.replace(/[^0-9.-]+/g, ''));
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
    setTotalCost(newTotal);
  };

  const handleSave = async () => {
    try {
      const itemsToSave = products;
      // Ensure we have a request id
      let ensuredRequestId = requestId;
      if (!ensuredRequestId) {
        const req = await saveRequest(String(userRequest ?? ''), { meta: 'createdFromSave', total: totalCost });
        ensuredRequestId = req.request_id;
        setRequestId(ensuredRequestId);
      }

      // Save or update result
      let finalResultId = resultId;
      if (!finalResultId && ensuredRequestId) {
        const title = String(userRequest ?? '') || (itemsToSave[0]?.name ?? 'Planned project');
        const res = await saveResult(ensuredRequestId, itemsToSave, 'deepseek', title);
        finalResultId = res.result_id;
        setResultId(finalResultId);
      } else if (finalResultId) {
        await updateResultItemsCloud(finalResultId, itemsToSave);
      }
      if (finalResultId) {
        router.push({ pathname: '/(main)/history-detail', params: { id: finalResultId } });
      } else {
        // Fallback: open profile if we somehow have no id
        router.push('/(main)/profile');
      }
    } catch (e) {
      Alert.alert('Save failed', 'Could not save your plan. Please try again.');
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedView style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleBackToHome} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
            Preparing Your Plan
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />

          {/* Animated progress bar */}
          <ThemedView style={[styles.progressBarContainer, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
            <Animated.View
              style={[styles.progressBarFill, {
                backgroundColor: colors.primary,
                width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['5%', '95%'] }),
              }]}
            />
          </ThemedView>

          {/* Rotating message */}
          <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
            {progressMessages[messageIndex]}
          </ThemedText>
          <ThemedText style={[styles.loadingHint, { color: colors.textTertiary }]}>
            Usually takes under 10 seconds
          </ThemedText>

          {/* Skeleton previews */}
          <ThemedView style={styles.skeletons}>
            {[0, 1, 2].map((i) => (
              <Animated.View key={i} style={[styles.skeletonCard, { opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }), backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                <ThemedView style={[styles.skeletonHeader]} />
                <ThemedView style={[styles.skeletonLine, { width: '85%', backgroundColor: colors.surfaceTertiary }]} />
                <ThemedView style={[styles.skeletonLine, { width: '60%', backgroundColor: colors.surfaceTertiary }]} />
              </Animated.View>
            ))}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBackToHome} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
          Your Plan
        </ThemedText>
        <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity onPress={handleSave} style={styles.newPlanButton}>
            <Ionicons name="save-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNewPlan} style={styles.newPlanButton}>
            <Ionicons name="add" size={24} color={colors.text} />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <ThemedView style={styles.requestSection}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
            Your Request
          </ThemedText>
          <ThemedView style={[styles.requestBox, { 
            backgroundColor: colors.primary + '10',
            borderLeftColor: colors.primary 
          }]}>
            <ThemedText style={[styles.requestText, { color: colors.text }]}>
              {userRequest}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.summarySection}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
            Project Summary
          </ThemedText>
          <ThemedView style={[styles.summaryBox, { backgroundColor: colors.surfaceSecondary }]}>
            <ThemedView style={styles.summaryRow}>
              <ThemedText style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Items:</ThemedText>
              <ThemedText style={[styles.summaryValue, { color: colors.text }]}>{products.length}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.summaryRow}>
              <ThemedText style={[styles.summaryLabel, { color: colors.textSecondary }]}>Estimated Cost:</ThemedText>
              <ThemedView style={styles.totalCostContainer}>
                <ThemedText style={[styles.summaryValue, styles.totalCost, { color: colors.success }]}>
                  ${totalCost.toFixed(2)}
                </ThemedText>
                {totalCost !== originalTotalCost && (
                  <ThemedView style={[styles.costChangeIndicator, { backgroundColor: colors.primary }]}>
                    <Ionicons name="swap-horizontal" size={12} color="white" />
                  </ThemedView>
                )}
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        
        {/* Optimize (recompute plans) */}
        <ThemedView style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <TouchableOpacity 
            onPress={() => handleOptimize('lowest')} 
            style={[
              styles.newPlanButton, 
              { 
                borderWidth: 1, 
                borderColor: optimizeMode === 'lowest' ? colors.primary : colors.border,
                backgroundColor: optimizeMode === 'lowest' ? colors.primary + '20' : (optimizing ? colors.primary + '10' : 'transparent')
              }
            ]} 
            disabled={optimizing}
          >
            <ThemedText style={{ color: optimizeMode === 'lowest' ? colors.primary : (optimizing ? colors.primary : colors.text) }}>
              {optimizing && optimizeMode === 'lowest' ? 'Optimizing…' : 'Optimize: Lowest Total'}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleOptimize('fewestShops')} 
            style={[
              styles.newPlanButton, 
              { 
                borderWidth: 1, 
                borderColor: optimizeMode === 'fewestShops' ? colors.primary : colors.border,
                backgroundColor: optimizeMode === 'fewestShops' ? colors.primary + '20' : (optimizing ? colors.primary + '10' : 'transparent')
              }
            ]} 
            disabled={optimizing}
          >
            <ThemedText style={{ color: optimizeMode === 'fewestShops' ? colors.primary : (optimizing ? colors.primary : colors.text) }}>
              {optimizing && optimizeMode === 'fewestShops' ? 'Optimizing…' : 'Optimize: Fewest Shops'}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleOptimize('both')} 
            style={[
              styles.newPlanButton, 
              { 
                borderWidth: 1, 
                borderColor: optimizeMode === 'both' ? colors.primary : colors.border,
                backgroundColor: optimizeMode === 'both' ? colors.primary + '20' : (optimizing ? colors.primary + '10' : 'transparent')
              }
            ]} 
            disabled={optimizing}
          >
            <ThemedText style={{ color: optimizeMode === 'both' ? colors.primary : (optimizing ? colors.primary : colors.text) }}>
              {optimizing && optimizeMode === 'both' ? 'Optimizing…' : 'Optimize: Both'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Products Section */}
        {products.filter(p => p.category === 'product').length > 0 && (
          <ThemedView style={styles.productsSection}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
              Products & Materials
            </ThemedText>
            {sortedProducts.filter(p => p.category === 'product').map((product) => {
              const parse = (store: string) => {
                const m = store.match(/lat:([0-9.+-]+) lng:([0-9.+-]+)/i);
                if (!m) return null;
                return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) } as any;
              };
              const loc = parse(product.store);
              const d = loc ? distanceKm(loc) : null;
              const distText = d && isFinite(d) ? `${d.toFixed(1)} km away` : undefined;
              return (
                <ProductCard key={product.id} product={product} colors={colors} onProductUpdate={handleProductUpdate} onToggleOwned={handleToggleOwned} distanceText={distText} />
              );
            })}
          </ThemedView>
        )}

        {/* Tools Section */}
        {products.filter(p => p.category === 'tool').length > 0 && (
          <ThemedView style={styles.productsSection}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
              Tools & Equipment
            </ThemedText>
            {sortedProducts.filter(p => p.category === 'tool').map((product) => {
              const parse = (store: string) => {
                const m = store.match(/lat:([0-9.+-]+) lng:([0-9.+-]+)/i);
                if (!m) return null;
                return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) } as any;
              };
              const loc = parse(product.store);
              const d = loc ? distanceKm(loc) : null;
              const distText = d && isFinite(d) ? `${d.toFixed(1)} km away` : undefined;
              return (
                <ProductCard key={product.id} product={product} colors={colors} onProductUpdate={handleProductUpdate} onToggleOwned={handleToggleOwned} distanceText={distText} />
              );
            })}
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 12,
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  newPlanButton: {
    padding: 12,
    borderRadius: 12,
  },
  content: { flex: 1, padding: 24 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  progressBarContainer: {
    width: '80%',
    height: 8,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 16,
    borderWidth: 1,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 8,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingHint: {
    fontSize: 12,
    marginTop: 6,
  },
  skeletons: {
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 12,
  },
  skeletonCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  skeletonHeader: {
    height: 18,
    borderRadius: 8,
    marginBottom: 10,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  requestSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  requestBox: {
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
  },
  requestText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  summarySection: {
    marginBottom: 32,
  },
  summaryBox: {
    padding: 20,
    borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalCost: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalCostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  costChangeIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsSection: {
    marginBottom: 32,
  },
  productCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 22,
  },
  productDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  productCategory: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
  },
  alternativesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    gap: 6,
  },
  alternativesToggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  alternativesContainer: {
    marginTop: 12,
    gap: 8,
  },
  alternativeCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  alternativeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alternativeInfo: {
    flex: 1,
    marginRight: 12,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alternativeName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  alternativeDescription: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
  },
  alternativeDetails: {
    gap: 6,
  },
  useAlternativeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  useAlternativeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
