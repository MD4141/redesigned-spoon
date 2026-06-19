/**
 * DATA PRODUK
 * -----------
 * Ini adalah satu-satunya file yang perlu Anda ubah untuk mengganti isi katalog.
 * Setiap produk adalah satu objek di dalam array PRODUCTS di bawah.
 *
 * Keterangan field:
 *  id       : angka unik, jangan ada yang sama
 *  name     : nama produk
 *  category : kategori produk (dipakai otomatis untuk membuat menu filter di atas)
 *  price    : harga dalam angka, TANPA titik/koma (contoh: 125000 untuk Rp125.000)
 *  desc     : deskripsi singkat (1 kalimat saja, biar rapi di kartu produk)
 *  icon     : emoji yang dipakai sebagai gambar sementara jika "image" kosong
 *  image    : (opsional) URL/alamat foto produk asli. Kosongkan saja ("") jika belum punya foto
 *  link     : alamat halaman/link detail produk (misalnya link marketplace Anda). Ganti "#" dengan link asli
 */

const PRODUCTS = [
  {
    id: 1,
    name: "Kemeja Flanel Pria",
    category: "Fashion",
    price: 125000,
    desc: "Bahan flanel tebal, nyaman dipakai harian maupun santai.",
    icon: "👕",
    image: "",
    link: "#"
  },
  {
    id: 2,
    name: "Tas Selempang Kanvas",
    category: "Fashion",
    price: 175000,
    desc: "Tas kanvas serbaguna dengan banyak kompartemen.",
    icon: "🎒",
    image: "",
    link: "#"
  },
  {
    id: 3,
    name: "Earphone Bluetooth TWS",
    category: "Elektronik",
    price: 89000,
    desc: "Suara jernih, koneksi stabil, baterai tahan lama.",
    icon: "🎧",
    image: "",
    link: "#"
  },
  {
    id: 4,
    name: "Power Bank 10000mAh",
    category: "Elektronik",
    price: 145000,
    desc: "Pengisian cepat, aman untuk perjalanan jauh.",
    icon: "🔋",
    image: "",
    link: "#"
  },
  {
    id: 5,
    name: "Sandal Jepit Premium",
    category: "Fashion",
    price: 45000,
    desc: "Empuk, anti licin, cocok untuk pemakaian sehari-hari.",
    icon: "🩴",
    image: "",
    link: "#"
  },
  {
    id: 6,
    name: "Toples Container Set",
    category: "Kebutuhan Rumah",
    price: 65000,
    desc: "Satu set toples kedap udara untuk dapur lebih rapi.",
    icon: "🏠",
    image: "",
    link: "#"
  },
  {
    id: 7,
    name: "Lampu LED Hias",
    category: "Kebutuhan Rumah",
    price: 55000,
    desc: "Cahaya hangat, cocok untuk dekorasi kamar atau ruang tamu.",
    icon: "💡",
    image: "",
    link: "#"
  },
  {
    id: 8,
    name: "Gelang Kulit Handmade",
    category: "Aksesoris",
    price: 39000,
    desc: "Dibuat dari kulit asli, desain simpel dan tahan lama.",
    icon: "📿",
    image: "",
    link: "#"
  }
];