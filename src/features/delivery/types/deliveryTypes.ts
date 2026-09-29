export type DeliveryStatus = 'assigned' | 'picked_up' | 'delivered';

export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface OrderItem {
  id: number;
  item_name: string;
  variant_name?: string | null;
  quantity: number;
  unit_price: string | number;
  line_total: string | number;
}

export interface DeliveryOrder {
  id: number;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  special_instructions?: string | null;
  total_price: string | number;
  status: string;
  payment_status: PaymentStatus;
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface DeliveryAssignment {
  id: number;
  order: number;
  order_details: DeliveryOrder;
  delivery_boy_phone: string;
  status: DeliveryStatus;
  assigned_at: string;
  delivered_at: string | null;
}

export interface DeliveryBoyProfileData {
  id: number;
  employee_id: string;
  username: string;
  name: string;
  phone_number: string;
  email: string;
  vehicle_number: string;
  is_on_duty: boolean;
  is_busy: boolean;
  total_delivered: number;
  today_delivered: number;
}
