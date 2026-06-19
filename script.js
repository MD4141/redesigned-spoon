/**
 * SCRIPT UTAMA KATALOG ONLINE
 * ---------------------------
 * File ini berisi semua logika: menu kategori dinamis, pencarian, kartu produk,
 * tombol "Tanya Admin" (WhatsApp), dan form pop-up "Pesan Offline" dengan
 * penjumlahan otomatis (qty x harga).
 *
 * Nomor WhatsApp admin diatur lewat konstanta ADMIN_WA di bawah.
 * Format wajib: kode negara tanpa "+" dan tanpa angka 0 di depan.
 * Contoh: 081322363337 -> 6281322363337
 */

const ADMIN_WA = "6281322363337";

// ---------- STATE ----------
let activeCategory = "Semua";
let searchTerm = "";
let currentOrderProduct = null;
let currentOrderQty = 1;

// ---------- HELPERS ----------
function formatRupiah(number) {
  return "Rp" + Number(number).toLocaleString("id-ID");
}

function waLink(message) {
  return `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(message)}`;
}

function getCategories() {
  const unique = [...new Set(PRODUCTS.map((p) => p.category))];
  return ["Semua", ...unique];
}

// ---------- RENDER: MENU KATEGORI (DINAMIS) ----------
function renderCategoryMenu() {
  const wrap = document.getElementById("categoryMenu");
  wrap.innerHTML = "";

  getCategories().forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip" + (cat === activeCategory ? " chip--active" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      activeCategory = cat;
      renderCategoryMenu();
      renderProducts();
    });
    wrap.appendChild(btn);
  });
}

// ---------- RENDER: GRID PRODUK ----------
function getFilteredProducts() {
  return PRODUCTS.filter((p) => {
    const matchCategory = activeCategory === "Semua" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });
}

function buildVisual(product) {
  if (product.image) {
    return `<img src="${product.image}" alt="${product.name}" class="card__photo" loading="lazy">`;
  }
  return `<div class="card__placeholder" aria-hidden="true"><span>${product.icon || "🛍️"}</span></div>`;
}

