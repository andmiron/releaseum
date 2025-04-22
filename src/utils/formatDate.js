export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
