const getItemsList = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('query');
  const apiUrl = `http://localhost:3001/api/v1/products/search?query=${query}`;
  return await fetch(apiUrl).then((res) => res.json());
};

document.addEventListener('DOMContentLoaded', async () => {
  let items = await getItemsList();
  renderItems(items);
});
