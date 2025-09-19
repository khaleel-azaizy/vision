export type Shop = {
  shop_id: string;
  name: string;
  location?: string;
  website?: string;
  contact_info?: string;
};

export type Item = {
  item_id: string;
  shop_id: string;
  name: string;
  category: string;
  price: number;
  availability: string;
  type: 'product' | 'tool';
};

export type RequestDoc = {
  request_id: string;
  input_text: string;
  ai_answer: any;
  created_at: number;
};

export type ResultDoc = {
  result_id: string;
  request_id: string;
  items: Item[];
  method: string;
  created_at: number;
};


