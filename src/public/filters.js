const fetchCategories = async () => {
  const apiUrl = `http://localhost:3001/api/v1/categories`;
  let result = await fetch(apiUrl).then((res) => res.json());
  if (result.data) return result.data;
  return [];
};

document.addEventListener('DOMContentLoaded', async () => {
  const categories = await fetchCategories();
  renderCategories(categories);
});

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
