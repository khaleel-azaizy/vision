import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AIResponse, ANSWER_FORMAT, callAIService, MOCK_SHOPS } from '@/services/aiService';
import { saveRequest, saveResult } from '@/services/firebase';
import { saveLocalRequestAndResult } from '@/services/localdb';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface Product {
  id: string;
  name: string;
  price: string;
  store: string;
  category: 'product' | 'tool';
  description: string;
  availability: string;
}

export default function ResultScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { userRequest } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    // Simulate AI processing
    processAIRequest(userRequest as string);
  }, [userRequest]);

  const processAIRequest = async (request: string) => {
    setLoading(true);
    
    try {
      // Use the DeepSeek API to process the request
      const aiResponse: AIResponse = await callAIService({
        userRequest: request,
        answerFormat: ANSWER_FORMAT,
        shopsData: MOCK_SHOPS
      });
      
      // Convert AI response to our Product interface
      const productsWithIds: Product[] = aiResponse.products.map((product, index) => ({
        ...product,
        id: (index + 1).toString()
      }));
      
      setProducts(productsWithIds);
      setTotalCost(aiResponse.totalCost);

      // Persist in Firestore (optional shared history)
      const req = await saveRequest(request, aiResponse);
      await saveResult(req.request_id, productsWithIds, 'deepseek');

      // Persist locally for device-only history
      await saveLocalRequestAndResult(request, aiResponse, productsWithIds, 'deepseek');
    } catch (error) {
      console.error('Error processing AI request:', error);
      Alert.alert('Error', 'Failed to process your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    router.back();
  };

  const handleNewPlan = () => {
    router.push('/(main)/create');
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedView style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleBackToHome} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
            Planning Your Project
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.loadingContainer}>
          <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
            AI is analyzing your request and finding the best products...
          </ThemedText>
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
        <TouchableOpacity onPress={handleNewPlan} style={styles.newPlanButton}>
          <Ionicons name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
              <ThemedText style={[styles.summaryValue, styles.totalCost, { color: colors.success }]}>${totalCost.toFixed(2)}</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.productsSection}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
            Recommended Products & Tools
          </ThemedText>
          {products.map((product) => (
            <ThemedView key={product.id} style={[styles.productCard, { backgroundColor: colors.surface }]}>
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
                <ThemedView style={styles.detailRow}>
                  <Ionicons name="pricetag" size={16} color={colors.textTertiary} />
                  <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>{product.price}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.detailRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>{product.availability}</ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>
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
    paddingTop: 80,
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
  content: {
    flex: 1,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  productsSection: {
    marginBottom: 32,
  },
  productCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
});
