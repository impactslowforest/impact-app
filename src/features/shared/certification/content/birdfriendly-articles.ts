import type { CertArticle } from './ra-articles';

export const BF_ARTICLES: CertArticle[] = [
  // ─── Article 1: BF Overview ───
  {
    id: 'bf-overview',
    type: 'birdfriendly',
    icon: 'Bird',
    category: 'standard',
    title: {
      en: 'Understanding Smithsonian Bird Friendly Certification',
      vi: 'Tìm hiểu Chứng nhận Bird Friendly của Smithsonian',
      lo: 'ການເຂົ້າໃຈການຢັ້ງຢືນ Bird Friendly ຂອງ Smithsonian',
      id: 'Memahami Sertifikasi Bird Friendly Smithsonian',
    },
    summary: {
      en: 'Overview of the Smithsonian Bird Friendly program — the world\'s most rigorous environmental certification for shade-grown coffee and cocoa.',
      vi: 'Tổng quan về chương trình Bird Friendly của Smithsonian — chứng nhận môi trường nghiêm ngặt nhất thế giới cho cà phê và ca cao trồng dưới tán cây.',
      lo: 'ພາບລວມຂອງໂຄງການ Bird Friendly ຂອງ Smithsonian — ການຢັ້ງຢືນສິ່ງແວດລ້ອມທີ່ເຂັ້ມງວດທີ່ສຸດໃນໂລກສຳລັບກາເຟ ແລະ ໂກໂກ້ປູກໃຕ້ຮົ່ມໄມ້.',
      id: 'Gambaran umum program Bird Friendly Smithsonian — sertifikasi lingkungan paling ketat di dunia untuk kopi dan kakao naungan.',
    },
    content: {
      en: `<h2>What is Bird Friendly Certification?</h2>
<p>The <strong>Smithsonian Bird Friendly</strong> certification was created in 1996 by the Smithsonian Migratory Bird Center (SMBC). It is widely recognized as the <strong>world's most stringent environmental standard</strong> for coffee and cocoa production, requiring farms to maintain forest-like habitat that supports migratory and resident bird populations.</p>

<h2>Three Core Criteria</h2>
<p>Every Bird Friendly certified farm must meet three fundamental requirements:</p>
<ul>
  <li><strong>Organic Certified</strong> — Active organic certification or in transition (USDA, EU, or equivalent)</li>
  <li><strong>Zero Deforestation</strong> — No conversion of natural forest for agricultural use</li>
  <li><strong>Biodiversity Conservation</strong> — Rigorous shade canopy and tree diversity standards</li>
</ul>

<div class="highlight-box">
  <strong>Two Pathways:</strong> Farms can qualify through (1) Agroforestry — maintaining diverse shade canopy over crops, or (2) Forest Conservation — protecting forest reserves adjacent to production areas at a 2:3 ratio.
</div>

<h2>Program Scale & Impact</h2>
<ul>
  <li>Over <strong>4,000 growers</strong> certified in 12 countries</li>
  <li>Certification cycle: every <strong>3 years</strong> with annual organic audits</li>
  <li>Premium prices and growing consumer demand for Bird Friendly products</li>
  <li>Proven biodiversity outcomes — certified farms host 2-3× more bird species than sun-grown</li>
</ul>

<div class="warning-box">
  <strong>Important:</strong> Bird Friendly certification requires active organic certification as a prerequisite. Farms must be certified organic (or in transition) before applying.
</div>`,

      vi: `<h2>Chứng nhận Bird Friendly là gì?</h2>
<p>Chứng nhận <strong>Smithsonian Bird Friendly</strong> được thành lập năm 1996 bởi Trung tâm Chim Di cư Smithsonian (SMBC). Đây là <strong>tiêu chuẩn môi trường nghiêm ngặt nhất thế giới</strong> cho sản xuất cà phê và ca cao, yêu cầu nông trại duy trì môi trường sống giống rừng tự nhiên hỗ trợ các loài chim di cư và bản địa.</p>

<h2>Ba Tiêu chí Cốt lõi</h2>
<ul>
  <li><strong>Chứng nhận Hữu cơ</strong> — Phải có chứng nhận hữu cơ đang hoạt động hoặc đang chuyển đổi</li>
  <li><strong>Không Phá rừng</strong> — Không chuyển đổi rừng tự nhiên sang nông nghiệp</li>
  <li><strong>Bảo tồn Đa dạng Sinh học</strong> — Tiêu chuẩn nghiêm ngặt về tán che và đa dạng cây bóng mát</li>
</ul>

<div class="highlight-box">
  <strong>Hai Lộ trình:</strong> Nông trại có thể đạt chứng nhận qua (1) Nông lâm kết hợp — duy trì tán che đa dạng, hoặc (2) Bảo tồn Rừng — bảo vệ diện tích rừng liền kề theo tỷ lệ 2:3.
</div>

<h2>Quy mô & Tác động</h2>
<ul>
  <li>Hơn <strong>4.000 nông dân</strong> được chứng nhận tại 12 quốc gia</li>
  <li>Chu kỳ chứng nhận: mỗi <strong>3 năm</strong></li>
  <li>Giá premium và nhu cầu thị trường ngày càng tăng</li>
</ul>

<div class="warning-box">
  <strong>Quan trọng:</strong> Chứng nhận Bird Friendly yêu cầu chứng nhận hữu cơ là điều kiện tiên quyết.
</div>`,

      lo: `<h2>ການຢັ້ງຢືນ Bird Friendly ແມ່ນຫຍັງ?</h2>
<p>ການຢັ້ງຢືນ <strong>Smithsonian Bird Friendly</strong> ຖືກສ້າງຂຶ້ນໃນປີ 1996 ໂດຍສູນນົກອົບພະຍົບ Smithsonian (SMBC). ມັນເປັນ<strong>ມາດຕະຖານສິ່ງແວດລ້ອມທີ່ເຂັ້ມງວດທີ່ສຸດໃນໂລກ</strong>ສຳລັບການຜະລິດກາເຟ ແລະ ໂກໂກ້.</p>

<h2>ສາມເງື່ອນໄຂຫຼັກ</h2>
<ul>
  <li><strong>ຢັ້ງຢືນກະສິກຳອິນຊີ</strong> — ຕ້ອງມີການຢັ້ງຢືນອິນຊີທີ່ດຳເນີນຢູ່</li>
  <li><strong>ບໍ່ທຳລາຍປ່າ</strong> — ບໍ່ປ່ຽນປ່າທຳມະຊາດເປັນກະສິກຳ</li>
  <li><strong>ອະນຸລັກຊີວະນາໆພັນ</strong> — ມາດຕະຖານເຂັ້ມງວດກ່ຽວກັບຮົ່ມໄມ້ ແລະ ຄວາມຫຼາກຫຼາຍຂອງຕົ້ນໄມ້</li>
</ul>

<div class="highlight-box">
  <strong>ສອງເສັ້ນທາງ:</strong> (1) ກະສິກຳປ່າໄມ້ — ຮັກສາຮົ່ມໄມ້ຫຼາກຫຼາຍ, ຫຼື (2) ການອະນຸລັກປ່າ — ປົກປ້ອງປ່າສະຫງວນໃນອັດຕາ 2:3.
</div>

<h2>ຂະໜາດ ແລະ ຜົນກະທົບ</h2>
<ul>
  <li>ຫຼາຍກວ່າ <strong>4,000 ຊາວກະສິກອນ</strong> ໃນ 12 ປະເທດ</li>
  <li>ວົງຈອນການຢັ້ງຢືນ: ທຸກ <strong>3 ປີ</strong></li>
  <li>ລາຄາພຣີມຽມ ແລະ ຄວາມຕ້ອງການທີ່ເພີ່ມຂຶ້ນ</li>
</ul>

<div class="warning-box">
  <strong>ສຳຄັນ:</strong> ການຢັ້ງຢືນ Bird Friendly ຕ້ອງການການຢັ້ງຢືນອິນຊີເປັນເງື່ອນໄຂເບື້ອງຕົ້ນ.
</div>`,

      id: `<h2>Apa itu Sertifikasi Bird Friendly?</h2>
<p>Sertifikasi <strong>Smithsonian Bird Friendly</strong> dibuat pada tahun 1996 oleh Smithsonian Migratory Bird Center (SMBC). Ini diakui sebagai <strong>standar lingkungan paling ketat di dunia</strong> untuk produksi kopi dan kakao, mewajibkan pertanian mempertahankan habitat seperti hutan yang mendukung populasi burung migran dan lokal.</p>

<h2>Tiga Kriteria Inti</h2>
<ul>
  <li><strong>Bersertifikat Organik</strong> — Sertifikasi organik aktif atau dalam transisi</li>
  <li><strong>Nol Deforestasi</strong> — Tidak ada konversi hutan alam untuk pertanian</li>
  <li><strong>Konservasi Keanekaragaman Hayati</strong> — Standar ketat naungan dan keragaman pohon</li>
</ul>

<div class="highlight-box">
  <strong>Dua Jalur:</strong> Pertanian dapat memenuhi syarat melalui (1) Agroforestri — naungan beragam di atas tanaman, atau (2) Konservasi Hutan — melindungi cadangan hutan dengan rasio 2:3.
</div>

<h2>Skala & Dampak</h2>
<ul>
  <li>Lebih dari <strong>4.000 petani</strong> tersertifikasi di 12 negara</li>
  <li>Siklus sertifikasi: setiap <strong>3 tahun</strong></li>
  <li>Harga premium dan permintaan pasar yang terus tumbuh</li>
</ul>

<div class="warning-box">
  <strong>Penting:</strong> Sertifikasi Bird Friendly mensyaratkan sertifikasi organik sebagai prasyarat.
</div>`,
    },
  },

  // ─── Article 2: Agroforestry Criteria ───
  {
    id: 'bf-agroforestry',
    type: 'birdfriendly',
    icon: 'Trees',
    category: 'guidance',
    title: {
      en: 'Agroforestry Criteria & Shade Requirements',
      vi: 'Tiêu chí Nông lâm Kết hợp & Yêu cầu Tán che',
      lo: 'ເງື່ອນໄຂກະສິກຳປ່າໄມ້ ແລະ ຂໍ້ກຳນົດຮົ່ມໄມ້',
      id: 'Kriteria Agroforestri & Persyaratan Naungan',
    },
    summary: {
      en: 'Detailed shade canopy, tree diversity, and height requirements for Bird Friendly agroforestry certification of coffee and cocoa farms.',
      vi: 'Chi tiết yêu cầu về tán che, đa dạng cây bóng mát và chiều cao cây cho chứng nhận nông lâm kết hợp Bird Friendly.',
      lo: 'ລາຍລະອຽດຂໍ້ກຳນົດກ່ຽວກັບຮົ່ມໄມ້, ຄວາມຫຼາກຫຼາຍຂອງຕົ້ນໄມ້ ແລະ ຄວາມສູງສຳລັບການຢັ້ງຢືນກະສິກຳປ່າໄມ້ Bird Friendly.',
      id: 'Detail persyaratan naungan, keragaman pohon, dan tinggi untuk sertifikasi agroforestri Bird Friendly.',
    },
    content: {
      en: `<h2>Tree Diversity Requirements</h2>
<p>Bird Friendly agroforestry demands a <strong>structurally complex, forest-like canopy</strong> over crop areas. The diversity criteria are among the most demanding of any certification:</p>
<ul>
  <li><strong>Minimum 10 tree species per hectare</strong></li>
  <li>At least <strong>60% must be native species</strong></li>
  <li>Each species must represent at least <strong>1% of total tree count</strong> (no single-species dominance)</li>
  <li>Banana/plantain counts as only 1 species even if multiple varieties are present</li>
</ul>

<div class="highlight-box">
  <strong>Recommended:</strong> Aim for multiple canopy layers — understory (3-8m), main canopy (8-15m), and emergent trees (15m+). This mimics natural forest structure and provides the best bird habitat.
</div>

<h2>Shade Cover Standards</h2>
<ul>
  <li><strong>Coffee:</strong> Minimum 40% canopy cover (measured even after pruning)</li>
  <li><strong>Cocoa:</strong> Minimum 30% canopy cover (measured even after pruning)</li>
  <li>Shade must be <strong>evenly distributed</strong> across the plot, not clumped in patches</li>
</ul>

<h2>Canopy Height</h2>
<p>The average canopy height of shade trees must be at least <strong>12 meters</strong>. This ensures adequate vertical structure for nesting and foraging birds.</p>

<div class="warning-box">
  <strong>Measurement:</strong> Shade is assessed using 25-meter radius circular plots. Auditors use cell phone cameras (overhead photos) and the SMBC Shade Guide to estimate canopy cover percentage.
</div>

<h2>Additional Recommendations</h2>
<ul>
  <li>Maintain living fences and hedgerows along farm borders</li>
  <li>Preserve epiphytes (orchids, ferns, bromeliads) on shade trees</li>
  <li>Maintain soil cover crops beneath the canopy</li>
  <li>Riparian buffers: 5m along streams, 10m along rivers</li>
  <li>Prune shade trees outside bird breeding season (typically March-June)</li>
</ul>`,

      vi: `<h2>Yêu cầu Đa dạng Cây</h2>
<p>Nông lâm kết hợp Bird Friendly đòi hỏi <strong>tán che phức tạp, giống rừng tự nhiên</strong> trên khu vực trồng trọt:</p>
<ul>
  <li><strong>Tối thiểu 10 loài cây mỗi hecta</strong></li>
  <li>Ít nhất <strong>60% phải là loài bản địa</strong></li>
  <li>Mỗi loài phải chiếm ít nhất <strong>1% tổng số cây</strong></li>
  <li>Chuối chỉ được tính là 1 loài dù có nhiều giống</li>
</ul>

<div class="highlight-box">
  <strong>Khuyến nghị:</strong> Tạo nhiều tầng tán — tầng thấp (3-8m), tán chính (8-15m), và cây vượt tán (15m+) để mô phỏng cấu trúc rừng tự nhiên.
</div>

<h2>Tiêu chuẩn Tán che</h2>
<ul>
  <li><strong>Cà phê:</strong> Tối thiểu 40% tán che (đo cả sau khi tỉa cành)</li>
  <li><strong>Ca cao:</strong> Tối thiểu 30% tán che (đo cả sau khi tỉa cành)</li>
  <li>Tán che phải <strong>phân bố đều</strong> trên toàn lô đất</li>
</ul>

<h2>Chiều cao Tán</h2>
<p>Chiều cao trung bình của tán cây bóng mát phải ít nhất <strong>12 mét</strong>.</p>

<div class="warning-box">
  <strong>Đo lường:</strong> Tán che được đánh giá bằng ô tròn bán kính 25 mét. Kiểm toán viên sử dụng camera điện thoại (ảnh chụp từ trên xuống) và Hướng dẫn Bóng mát SMBC.
</div>

<h2>Khuyến nghị Bổ sung</h2>
<ul>
  <li>Duy trì hàng rào sống và bờ cây dọc biên nông trại</li>
  <li>Bảo tồn thực vật phụ sinh (phong lan, dương xỉ) trên cây bóng mát</li>
  <li>Vùng đệm ven suối: 5m dọc suối, 10m dọc sông</li>
  <li>Tỉa cành cây bóng mát ngoài mùa sinh sản của chim (thường tháng 3-6)</li>
</ul>`,

      lo: `<h2>ຂໍ້ກຳນົດຄວາມຫຼາກຫຼາຍຂອງຕົ້ນໄມ້</h2>
<p>ກະສິກຳປ່າໄມ້ Bird Friendly ຮຽກຮ້ອງ<strong>ຮົ່ມໄມ້ທີ່ຊັບຊ້ອນຄ້າຍກັບປ່າທຳມະຊາດ</strong>:</p>
<ul>
  <li><strong>ຢ່າງໜ້ອຍ 10 ຊະນິດຕົ້ນໄມ້ຕໍ່ເຮັກຕາ</strong></li>
  <li>ຢ່າງໜ້ອຍ <strong>60% ຕ້ອງເປັນຊະນິດພື້ນເມືອງ</strong></li>
  <li>ແຕ່ລະຊະນິດຕ້ອງເປັນຢ່າງໜ້ອຍ <strong>1% ຂອງຈຳນວນຕົ້ນໄມ້ທັງໝົດ</strong></li>
  <li>ກ້ວຍນັບເປັນ 1 ຊະນິດເທົ່ານັ້ນ</li>
</ul>

<div class="highlight-box">
  <strong>ແນະນຳ:</strong> ສ້າງຫຼາຍຊັ້ນຮົ່ມໄມ້ — ຊັ້ນລຸ່ມ (3-8m), ຮົ່ມໄມ້ຫຼັກ (8-15m), ແລະ ຕົ້ນໄມ້ສູງ (15m+).
</div>

<h2>ມາດຕະຖານຮົ່ມໄມ້</h2>
<ul>
  <li><strong>ກາເຟ:</strong> ຢ່າງໜ້ອຍ 40% ການປົກຫຸ້ມ</li>
  <li><strong>ໂກໂກ້:</strong> ຢ່າງໜ້ອຍ 30% ການປົກຫຸ້ມ</li>
  <li>ຮົ່ມໄມ້ຕ້ອງ<strong>ກະຈາຍຢ່າງສະເໝີ</strong>ທົ່ວແປງ</li>
</ul>

<h2>ຄວາມສູງຂອງຮົ່ມໄມ້</h2>
<p>ຄວາມສູງສະເລ່ຍຂອງຮົ່ມໄມ້ຕ້ອງຢ່າງໜ້ອຍ <strong>12 ແມັດ</strong>.</p>

<div class="warning-box">
  <strong>ການວັດແທກ:</strong> ຮົ່ມໄມ້ຖືກປະເມີນໂດຍໃຊ້ແປງວົງມົນລັດສະໝີ 25 ແມັດ. ໃຊ້ກ້ອງໂທລະສັບ ແລະ ຄູ່ມືຮົ່ມໄມ້ SMBC.
</div>

<h2>ຄຳແນະນຳເພີ່ມເຕີມ</h2>
<ul>
  <li>ຮັກສາຮົ້ວຕົ້ນໄມ້ທີ່ມີຊີວິດ</li>
  <li>ອະນຸລັກພືດເກາະຕິດ (ກ້ວຍໄມ້, ເຟີນ)</li>
  <li>ເຂດກັນຊົນ: 5m ຕາມລຳຫ້ວຍ, 10m ຕາມແມ່ນ້ຳ</li>
  <li>ຕັດແຕ່ງຕົ້ນໄມ້ນອກລະດູການສືບພັນຂອງນົກ</li>
</ul>`,

      id: `<h2>Persyaratan Keragaman Pohon</h2>
<p>Agroforestri Bird Friendly menuntut <strong>kanopi kompleks menyerupai hutan</strong> di atas area tanaman:</p>
<ul>
  <li><strong>Minimal 10 spesies pohon per hektare</strong></li>
  <li>Minimal <strong>60% harus spesies asli (native)</strong></li>
  <li>Setiap spesies minimal <strong>1% dari total jumlah pohon</strong></li>
  <li>Pisang dihitung sebagai 1 spesies saja meskipun ada beberapa varietas</li>
</ul>

<div class="highlight-box">
  <strong>Rekomendasi:</strong> Buat beberapa lapisan kanopi — bawah (3-8m), kanopi utama (8-15m), dan pohon emergent (15m+) untuk meniru struktur hutan alami.
</div>

<h2>Standar Naungan</h2>
<ul>
  <li><strong>Kopi:</strong> Minimal 40% tutupan kanopi (diukur bahkan setelah pemangkasan)</li>
  <li><strong>Kakao:</strong> Minimal 30% tutupan kanopi (diukur bahkan setelah pemangkasan)</li>
  <li>Naungan harus <strong>terdistribusi merata</strong> di seluruh plot</li>
</ul>

<h2>Tinggi Kanopi</h2>
<p>Rata-rata tinggi kanopi pohon peneduh minimal <strong>12 meter</strong>.</p>

<div class="warning-box">
  <strong>Pengukuran:</strong> Naungan dinilai menggunakan plot lingkaran radius 25 meter. Auditor menggunakan kamera ponsel (foto dari atas) dan Panduan Naungan SMBC.
</div>

<h2>Rekomendasi Tambahan</h2>
<ul>
  <li>Pertahankan pagar hidup di sepanjang batas pertanian</li>
  <li>Lestarikan epifit (anggrek, pakis) pada pohon peneduh</li>
  <li>Zona riparian: 5m sepanjang sungai kecil, 10m sepanjang sungai besar</li>
  <li>Pangkas pohon peneduh di luar musim berkembang biak burung (biasanya Maret-Juni)</li>
</ul>`,
    },
  },

  // ─── Article 3: Forest Conservation Pathway ───
  {
    id: 'bf-forest-conservation',
    type: 'birdfriendly',
    icon: 'Mountain',
    category: 'guidance',
    title: {
      en: 'Forest Conservation Pathway',
      vi: 'Lộ trình Bảo tồn Rừng',
      lo: 'ເສັ້ນທາງການອະນຸລັກປ່າໄມ້',
      id: 'Jalur Konservasi Hutan',
    },
    summary: {
      en: 'Alternative Bird Friendly pathway through dedicated forest conservation areas with 2:3 forest-to-crop ratio, governance plans, and connectivity requirements.',
      vi: 'Lộ trình Bird Friendly thay thế thông qua bảo tồn rừng chuyên dụng với tỷ lệ rừng/cây trồng 2:3, kế hoạch quản trị và yêu cầu kết nối.',
      lo: 'ເສັ້ນທາງ Bird Friendly ທາງເລືອກຜ່ານການອະນຸລັກປ່າໂດຍສະເພາະ ດ້ວຍອັດຕາປ່າ/ພືດ 2:3.',
      id: 'Jalur alternatif Bird Friendly melalui konservasi hutan khusus dengan rasio hutan-tanaman 2:3.',
    },
    content: {
      en: `<h2>The Forest Conservation Alternative</h2>
<p>Farms that cannot meet the full agroforestry canopy criteria may qualify through the <strong>Forest Conservation Pathway</strong>. This pathway recognizes that protecting intact forest adjacent to farms provides critical habitat for birds and biodiversity.</p>

<h2>Area & Ratio Requirements</h2>
<div class="highlight-box">
  <strong>Key Ratio:</strong> A minimum 2:3 ratio of conserved forest to crop area is required. For example, if you have 6 hectares of coffee, you must conserve at least 4 hectares of forest.
</div>
<ul>
  <li>Forest must be within <strong>2 km</strong> of the crop area (up to 10 km considered case-by-case)</li>
  <li>All conservation areas must be <strong>georeferenced</strong> — GPS points for small areas, polygon mapping for areas over 4 hectares</li>
  <li><strong>Legal tenure</strong> or recognized use rights over the forest area is required</li>
</ul>

<h2>Forest Quality Standards</h2>
<ul>
  <li>Forest must have <strong>intact vertical layers</strong> (ground cover, understory, canopy, emergent)</li>
  <li>At least <strong>80% native tree species</strong></li>
  <li>Minimum <strong>60% canopy cover</strong></li>
  <li>Landscape connectivity — corridors between forest patches are strongly encouraged</li>
</ul>

<h2>Governance Plan</h2>
<p>A governance plan for the conservation area is mandatory:</p>
<ul>
  <li><strong>Small areas (&lt;50 ha):</strong> Verbal agreement with community documentation is acceptable</li>
  <li><strong>Larger areas (&gt;50 ha):</strong> Written governance plan required</li>
</ul>

<div class="danger-box">
  <strong>Zero Tolerance:</strong> No burning, extractive logging, or wildlife harvesting is permitted in conservation forest areas. Violations result in immediate decertification.
</div>

<div class="warning-box">
  <strong>For Slow Forest:</strong> This pathway is particularly relevant for our Laos operations where community forests adjacent to coffee plots can qualify as conservation areas.
</div>`,

      vi: `<h2>Lộ trình Bảo tồn Rừng</h2>
<p>Nông trại không đáp ứng đầy đủ tiêu chí tán che nông lâm kết hợp có thể đạt chứng nhận qua <strong>Lộ trình Bảo tồn Rừng</strong>. Lộ trình này công nhận việc bảo vệ rừng nguyên vẹn liền kề nông trại cung cấp môi trường sống quan trọng cho chim và đa dạng sinh học.</p>

<h2>Yêu cầu Diện tích & Tỷ lệ</h2>
<div class="highlight-box">
  <strong>Tỷ lệ quan trọng:</strong> Tỷ lệ tối thiểu 2:3 giữa rừng bảo tồn và diện tích cây trồng. Ví dụ: 6 ha cà phê cần bảo tồn ít nhất 4 ha rừng.
</div>
<ul>
  <li>Rừng phải nằm trong phạm vi <strong>2 km</strong> từ khu vực trồng trọt (tối đa 10 km xét theo trường hợp)</li>
  <li>Tất cả khu vực bảo tồn phải được <strong>định vị GPS</strong></li>
  <li>Yêu cầu <strong>quyền sở hữu hợp pháp</strong> hoặc quyền sử dụng đất</li>
</ul>

<h2>Tiêu chuẩn Chất lượng Rừng</h2>
<ul>
  <li>Rừng phải có <strong>các tầng nguyên vẹn</strong> (tầng đất, tầng dưới, tán chính, tầng vượt tán)</li>
  <li>Ít nhất <strong>80% cây bản địa</strong></li>
  <li>Tối thiểu <strong>60% tán che</strong></li>
</ul>

<h2>Kế hoạch Quản trị</h2>
<ul>
  <li><strong>Diện tích nhỏ (&lt;50 ha):</strong> Thỏa thuận miệng với tài liệu cộng đồng</li>
  <li><strong>Diện tích lớn (&gt;50 ha):</strong> Kế hoạch quản trị bằng văn bản</li>
</ul>

<div class="danger-box">
  <strong>Không khoan nhượng:</strong> Không được đốt, khai thác gỗ, hoặc săn bắt động vật hoang dã trong khu vực rừng bảo tồn.
</div>

<div class="warning-box">
  <strong>Cho Slow Forest:</strong> Lộ trình này đặc biệt phù hợp với hoạt động tại Lào nơi rừng cộng đồng liền kề vườn cà phê có thể đạt tiêu chuẩn.
</div>`,

      lo: `<h2>ທາງເລືອກການອະນຸລັກປ່າ</h2>
<p>ນາໄຮ່ທີ່ບໍ່ສາມາດຕອບສະໜອງເງື່ອນໄຂຮົ່ມໄມ້ກະສິກຳປ່າໄມ້ຄົບຖ້ວນ ອາດໄດ້ຮັບການຢັ້ງຢືນຜ່ານ<strong>ເສັ້ນທາງການອະນຸລັກປ່າ</strong>.</p>

<h2>ຂໍ້ກຳນົດພື້ນທີ່ ແລະ ອັດຕາສ່ວນ</h2>
<div class="highlight-box">
  <strong>ອັດຕາສ່ວນສຳຄັນ:</strong> ອັດຕາສ່ວນຕ່ຳສຸດ 2:3 ຂອງປ່າອະນຸລັກຕໍ່ພື້ນທີ່ປູກ. ຕົວຢ່າງ: 6 ເຮັກຕາກາເຟ ຕ້ອງອະນຸລັກ 4 ເຮັກຕາປ່າ.
</div>
<ul>
  <li>ປ່າຕ້ອງຢູ່ພາຍໃນ <strong>2 ກມ</strong> (ສູງສຸດ 10 ກມ ພິຈາລະນາເປັນກໍລະນີ)</li>
  <li>ທຸກພື້ນທີ່ຕ້ອງ<strong>ກຳນົດພິກັດ GPS</strong></li>
  <li>ຕ້ອງການ<strong>ສິດທິການຄອບຄອງທີ່ຖືກກົດໝາຍ</strong></li>
</ul>

<h2>ມາດຕະຖານຄຸນນະພາບປ່າ</h2>
<ul>
  <li>ຕ້ອງມີ<strong>ຊັ້ນຕ່າງໆທີ່ສົມບູນ</strong></li>
  <li>ຢ່າງໜ້ອຍ <strong>80% ຕົ້ນໄມ້ພື້ນເມືອງ</strong></li>
  <li>ຢ່າງໜ້ອຍ <strong>60% ການປົກຫຸ້ມ</strong></li>
</ul>

<h2>ແຜນການປົກຄອງ</h2>
<ul>
  <li><strong>ພື້ນທີ່ນ້ອຍ (&lt;50 ເຮັກຕາ):</strong> ຂໍ້ຕົກລົງປາກເປົ່າ</li>
  <li><strong>ພື້ນທີ່ໃຫຍ່ (&gt;50 ເຮັກຕາ):</strong> ແຜນການປົກຄອງເປັນລາຍລັກອັກສອນ</li>
</ul>

<div class="danger-box">
  <strong>ບໍ່ອົດທົນ:</strong> ບໍ່ອະນຸຍາດໃຫ້ເຜົາ, ຕັດໄມ້, ຫຼື ລ່າສັດປ່າໃນພື້ນທີ່ປ່າອະນຸລັກ.
</div>

<div class="warning-box">
  <strong>ສຳລັບ Slow Forest:</strong> ເສັ້ນທາງນີ້ເໝາະສົມກັບການດຳເນີນງານໃນລາວ ບ່ອນທີ່ປ່າຊຸມຊົນທີ່ຢູ່ຕິດກັບສວນກາເຟ.
</div>`,

      id: `<h2>Alternatif Konservasi Hutan</h2>
<p>Pertanian yang tidak dapat memenuhi kriteria kanopi agroforestri penuh dapat memenuhi syarat melalui <strong>Jalur Konservasi Hutan</strong>. Jalur ini mengakui bahwa melindungi hutan utuh yang berdekatan dengan pertanian menyediakan habitat penting bagi burung.</p>

<h2>Persyaratan Area & Rasio</h2>
<div class="highlight-box">
  <strong>Rasio Kunci:</strong> Rasio minimum 2:3 hutan konservasi terhadap area tanaman. Contoh: 6 ha kopi memerlukan konservasi minimal 4 ha hutan.
</div>
<ul>
  <li>Hutan harus dalam jarak <strong>2 km</strong> dari area tanaman (hingga 10 km dipertimbangkan kasus per kasus)</li>
  <li>Semua area konservasi harus <strong>direferensikan GPS</strong></li>
  <li>Diperlukan <strong>hak kepemilikan sah</strong> atas area hutan</li>
</ul>

<h2>Standar Kualitas Hutan</h2>
<ul>
  <li>Hutan harus memiliki <strong>lapisan vertikal utuh</strong> (penutup tanah, bawah, kanopi, emergent)</li>
  <li>Minimal <strong>80% pohon asli (native)</strong></li>
  <li>Minimal <strong>60% tutupan kanopi</strong></li>
  <li>Konektivitas lanskap — koridor antar fragmen hutan sangat dianjurkan</li>
</ul>

<h2>Rencana Tata Kelola</h2>
<ul>
  <li><strong>Area kecil (&lt;50 ha):</strong> Kesepakatan lisan dengan dokumentasi komunitas</li>
  <li><strong>Area besar (&gt;50 ha):</strong> Rencana tata kelola tertulis</li>
</ul>

<div class="danger-box">
  <strong>Toleransi Nol:</strong> Tidak ada pembakaran, penebangan, atau perburuan satwa liar di area hutan konservasi.
</div>

<div class="warning-box">
  <strong>Untuk Slow Forest:</strong> Jalur ini sangat relevan untuk operasi kami di Laos di mana hutan komunitas yang berdekatan dengan kebun kopi dapat memenuhi syarat.
</div>`,
    },
  },

  // ─── Article 4: Post-Harvest & Traceability ───
  {
    id: 'bf-post-harvest',
    type: 'birdfriendly',
    icon: 'Warehouse',
    category: 'checklist',
    title: {
      en: 'Post-Harvest & Traceability Requirements',
      vi: 'Yêu cầu Sau Thu hoạch & Truy xuất Nguồn gốc',
      lo: 'ຂໍ້ກຳນົດຫຼັງການເກັບກ່ຽວ ແລະ ການຕິດຕາມແຫຼ່ງກຳເນີດ',
      id: 'Persyaratan Pasca-Panen & Ketertelusuran',
    },
    summary: {
      en: 'Bird Friendly post-harvest separation, labeling, recordkeeping, mass balance, and Internal Control System requirements for traceability.',
      vi: 'Yêu cầu tách biệt sau thu hoạch, ghi nhãn, lưu trữ hồ sơ, cân bằng khối lượng và Hệ thống Kiểm soát Nội bộ Bird Friendly.',
      lo: 'ຂໍ້ກຳນົດການແຍກຫຼັງເກັບກ່ຽວ, ການຕິດສະຫຼາກ, ການບັນທຶກ ແລະ ລະບົບຄວບຄຸມພາຍໃນ Bird Friendly.',
      id: 'Persyaratan pemisahan pasca-panen, pelabelan, pencatatan, dan Sistem Kontrol Internal Bird Friendly.',
    },
    content: {
      en: `<h2>Physical Separation</h2>
<div class="danger-box">
  <strong>Critical:</strong> Bird Friendly certified products must be physically separated from non-certified products at ALL stages — harvesting, processing, drying, storage, and transport. Commingling is a decertification-level violation.
</div>
<ul>
  <li>Separate collection containers, drying beds, and storage areas</li>
  <li>Clear physical barriers or designated zones in processing facilities</li>
  <li>Temporal separation (processing BF product at different times) is acceptable if facilities are cleaned between runs</li>
</ul>

<h2>Labeling Requirements</h2>
<p>All Bird Friendly product must be clearly labeled at every stage:</p>
<ul>
  <li>Use <strong>"Bird Friendly"</strong> or <strong>"BF"</strong> labels on all bags, containers, and lots</li>
  <li>Labels must be present during processing, storage, and transport</li>
  <li>Include lot numbers, producer/group name, and weight on each label</li>
</ul>

<h2>Recordkeeping</h2>
<p>Maintain complete chain-of-custody documentation:</p>
<ul>
  <li><strong>Harvest records</strong> — date, farmer name, plot ID, volume</li>
  <li><strong>Bills of lading</strong> — transport from farm to processing</li>
  <li><strong>Delivery receipts</strong> — receipt at processing facility</li>
  <li><strong>Sales invoices</strong> — all commercial transactions</li>
  <li><strong>Transaction certificates</strong> — issued by certifier for each sale</li>
</ul>

<div class="highlight-box">
  <strong>Mass Balance:</strong> Auditors perform mass balance and trace-back audits comparing input volumes (harvest) against output volumes (sales). All quantities must reconcile within acceptable tolerances.
</div>

<h2>Internal Control System</h2>
<ul>
  <li>Maintain <strong>self-evaluation worksheets</strong> for each farm/member</li>
  <li>Develop an <strong>internal control matrix</strong> documenting compliance status</li>
  <li>All facilities and records must be <strong>accessible to auditors</strong> at any time</li>
</ul>

<div class="warning-box">
  <strong>Tip:</strong> The Slow Forest Impact app's traceability module helps digitize harvest records and maintain chain-of-custody documentation required for Bird Friendly audits.
</div>`,

      vi: `<h2>Tách biệt Vật lý</h2>
<div class="danger-box">
  <strong>Nghiêm trọng:</strong> Sản phẩm Bird Friendly phải được tách biệt vật lý khỏi sản phẩm không được chứng nhận ở TẤT CẢ giai đoạn — thu hoạch, chế biến, phơi sấy, lưu kho và vận chuyển.
</div>
<ul>
  <li>Thùng thu gom, sàn phơi và kho riêng biệt</li>
  <li>Rào chắn vật lý rõ ràng tại cơ sở chế biến</li>
  <li>Tách biệt theo thời gian được chấp nhận nếu vệ sinh giữa các lô</li>
</ul>

<h2>Yêu cầu Ghi nhãn</h2>
<ul>
  <li>Dùng nhãn <strong>"Bird Friendly"</strong> hoặc <strong>"BF"</strong> trên tất cả bao bì</li>
  <li>Nhãn phải có trong suốt quá trình chế biến, lưu kho và vận chuyển</li>
  <li>Ghi số lô, tên nhóm sản xuất và trọng lượng</li>
</ul>

<h2>Lưu trữ Hồ sơ</h2>
<ul>
  <li><strong>Biên bản thu hoạch</strong> — ngày, tên nông dân, mã lô, sản lượng</li>
  <li><strong>Vận đơn</strong> — vận chuyển từ nông trại đến cơ sở chế biến</li>
  <li><strong>Biên nhận giao hàng</strong> — nhận tại cơ sở chế biến</li>
  <li><strong>Hóa đơn bán hàng</strong> — tất cả giao dịch thương mại</li>
  <li><strong>Chứng chỉ giao dịch</strong> — do tổ chức chứng nhận cấp</li>
</ul>

<div class="highlight-box">
  <strong>Cân bằng Khối lượng:</strong> Kiểm toán viên thực hiện cân bằng khối lượng so sánh đầu vào (thu hoạch) với đầu ra (bán hàng).
</div>

<h2>Hệ thống Kiểm soát Nội bộ</h2>
<ul>
  <li>Duy trì <strong>bảng tự đánh giá</strong> cho mỗi nông trại/thành viên</li>
  <li>Phát triển <strong>ma trận kiểm soát nội bộ</strong></li>
  <li>Tất cả cơ sở và hồ sơ phải <strong>sẵn sàng cho kiểm toán viên</strong></li>
</ul>

<div class="warning-box">
  <strong>Mẹo:</strong> Module truy xuất nguồn gốc của ứng dụng Slow Forest Impact giúp số hóa hồ sơ thu hoạch và duy trì chuỗi hành trình sản phẩm.
</div>`,

      lo: `<h2>ການແຍກທາງກາຍະພາບ</h2>
<div class="danger-box">
  <strong>ສຳຄັນຫຼາຍ:</strong> ຜະລິດຕະພັນ Bird Friendly ຕ້ອງແຍກອອກຈາກຜະລິດຕະພັນທີ່ບໍ່ໄດ້ຮັບການຢັ້ງຢືນໃນທຸກຂັ້ນຕອນ — ເກັບກ່ຽວ, ປຸງແຕ່ງ, ຕາກ, ເກັບຮັກສາ ແລະ ຂົນສົ່ງ.
</div>
<ul>
  <li>ພາຊະນະເກັບ, ບ່ອນຕາກ ແລະ ບ່ອນເກັບແຍກຕ່າງຫາກ</li>
  <li>ກຳແພງກັ້ນທາງກາຍະພາບ ຫຼື ເຂດທີ່ກຳນົດ</li>
</ul>

<h2>ຂໍ້ກຳນົດການຕິດສະຫຼາກ</h2>
<ul>
  <li>ໃຊ້ສະຫຼາກ <strong>"Bird Friendly"</strong> ຫຼື <strong>"BF"</strong> ເທິງທຸກຖົງ</li>
  <li>ສະຫຼາກຕ້ອງມີໃນທຸກຂັ້ນຕອນ</li>
  <li>ລວມເລກລ໋ອດ, ຊື່ຜູ້ຜະລິດ, ແລະ ນ້ຳໜັກ</li>
</ul>

<h2>ການບັນທຶກ</h2>
<ul>
  <li><strong>ບັນທຶກການເກັບກ່ຽວ</strong> — ວັນທີ, ຊື່ຊາວກະສິກອນ, ລະຫັດແປງ, ປະລິມານ</li>
  <li><strong>ໃບສົ່ງສິນຄ້າ</strong> — ການຂົນສົ່ງຈາກນາໄຮ່ໄປໂຮງງານ</li>
  <li><strong>ໃບຮັບສິນຄ້າ</strong> — ການຮັບທີ່ໂຮງງານ</li>
  <li><strong>ໃບແຈ້ງໜີ້ການຂາຍ</strong> — ທຸກທຸລະກຳການຄ້າ</li>
  <li><strong>ໃບຢັ້ງຢືນທຸລະກຳ</strong> — ອອກໂດຍອົງການຢັ້ງຢືນ</li>
</ul>

<div class="highlight-box">
  <strong>ການດຸ່ນດ່ຽງມວນ:</strong> ຜູ້ກວດສອບປຽບທຽບປະລິມານນຳເຂົ້າ (ເກັບກ່ຽວ) ກັບປະລິມານສົ່ງອອກ (ຂາຍ).
</div>

<h2>ລະບົບຄວບຄຸມພາຍໃນ</h2>
<ul>
  <li>ແບບຟອມ<strong>ການປະເມີນຕົນເອງ</strong>ສຳລັບແຕ່ລະນາໄຮ່</li>
  <li><strong>ຕາຕະລາງຄວບຄຸມພາຍໃນ</strong></li>
  <li>ທຸກສິ່ງອຳນວຍຄວາມສະດວກ ແລະ ບັນທຶກຕ້ອງ<strong>ເປີດໃຫ້ຜູ້ກວດສອບ</strong></li>
</ul>`,

      id: `<h2>Pemisahan Fisik</h2>
<div class="danger-box">
  <strong>Kritis:</strong> Produk Bird Friendly harus dipisahkan secara fisik dari produk non-sertifikasi di SEMUA tahap — panen, pengolahan, pengeringan, penyimpanan, dan transportasi.
</div>
<ul>
  <li>Wadah pengumpulan, tempat pengeringan, dan area penyimpanan terpisah</li>
  <li>Pembatas fisik yang jelas di fasilitas pengolahan</li>
  <li>Pemisahan temporal (mengolah pada waktu berbeda) dapat diterima jika fasilitas dibersihkan</li>
</ul>

<h2>Persyaratan Pelabelan</h2>
<ul>
  <li>Gunakan label <strong>"Bird Friendly"</strong> atau <strong>"BF"</strong> pada semua kemasan</li>
  <li>Label harus ada selama pengolahan, penyimpanan, dan transportasi</li>
  <li>Sertakan nomor lot, nama produsen/kelompok, dan berat</li>
</ul>

<h2>Pencatatan</h2>
<ul>
  <li><strong>Catatan panen</strong> — tanggal, nama petani, ID plot, volume</li>
  <li><strong>Surat jalan</strong> — transportasi dari pertanian ke pengolahan</li>
  <li><strong>Tanda terima pengiriman</strong> — penerimaan di fasilitas</li>
  <li><strong>Faktur penjualan</strong> — semua transaksi komersial</li>
  <li><strong>Sertifikat transaksi</strong> — dikeluarkan oleh lembaga sertifikasi</li>
</ul>

<div class="highlight-box">
  <strong>Neraca Massa:</strong> Auditor membandingkan volume masuk (panen) dengan volume keluar (penjualan). Semua kuantitas harus sesuai.
</div>

<h2>Sistem Kontrol Internal</h2>
<ul>
  <li>Kelola <strong>lembar evaluasi mandiri</strong> untuk setiap pertanian/anggota</li>
  <li>Kembangkan <strong>matriks kontrol internal</strong></li>
  <li>Semua fasilitas dan catatan harus <strong>tersedia untuk auditor</strong> kapan saja</li>
</ul>

<div class="warning-box">
  <strong>Tips:</strong> Modul ketertelusuran aplikasi Slow Forest Impact membantu mendigitalisasi catatan panen dan dokumentasi rantai pengawasan.
</div>`,
    },
  },

  // ─── Article 5: FAQ ───
  {
    id: 'bf-faq',
    type: 'birdfriendly',
    icon: 'HelpCircle',
    category: 'faq',
    title: {
      en: 'Bird Friendly Certification FAQ for Slow Forest Farmers',
      vi: 'Câu hỏi Thường gặp về Chứng nhận Bird Friendly cho Nông dân Slow Forest',
      lo: 'ຄຳຖາມທີ່ຖາມເລື້ອຍໆກ່ຽວກັບ Bird Friendly ສຳລັບຊາວກະສິກອນ Slow Forest',
      id: 'FAQ Sertifikasi Bird Friendly untuk Petani Slow Forest',
    },
    summary: {
      en: 'Common questions about Bird Friendly certification: audit frequency, organic prerequisite, shade requirements, tree heights, and combining audits.',
      vi: 'Câu hỏi phổ biến về chứng nhận Bird Friendly: tần suất đánh giá, yêu cầu hữu cơ, tán che, chiều cao cây và kết hợp đánh giá.',
      lo: 'ຄຳຖາມທົ່ວໄປກ່ຽວກັບ Bird Friendly: ຄວາມຖີ່ຂອງການກວດສອບ, ຂໍ້ກຳນົດອິນຊີ, ຮົ່ມໄມ້, ຄວາມສູງຕົ້ນໄມ້.',
      id: 'Pertanyaan umum tentang Bird Friendly: frekuensi audit, syarat organik, naungan, tinggi pohon.',
    },
    content: {
      en: `<h2>Frequently Asked Questions</h2>

<h3>1. How often are Bird Friendly audits?</h3>
<p>Bird Friendly certification audits occur every <strong>3 years</strong>. However, since organic certification is a prerequisite, you will still have annual organic audits. The BF audit can be combined with the organic audit to save time and cost.</p>

<h3>2. Must we be organic certified?</h3>
<p>Yes. Active organic certification (USDA, EU Organic, or equivalent) — or being in organic transition — is a <strong>mandatory prerequisite</strong> for Bird Friendly certification. You cannot hold BF certification without organic status.</p>

<h3>3. Do all shade trees need to be native species?</h3>
<p>No. At least <strong>60% of shade tree species must be native</strong>. The remaining 40% can include useful exotic species, but each species must represent at least 1% of the total tree count to prevent monoculture dominance.</p>

<h3>4. What about bananas — do they count as shade trees?</h3>
<p>Banana and plantain plants count as <strong>only 1 species</strong> regardless of how many varieties are present (they are technically not trees). They can contribute to canopy cover but should not dominate. You still need 9 other tree species to reach the minimum of 10.</p>

<h3>5. Can part of a cooperative get certified while the rest does not?</h3>
<p>Yes. A subset of cooperative members can be Bird Friendly certified, provided there are robust <strong>separation procedures</strong> to keep BF and non-BF product apart throughout the supply chain.</p>

<h3>6. Is there a minimum farm size?</h3>
<p>There is <strong>no minimum farm size</strong>. However, even the smallest farm must meet the 10-species diversity requirement per hectare. For farms smaller than 1 hectare, the 10 species are still required within the farm area.</p>

<h3>7. How many sample measurement points are needed?</h3>
<p>Auditors require at least <strong>2 sample plots</strong> per farm (25m radius circles). Larger or more variable farms require more sample points to ensure representative coverage.</p>

<h3>8. What if our trees haven't reached 12 meters yet?</h3>
<div class="highlight-box">
  <strong>Commitment Letter:</strong> If shade trees are below 12m, the farm can sign a commitment letter promising the trees will reach the required height by the next audit cycle (3 years). This is a one-time allowance for newly planted shade systems.
</div>

<h3>9. Can we combine the BF audit with our organic audit?</h3>
<p>Yes, and this is <strong>strongly encouraged</strong>. Combining audits reduces travel costs, minimizes disruption to farm operations, and is accepted by SMBC. Coordinate with your certifying body to schedule both audits together.</p>

<div class="warning-box">
  <strong>Slow Forest Support:</strong> Contact your Slow Forest field coordinator for assistance with audit preparation, shade tree measurement, and species identification training.
</div>`,

      vi: `<h2>Câu hỏi Thường gặp</h2>

<h3>1. Đánh giá Bird Friendly diễn ra bao lâu một lần?</h3>
<p>Đánh giá chứng nhận Bird Friendly diễn ra mỗi <strong>3 năm</strong>. Tuy nhiên, vì chứng nhận hữu cơ là điều kiện tiên quyết, bạn vẫn có đánh giá hữu cơ hàng năm. Đánh giá BF có thể kết hợp với đánh giá hữu cơ.</p>

<h3>2. Chúng tôi có bắt buộc phải có chứng nhận hữu cơ không?</h3>
<p>Có. Chứng nhận hữu cơ đang hoạt động (hoặc đang chuyển đổi) là <strong>điều kiện bắt buộc</strong> cho Bird Friendly.</p>

<h3>3. Tất cả cây bóng mát có cần là loài bản địa không?</h3>
<p>Không. Ít nhất <strong>60% loài cây phải là bản địa</strong>. 40% còn lại có thể là loài ngoại lai hữu ích, nhưng mỗi loài phải chiếm ít nhất 1% tổng số cây.</p>

<h3>4. Cây chuối có tính là cây bóng mát không?</h3>
<p>Chuối chỉ được tính là <strong>1 loài</strong> dù có nhiều giống (về mặt kỹ thuật không phải là cây). Bạn vẫn cần 9 loài cây khác để đạt tối thiểu 10 loài.</p>

<h3>5. Một phần hợp tác xã có thể được chứng nhận không?</h3>
<p>Có. Một nhóm thành viên có thể được chứng nhận BF với điều kiện có <strong>quy trình tách biệt</strong> chặt chẽ trong toàn chuỗi cung ứng.</p>

<h3>6. Có diện tích tối thiểu không?</h3>
<p><strong>Không có diện tích tối thiểu</strong>, nhưng vẫn phải đáp ứng yêu cầu 10 loài cây cho mọi kích thước nông trại.</p>

<h3>7. Cần bao nhiêu điểm đo mẫu?</h3>
<p>Ít nhất <strong>2 ô mẫu</strong> mỗi nông trại (vòng tròn bán kính 25m). Nông trại lớn hơn cần nhiều điểm hơn.</p>

<h3>8. Nếu cây chưa đạt 12 mét thì sao?</h3>
<div class="highlight-box">
  <strong>Thư cam kết:</strong> Nông trại có thể ký thư cam kết rằng cây sẽ đạt chiều cao yêu cầu trước kỳ đánh giá tiếp theo (3 năm).
</div>

<h3>9. Có thể kết hợp đánh giá BF với đánh giá hữu cơ không?</h3>
<p>Có, và điều này được <strong>khuyến khích mạnh mẽ</strong> để giảm chi phí và gián đoạn hoạt động.</p>

<div class="warning-box">
  <strong>Hỗ trợ Slow Forest:</strong> Liên hệ điều phối viên hiện trường Slow Forest để được hỗ trợ chuẩn bị đánh giá, đo lường cây bóng mát và đào tạo nhận dạng loài cây.
</div>`,

      lo: `<h2>ຄຳຖາມທີ່ຖາມເລື້ອຍໆ</h2>

<h3>1. ການກວດສອບ Bird Friendly ເກີດຂຶ້ນເລື້ອຍປານໃດ?</h3>
<p>ການກວດສອບ Bird Friendly ທຸກ <strong>3 ປີ</strong>. ແນວໃດກໍ່ຕາມ, ເນື່ອງຈາກການຢັ້ງຢືນອິນຊີເປັນເງື່ອນໄຂ, ທ່ານຍັງມີການກວດສອບອິນຊີປະຈຳປີ. ການກວດສອບ BF ສາມາດລວມກັບການກວດສອບອິນຊີ.</p>

<h3>2. ຕ້ອງມີການຢັ້ງຢືນອິນຊີບໍ?</h3>
<p>ແມ່ນ. ການຢັ້ງຢືນອິນຊີແມ່ນ<strong>ເງື່ອນໄຂບັງຄັບ</strong>ສຳລັບ Bird Friendly.</p>

<h3>3. ຕົ້ນໄມ້ທັງໝົດຕ້ອງເປັນພື້ນເມືອງບໍ?</h3>
<p>ບໍ່. ຢ່າງໜ້ອຍ <strong>60% ຕ້ອງເປັນພື້ນເມືອງ</strong>. 40% ສ່ວນທີ່ເຫຼືອສາມາດເປັນຊະນິດຕ່າງປະເທດ.</p>

<h3>4. ກ້ວຍນັບເປັນຕົ້ນໄມ້ບັງແດດບໍ?</h3>
<p>ກ້ວຍນັບເປັນ <strong>1 ຊະນິດ</strong> ເທົ່ານັ້ນ. ທ່ານຍັງຕ້ອງການ 9 ຊະນິດອື່ນ.</p>

<h3>5. ບາງສ່ວນຂອງສະຫະກອນສາມາດໄດ້ຮັບການຢັ້ງຢືນບໍ?</h3>
<p>ແມ່ນ, ດ້ວຍ<strong>ຂະບວນການແຍກ</strong>ທີ່ເຂັ້ມງວດ.</p>

<h3>6. ມີຂະໜາດນາໄຮ່ຕ່ຳສຸດບໍ?</h3>
<p><strong>ບໍ່ມີ</strong>, ແຕ່ຍັງຕ້ອງການ 10 ຊະນິດຕົ້ນໄມ້.</p>

<h3>7. ຕ້ອງການຈຸດວັດແທກຈັກຈຸດ?</h3>
<p>ຢ່າງໜ້ອຍ <strong>2 ແປງ</strong> (ວົງມົນ 25 ແມັດ). ນາໄຮ່ໃຫຍ່ຕ້ອງການຫຼາຍກວ່າ.</p>

<h3>8. ຖ້າຕົ້ນໄມ້ບໍ່ເຖິງ 12 ແມັດ?</h3>
<div class="highlight-box">
  <strong>ຈົດໝາຍຄຳໝັ້ນ:</strong> ນາໄຮ່ສາມາດເຊັນຈົດໝາຍຄຳໝັ້ນວ່າຕົ້ນໄມ້ຈະເຖິງຄວາມສູງກ່ອນການກວດສອບຄັ້ງຕໍ່ໄປ (3 ປີ).
</div>

<h3>9. ສາມາດລວມການກວດສອບ BF ກັບການກວດສອບອິນຊີບໍ?</h3>
<p>ແມ່ນ, ແລະ ນີ້ <strong>ຖືກແນະນຳຢ່າງແຮງ</strong> ເພື່ອຫຼຸດຄ່າໃຊ້ຈ່າຍ.</p>

<div class="warning-box">
  <strong>ການສະໜັບສະໜູນ Slow Forest:</strong> ຕິດຕໍ່ຜູ້ປະສານງານພາກສະໜາມ Slow Forest ເພື່ອຊ່ວຍກະກຽມການກວດສອບ.
</div>`,

      id: `<h2>Pertanyaan yang Sering Diajukan</h2>

<h3>1. Seberapa sering audit Bird Friendly dilakukan?</h3>
<p>Audit sertifikasi Bird Friendly dilakukan setiap <strong>3 tahun</strong>. Namun, karena sertifikasi organik adalah prasyarat, Anda tetap menjalani audit organik tahunan. Audit BF dapat digabungkan dengan audit organik.</p>

<h3>2. Apakah kami harus bersertifikat organik?</h3>
<p>Ya. Sertifikasi organik aktif (atau dalam transisi) adalah <strong>prasyarat wajib</strong> untuk Bird Friendly.</p>

<h3>3. Apakah semua pohon peneduh harus spesies asli?</h3>
<p>Tidak. Minimal <strong>60% spesies harus asli (native)</strong>. 40% sisanya boleh spesies eksotis yang bermanfaat, tetapi setiap spesies harus minimal 1% dari total jumlah pohon.</p>

<h3>4. Bagaimana dengan pisang — apakah dihitung sebagai pohon peneduh?</h3>
<p>Pisang dihitung sebagai <strong>hanya 1 spesies</strong> berapa pun varietasnya (secara teknis bukan pohon). Anda tetap memerlukan 9 spesies pohon lain untuk mencapai minimum 10.</p>

<h3>5. Bisakah sebagian koperasi mendapat sertifikasi?</h3>
<p>Ya. Sebagian anggota koperasi dapat disertifikasi BF asalkan ada <strong>prosedur pemisahan</strong> yang ketat di seluruh rantai pasokan.</p>

<h3>6. Apakah ada ukuran pertanian minimum?</h3>
<p><strong>Tidak ada ukuran minimum</strong>, tetapi persyaratan 10 spesies tetap berlaku untuk semua ukuran pertanian.</p>

<h3>7. Berapa banyak titik sampel yang diperlukan?</h3>
<p>Minimal <strong>2 plot sampel</strong> per pertanian (lingkaran radius 25m). Pertanian yang lebih besar memerlukan lebih banyak titik.</p>

<h3>8. Bagaimana jika pohon kami belum mencapai 12 meter?</h3>
<div class="highlight-box">
  <strong>Surat Komitmen:</strong> Pertanian dapat menandatangani surat komitmen bahwa pohon akan mencapai ketinggian yang diperlukan sebelum audit berikutnya (3 tahun).
</div>

<h3>9. Bisakah audit BF digabung dengan audit organik?</h3>
<p>Ya, dan ini <strong>sangat dianjurkan</strong> untuk mengurangi biaya dan gangguan operasional.</p>

<div class="warning-box">
  <strong>Dukungan Slow Forest:</strong> Hubungi koordinator lapangan Slow Forest untuk bantuan persiapan audit, pengukuran pohon peneduh, dan pelatihan identifikasi spesies.
</div>`,
    },
  },
];
