const KEY = "feedback_data";

export const getFeedbacks = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const saveFeedbacks = (feedbacks) => {
  localStorage.setItem(KEY, JSON.stringify(feedbacks));
};
