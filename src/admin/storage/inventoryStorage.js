const KEY = "inventory_products";

export const getProducts = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const saveProducts = (products) => {
  localStorage.setItem(KEY, JSON.stringify(products));
};
