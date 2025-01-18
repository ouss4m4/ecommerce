const getItemsList = async () => {
  const params = new URLSearchParams(window.location.search);

  const apiUrl = `http://localhost:3001/api/v1/products/search?${params.toString()}`;
  let result = await fetch(apiUrl).then((res) => res.json());
  console.log(result);
  return result;
};

document.addEventListener('DOMContentLoaded', async () => {
  let items = await getItemsList();
  renderItems(items);
});
