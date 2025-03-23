
import axios from 'axios';
import { MenuItem } from '@/components/MenuCard';
import { Table } from '@/components/TableGrid';
import { OrderType } from '@/pages/orders/OrderManager';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Order API calls
export const getOrders = async (orderType?: OrderType, tableId?: number) => {
  try {
    const params: any = {};
    if (orderType) params.orderType = orderType;
    if (tableId) params.tableId = tableId;
    
    const response = await api.get('/orders', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderById = async (id: string) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
};

export const createOrder = async (orderData: {
  items: MenuItem[];
  tableId?: number | null;
  tableNumber?: number | null;
  orderType: OrderType;
}) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrder = async (id: string, orderData: any) => {
  try {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    throw error;
  }
};

export const deleteOrder = async (id: string) => {
  try {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting order ${id}:`, error);
    throw error;
  }
};

export const sendOrderToKitchen = async (id: string) => {
  try {
    const response = await api.post(`/orders/${id}/send-to-kitchen`);
    return response.data;
  } catch (error) {
    console.error(`Error sending order ${id} to kitchen:`, error);
    throw error;
  }
};

// Table API calls
export const getTables = async (status?: string) => {
  try {
    const params: any = {};
    if (status) params.status = status;
    
    const response = await api.get('/tables', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
};

export const getTableById = async (id: number) => {
  try {
    const response = await api.get(`/tables/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching table ${id}:`, error);
    throw error;
  }
};

export const updateTableStatus = async (id: number, status: string, orderId?: string) => {
  try {
    const response = await api.put(`/tables/${id}/status`, { status, orderId });
    return response.data;
  } catch (error) {
    console.error(`Error updating table ${id} status:`, error);
    throw error;
  }
};

// Menu API calls
export const getMenuItems = async (category?: string) => {
  try {
    const params: any = {};
    if (category) params.category = category;
    
    const response = await api.get('/menu', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

export const getMenuItemById = async (id: string) => {
  try {
    const response = await api.get(`/menu/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu item ${id}:`, error);
    throw error;
  }
};

export const createMenuItem = async (itemData: {
  name: string;
  price: number;
  description?: string;
  category: string;
  image?: string;
}) => {
  try {
    const response = await api.post('/menu', itemData);
    return response.data;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

export const updateMenuItem = async (id: string, itemData: any) => {
  try {
    const response = await api.put(`/menu/${id}`, itemData);
    return response.data;
  } catch (error) {
    console.error(`Error updating menu item ${id}:`, error);
    throw error;
  }
};

export const deleteMenuItem = async (id: string) => {
  try {
    const response = await api.delete(`/menu/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting menu item ${id}:`, error);
    throw error;
  }
};

export default api;
