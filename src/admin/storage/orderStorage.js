const KEY = "orders_data";

export const getOrders = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const saveOrders = (orders) => {
  localStorage.setItem(KEY, JSON.stringify(orders));
};
