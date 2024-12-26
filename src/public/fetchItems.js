const getItemsList = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  const pageSize = 10;

  const apiUrl = page ? `http://localhost:3001/api/v1/products?page=${page}&pageSize=${pageSize}` : 'http://localhost:3001/api/v1/products';
  return await fetch(apiUrl).then((res) => res.json());
};

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  let items = await getItemsList();

  renderItems(items.data);
  updatePaginator(page, items.total);
});

const updatePaginator = (currentPage, itemsTotal) => {
  const page = Number(currentPage) || 1;
  const itemsPerPage = 10;
  const lastPage = Math.ceil(itemsTotal / itemsPerPage);
  const from = (page - 1) * itemsPerPage + 1;
  const to = Math.min(page * itemsPerPage, itemsTotal);

  document.getElementById('total').textContent = itemsTotal;
  document.getElementById('from').textContent = itemsTotal ? from : 0;
  document.getElementById('to').textContent = itemsTotal ? to : 0;

  const backLink = page > 1 ? page - 1 : '#';
  const nextLink = page < lastPage ? page + 1 : '#';

  document.getElementById('back').href = backLink === '#' ? '#' : `http://localhost:3001?page=${backLink}`;
  document.getElementById('next').href = nextLink === '#' ? '#' : `http://localhost:3001?page=${nextLink}`;

  // render page links;
};
