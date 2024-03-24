function formatDate(dateStr) {
  const date = new Date(dateStr);
  const dd = date.getDate().toString().padStart(2, "0");
  const mm = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
  const yyyy = date.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}

export default formatDate;