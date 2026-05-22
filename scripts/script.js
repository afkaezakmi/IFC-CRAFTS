fetch('products.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('product-container');

    data.forEach(item => {
      const col = document.createElement('div');
      col.classList.add('col-lg-2', 'col-md-4', 'col-sm-6');

      // ✅ fallback values
      const name = item.name || "No name";
      const size = item.size || "N/A";
      const price = item.price || "N/A";
      const image = item.image || "";
      const description = item.description || "No description available";

      col.innerHTML = `
        <div class="product-card shadow-sm">

          <div class="product-img-wrapper">
            <img src="${image}" class="product-img" alt="${size}">
          </div>

          <div class="product-body text-center">
            <h6 class="product-name">${name}</h6>

            <p class="text-muted small mb-1">${size}</p>

            <p class="product-price">${price}</p>

            <button class="btn btn-dark btn-sm w-100 mt-2"
              onclick="showItem('${name}', '${size}', '${price}', '${image}', '${description}')">
              <i class="bi bi-eye"></i> View
            </button>
          </div>

        </div>
      `;

      container.appendChild(col);
    });
  })
  .catch(error => console.error('Error loading JSON:', error));


// ✅ GLOBAL VARIABLES (for updating quantity dynamically)
let currentName = "";
let currentSize = "";
let currentPrice = "";


// ✅ SHOW ITEM MODAL
function showItem(name, size, price, image, description) {
    currentName = name;
    currentSize = size;
    currentPrice = price;

    document.getElementById('modalTitle').innerText = name;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('modalDescription').innerText = description;
    document.getElementById('modalImage').src = image;
    document.getElementById('modalSize').innerText = size;

    // ✅ set default quantity to 1
    document.getElementById('quantity').value = 1;

    // ✅ update buy link initially
    updateBuyLink();

    const modal = new bootstrap.Modal(document.getElementById('itemModal'));
    modal.show();
}


// ✅ UPDATE BUY LINK (with quantity)
function updateBuyLink() {
    const quantity = document.getElementById('quantity').value;

    const message = encodeURIComponent(
        `Hello! I want to order:\n\nProduct: ${currentName}\nSize: ${currentSize}\nPrice: ${currentPrice}\nQuantity: ${quantity}`
    );

    const fbLink = `https://m.me/100086702227778?text=${message}`;

    document.getElementById('buyBtn').href = fbLink;
}

let allProducts = []; // store all products

fetch('products.json')
  .then(response => response.json())
  .then(data => {
    allProducts = data;
    renderProducts(allProducts);

    // ✅ listen to filter changes
    document.getElementById('small').addEventListener('change', applyFilters);
    document.getElementById('medium').addEventListener('change', applyFilters);
    document.getElementById('large').addEventListener('change', applyFilters);
document.getElementById('under200').addEventListener('change', applyFilters);
document.getElementById('200to500').addEventListener('change', applyFilters);
document.getElementById('above500').addEventListener('change', applyFilters);
document.getElementById('allPrice').addEventListener('change', applyFilters);
  })
  .catch(error => console.error('Error loading JSON:', error));


// ✅ RENDER FUNCTION
function renderProducts(products) {
  const container = document.getElementById('product-container');
  container.innerHTML = ""; // clear first

  products.forEach(item => {
    const col = document.createElement('div');
    col.classList.add('col-lg-2', 'col-md-4', 'col-sm-6');

    col.innerHTML = `
      <div class="product-card shadow-sm">
        <div class="product-img-wrapper">
          <img src="${item.image}" class="product-img" alt="${item.size}">
        </div>

        <div class="product-body text-center">
          <h6 class="product-name">${item.name}</h6>
          <p class="text-muted small mb-1">${item.size}</p>
          <p class="product-price">${item.price}</p>

          <button class="btn btn-dark btn-sm w-100 mt-2"
            onclick="showItem('${item.name}', '${item.size}', '${item.price}', '${item.image}', '${item.description}')">
            <i class="bi bi-eye"></i> View
          </button>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
}


// ✅ FILTER FUNCTION
function applyFilters() {
  const small = document.getElementById('small').checked;
  const medium = document.getElementById('medium').checked;
  const large = document.getElementById('large').checked;

  const under200 = document.getElementById('under200').checked;
  const twoToFive = document.getElementById('200to500').checked;
  const above500 = document.getElementById('above500').checked;

  let filtered = allProducts.filter(item => {

    // ✅ SIZE FILTER
    let sizeMatch = true;
    if (small || medium || large) {
      sizeMatch =
        (small && item.size === "Small") ||
        (medium && item.size === "Medium") ||
        (large && item.size === "Large");
    }

    // ✅ PRICE FILTER
    const numericPrice = parseInt(item.price.replace('₱', ''));

    let priceMatch = true;

    if (under200) priceMatch = numericPrice < 200;
    else if (twoToFive) priceMatch = numericPrice >= 200 && numericPrice <= 500;
    else if (above500) priceMatch = numericPrice > 500;
    // "All" = no filter

    return sizeMatch && priceMatch;
  });

  renderProducts(filtered);
}