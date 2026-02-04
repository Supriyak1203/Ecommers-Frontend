const KEY = "payments_data";

export const getPayments = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const savePayments = (payments) => {
  localStorage.setItem(KEY, JSON.stringify(payments));
};