function buildCard(product) {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <div class="card__visual">${buildVisual(product)}</div>
    <div class="card__body">
      <span class="card__category">${product.category}</span>
      <h3 class="card__name">${product.name}</h3>
      <p class="card__desc">${product.desc}</p>
      <p class="card__price">${formatRupiah(product.price)}</p>
    </div>
    <div class="card__actions">
      <a class="btn btn--ghost" href="${product.link}" target="_blank" rel="noopener">Lihat Produk</a>
      <button type="button" class="btn btn--wa" data-action="ask" data-id="${product.id}">Tanya Admin</button>
      <button type="button" class="btn btn--primary" data-action="order" data-id="${product.id}">Pesan Offline</button>
    </div>
  `;
  return card;
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("emptyState");
  const counter = document.getElementById("resultCounter");
  const list = getFilteredProducts();

  grid.innerHTML = "";
  list.forEach((product) => grid.appendChild(buildCard(product)));

  empty.hidden = list.length !== 0;
  counter.textContent = `Menampilkan ${list.length} dari ${PRODUCTS.length} produk`;
}

// ---------- AKSI: TANYA ADMIN ----------
function askAdmin(productId) {
  const product = PRODUCTS.find((p) => p.id === Number(productId));
  if (!product) return;
  const message = `Halo Admin, saya ingin bertanya tentang produk *${product.name}* (${formatRupiah(product.price)}). Apakah masih tersedia?`;
  window.open(waLink(message), "_blank", "noopener");
}

// ---------- MODAL: PESAN OFFLINE ----------
const modal = document.getElementById("orderModal");
const orderForm = document.getElementById("orderForm");

function openOrderModal(productId) {
  const product = PRODUCTS.find((p) => p.id === Number(productId));
  if (!product) return;

  currentOrderProduct = product;
  currentOrderQty = 1;

  document.getElementById("modalProductVisual").innerHTML = buildVisual(product);
  document.getElementById("modalProductName").textContent = product.name;
  document.getElementById("modalProductPrice").textContent = formatRupiah(product.price);
  document.getElementById("qtyValue").textContent = currentOrderQty;

  clearFormErrors();
  orderForm.reset();
  updateOrderTotal();

  modal.classList.add("modal--open");
  document.body.classList.add("no-scroll");
  document.getElementById("fieldNama").focus();
}

function closeOrderModal() {
  modal.classList.remove("modal--open");
  document.body.classList.remove("no-scroll");
  currentOrderProduct = null;
}

function updateOrderTotal() {
  if (!currentOrderProduct) return;
  const subtotal = currentOrderProduct.price * currentOrderQty;
  document.getElementById("orderSubtotal").textContent = formatRupiah(subtotal);
  document.getElementById("orderTotal").textContent = formatRupiah(subtotal);
}

function changeQty(delta) {
  currentOrderQty = Math.max(1, currentOrderQty + delta);
  document.getElementById("qtyValue").textContent = currentOrderQty;
  updateOrderTotal();
}

function clearFormErrors() {
  document.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
  document.querySelectorAll(".field--invalid").forEach((el) => el.classList.remove("field--invalid"));
}

function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "Error");
  input.classList.add("field--invalid");
  errorEl.textContent = message;
}

function validateOrderForm(data) {
  clearFormErrors();
  let valid = true;

  if (!data.nama.trim()) {
    showFieldError("fieldNama", "Nama lengkap wajib diisi.");
    valid = false;
  }
  const phoneDigits = data.hp.replace(/\D/g, "");
  if (phoneDigits.length < 9) {
    showFieldError("fieldHp", "Nomor HP/WhatsApp tidak valid.");
    valid = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    showFieldError("fieldEmail", "Format email tidak valid.");
    valid = false;
  }
  if (!data.alamat.trim()) {
    showFieldError("fieldAlamat", "Alamat lengkap wajib diisi.");
    valid = false;
  }
  return valid;
}

function handleOrderSubmit(event) {
  event.preventDefault();
  if (!currentOrderProduct) return;

  const data = {
    nama: document.getElementById("fieldNama").value,
    hp: document.getElementById("fieldHp").value,
    email: document.getElementById("fieldEmail").value,
    alamat: document.getElementById("fieldAlamat").value
  };

  if (!validateOrderForm(data)) return;

  const subtotal = currentOrderProduct.price * currentOrderQty;
  const message =
    `*PESANAN OFFLINE BARU*\n` +
    `Produk: ${currentOrderProduct.name}\n` +
    `Jumlah: ${currentOrderQty}\n` +
    `Harga satuan: ${formatRupiah(currentOrderProduct.price)}\n` +
    `Total: ${formatRupiah(subtotal)}\n\n` +
    `Nama: ${data.nama}\n` +
    `No. HP: ${data.hp}\n` +
    `Email: ${data.email}\n` +
    `Alamat: ${data.alamat}`;

  window.open(waLink(message), "_blank", "noopener");
  showOrderSuccess();
}

function showOrderSuccess() {
  const successBox = document.getElementById("orderSuccess");
  successBox.hidden = false;
  setTimeout(() => {
    successBox.hidden = true;
    closeOrderModal();
  }, 1800);
}

// ---------- EVENT DELEGATION UNTUK KARTU PRODUK ----------
document.getElementById("productGrid").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "ask") askAdmin(id);
  if (action === "order") openOrderModal(id);
});

// ---------- EVENT: MODAL ----------
document.getElementById("modalClose").addEventListener("click", closeOrderModal);
document.getElementById("modalOverlay").addEventListener("click", closeOrderModal);
document.getElementById("qtyMinus").addEventListener("click", () => changeQty(-1));
document.getElementById("qtyPlus").addEventListener("click", () => changeQty(1));
orderForm.addEventListener("submit", handleOrderSubmit);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("modal--open")) {
    closeOrderModal();
  }
});

// ---------- EVENT: PENCARIAN ----------
document.getElementById("searchInput").addEventListener("input", (event) => {
  searchTerm = event.target.value;
  renderProducts();
});

// ---------- EVENT: MENU MOBILE ----------
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("nav__menu--open");
  navToggle.setAttribute("aria-expanded", isOpen);
});
navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navMenu.classList.remove("nav__menu--open"));
});

// ---------- INISIALISASI ----------
document.getElementById("yearNow").textContent = new Date().getFullYear();
renderCategoryMenu();
renderProducts();