import type { CertArticle } from './ra-articles';

export const FT_ARTICLES: CertArticle[] = [
  // ─── Article 1: FairTrade Overview ───
  {
    id: 'ft-overview',
    type: 'fairtrade',
    icon: 'Award',
    category: 'standard',
    title: {
      en: 'Understanding FairTrade Certification',
      vi: 'Tìm hiểu Chứng nhận FairTrade',
      lo: 'ການເຂົ້າໃຈການຢັ້ງຢືນ FairTrade',
      id: 'Memahami Sertifikasi FairTrade',
    },
    summary: {
      en: 'Overview of FairTrade International certification for small-scale producer organizations: minimum price, premium, four pillars, and benefits for smallholder coffee and cacao farmers.',
      vi: 'Tổng quan chứng nhận FairTrade International cho tổ chức sản xuất quy mô nhỏ: giá sàn, phí premium, bốn trụ cột và lợi ích cho nông dân trồng cà phê, ca cao.',
      lo: 'ພາບລວມການຢັ້ງຢືນ FairTrade International ສຳລັບອົງການຜະລິດຂະໜາດນ້ອຍ: ລາຄາຂັ້ນຕ່ຳ, ເງິນພຣີມຽມ, ສີ່ເສົາຫຼັກ ແລະ ຜົນປະໂຫຍດ.',
      id: 'Gambaran sertifikasi FairTrade International untuk organisasi produsen skala kecil: harga minimum, premium, empat pilar, dan manfaat bagi petani kopi dan kakao.',
    },
    content: {
      en: `<h2>What is FairTrade Certification?</h2>
<p><strong>FairTrade International</strong> is a global system that sets social, economic, and environmental standards for companies and farmers. The certification is audited by <strong>FLOCERT</strong>, an independent body that verifies compliance. The FAIRTRADE Mark on a product guarantees that producers received at least the FairTrade Minimum Price and an additional FairTrade Premium.</p>

<h2>FairTrade Minimum Price & Premium</h2>
<div class="highlight-box">
  <strong>Coffee:</strong> The FairTrade Minimum Price for Arabica coffee is USD 1.80/lb (conventional) and USD 2.20/lb (organic). On top of this, producers receive a <strong>FairTrade Premium of USD 0.20/lb</strong> to invest in community and business development.
</div>
<p>For cacao, the Minimum Price is USD 2,400/MT with a Premium of USD 240/MT. These prices act as a safety net when market prices fall below sustainable levels.</p>

<h2>The Four Pillars</h2>
<ul>
  <li><strong>Trade Standards</strong> — Fair pricing, transparent contracts, traceability</li>
  <li><strong>Production Standards</strong> — Environmental protection, sustainable farming</li>
  <li><strong>Labour Standards</strong> — Workers' rights, safe conditions, no child labour</li>
  <li><strong>Business & Development</strong> — Democratic governance, Premium investment, capacity building</li>
</ul>

<h2>Who Can Apply?</h2>
<p>FairTrade certification for coffee and cacao is available to <strong>Small-scale Producer Organizations (SPOs)</strong>: cooperatives or associations where the majority of members are smallholders. The organization must be democratically governed and the majority of product volume must come from small-scale members.</p>

<div class="warning-box">
  <strong>Important:</strong> Only organized producer groups (cooperatives, associations) can apply — individual farmers cannot be FairTrade certified on their own.
</div>`,

      vi: `<h2>Chứng nhận FairTrade là gì?</h2>
<p><strong>FairTrade International</strong> là hệ thống toàn cầu thiết lập tiêu chuẩn xã hội, kinh tế và môi trường cho doanh nghiệp và nông dân. Chứng nhận được đánh giá bởi <strong>FLOCERT</strong>, tổ chức độc lập xác minh tuân thủ. Nhãn FAIRTRADE trên sản phẩm đảm bảo nhà sản xuất nhận ít nhất Giá Sàn FairTrade và Phí Premium bổ sung.</p>

<h2>Giá Sàn & Premium FairTrade</h2>
<div class="highlight-box">
  <strong>Cà phê:</strong> Giá Sàn FairTrade cho Arabica là 1,80 USD/lb (thông thường) và 2,20 USD/lb (hữu cơ). Ngoài ra, nhà sản xuất nhận <strong>Premium 0,20 USD/lb</strong> để đầu tư phát triển cộng đồng.
</div>
<p>Đối với ca cao, Giá Sàn là 2.400 USD/MT với Premium 240 USD/MT.</p>

<h2>Bốn Trụ cột</h2>
<ul>
  <li><strong>Tiêu chuẩn Thương mại</strong> — Giá công bằng, hợp đồng minh bạch, truy xuất nguồn gốc</li>
  <li><strong>Tiêu chuẩn Sản xuất</strong> — Bảo vệ môi trường, canh tác bền vững</li>
  <li><strong>Tiêu chuẩn Lao động</strong> — Quyền lao động, điều kiện an toàn, không lao động trẻ em</li>
  <li><strong>Kinh doanh & Phát triển</strong> — Quản trị dân chủ, đầu tư Premium, nâng cao năng lực</li>
</ul>

<h2>Ai có thể đăng ký?</h2>
<p>Chứng nhận dành cho <strong>Tổ chức Sản xuất Quy mô nhỏ (SPO)</strong>: hợp tác xã hoặc hiệp hội với đa số thành viên là nông hộ nhỏ, được quản trị dân chủ.</p>

<div class="warning-box">
  <strong>Quan trọng:</strong> Chỉ nhóm sản xuất có tổ chức (hợp tác xã, hiệp hội) mới đăng ký được — nông dân cá nhân không thể tự chứng nhận FairTrade.
</div>`,

      lo: `<h2>ການຢັ້ງຢືນ FairTrade ແມ່ນຫຍັງ?</h2>
<p><strong>FairTrade International</strong> ແມ່ນລະບົບທົ່ວໂລກທີ່ກຳນົດມາດຕະຖານທາງສັງຄົມ, ເສດຖະກິດ ແລະ ສິ່ງແວດລ້ອມ. ການຢັ້ງຢືນໄດ້ຖືກກວດສອບໂດຍ <strong>FLOCERT</strong>, ອົງການອິດສະຫຼະທີ່ຢືນຢັນການປະຕິບັດ. ເຄື່ອງໝາຍ FAIRTRADE ຮັບປະກັນວ່າຜູ້ຜະລິດໄດ້ຮັບລາຄາຂັ້ນຕ່ຳ ແລະ ເງິນພຣີມຽມ.</p>

<h2>ລາຄາຂັ້ນຕ່ຳ ແລະ ພຣີມຽມ</h2>
<div class="highlight-box">
  <strong>ກາເຟ:</strong> ລາຄາຂັ້ນຕ່ຳ FairTrade ສຳລັບ Arabica ແມ່ນ 1.80 USD/lb (ທຳມະດາ) ແລະ 2.20 USD/lb (ອິນຊີ). ນອກຈາກນັ້ນ, ຜູ້ຜະລິດໄດ້ຮັບ <strong>ພຣີມຽມ 0.20 USD/lb</strong> ເພື່ອລົງທຶນໃນການພັດທະນາ.
</div>

<h2>ສີ່ເສົາຫຼັກ</h2>
<ul>
  <li><strong>ມາດຕະຖານການຄ້າ</strong> — ລາຄາທີ່ເປັນທຳ, ສັນຍາໂປ່ງໃສ</li>
  <li><strong>ມາດຕະຖານການຜະລິດ</strong> — ປົກປ້ອງສິ່ງແວດລ້ອມ</li>
  <li><strong>ມາດຕະຖານແຮງງານ</strong> — ສິດທິແຮງງານ, ບໍ່ມີແຮງງານເດັກ</li>
  <li><strong>ທຸລະກິດ & ການພັດທະນາ</strong> — ການປົກຄອງແບບປະຊາທິປະໄຕ</li>
</ul>

<h2>ໃຜສາມາດສະໝັກ?</h2>
<p>ການຢັ້ງຢືນສຳລັບ <strong>ອົງການຜະລິດຂະໜາດນ້ອຍ (SPO)</strong>: ສະຫະກອນ ຫຼື ສະມາຄົມທີ່ສ່ວນໃຫຍ່ແມ່ນຊາວກະສິກອນຂະໜາດນ້ອຍ.</p>

<div class="warning-box">
  <strong>ສຳຄັນ:</strong> ມີແຕ່ກຸ່ມຜູ້ຜະລິດທີ່ຈັດຕັ້ງ (ສະຫະກອນ, ສະມາຄົມ) ເທົ່ານັ້ນທີ່ສາມາດສະໝັກ — ຊາວກະສິກອນສ່ວນບຸກຄົນບໍ່ສາມາດໄດ້ຮັບການຢັ້ງຢືນ FairTrade ດ້ວຍຕົນເອງ.
</div>`,

      id: `<h2>Apa itu Sertifikasi FairTrade?</h2>
<p><strong>FairTrade International</strong> adalah sistem global yang menetapkan standar sosial, ekonomi, dan lingkungan bagi perusahaan dan petani. Sertifikasi diaudit oleh <strong>FLOCERT</strong>, lembaga independen yang memverifikasi kepatuhan. Tanda FAIRTRADE pada produk menjamin produsen menerima Harga Minimum FairTrade dan Premium tambahan.</p>

<h2>Harga Minimum & Premium FairTrade</h2>
<div class="highlight-box">
  <strong>Kopi:</strong> Harga Minimum FairTrade untuk Arabika adalah USD 1,80/lb (konvensional) dan USD 2,20/lb (organik). Produsen juga menerima <strong>Premium USD 0,20/lb</strong> untuk investasi pengembangan komunitas.
</div>
<p>Untuk kakao, Harga Minimum USD 2.400/MT dengan Premium USD 240/MT.</p>

<h2>Empat Pilar</h2>
<ul>
  <li><strong>Standar Perdagangan</strong> — Harga adil, kontrak transparan, ketertelusuran</li>
  <li><strong>Standar Produksi</strong> — Perlindungan lingkungan, pertanian berkelanjutan</li>
  <li><strong>Standar Ketenagakerjaan</strong> — Hak pekerja, kondisi aman, tanpa pekerja anak</li>
  <li><strong>Bisnis & Pengembangan</strong> — Tata kelola demokratis, investasi Premium</li>
</ul>

<h2>Siapa yang Bisa Mendaftar?</h2>
<p>Sertifikasi untuk <strong>Organisasi Produsen Skala Kecil (SPO)</strong>: koperasi atau asosiasi dengan mayoritas anggota petani kecil yang dikelola secara demokratis.</p>

<div class="warning-box">
  <strong>Penting:</strong> Hanya kelompok produsen terorganisir (koperasi, asosiasi) yang dapat mendaftar — petani individu tidak dapat disertifikasi FairTrade secara mandiri.
</div>`,
    },
  },

  // ─── Article 2: Trade & Traceability Requirements ───
  {
    id: 'ft-trade-requirements',
    type: 'fairtrade',
    icon: 'Route',
    category: 'guidance',
    title: {
      en: 'Trade & Traceability Requirements',
      vi: 'Yêu cầu Thương mại & Truy xuất Nguồn gốc',
      lo: 'ຂໍ້ກຳນົດດ້ານການຄ้າ ແລະ ການຕິດຕາມແຫຼ່ງທີ່ມາ',
      id: 'Persyaratan Perdagangan & Ketertelusuran',
    },
    summary: {
      en: 'FairTrade trade standards covering product traceability, physical separation, record-keeping, sourcing contracts, FAIRTRADE Mark labeling, and FairInsight reporting.',
      vi: 'Tiêu chuẩn thương mại FairTrade: truy xuất nguồn gốc sản phẩm, tách biệt vật lý, lưu trữ hồ sơ, hợp đồng thu mua, nhãn FAIRTRADE và báo cáo FairInsight.',
      lo: 'ມາດຕະຖານການຄ້າ FairTrade: ການຕິດຕາມຜະລິດຕະພັນ, ການແຍກທາງກາຍະພາບ, ການບັນທຶກ, ສັນຍາ ແລະ ການລາຍງານ FairInsight.',
      id: 'Standar perdagangan FairTrade: ketertelusuran produk, pemisahan fisik, pencatatan, kontrak pengadaan, label FAIRTRADE, dan pelaporan FairInsight.',
    },
    content: {
      en: `<h2>Product Traceability</h2>
<p>FairTrade requires full traceability of certified products from the individual member farmer through to the buyer. Every kilogram of FairTrade coffee or cacao must be tracked through the supply chain.</p>

<h3>Physical Separation</h3>
<ul>
  <li>FairTrade-certified product must be <strong>physically separated</strong> from non-certified product at all stages</li>
  <li>Separate storage areas, containers, and processing lines must be clearly identified</li>
  <li>Volume reconciliation: total FairTrade sales must not exceed total FairTrade purchases from members</li>
</ul>

<h3>Record-Keeping Requirements</h3>
<div class="highlight-box">
  <strong>Essential Records:</strong> Purchase receipts from each member (name, date, volume, quality, price paid), sales contracts with buyers, delivery notes, processing records, and stock inventories.
</div>
<ul>
  <li>All records must be kept for at least <strong>5 years</strong></li>
  <li>Records must demonstrate the flow: member → SPO → buyer</li>
  <li>Payment proof showing Minimum Price and Premium received</li>
</ul>

<h3>Sourcing & Contracts</h3>
<ul>
  <li>Buyers must sign contracts specifying FairTrade terms</li>
  <li>Pre-financing: buyers should offer up to 60% pre-finance if requested</li>
  <li>Long-term trading relationships are encouraged</li>
</ul>

<h3>FairInsight Platform</h3>
<p><strong>FairInsight</strong> is FairTrade's online reporting and monitoring platform. SPOs must report annually on production volumes, sales, Premium use, and membership data.</p>

<div class="warning-box">
  <strong>Requirement:</strong> Failure to report on FairInsight within the required timeframe may result in certification suspension.
</div>`,

      vi: `<h2>Truy xuất Nguồn gốc Sản phẩm</h2>
<p>FairTrade yêu cầu truy xuất đầy đủ sản phẩm được chứng nhận từ nông dân thành viên đến người mua. Mỗi kilogram cà phê hoặc ca cao FairTrade phải được theo dõi qua chuỗi cung ứng.</p>

<h3>Tách biệt Vật lý</h3>
<ul>
  <li>Sản phẩm FairTrade phải được <strong>tách biệt vật lý</strong> khỏi sản phẩm không chứng nhận</li>
  <li>Khu vực lưu trữ, container và dây chuyền chế biến riêng phải được đánh dấu rõ ràng</li>
  <li>Đối chiếu khối lượng: tổng bán FairTrade không được vượt quá tổng mua từ thành viên</li>
</ul>

<h3>Yêu cầu Lưu trữ Hồ sơ</h3>
<div class="highlight-box">
  <strong>Hồ sơ Thiết yếu:</strong> Biên lai mua từ mỗi thành viên (tên, ngày, khối lượng, chất lượng, giá), hợp đồng bán, phiếu giao hàng, hồ sơ chế biến và tồn kho.
</div>
<ul>
  <li>Tất cả hồ sơ phải được lưu ít nhất <strong>5 năm</strong></li>
  <li>Bằng chứng thanh toán Giá Sàn và Premium</li>
</ul>

<h3>Nền tảng FairInsight</h3>
<p><strong>FairInsight</strong> là nền tảng báo cáo trực tuyến của FairTrade. SPO phải báo cáo hàng năm về sản lượng, doanh số, sử dụng Premium và dữ liệu thành viên.</p>

<div class="warning-box">
  <strong>Yêu cầu:</strong> Không báo cáo FairInsight đúng hạn có thể dẫn đến đình chỉ chứng nhận.
</div>`,

      lo: `<h2>ການຕິດຕາມແຫຼ່ງທີ່ມາຂອງຜະລິດຕະພັນ</h2>
<p>FairTrade ຮຽກຮ້ອງການຕິດຕາມຢ່າງຄົບຖ້ວນຂອງຜະລິດຕະພັນຈາກຊາວກະສິກອນສະມາຊິກຫາຜູ້ຊື້. ກາເຟ ແລະ ໂກໂກ້ FairTrade ທຸກກິໂລກຣາມຕ້ອງຖືກຕິດຕາມຜ່ານລະບົບຕ່ອງໂສ້ການສະໜອງ.</p>

<h3>ການແຍກທາງກາຍະພາບ</h3>
<ul>
  <li>ຜະລິດຕະພັນ FairTrade ຕ້ອງ<strong>ແຍກທາງກາຍະພາບ</strong>ຈາກຜະລິດຕະພັນທີ່ບໍ່ໄດ້ຮັບການຢັ້ງຢືນ</li>
  <li>ພື້ນທີ່ຈັດເກັບ, ຕູ້ຄອນເທນເນີ ແລະ ສາຍການຜະລິດແຍກຕ່າງຫາກ</li>
  <li>ການກວດສອບປະລິມານ: ຍອດຂາຍ FairTrade ຕ້ອງບໍ່ເກີນຍອດຊື້ຈາກສະມາຊິກ</li>
</ul>

<h3>ຂໍ້ກຳນົດການບັນທຶກ</h3>
<div class="highlight-box">
  <strong>ບັນທຶກທີ່ຈຳເປັນ:</strong> ໃບຮັບຊື້ຈາກສະມາຊິກ, ສັນຍາຂາຍ, ໃບສົ່ງສິນຄ້າ, ບັນທຶກການປຸງແຕ່ງ ແລະ ສິນຄ້າຄົງຄັງ.
</div>
<ul>
  <li>ບັນທຶກທັງໝົດຕ້ອງຮັກສາຢ່າງໜ້ອຍ <strong>5 ປີ</strong></li>
</ul>

<h3>ແພລດຟອມ FairInsight</h3>
<p><strong>FairInsight</strong> ແມ່ນແພລດຟອມລາຍງານອອນໄລນ໌ຂອງ FairTrade. SPO ຕ້ອງລາຍງານປະຈຳປີ.</p>

<div class="warning-box">
  <strong>ຂໍ້ກຳນົດ:</strong> ການບໍ່ລາຍງານໃນ FairInsight ຕາມກຳນົດເວລາອາດເຮັດໃຫ້ຖືກລະງັບການຢັ້ງຢືນ.
</div>`,

      id: `<h2>Ketertelusuran Produk</h2>
<p>FairTrade mensyaratkan ketertelusuran penuh produk bersertifikat dari petani anggota hingga pembeli. Setiap kilogram kopi atau kakao FairTrade harus dilacak melalui rantai pasok.</p>

<h3>Pemisahan Fisik</h3>
<ul>
  <li>Produk FairTrade harus <strong>dipisahkan secara fisik</strong> dari produk non-sertifikasi</li>
  <li>Area penyimpanan, kontainer, dan jalur pengolahan terpisah harus ditandai jelas</li>
  <li>Rekonsiliasi volume: total penjualan FairTrade tidak boleh melebihi total pembelian dari anggota</li>
</ul>

<h3>Persyaratan Pencatatan</h3>
<div class="highlight-box">
  <strong>Catatan Penting:</strong> Kwitansi pembelian dari setiap anggota (nama, tanggal, volume, kualitas, harga), kontrak penjualan, nota pengiriman, catatan pengolahan, dan inventaris stok.
</div>
<ul>
  <li>Semua catatan harus disimpan minimal <strong>5 tahun</strong></li>
  <li>Bukti pembayaran Harga Minimum dan Premium</li>
</ul>

<h3>Platform FairInsight</h3>
<p><strong>FairInsight</strong> adalah platform pelaporan online FairTrade. SPO harus melaporkan produksi, penjualan, penggunaan Premium, dan data keanggotaan setiap tahun.</p>

<div class="warning-box">
  <strong>Persyaratan:</strong> Kegagalan melaporkan di FairInsight tepat waktu dapat mengakibatkan penangguhan sertifikasi.
</div>`,
    },
  },

  // ─── Article 3: Production & Environmental Standards ───
  {
    id: 'ft-production-environment',
    type: 'fairtrade',
    icon: 'Sprout',
    category: 'guidance',
    title: {
      en: 'Production & Environmental Standards',
      vi: 'Tiêu chuẩn Sản xuất & Môi trường',
      lo: 'ມາດຕະຖານການຜະລິດ ແລະ ສິ່ງແວດລ້ອມ',
      id: 'Standar Produksi & Lingkungan',
    },
    summary: {
      en: 'FairTrade environmental requirements: risk assessment, pest management, Hazardous Materials List, deforestation and GMO prohibition, biodiversity protection, and climate adaptation.',
      vi: 'Yêu cầu môi trường FairTrade: đánh giá rủi ro, quản lý dịch hại, Danh sách Vật liệu Nguy hiểm, cấm phá rừng và GMO, bảo vệ đa dạng sinh học, thích ứng khí hậu.',
      lo: 'ຂໍ້ກຳນົດສິ່ງແວດລ້ອມ FairTrade: ການປະເມີນຄວາມສ່ຽງ, ການຄຸ້ມຄອງສັດຕູພືດ, ລາຍການວັດສະດຸອັນຕະລາຍ, ຫ້າມທຳລາຍປ່າ ແລະ GMO.',
      id: 'Persyaratan lingkungan FairTrade: penilaian risiko, manajemen hama, Daftar Bahan Berbahaya, larangan deforestasi dan GMO, perlindungan keanekaragaman hayati.',
    },
    content: {
      en: `<h2>Environmental Risk Assessment</h2>
<p>FairTrade requires SPOs to conduct an <strong>environmental risk assessment</strong> identifying key environmental risks in the production area, including water contamination, soil degradation, biodiversity loss, and climate vulnerability. Based on this assessment, the organization must develop mitigation measures.</p>

<h2>Pest Management & Hazardous Materials</h2>
<h3>Hazardous Materials List (HML)</h3>
<p>FairTrade maintains a strict Hazardous Materials List categorizing pesticides into:</p>
<ul>
  <li><strong>Red List</strong> — Completely prohibited substances (e.g., WHO Class Ia/Ib, Stockholm Convention POPs)</li>
  <li><strong>Orange List</strong> — Restricted substances requiring a derogation and phase-out plan</li>
</ul>
<div class="danger-box">
  <strong>Zero Tolerance:</strong> Use of any Red List pesticide results in immediate non-conformity and potential decertification. This includes highly hazardous substances such as paraquat, endosulfan, and chlorpyrifos.
</div>

<h3>Pesticide Storage & Safety</h3>
<ul>
  <li>Pesticides must be stored in locked, ventilated facilities away from living areas</li>
  <li>PPE (gloves, masks, boots) must be provided for all applicators</li>
  <li>Empty containers must be triple-rinsed and disposed of safely</li>
  <li>Buffer zones around water bodies and residential areas during spraying</li>
</ul>

<h2>Deforestation & GMO Prohibition</h2>
<div class="danger-box">
  <strong>Prohibited:</strong> No deforestation of primary forest or areas of High Conservation Value. No use of genetically modified organisms (GMOs) in any FairTrade-certified production.
</div>

<h2>Biodiversity & Climate</h2>
<ul>
  <li>Protect and restore natural ecosystems and protected areas</li>
  <li>Maintain shade tree cover in coffee and cacao plantations</li>
  <li>Develop a <strong>climate adaptation plan</strong> addressing drought, floods, and shifting growing seasons</li>
  <li>Promote soil conservation through composting and mulching</li>
</ul>

<div class="highlight-box">
  <strong>Slow Forest Advantage:</strong> Our agroforestry model already aligns with FairTrade environmental standards through multi-layer shade canopy and native tree integration.
</div>`,

      vi: `<h2>Đánh giá Rủi ro Môi trường</h2>
<p>FairTrade yêu cầu SPO thực hiện <strong>đánh giá rủi ro môi trường</strong> xác định các rủi ro chính trong vùng sản xuất: ô nhiễm nước, suy thoái đất, mất đa dạng sinh học và biến đổi khí hậu. Dựa trên đánh giá, tổ chức phải xây dựng các biện pháp giảm thiểu.</p>

<h2>Quản lý Dịch hại & Vật liệu Nguy hiểm</h2>
<h3>Danh sách Vật liệu Nguy hiểm (HML)</h3>
<ul>
  <li><strong>Danh sách Đỏ</strong> — Chất hoàn toàn bị cấm (WHO Class Ia/Ib, POPs)</li>
  <li><strong>Danh sách Cam</strong> — Chất hạn chế yêu cầu miễn trừ và kế hoạch loại bỏ dần</li>
</ul>
<div class="danger-box">
  <strong>Không khoan nhượng:</strong> Sử dụng bất kỳ thuốc trừ sâu Danh sách Đỏ nào dẫn đến vi phạm ngay lập tức. Bao gồm paraquat, endosulfan và chlorpyrifos.
</div>

<h3>Bảo quản & An toàn Thuốc trừ sâu</h3>
<ul>
  <li>Thuốc trừ sâu phải lưu trữ trong kho có khóa, thông gió, xa khu dân cư</li>
  <li>Cung cấp PPE (găng tay, khẩu trang, ủng) cho người phun thuốc</li>
  <li>Bao bì trống phải rửa ba lần và xử lý an toàn</li>
</ul>

<h2>Cấm Phá rừng & GMO</h2>
<div class="danger-box">
  <strong>Nghiêm cấm:</strong> Không phá rừng nguyên sinh hoặc khu vực có Giá trị Bảo tồn Cao. Không sử dụng sinh vật biến đổi gen (GMO).
</div>

<h2>Đa dạng Sinh học & Khí hậu</h2>
<ul>
  <li>Bảo vệ và phục hồi hệ sinh thái tự nhiên</li>
  <li>Duy trì cây bóng mát trong vườn cà phê và ca cao</li>
  <li>Xây dựng <strong>kế hoạch thích ứng khí hậu</strong></li>
</ul>

<div class="highlight-box">
  <strong>Lợi thế Slow Forest:</strong> Mô hình nông lâm kết hợp của chúng tôi đã phù hợp với tiêu chuẩn môi trường FairTrade nhờ tán cây bóng mát đa tầng và cây bản địa.
</div>`,

      lo: `<h2>ການປະເມີນຄວາມສ່ຽງດ້ານສິ່ງແວດລ້ອມ</h2>
<p>FairTrade ຮຽກຮ້ອງໃຫ້ SPO ດຳເນີນ<strong>ການປະເມີນຄວາມສ່ຽງດ້ານສິ່ງແວດລ້ອມ</strong> ລະບຸຄວາມສ່ຽງຫຼັກ: ການປົນເປື້ອນນ້ຳ, ການເຊື່ອມໂຊມຂອງດິນ, ການສູນເສຍຊີວະນາໆພັນ ແລະ ການປ່ຽນແປງສະພາບອາກາດ.</p>

<h2>ການຄຸ້ມຄອງສັດຕູພືດ ແລະ ວັດສະດຸອັນຕະລາຍ</h2>
<h3>ລາຍການວັດສະດຸອັນຕະລາຍ (HML)</h3>
<ul>
  <li><strong>ລາຍການແດງ</strong> — ສານທີ່ຖືກຫ້າມຢ່າງສົມບູນ (WHO Class Ia/Ib)</li>
  <li><strong>ລາຍການສົ້ມ</strong> — ສານທີ່ຖືກຈຳກັດ ຕ້ອງມີແຜນຍົກເລີກ</li>
</ul>
<div class="danger-box">
  <strong>ບໍ່ອົດທົນ:</strong> ການໃຊ້ຢາຂ້າແມງໄມ້ລາຍການແດງ ນຳໄປສູ່ການລະເມີດທັນທີ. ລວມທັງ paraquat, endosulfan ແລະ chlorpyrifos.
</div>

<h3>ການເກັບຮັກສາ ແລະ ຄວາມປອດໄພ</h3>
<ul>
  <li>ຢາຂ້າແມງໄມ້ຕ້ອງເກັບໄວ້ໃນບ່ອນລັອກ, ມີການລະບາຍອາກາດ</li>
  <li>ສະໜອງ PPE (ຖົງມື, ໜ້າກາກ, ເກີບ) ສຳລັບຜູ້ສີດພົ່ນ</li>
</ul>

<h2>ຫ້າມທຳລາຍປ່າ ແລະ GMO</h2>
<div class="danger-box">
  <strong>ຫ້າມ:</strong> ບໍ່ທຳລາຍປ່າດົ້ນ ຫຼື ພື້ນທີ່ມູນຄ່າການອະນຸລັກສູງ. ບໍ່ໃຊ້ GMO ໃນການຜະລິດ FairTrade.
</div>

<h2>ຊີວະນາໆພັນ ແລະ ສະພາບອາກາດ</h2>
<ul>
  <li>ປົກປ້ອງ ແລະ ຟື້ນຟູລະບົບນິເວດທຳມະຊາດ</li>
  <li>ຮັກສາຕົ້ນໄມ້ບັງແດດໃນສວນກາເຟ ແລະ ໂກໂກ້</li>
  <li>ສ້າງ<strong>ແຜນການປັບຕົວຕໍ່ສະພາບອາກາດ</strong></li>
</ul>

<div class="highlight-box">
  <strong>ຂໍ້ໄດ້ປຽບ Slow Forest:</strong> ແບບຈຳລອງປ່າໄມ້ກະສິກຳຂອງພວກເຮົາສອດຄ່ອງກັບມາດຕະຖານສິ່ງແວດລ້ອມ FairTrade ແລ້ວ.
</div>`,

      id: `<h2>Penilaian Risiko Lingkungan</h2>
<p>FairTrade mensyaratkan SPO melakukan <strong>penilaian risiko lingkungan</strong> yang mengidentifikasi risiko utama: pencemaran air, degradasi tanah, hilangnya keanekaragaman hayati, dan kerentanan iklim. Berdasarkan penilaian ini, organisasi harus mengembangkan langkah mitigasi.</p>

<h2>Manajemen Hama & Bahan Berbahaya</h2>
<h3>Daftar Bahan Berbahaya (HML)</h3>
<ul>
  <li><strong>Daftar Merah</strong> — Zat yang sepenuhnya dilarang (WHO Kelas Ia/Ib, POP)</li>
  <li><strong>Daftar Oranye</strong> — Zat terbatas yang memerlukan derogasi dan rencana penghapusan</li>
</ul>
<div class="danger-box">
  <strong>Toleransi Nol:</strong> Penggunaan pestisida Daftar Merah mengakibatkan ketidaksesuaian langsung. Termasuk paraquat, endosulfan, dan klorpirifos.
</div>

<h3>Penyimpanan & Keamanan Pestisida</h3>
<ul>
  <li>Pestisida harus disimpan di fasilitas terkunci dan berventilasi, jauh dari area tinggal</li>
  <li>APD (sarung tangan, masker, sepatu bot) harus disediakan untuk semua aplikator</li>
  <li>Wadah kosong harus dibilas tiga kali dan dibuang dengan aman</li>
</ul>

<h2>Larangan Deforestasi & GMO</h2>
<div class="danger-box">
  <strong>Dilarang:</strong> Tidak ada deforestasi hutan primer atau area Nilai Konservasi Tinggi. Tidak ada penggunaan organisme hasil rekayasa genetika (GMO).
</div>

<h2>Keanekaragaman Hayati & Iklim</h2>
<ul>
  <li>Lindungi dan pulihkan ekosistem alami dan area dilindungi</li>
  <li>Pertahankan pohon peneduh di perkebunan kopi dan kakao</li>
  <li>Kembangkan <strong>rencana adaptasi iklim</strong> menghadapi kekeringan, banjir, dan pergeseran musim tanam</li>
</ul>

<div class="highlight-box">
  <strong>Keunggulan Slow Forest:</strong> Model agroforestri kami sudah sejalan dengan standar lingkungan FairTrade melalui kanopi peneduh berlapis dan integrasi pohon asli.
</div>`,
    },
  },

  // ─── Article 4: Labour Rights & Business Development ───
  {
    id: 'ft-labor-development',
    type: 'fairtrade',
    icon: 'Users',
    category: 'guidance',
    title: {
      en: 'Labour Rights & Business Development',
      vi: 'Quyền Lao động & Phát triển Kinh doanh',
      lo: 'ສິດທິແຮງງານ ແລະ ການພັດທະນາທຸລະກິດ',
      id: 'Hak Tenaga Kerja & Pengembangan Bisnis',
    },
    summary: {
      en: 'FairTrade labour standards and business development requirements: non-discrimination, child labour prohibition, freedom of association, FairTrade Premium management, and democratic governance.',
      vi: 'Tiêu chuẩn lao động và phát triển kinh doanh FairTrade: không phân biệt đối xử, cấm lao động trẻ em, tự do hiệp hội, quản lý Premium và quản trị dân chủ.',
      lo: 'ມາດຕະຖານແຮງງານ ແລະ ການພັດທະນາທຸລະກິດ FairTrade: ບໍ່ຈຳແນກ, ຫ້າມແຮງງານເດັກ, ເສລີພາບໃນການສະມາຄົມ, ການຄຸ້ມຄອງພຣີມຽມ.',
      id: 'Standar ketenagakerjaan dan pengembangan bisnis FairTrade: non-diskriminasi, larangan pekerja anak, kebebasan berserikat, pengelolaan Premium, dan tata kelola demokratis.',
    },
    content: {
      en: `<h2>Non-Discrimination</h2>
<p>FairTrade prohibits discrimination based on race, colour, sex, sexual orientation, disability, marital status, age, religion, political opinion, nationality, ethnic or social origin. All members and workers must be treated equally in access to opportunities, services, and benefits.</p>

<h2>Child Labour Prohibition</h2>
<div class="danger-box">
  <strong>Zero Tolerance:</strong> No children under 15 years old may be employed. No person under 18 may perform any work classified as the <strong>worst forms of child labour</strong> (hazardous work, pesticide handling, heavy loads, night work, or work interfering with education).
</div>
<ul>
  <li>SPOs must implement a child labour monitoring and remediation system</li>
  <li>Age verification records required for all workers</li>
  <li>Children of members may assist with light tasks outside school hours only</li>
</ul>

<h2>Forced Labour & Freedom of Association</h2>
<ul>
  <li>All labour must be voluntary — no forced, bonded, or trafficked labour</li>
  <li>Workers have the right to form and join trade unions</li>
  <li>Collective bargaining must be respected</li>
  <li>No retaliation against workers exercising their rights</li>
</ul>

<h2>Conditions of Employment</h2>
<ul>
  <li>Wages must meet or exceed the legal minimum wage</li>
  <li>Maximum working hours: 48 hours/week regular, 12 hours/week overtime</li>
  <li>Overtime must be voluntary and compensated at premium rates</li>
  <li>Written employment contracts for permanent workers</li>
</ul>

<h3>Occupational Health & Safety</h3>
<ul>
  <li>Safe working environment with risk assessments</li>
  <li>PPE provided free of charge for hazardous tasks</li>
  <li>First aid and emergency procedures in place</li>
  <li>No work under influence of alcohol or drugs</li>
</ul>

<h2>FairTrade Development Plan & Premium</h2>
<div class="highlight-box">
  <strong>FairTrade Premium:</strong> At least USD 0.20/lb for coffee (USD 0.05/lb minimum for organizational strengthening). The Premium must be managed transparently by a <strong>Premium Committee</strong> elected by members, with clear accounting and annual reporting.
</div>
<p>The SPO must develop a <strong>FairTrade Development Plan</strong> outlining how Premium funds will be invested in:</p>
<ul>
  <li>Productivity and quality improvements</li>
  <li>Community development projects (schools, health, infrastructure)</li>
  <li>Organizational strengthening and capacity building</li>
  <li>Environmental sustainability initiatives</li>
</ul>

<h2>Democracy & Governance</h2>
<p>The SPO must operate democratically with transparent governance:</p>
<ul>
  <li>General Assembly with voting rights for all members</li>
  <li>Elected board and Premium Committee</li>
  <li>Annual financial audits and reports shared with members</li>
  <li>Inclusive participation regardless of gender or ethnicity</li>
</ul>`,

      vi: `<h2>Không phân biệt Đối xử</h2>
<p>FairTrade cấm phân biệt đối xử dựa trên chủng tộc, giới tính, khuynh hướng tình dục, khuyết tật, tuổi, tôn giáo, quan điểm chính trị hoặc nguồn gốc dân tộc. Tất cả thành viên và người lao động phải được đối xử bình đẳng.</p>

<h2>Cấm Lao động Trẻ em</h2>
<div class="danger-box">
  <strong>Không khoan nhượng:</strong> Không trẻ em dưới 15 tuổi được tuyển dụng. Không người dưới 18 tuổi được làm <strong>các hình thức lao động trẻ em tồi tệ nhất</strong> (công việc nguy hiểm, xử lý thuốc trừ sâu, vác nặng, làm đêm).
</div>
<ul>
  <li>SPO phải triển khai hệ thống giám sát và khắc phục lao động trẻ em</li>
  <li>Yêu cầu hồ sơ xác minh tuổi cho tất cả người lao động</li>
</ul>

<h2>Lao động Cưỡng bức & Tự do Hiệp hội</h2>
<ul>
  <li>Tất cả lao động phải tự nguyện — không lao động cưỡng bức hoặc buôn người</li>
  <li>Người lao động có quyền thành lập và tham gia công đoàn</li>
  <li>Tôn trọng thương lượng tập thể</li>
</ul>

<h2>Điều kiện Tuyển dụng</h2>
<ul>
  <li>Lương phải bằng hoặc cao hơn lương tối thiểu pháp luật</li>
  <li>Tối đa 48 giờ/tuần, làm thêm 12 giờ/tuần</li>
  <li>Làm thêm giờ tự nguyện và được trả thêm</li>
</ul>

<h2>Kế hoạch Phát triển & Premium FairTrade</h2>
<div class="highlight-box">
  <strong>Premium FairTrade:</strong> Ít nhất 0,20 USD/lb cho cà phê. Premium phải được quản lý minh bạch bởi <strong>Ủy ban Premium</strong> do thành viên bầu, với kế toán rõ ràng và báo cáo hàng năm.
</div>
<p>SPO phải xây dựng <strong>Kế hoạch Phát triển FairTrade</strong> đầu tư vào:</p>
<ul>
  <li>Cải thiện năng suất và chất lượng</li>
  <li>Dự án phát triển cộng đồng (trường học, y tế, cơ sở hạ tầng)</li>
  <li>Nâng cao năng lực tổ chức</li>
  <li>Sáng kiến bền vững môi trường</li>
</ul>

<h2>Dân chủ & Quản trị</h2>
<ul>
  <li>Đại hội đồng với quyền biểu quyết cho tất cả thành viên</li>
  <li>Ban điều hành và Ủy ban Premium được bầu cử</li>
  <li>Kiểm toán tài chính hàng năm chia sẻ với thành viên</li>
</ul>`,

      lo: `<h2>ບໍ່ຈຳແນກ</h2>
<p>FairTrade ຫ້າມການຈຳແນກບົນພື້ນຖານເຊື້ອຊາດ, ເພດ, ອາຍຸ, ສາສະໜາ, ຄວາມເຊື່ອທາງການເມືອງ ຫຼື ເຊື້ອສາຍ. ສະມາຊິກ ແລະ ຜູ້ອອກແຮງງານທັງໝົດຕ້ອງໄດ້ຮັບການປະຕິບັດຢ່າງສະເໝີພາບ.</p>

<h2>ຫ້າມແຮງງານເດັກ</h2>
<div class="danger-box">
  <strong>ບໍ່ອົດທົນ:</strong> ບໍ່ມີເດັກນ້ອຍອາຍຸຕ່ຳກວ່າ 15 ປີ. ບໍ່ມີຜູ້ອາຍຸຕ່ຳກວ່າ 18 ປີ ເຮັດ<strong>ວຽກທີ່ເປັນຮູບແບບທີ່ຮ້າຍແຮງທີ່ສຸດ</strong> (ວຽກອັນຕະລາຍ, ຈັດການຢາຂ້າແມງໄມ້, ແບກໜັກ, ເຮັດວຽກກາງຄືນ).
</div>
<ul>
  <li>SPO ຕ້ອງມີລະບົບຕິດຕາມ ແລະ ແກ້ໄຂແຮງງານເດັກ</li>
  <li>ຕ້ອງມີບັນທຶກຢືນຢັນອາຍຸສຳລັບຜູ້ອອກແຮງງານທຸກຄົນ</li>
</ul>

<h2>ແຮງງານບັງຄັບ ແລະ ເສລີພາບໃນການສະມາຄົມ</h2>
<ul>
  <li>ແຮງງານທັງໝົດຕ້ອງເປັນແບບສະໝັກໃຈ</li>
  <li>ຜູ້ອອກແຮງງານມີສິດສ້າງ ແລະ ເຂົ້າຮ່ວມສະຫະພັນ</li>
  <li>ຕ້ອງເຄົາລົບການເຈລະຈາລວມ</li>
</ul>

<h2>ເງື່ອນໄຂການຈ້າງງານ</h2>
<ul>
  <li>ຄ່າຈ້າງຕ້ອງເທົ່າກັບ ຫຼື ສູງກວ່າຄ່າຈ້າງຂັ້ນຕ່ຳຕາມກົດໝາຍ</li>
  <li>ສູງສຸດ 48 ຊົ່ວໂມງ/ອາທິດ, ລ່ວງເວລາ 12 ຊົ່ວໂມງ/ອາທິດ</li>
</ul>

<h2>ແຜນພັດທະນາ ແລະ ພຣີມຽມ FairTrade</h2>
<div class="highlight-box">
  <strong>ພຣີມຽມ FairTrade:</strong> ຢ່າງໜ້ອຍ 0.20 USD/lb ສຳລັບກາເຟ. ພຣີມຽມຕ້ອງຄຸ້ມຄອງໂດຍ<strong>ຄະນະກຳມະການພຣີມຽມ</strong>ທີ່ເລືອກໂດຍສະມາຊິກ.
</div>
<p>SPO ຕ້ອງສ້າງ<strong>ແຜນພັດທະນາ FairTrade</strong> ລົງທຶນໃນ:</p>
<ul>
  <li>ການປັບປຸງຜົນຜະລິດ ແລະ ຄຸນນະພາບ</li>
  <li>ໂຄງການພັດທະນາຊຸມຊົນ</li>
  <li>ການເສີມສ້າງຄວາມສາມາດຂອງອົງການ</li>
</ul>

<h2>ປະຊາທິປະໄຕ ແລະ ການປົກຄອງ</h2>
<ul>
  <li>ສະພາໃຫຍ່ມີສິດລົງຄະແນນສຽງສຳລັບສະມາຊິກທຸກຄົນ</li>
  <li>ຄະນະບໍລິຫານ ແລະ ຄະນະກຳມະການພຣີມຽມທີ່ຖືກເລືອກຕັ້ງ</li>
  <li>ການກວດສອບບັນຊີການເງິນປະຈຳປີ</li>
</ul>`,

      id: `<h2>Non-Diskriminasi</h2>
<p>FairTrade melarang diskriminasi berdasarkan ras, jenis kelamin, orientasi seksual, disabilitas, usia, agama, pandangan politik, atau asal etnis. Semua anggota dan pekerja harus diperlakukan secara setara.</p>

<h2>Larangan Pekerja Anak</h2>
<div class="danger-box">
  <strong>Toleransi Nol:</strong> Tidak ada anak di bawah 15 tahun yang boleh dipekerjakan. Tidak ada orang di bawah 18 tahun yang boleh melakukan <strong>bentuk-bentuk terburuk pekerja anak</strong> (pekerjaan berbahaya, penanganan pestisida, beban berat, kerja malam).
</div>
<ul>
  <li>SPO harus menerapkan sistem pemantauan dan remediasi pekerja anak</li>
  <li>Catatan verifikasi usia wajib untuk semua pekerja</li>
</ul>

<h2>Kerja Paksa & Kebebasan Berserikat</h2>
<ul>
  <li>Semua tenaga kerja harus sukarela — tanpa kerja paksa atau perdagangan manusia</li>
  <li>Pekerja berhak membentuk dan bergabung dengan serikat pekerja</li>
  <li>Perundingan bersama harus dihormati</li>
</ul>

<h2>Kondisi Ketenagakerjaan</h2>
<ul>
  <li>Upah harus memenuhi atau melebihi upah minimum yang ditetapkan hukum</li>
  <li>Maksimal 48 jam/minggu reguler, lembur 12 jam/minggu</li>
  <li>Lembur harus sukarela dan dibayar dengan tarif premium</li>
</ul>

<h2>Rencana Pengembangan & Premium FairTrade</h2>
<div class="highlight-box">
  <strong>Premium FairTrade:</strong> Minimal USD 0,20/lb untuk kopi. Premium harus dikelola secara transparan oleh <strong>Komite Premium</strong> yang dipilih anggota, dengan akuntansi jelas dan pelaporan tahunan.
</div>
<p>SPO harus mengembangkan <strong>Rencana Pengembangan FairTrade</strong> yang menginvestasikan dana Premium untuk:</p>
<ul>
  <li>Peningkatan produktivitas dan kualitas</li>
  <li>Proyek pengembangan komunitas (sekolah, kesehatan, infrastruktur)</li>
  <li>Penguatan organisasi dan pengembangan kapasitas</li>
  <li>Inisiatif keberlanjutan lingkungan</li>
</ul>

<h2>Demokrasi & Tata Kelola</h2>
<ul>
  <li>Rapat Umum Anggota dengan hak suara untuk semua anggota</li>
  <li>Pengurus dan Komite Premium yang dipilih</li>
  <li>Audit keuangan tahunan dibagikan kepada anggota</li>
  <li>Partisipasi inklusif tanpa memandang gender atau etnis</li>
</ul>`,
    },
  },

  // ─── Article 5: FairTrade FAQ ───
  {
    id: 'ft-faq',
    type: 'fairtrade',
    icon: 'HelpCircle',
    category: 'faq',
    title: {
      en: 'FairTrade Certification FAQ for Slow Forest Farmers',
      vi: 'Câu hỏi Thường gặp về Chứng nhận FairTrade cho Nông dân Slow Forest',
      lo: 'ຄຳຖາມທີ່ຖາມເລື້ອຍໆກ່ຽວກັບ FairTrade ສຳລັບຊາວກະສິກອນ Slow Forest',
      id: 'FAQ Sertifikasi FairTrade untuk Petani Slow Forest',
    },
    summary: {
      en: 'Common questions about FairTrade certification: timeline, Premium usage, FairInsight, multiple certifications, FLOCERT audits, costs, and what happens if you fail an audit.',
      vi: 'Câu hỏi phổ biến về chứng nhận FairTrade: thời gian, sử dụng Premium, FairInsight, chứng nhận đa hệ, kiểm toán FLOCERT, chi phí.',
      lo: 'ຄຳຖາມທົ່ວໄປກ່ຽວກັບ FairTrade: ໄລຍະເວລາ, ການໃຊ້ພຣີມຽມ, FairInsight, ການຢັ້ງຢືນຫຼາຍລະບົບ, ການກວດສອບ FLOCERT.',
      id: 'Pertanyaan umum tentang sertifikasi FairTrade: timeline, penggunaan Premium, FairInsight, multi-sertifikasi, audit FLOCERT, biaya.',
    },
    content: {
      en: `<h2>Frequently Asked Questions</h2>

<h3>1. How long does FairTrade certification take?</h3>
<p>The initial certification process typically takes <strong>9-18 months</strong>. This includes forming or strengthening the SPO, training members, implementing internal controls, applying to FLOCERT, and undergoing the initial audit. Slow Forest provides support throughout this entire process.</p>

<h3>2. What is the FairTrade Premium and how is it used?</h3>
<p>The FairTrade Premium is an additional sum paid on top of the selling price (e.g., USD 0.20/lb for coffee). It is managed by a democratically elected <strong>Premium Committee</strong>. Common uses include:</p>
<ul>
  <li>Farm inputs (seedlings, fertilizer, tools)</li>
  <li>Community projects (clean water, school scholarships)</li>
  <li>Quality improvement and processing equipment</li>
  <li>Organizational capacity building</li>
</ul>

<h3>3. What is FairInsight?</h3>
<p><strong>FairInsight</strong> is FairTrade's online data platform where SPOs report production, sales, Premium income and expenditure, and membership information. It helps FairTrade monitor the impact of certification globally.</p>

<h3>4. Can we have multiple certifications (RA, EU Organic, FairTrade)?</h3>
<div class="highlight-box">
  <strong>Yes!</strong> Many Slow Forest cooperatives pursue multiple certifications. While requirements overlap significantly, each certification adds market value. Triple-certified coffee (FairTrade + Organic + RA) commands the highest premiums. The Slow Forest Impact app helps manage compliance across all certifications.
</div>

<h3>5. What is FLOCERT?</h3>
<p><strong>FLOCERT</strong> is the independent certification body that audits FairTrade compliance worldwide. It is ISO 17065 accredited and operates independently from FairTrade International. FLOCERT auditors visit SPOs to verify compliance with all FairTrade standards.</p>

<h3>6. What are the main costs?</h3>
<p>Key costs include:</p>
<ul>
  <li><strong>FLOCERT certification fee</strong> — Based on SPO size, typically EUR 1,500-3,500 for initial audit</li>
  <li><strong>Annual renewal audits</strong> — Similar range to initial certification</li>
  <li><strong>Internal management costs</strong> — Staff, training, record-keeping</li>
  <li>Slow Forest covers certification fees centrally; farmers do not pay individually</li>
</ul>

<h3>7. How often are audits conducted?</h3>
<p>FLOCERT conducts audits on a <strong>3-year cycle</strong> with at least one on-site audit per cycle. Additional unannounced audits may occur at any time. The SPO must also conduct <strong>annual internal inspections</strong> of all members.</p>

<h3>8. What happens if we fail an audit?</h3>
<p>If non-conformities are found during a FLOCERT audit:</p>
<ul>
  <li><strong>Minor non-conformity:</strong> Corrective action within a specified timeline (typically 3 months)</li>
  <li><strong>Major non-conformity:</strong> Certification may be suspended until resolved</li>
  <li><strong>Critical:</strong> Zero-tolerance issues (child labour, forced labour) may result in immediate decertification</li>
</ul>

<div class="warning-box">
  <strong>Slow Forest Support:</strong> If issues are identified, Slow Forest works with the cooperative to develop corrective action plans and provides technical assistance to resolve non-conformities before they escalate.
</div>`,

      vi: `<h2>Câu hỏi Thường gặp</h2>

<h3>1. Chứng nhận FairTrade mất bao lâu?</h3>
<p>Quá trình chứng nhận ban đầu mất <strong>9-18 tháng</strong>, bao gồm thành lập hoặc củng cố SPO, đào tạo thành viên, triển khai kiểm soát nội bộ, nộp đơn cho FLOCERT và kiểm toán ban đầu.</p>

<h3>2. Premium FairTrade là gì và sử dụng như thế nào?</h3>
<p>Premium là khoản thanh toán bổ sung (0,20 USD/lb cho cà phê), quản lý bởi <strong>Ủy ban Premium</strong> được bầu dân chủ:</p>
<ul>
  <li>Vật tư nông nghiệp (cây giống, phân bón, dụng cụ)</li>
  <li>Dự án cộng đồng (nước sạch, học bổng)</li>
  <li>Nâng cấp chất lượng và thiết bị chế biến</li>
</ul>

<h3>3. FairInsight là gì?</h3>
<p><strong>FairInsight</strong> là nền tảng dữ liệu trực tuyến nơi SPO báo cáo sản xuất, doanh số, thu chi Premium và thông tin thành viên.</p>

<h3>4. Có thể có nhiều chứng nhận (RA, EU Organic, FairTrade)?</h3>
<div class="highlight-box">
  <strong>Có!</strong> Nhiều hợp tác xã Slow Forest theo đuổi đa chứng nhận. Cà phê ba chứng nhận (FairTrade + Hữu cơ + RA) được giá cao nhất. Ứng dụng Slow Forest Impact giúp quản lý tuân thủ tất cả chứng nhận.
</div>

<h3>5. FLOCERT là gì?</h3>
<p><strong>FLOCERT</strong> là tổ chức chứng nhận độc lập kiểm toán tuân thủ FairTrade trên toàn thế giới, được công nhận ISO 17065.</p>

<h3>6. Chi phí chính là gì?</h3>
<ul>
  <li><strong>Phí chứng nhận FLOCERT</strong> — Khoảng EUR 1.500-3.500 cho kiểm toán ban đầu</li>
  <li><strong>Kiểm toán gia hạn hàng năm</strong> — Tương tự phí ban đầu</li>
  <li>Slow Forest chi trả phí chứng nhận tập trung; nông dân không phải trả riêng</li>
</ul>

<h3>7. Kiểm toán được thực hiện bao lâu một lần?</h3>
<p>FLOCERT kiểm toán theo <strong>chu kỳ 3 năm</strong> với ít nhất một kiểm toán tại chỗ. Kiểm toán đột xuất có thể xảy ra bất cứ lúc nào.</p>

<h3>8. Điều gì xảy ra nếu không đạt kiểm toán?</h3>
<ul>
  <li><strong>Vi phạm nhỏ:</strong> Hành động khắc phục trong thời hạn (thường 3 tháng)</li>
  <li><strong>Vi phạm lớn:</strong> Có thể đình chỉ chứng nhận</li>
  <li><strong>Nghiêm trọng:</strong> Lao động trẻ em, lao động cưỡng bức có thể bị thu hồi chứng nhận</li>
</ul>

<div class="warning-box">
  <strong>Hỗ trợ Slow Forest:</strong> Nếu phát hiện vấn đề, Slow Forest hỗ trợ hợp tác xã xây dựng kế hoạch khắc phục và cung cấp hỗ trợ kỹ thuật.
</div>`,

      lo: `<h2>ຄຳຖາມທີ່ຖາມເລື້ອຍໆ</h2>

<h3>1. ການຢັ້ງຢືນ FairTrade ໃຊ້ເວລາດົນປານໃດ?</h3>
<p>ຂະບວນການຢັ້ງຢືນເບື້ອງຕົ້ນໃຊ້ເວລາ <strong>9-18 ເດືອນ</strong>, ລວມທັງການສ້າງ SPO, ການຝຶກອົບຮົມ, ການຄຸ້ມຄອງພາຍໃນ ແລະ ການກວດສອບ FLOCERT.</p>

<h3>2. ພຣີມຽມ FairTrade ແມ່ນຫຍັງ?</h3>
<p>ພຣີມຽມແມ່ນເງິນເພີ່ມເຕີມ (0.20 USD/lb ສຳລັບກາເຟ) ຄຸ້ມຄອງໂດຍ<strong>ຄະນະກຳມະການພຣີມຽມ</strong>:</p>
<ul>
  <li>ວັດສະດຸການຜະລິດ (ເບ້ຍໄມ້, ຝຸ່ນ, ເຄື່ອງມື)</li>
  <li>ໂຄງການຊຸມຊົນ (ນ້ຳສະອາດ, ທຶນການສຶກສາ)</li>
</ul>

<h3>3. FairInsight ແມ່ນຫຍັງ?</h3>
<p><strong>FairInsight</strong> ແມ່ນແພລດຟອມຂໍ້ມູນອອນໄລນ໌ສຳລັບລາຍງານການຜະລິດ, ການຂາຍ ແລະ ການໃຊ້ພຣີມຽມ.</p>

<h3>4. ສາມາດມີຫຼາຍການຢັ້ງຢືນ (RA, EU Organic, FairTrade) ໄດ້ບໍ?</h3>
<div class="highlight-box">
  <strong>ໄດ້!</strong> ສະຫະກອນ Slow Forest ຫຼາຍແຫ່ງມີການຢັ້ງຢືນຫຼາຍລະບົບ. ກາເຟສາມການຢັ້ງຢືນໄດ້ລາຄາສູງສຸດ. ແອັບ Slow Forest Impact ຊ່ວຍຄຸ້ມຄອງການປະຕິບັດຕາມທຸກການຢັ້ງຢືນ.
</div>

<h3>5. FLOCERT ແມ່ນຫຍັງ?</h3>
<p><strong>FLOCERT</strong> ແມ່ນອົງການຢັ້ງຢືນອິດສະຫຼະທີ່ກວດສອບການປະຕິບັດຕາມ FairTrade ທົ່ວໂລກ, ໄດ້ຮັບການຮັບຮອງ ISO 17065.</p>

<h3>6. ຄ່າໃຊ້ຈ່າຍຫຼັກແມ່ນຫຍັງ?</h3>
<ul>
  <li><strong>ຄ່າທຳນຽມ FLOCERT</strong> — ປະມານ EUR 1,500-3,500</li>
  <li>Slow Forest ຈ່າຍຄ່າທຳນຽມແບບລວມສູນ; ຊາວກະສິກອນບໍ່ຈ່າຍເອງ</li>
</ul>

<h3>7. ການກວດສອບດຳເນີນເລື້ອຍປານໃດ?</h3>
<p>FLOCERT ກວດສອບຕາມ<strong>ວົງຈອນ 3 ປີ</strong>. ການກວດສອບແບບບໍ່ໄດ້ແຈ້ງລ່ວງໜ້າອາດເກີດຂຶ້ນໄດ້ທຸກເວລາ.</p>

<h3>8. ຈະເກີດຫຍັງຂຶ້ນຖ້າບໍ່ຜ່ານ?</h3>
<ul>
  <li><strong>ການລະເມີດນ້ອຍ:</strong> ແກ້ໄຂພາຍໃນ 3 ເດືອນ</li>
  <li><strong>ການລະເມີດໃຫຍ່:</strong> ອາດຖືກລະງັບການຢັ້ງຢືນ</li>
  <li><strong>ຮ້າຍແຮງ:</strong> ແຮງງານເດັກ, ແຮງງານບັງຄັບ ອາດຖືກຍົກເລີກການຢັ້ງຢືນ</li>
</ul>

<div class="warning-box">
  <strong>ການສະໜັບສະໜູນ Slow Forest:</strong> ຖ້າພົບບັນຫາ, Slow Forest ຈະຊ່ວຍສ້າງແຜນແກ້ໄຂ ແລະ ໃຫ້ການຊ່ວຍເຫຼືອດ້ານເຕັກນິກ.
</div>`,

      id: `<h2>Pertanyaan yang Sering Diajukan</h2>

<h3>1. Berapa lama sertifikasi FairTrade memakan waktu?</h3>
<p>Proses sertifikasi awal biasanya memakan waktu <strong>9-18 bulan</strong>, termasuk pembentukan SPO, pelatihan anggota, penerapan kontrol internal, pengajuan ke FLOCERT, dan audit awal.</p>

<h3>2. Apa itu Premium FairTrade dan bagaimana penggunaannya?</h3>
<p>Premium adalah pembayaran tambahan (USD 0,20/lb untuk kopi), dikelola oleh <strong>Komite Premium</strong> yang dipilih secara demokratis:</p>
<ul>
  <li>Input pertanian (bibit, pupuk, peralatan)</li>
  <li>Proyek komunitas (air bersih, beasiswa sekolah)</li>
  <li>Peningkatan kualitas dan peralatan pengolahan</li>
</ul>

<h3>3. Apa itu FairInsight?</h3>
<p><strong>FairInsight</strong> adalah platform data online FairTrade untuk melaporkan produksi, penjualan, pendapatan dan pengeluaran Premium, serta informasi keanggotaan.</p>

<h3>4. Bisakah kami memiliki beberapa sertifikasi (RA, EU Organik, FairTrade)?</h3>
<div class="highlight-box">
  <strong>Bisa!</strong> Banyak koperasi Slow Forest mengejar multi-sertifikasi. Kopi tiga sertifikasi (FairTrade + Organik + RA) mendapat premium tertinggi. Aplikasi Slow Forest Impact membantu mengelola kepatuhan semua sertifikasi.
</div>

<h3>5. Apa itu FLOCERT?</h3>
<p><strong>FLOCERT</strong> adalah lembaga sertifikasi independen yang mengaudit kepatuhan FairTrade di seluruh dunia, terakreditasi ISO 17065.</p>

<h3>6. Apa saja biaya utama?</h3>
<ul>
  <li><strong>Biaya sertifikasi FLOCERT</strong> — Sekitar EUR 1.500-3.500 untuk audit awal</li>
  <li><strong>Audit pembaruan tahunan</strong> — Kisaran serupa dengan sertifikasi awal</li>
  <li>Slow Forest menanggung biaya sertifikasi secara terpusat; petani tidak membayar secara individual</li>
</ul>

<h3>7. Seberapa sering audit dilakukan?</h3>
<p>FLOCERT melakukan audit dalam <strong>siklus 3 tahun</strong> dengan minimal satu audit di tempat per siklus. Audit tak terjadwal dapat terjadi kapan saja.</p>

<h3>8. Apa yang terjadi jika gagal audit?</h3>
<ul>
  <li><strong>Ketidaksesuaian minor:</strong> Tindakan korektif dalam jangka waktu tertentu (biasanya 3 bulan)</li>
  <li><strong>Ketidaksesuaian mayor:</strong> Sertifikasi dapat ditangguhkan</li>
  <li><strong>Kritis:</strong> Pekerja anak, kerja paksa dapat mengakibatkan pencabutan sertifikasi</li>
</ul>

<div class="warning-box">
  <strong>Dukungan Slow Forest:</strong> Jika ditemukan masalah, Slow Forest membantu koperasi menyusun rencana tindakan korektif dan memberikan bantuan teknis.
</div>`,
    },
  },
];
