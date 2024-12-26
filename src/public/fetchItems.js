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

  let pagesLinks = '';
  if (page > 1) {
    pagesLinks = `
    <a
      href="http://localhost:3001?page=${page - 1}"
      aria-current="page"
      class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      >${page - 1}</a
    >
    `;
  }
  pagesLinks += `
  <a
      disabled
      href="#"
      aria-current="page"
      class="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >${page}</a
    >
  <a
      
      href="http://localhost:3001?page=${page + 1}"
      aria-current="page"
     class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      >${page + 1}</a
    >
  `;

  console.log(pagesLinks);
  document.getElementById('pageLinks').innerHTML = `${pagesLinks}`;
  // render page links;
};
