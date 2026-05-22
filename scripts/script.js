// ✅ GLOBAL VARIABLES
let allProducts = [];
let currentName = "";
let currentSize = "";
let currentPrice = "";
let messengerLink = "";

// ✅ RUN AFTER PAGE LOAD
document.addEventListener("DOMContentLoaded", () => {

  loadProducts();
  setupFilters();
  setupImagePreview();
  setupCustomForm();

});


// ✅ LOAD PRODUCTS
function loadProducts() {
  fetch('products.json')
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      renderProducts(allProducts);
    })
    .catch(err => console.error('Error loading JSON:', err));
}


// ✅ RENDER PRODUCTS
function renderProducts(products) {
  const container = document.getElementById('product-container');
  container.innerHTML = "";

  products.forEach(item => {
    const col = document.createElement('div');
    col.classList.add('col-6', 'col-sm-6', 'col-md-4', 'col-lg-3', 'col-xl-2')

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


// ✅ FILTER SETUP
function setupFilters() {
  ['small','medium','large','under200','200to500','above500','allPrice']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', applyFilters);
    });
}


// ✅ APPLY FILTERS
function applyFilters() {
  const small = document.getElementById('small')?.checked;
  const medium = document.getElementById('medium')?.checked;
  const large = document.getElementById('large')?.checked;

  const under200 = document.getElementById('under200')?.checked;
  const twoToFive = document.getElementById('200to500')?.checked;
  const above500 = document.getElementById('above500')?.checked;

  const filtered = allProducts.filter(item => {

    // SIZE
    let sizeMatch = true;
    if (small || medium || large) {
      sizeMatch =
        (small && item.size === "Small") ||
        (medium && item.size === "Medium") ||
        (large && item.size === "Large");
    }

    // PRICE
    const num = parseInt(item.price.replace('₱',''));
    let priceMatch = true;

    if (under200) priceMatch = num < 200;
    else if (twoToFive) priceMatch = num >= 200 && num <= 500;
    else if (above500) priceMatch = num > 500;

    return sizeMatch && priceMatch;
  });

  renderProducts(filtered);
}


// ✅ PRODUCT MODAL
function showItem(name, size, price, image, description) {
  currentName = name;
  currentSize = size;
  currentPrice = price;

  document.getElementById('modalTitle').innerText = name;
  document.getElementById('modalPrice').innerText = price;
  document.getElementById('modalDescription').innerText = description;
  document.getElementById('modalImage').src = image;
  document.getElementById('modalSize').innerText = size;

  document.getElementById('quantity').value = 1;

  updateBuyLink();

  new bootstrap.Modal(document.getElementById('itemModal')).show();
}


// ✅ BUY LINK
function updateBuyLink() {
  const qty = document.getElementById('quantity').value;

  const message = encodeURIComponent(
`Hello! I want to order:

Product: ${currentName}
Size: ${currentSize}
Price: ${currentPrice}
Quantity: ${qty}`
  );

  document.getElementById('buyBtn').href =
    `https://m.me/100086702227778?text=${message}`;
}


// ✅ IMAGE PREVIEW
function setupImagePreview() {
  const input = document.getElementById("imageUpload");
  const preview = document.getElementById("imagePreview");

  if (!input) return;

  input.addEventListener("change", () => {
    const file = input.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });
}


// ✅ CUSTOM FORM (with PROMPT → replace later with modal if needed)
function setupCustomForm() {
  const form = document.getElementById("customForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const size = document.querySelector('input[name="size"]:checked')?.value;
    const type = document.querySelector('input[name="type"]:checked')?.value;
    const style = document.querySelector('input[name="style"]:checked')?.value || "Not specified";
    const desc = document.getElementById("customDesc").value;

    const message = encodeURIComponent(
`Hello! I want to request a custom craft:

Size: ${size}
Type: ${type}
Style: ${style}
Design: ${desc}

✅ I uploaded a reference image. I will send it in chat.`
    );

    messengerLink = `https://m.me/100086702227778?text=${message}`;

    // ✅ SHOW MODAL INSTEAD OF confirm()
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
  });

  // ✅ Continue button (only runs once)
  const continueBtn = document.getElementById("continueBtn");

  if (continueBtn) {
    continueBtn.addEventListener("click", () => {

      window.open(messengerLink, "_blank");

      // close modal
      const modalEl = document.getElementById('confirmModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    });
  }
}
``