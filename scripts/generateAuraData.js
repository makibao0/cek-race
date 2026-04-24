const fs = require('fs');
const path = require('path');

const baseColors = [
  "Merah", "Biru", "Hijau", "Kuning", "Ungu", "Hitam", "Putih", "Nila", "Jingga", "Emas",
  "Perak", "Perunggu", "Abu-abu", "Coklat", "Merah Muda", "Tosca", "Magenta", "Cyan", "Maroon", "Navy",
  "Khaki", "Koral", "Persik", "Zamrud", "Safir"
];

const modifiers = [
  "Berkabut", "Gelap", "Menyala", "Pudar", "Berkilau", "Transparan", "Berpendar", "Pekat", "Berbayang", "Terang",
  "Redup", "Bercahaya", "Kristal", "Matte", "Neon", "Pastel", "Berdebu", "Misterius", "Menyilaukan", "Kelam"
];

const traits = [
  "Bucin Tapi Gengsi", "Sering OVT Jam 2 Pagi", "Dompet Tipis Tapi Gaya Elit", "Mageran Kronis",
  "Kepoan Maksimal", "Selalu Merasa Paling Benar", "Si Paling Healing", "Tukang Ghosting",
  "Hati Hello Kitty", "Sumbu Pendek", "Suka Ngutang Lupa Bayar", "Si Paling Overthinking",
  "Ketawa Paling Keras", "Suka Makan Teman (Bercanda)", "Gampang Baper", "Suka Ngaret",
  "Sok Sibuk", "Suka Drama", "Hobi Stalking Mantan", "Tukang Curhat", "Sering Typo",
  "Gampang Lupa", "Suka Jajan", "Tukang Tidur", "Suka Ngemil Malam", "Rajin Menabung (Bohong)",
  "Suka Marah-Marah Gak Jelas", "Sering Galau", "Si Paling Estetik", "Anak Senja Banget",
  "Tukang Gibah", "Sering Ketipu Olshop", "Suka Minta Traktir", "Sering Kesiangan",
  "Suka Ngasih Nasihat Tapi Hidup Sendiri Berantakan", "Si Paling Mandiri (Aslinya Manja)",
  "Suka Cari Perhatian", "Gampang Capek", "Tukang PHP", "Sering Salah Paham"
];

const descriptions = [
  "Aura ini memancar dari orang yang suka stalking mantan tapi kalau disapa pura-pura tidak kenal. Energi asmaranya besar tapi tertutup kabut keraguan.",
  "Mencerminkan jiwa yang selalu haus akan validasi sosial. Suka banget update story walau cuma foto jalanan sepi.",
  "Menandakan sifat yang suka menunda-nunda pekerjaan sampai mepet deadline, lalu panik sendiri menyalahkan keadaan.",
  "Aura dari seseorang yang dompetnya tipis tapi gengsinya setinggi langit. Sering beli kopi mahal cuma buat story.",
  "Orang ini gampang banget baper. Dikasih senyum dikit langsung mikir mau diajak nikah.",
  "Energinya sangat kuat dalam urusan rebahan. Bisa tidak keluar kamar seharian penuh.",
  "Memiliki bakat terpendam sebagai detektif, terutama dalam urusan mencari tahu aib orang lain.",
  "Aura ini muncul dari orang yang sering overthinking hal-hal yang belum tentu terjadi. Terlalu banyak mikir, kurang aksi.",
  "Sangat protektif terhadap makanan. Kalau ada yang minta makanannya walau sedikit, auranya langsung berubah mematikan.",
  "Orang ini sering tertawa paling keras di tongkrongan, padahal di dalam hatinya sedang menangis memikirkan cicilan.",
  "Menunjukkan kepribadian yang labil. Kadang sangat bersemangat, lima menit kemudian tiba-tiba jadi emo.",
  "Suka memberikan nasihat percintaan kepada teman, padahal dirinya sendiri sudah lama menjomblo ngenes.",
  "Aura ini sangat langka, biasanya hanya dimiliki oleh orang yang tidak pernah marah kalau Wi-Fi ngadat.",
  "Sering mengalami 'senior moments' atau tiba-tiba lupa mau ngomong apa padahal baru saja mau buka mulut.",
  "Energi mistis yang membuat orang ini selalu merasa lapar di tengah malam padahal sudah makan malam 3 kali.",
  "Aura yang menandakan orang ini sering banget typo kalau ngetik, apalagi kalau lagi emosi.",
  "Orang ini suka banget bilang 'otw', padahal aslinya baru aja bangun tidur dan belum mandi.",
  "Sangat ahli dalam membuat rencana liburan yang epik, tapi selalu berakhir batal karena tidak ada dana.",
  "Aura dari seorang pengamat sejati. Suka melihat drama orang lain dari jauh sambil makan popcorn.",
  "Menandakan orang yang selalu merasa dirinya paling benar. Susah diajak diskusi karena kepalanya sekeras batu."
];

// Hex color codes mapping for UI
const colorHexMap = {
  "Merah": "#ef4444", "Biru": "#3b82f6", "Hijau": "#22c55e", "Kuning": "#eab308", "Ungu": "#a855f7",
  "Hitam": "#0f172a", "Putih": "#f8fafc", "Nila": "#6366f1", "Jingga": "#f97316", "Emas": "#fbbf24",
  "Perak": "#cbd5e1", "Perunggu": "#b45309", "Abu-abu": "#64748b", "Coklat": "#78350f", "Merah Muda": "#ec4899",
  "Tosca": "#14b8a6", "Magenta": "#d946ef", "Cyan": "#06b6d4", "Maroon": "#9f1239", "Navy": "#1e3a8a",
  "Khaki": "#fef08a", "Koral": "#fb7185", "Persik": "#fdba74", "Zamrud": "#10b981", "Safir": "#0284c7"
};

const generatedData = new Set();
const auraList = [];

while (auraList.length < 1000) {
  const baseColor = baseColors[Math.floor(Math.random() * baseColors.length)];
  const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
  const trait = traits[Math.floor(Math.random() * traits.length)];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];

  // Create a unique key to ensure no exact duplicates
  const uniqueKey = `${baseColor}-${modifier}-${trait}`;

  if (!generatedData.has(uniqueKey)) {
    generatedData.add(uniqueKey);
    auraList.push({
      warna: `${baseColor} ${modifier}`,
      hex: colorHexMap[baseColor],
      sifat: trait,
      deskripsi: description
    });
  }
}

// Ensure the directory exists
const dataDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(
  path.join(dataDir, 'aura.json'),
  JSON.stringify(auraList, null, 2)
);

console.log(`Successfully generated ${auraList.length} aura data items to src/data/aura.json`);
