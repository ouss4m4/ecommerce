// init search input value from url
const searchInput = document.getElementById('search');

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('query')) {
  searchInput.value = urlParams.get('query');
}
let timeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(timeout); // debounce
  timeout = setTimeout(function () {
    window.location.href = `http://localhost:5500/search.html?query=${e.target.value}`;
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

async function renderItems(itemsList) {
  console.log(itemsList);
  const itemsWrap = document.getElementById('products');
  for (let i = 0; i < itemsList.length; i++) {
    let card = createItemCard(itemsList[i]);
    itemsWrap.append(card);
  }
}
