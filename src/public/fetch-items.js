const itemsWrap = document.getElementById('products');

const getItemsList = async () => {
  return await fetch('http://localhost:3001/api/v1/products').then((res) => res.json());
};

const createItemCard = (item) => {
  let itemDiv = document.createElement('div');
  itemDiv.className = `shadow bg-white flex flex-col items-center p-0 m-0 w-[300px] hover:shadow-lg`;
  itemDiv.innerHTML = `
        <p class=''> ${item.name} </p>
        <img src='http://localhost:3001/${item.image}'  width='300' height='300' class='w-[300px] h-[300px]'/>
        <p class='text-sm mt-2 text-center'> ${item.description} </p>
        <div class='grid grid-cols-2 w-full mt-4 border'>
            <div class='w-full border-r-2 text-center py-2 text-sm'> ${item.price}</div>
            <div class='w-full py-2 text-center text-sm hover:font-semibold cursor-pointer'> ADD TO CART</div>
        </div>
    `;

  return itemDiv;
};

async function renderItems() {
  let items = await getItemsList();
  console.log(items.data.length);
  for (let i = 0; i < items.data.length; i++) {
    if (i == 9) {
      break;
    }
    let first = createItemCard(items.data[i]);
    itemsWrap.append(first);
  }
}

renderItems();
