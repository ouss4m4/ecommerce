const fetchCategories = async () => {
  const apiUrl = `http://localhost:3001/api/v1/categories`;
  let result = await fetch(apiUrl).then((res) => res.json());
  if (result.data) return result.data;
  return [];
};

document.addEventListener('DOMContentLoaded', async () => {
  const categories = await fetchCategories();
  renderCategories(categories);
  renderMinPriceInput();
  renderMaxPriceInput();
});

const renderMinPriceInput = () => {
  const filtersDiv = document.getElementById('filters');
  const minPriceWrap = document.createElement('div');
  const label = document.createElement('label');
  label.className = `block text-sm font-semibold text-gray-500 mb-2`;
  label.textContent = 'Min Price';
  label.htmlFor = 'minprice';
  minPriceWrap.append(label);
  const minPriceInput = document.createElement('input');
  minPriceInput.type = 'number';
  minPriceInput.className = 'rounded-sm border  text-sm w-[100px]';
  minPriceInput.name = 'minprice';
  minPriceInput.id = 'minprice';
  let minprice = new URLSearchParams(window.location.search).get('priceMin');
  minprice ? (minPriceInput.value = minprice) : '';
  minPriceInput.addEventListener('change', (e) => {
    const priceMin = e.target.value ? e.target.value : '0';
    const params = new URLSearchParams(window.location.search);
    if (priceMin == '0') {
      params.delete('priceMin');
    } else {
      params.set('priceMin', priceMin);
    }
    window.location.href = `${window.location.pathname}?${params.toString()}`;
  });
  minPriceWrap.append(minPriceInput);
  filtersDiv.append(minPriceWrap);
};

const renderMaxPriceInput = () => {
  const filtersDiv = document.getElementById('filters');
  const maxPriceWrap = document.createElement('div');
  const label = document.createElement('label');
  label.className = `block text-sm font-semibold text-gray-500 mb-2`;
  label.textContent = 'Max Price';
  label.htmlFor = 'maxprice';
  maxPriceWrap.append(label);
  const maxPriceInput = document.createElement('input');
  maxPriceInput.type = 'number';
  maxPriceInput.className = 'rounded-sm border  text-sm w-[100px]';
  maxPriceInput.name = 'maxprice';
  maxPriceInput.id = 'maxprice';
  let maxprice = new URLSearchParams(window.location.search).get('priceMax');
  maxprice ? (maxPriceInput.value = maxprice) : '';
  maxPriceInput.addEventListener('change', (e) => {
    const priceMax = e.target.value ? e.target.value : '0';
    const params = new URLSearchParams(window.location.search);
    if (priceMax == '0') {
      params.delete('priceMax');
    } else {
      params.set('priceMax', priceMax);
    }
    window.location.href = `${window.location.pathname}?${params.toString()}`;
  });
  maxPriceWrap.append(maxPriceInput);
  filtersDiv.append(maxPriceWrap);
};

const renderCategories = (list) => {
  const filtersDiv = document.getElementById('filters');
  const categoriesWrap = document.createElement('div');
  const label = document.createElement('label');
  label.className = `block text-sm font-semibold text-gray-500 mb-2`;
  label.textContent = 'Categories';
  categoriesWrap.appendChild(label);
  const selectTag = document.createElement('select');
  selectTag.name = 'categories';
  selectTag.className = `rounded-sm border-gray-300  sm:text-sm w-[200px]`;
  const allOption = document.createElement('option');
  allOption.text = 'All';
  allOption.value = 'All';
  selectTag.append(allOption);
  // preselect per url
  let selected = new URLSearchParams(window.location.search).get('category');
  for (const item of list) {
    const option = document.createElement('option');
    option.text = item.name;
    option.value = item.name;
    option.selected = selected == item.name ? true : false;
    selectTag.append(option);
  }

  selectTag.addEventListener('change', (ev) => {
    const category = ev.target.value ? ev.target.value : 'All';
    const params = new URLSearchParams(window.location.search);
    if (category == 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    window.location.href = `${window.location.pathname}?${params.toString()}`;
  });

  categoriesWrap.append(selectTag);
  filtersDiv.appendChild(categoriesWrap);
};
