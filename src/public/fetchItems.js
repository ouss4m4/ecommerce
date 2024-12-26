const getItemsList = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  const pageSize = 10; // get item from paginator object later
  console.log(page);
  const apiUrl = page ? `http://localhost:3001/api/v1/products?page=${page}&pageSize=${pageSize}` : 'http://localhost:3001/api/v1/products';
  return await fetch(apiUrl).then((res) => res.json());
};

document.addEventListener('DOMContentLoaded', async () => {
  let items = await getItemsList();
  renderItems(items.data);
});
