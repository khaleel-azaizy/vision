// AI Service Integration
// Replace this with your actual AI API integration

export interface AIRequest {
  userRequest: string;
  answerFormat: string;
  shopsData: ShopData[];
}

export interface ShopData {
  name: string;
  url: string;
  apiKey?: string;
  categories: string[];
}

export interface AIResponse {
  products: Product[];
  totalCost: number;
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Product {
  id: string;
  name: string;
  price: string;
  store: string;
  category: 'product' | 'tool';
  description: string;
  availability: string;
  url?: string;
  imageUrl?: string;
}

// Mock shop data - replace with your actual shop integrations
const MOCK_SHOPS: ShopData[] = [
  {
    name: 'Home Depot',
    url: 'https://homedepot.com',
    categories: ['tools', 'hardware', 'lumber', 'paint']
  },
  {
    name: 'Lowe\'s',
    url: 'https://lowes.com',
    categories: ['tools', 'hardware', 'lumber', 'paint']
  },
  {
    name: 'Amazon',
    url: 'https://amazon.com',
    categories: ['tools', 'hardware', 'electronics', 'general']
  },
  {
    name: 'Michaels',
    url: 'https://michaels.com',
    categories: ['crafts', 'art supplies', 'tools']
  }
];

// Mock AI response generator
export const generateAIResponse = async (userRequest: string): Promise<AIResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock response based on user request
  const mockProducts: Product[] = generateMockProducts(userRequest);
  const totalCost = calculateTotalCost(mockProducts);
  
  return {
    products: mockProducts,
    totalCost,
    estimatedTime: '2-4 hours',
    difficulty: 'Medium'
  };
};

// DeepSeek API integration
export const callAIService = async (request: AIRequest): Promise<AIResponse> => {
  try {
    const prompt = `You are a helpful assistant that creates detailed shopping lists for DIY projects. 

User Request: "${request.userRequest}"

Please provide a detailed shopping list with the following information for each item:
- Product name
- Price estimate (in $XX.XX format)
- Store recommendation (choose from: Home Depot, Lowe's, Amazon, Michaels, IKEA)
- Category (either "product" or "tool")
- Brief description
- Availability status

Consider the following stores and their specialties:
- Home Depot: Tools, hardware, lumber, paint, electrical
- Lowe's: Tools, hardware, lumber, paint, appliances
- Amazon: General products, electronics, tools, fast delivery
- Michaels: Crafts, art supplies, tools, creative materials
- IKEA: Furniture, home organization, simple tools

Please respond with a JSON object in this exact format:
{
  "products": [
    {
      "name": "Product name",
      "price": "$XX.XX",
      "store": "Store name",
      "category": "product",
      "description": "Brief description",
      "availability": "In Stock"
    }
  ],
  "totalCost": XX.XX,
  "estimatedTime": "X hours",
  "difficulty": "Easy"
}

Make sure to include both materials/products and tools needed for the project.`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-3e1a48cc8bc24810aff25e914b2f18ec',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Parse the JSON response from DeepSeek
    try {
      const parsedResponse = JSON.parse(aiResponse);
      return parsedResponse;
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to mock data if parsing fails
      return generateAIResponse(request.userRequest);
    }
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    // Fallback to mock data
    return generateAIResponse(request.userRequest);
  }
};

// Helper functions
const generateMockProducts = (userRequest: string): Product[] => {
  const request = userRequest.toLowerCase();
  
  if (request.includes('coffee table') || request.includes('table')) {
    return [
      {
        id: '1',
        name: 'Wooden Coffee Table Kit',
        price: '$89.99',
        store: 'Home Depot',
        category: 'product',
        description: 'Complete kit with all materials needed',
        availability: 'In Stock',
        url: 'https://homedepot.com/coffee-table-kit'
      },
      {
        id: '2',
        name: 'Cordless Drill',
        price: '$45.99',
        store: 'Lowe\'s',
        category: 'tool',
        description: '12V cordless drill with battery and charger',
        availability: 'In Stock',
        url: 'https://lowes.com/cordless-drill'
      },
      {
        id: '3',
        name: 'Wood Stain (Dark Oak)',
        price: '$12.50',
        store: 'Amazon',
        category: 'product',
        description: '250ml can of water-based wood stain',
        availability: 'Prime Delivery',
        url: 'https://amazon.com/wood-stain'
      }
    ];
  }
  
  if (request.includes('shelf') || request.includes('bookcase')) {
    return [
      {
        id: '1',
        name: 'Floating Shelf Kit',
        price: '$34.99',
        store: 'IKEA',
        category: 'product',
        description: 'Set of 3 floating shelves with mounting hardware',
        availability: 'In Stock'
      },
      {
        id: '2',
        name: 'Level',
        price: '$8.99',
        store: 'Home Depot',
        category: 'tool',
        description: '24-inch spirit level for accurate mounting',
        availability: 'In Stock'
      }
    ];
  }
  
  // Default response for other requests
  return [
    {
      id: '1',
      name: 'Basic Tool Set',
      price: '$29.99',
      store: 'Amazon',
      category: 'tool',
      description: 'Essential tools for DIY projects',
      availability: 'Prime Delivery'
    },
    {
      id: '2',
      name: 'Project Materials',
      price: '$49.99',
      store: 'Home Depot',
      category: 'product',
      description: 'Materials based on your project needs',
      availability: 'In Stock'
    }
  ];
};

export const calculateTotalCost = (products: Product[]): number => {
  return products.reduce((total, product) => {
    const price = parseFloat(product.price.replace('$', ''));
    return total + price;
  }, 0);
};

// Answer format template for AI requests
export const ANSWER_FORMAT = `
Please provide a detailed shopping list for the following project request: "{userRequest}"

Format your response as JSON with the following structure:
{
  "products": [
    {
      "name": "Product name",
      "price": "$XX.XX",
      "store": "Store name",
      "category": "product" or "tool",
      "description": "Brief description",
      "availability": "In Stock" or "Out of Stock",
      "url": "Product URL if available"
    }
  ],
  "totalCost": XX.XX,
  "estimatedTime": "X hours",
  "difficulty": "Easy" or "Medium" or "Hard"
}

Consider the following stores and their specialties:
- Home Depot: Tools, hardware, lumber, paint
- Lowe's: Tools, hardware, lumber, paint  
- Amazon: General products, electronics, tools
- Michaels: Crafts, art supplies, tools

Prioritize products that are:
1. In stock and readily available
2. Good value for money
3. Appropriate for the skill level
4. From reputable stores
`;
