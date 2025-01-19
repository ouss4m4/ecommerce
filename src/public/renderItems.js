// init search input value from url
const searchInput = document.getElementById('search');

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('keyword')) {
  searchInput.value = urlParams.get('keyword');
}
let timeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(timeout); // debounce
  timeout = setTimeout(function () {
    let params = new URLSearchParams(window.location.search);
    if (e.target.value) {
      params.set('keyword', e.target.value);
    } else {
      params.delete('keyword');
    }
    let base = window.location.pathname == 'search' ? '' : '/search';
    window.location.href = `${base}?${params.toString()}`;
  }, 500);
});

const createItemCard = (item) => {
  let itemDiv = document.createElement('div');
  itemDiv.className = `shadow bg-white flex flex-col items-center p-0 m-0 w-[300px] hover:shadow-lg`;
  itemDiv.innerHTML = `
          <p class=''> ${item.name} </p>
          <img src='http://localhost:3001/${item.image}'  width='300' height='300' class='w-[300px] h-[300px]'/>
          <p class='text-sm mt-2 text-center px-2 py-1'> ${item.description} </p>
          <div class='grid grid-cols-2 w-full mt-4 border'>
              <div class='w-full border-r-2 text-center py-2 text-sm'> ${item.price}</div>
              <div class='w-full py-2 text-center text-sm hover:font-semibold cursor-pointer'> ADD TO CART</div>
          </div>
      `;

  return itemDiv;
};

async function renderItems(data) {
  const { data: itemsList, aggs } = data;
  const itemsWrap = document.getElementById('products');
  for (let i = 0; i < itemsList.length; i++) {
    let card = createItemCard(itemsList[i]);
    itemsWrap.append(card);
  }

  renderAggs(aggs);
}

const renderAggs = (items) => {
  renderBrands(items.brand_counts.buckets);
  renderPriceRanges(items.price_ranges.buckets);
};

const renderBrands = (brands) => {
  const aggsDiv = document.getElementById('aggs');
  const wrapDiv = document.createElement('div');
  wrapDiv.className = 'shadow bg-white flex flex-col space-y-2 p-2';
  const title = document.createElement('h2');
  title.textContent = 'BRANDS';
  title.className = 'text-sm';
  wrapDiv.append(title);
  const preSelectedBrands = getPreselectedBrands();
  for (const brand of brands) {
    const brandWrap = document.createElement('div');
    brandWrap.className = 'flex items-center space-x-2';
    const brandCheck = document.createElement('input');
    brandCheck.type = 'checkbox';
    brandCheck.name = `${brand.key}`;
    brandCheck.id = `${brand.key}`;
    brandCheck.checked = preSelectedBrands.includes(`${brand.key}`);
    brandCheck.addEventListener('change', function (e) {
      const params = new URLSearchParams(window.location.search);
      let newValue;
      if (e.target.checked) {
        newValue = [...getPreselectedBrands(), `${brand.key}`];
      } else {
        newValue = getPreselectedBrands().filter((name) => name != `${brand.key}`);
      }
      params.set('brand', newValue);

      window.location.href = `${window.location.pathname}?${params.toString()}`;
    });
    brandWrap.append(brandCheck);
    const brandLabel = document.createElement('label');
    brandLabel.innerText = `${brand.key} - (${brand.doc_count})`;
    brandLabel.htmlFor = `${brand.key}`;
    brandWrap.append(brandLabel);
    wrapDiv.append(brandWrap);
  }

  aggsDiv.append(wrapDiv);
};

const renderPriceRanges = (prices) => {
  for (const range of prices) {
    console.log(range);
  }
};
const getPreselectedBrands = () => {
  let urlBrands = new URLSearchParams(window.location.search).get(`brand`); // 'LG,Sony,...'
  if (!urlBrands) return [];
  result = urlBrands.split(',');
  return result;
};
