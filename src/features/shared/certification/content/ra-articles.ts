export interface CertArticle {
  id: string;
  type: 'ra' | 'eu_organic' | 'fairtrade' | 'birdfriendly' | 'eudr';
  icon: string;
  category: 'standard' | 'guidance' | 'checklist' | 'faq';
  title: { en: string; vi: string; lo: string; id: string };
  summary: { en: string; vi: string; lo: string; id: string };
  content: { en: string; vi: string; lo: string; id: string };
}

export const RA_ARTICLES: CertArticle[] = [
  // ─── Article 1: RA Overview ───
  {
    id: 'ra-overview',
    type: 'ra',
    icon: 'Award',
    category: 'standard',
    title: {
      en: 'Understanding Rainforest Alliance Certification (2020 Standard)',
      vi: 'Tìm hiểu Chứng nhận Rainforest Alliance (Tiêu chuẩn 2020)',
      lo: 'ການເຂົ້າໃຈການຢັ້ງຢືນ Rainforest Alliance (ມາດຕະຖານ 2020)',
      id: 'Memahami Sertifikasi Rainforest Alliance (Standar 2020)',
    },
    summary: {
      en: 'Overview of the Rainforest Alliance 2020 Sustainable Agriculture Standard, its principles, and applicability to coffee and cacao farming.',
      vi: 'Tổng quan về Tiêu chuẩn Nông nghiệp Bền vững Rainforest Alliance 2020, các nguyên tắc và áp dụng cho trồng cà phê và ca cao.',
      lo: 'ພາບລວມຂອງມາດຕະຖານກະສິກຳແບບຍືນຍົງ Rainforest Alliance 2020, ຫຼັກການ ແລະ ການນຳໃຊ້ກັບການປູກກາເຟ ແລະ ໂກໂກ້.',
      id: 'Gambaran umum Standar Pertanian Berkelanjutan Rainforest Alliance 2020, prinsipnya, dan penerapan untuk pertanian kopi dan kakao.',
    },
    content: {
      en: `<h2>What is Rainforest Alliance Certification?</h2>
<p>The <strong>Rainforest Alliance</strong> is an international non-profit organization that works to conserve biodiversity and ensure sustainable livelihoods. The RA certification mark—the green frog seal—indicates that a farm or product meets rigorous social, economic, and environmental standards.</p>

<h2>The 2020 Sustainable Agriculture Standard</h2>
<p>The 2020 Standard replaced the previous SAN/RA standard and introduced a <strong>continuous improvement model</strong>. Instead of a pass/fail system, it uses a three-tier approach:</p>
<ul>
  <li><strong>Core Requirements</strong> — Mandatory for all certified farms from day one</li>
  <li><strong>Improvement Requirements</strong> — Must be met over time through measurable progress</li>
  <li><strong>Smart Metrics</strong> — Data collection to track sustainability performance</li>
</ul>

<div class="highlight-box">
  <strong>Key Principles:</strong> The standard is built on 4 pillars: Social (fair labor, human rights), Environmental (biodiversity, climate), Economic (farm viability, livelihoods), and Management (planning, traceability).
</div>

<h2>Who Does It Apply To?</h2>
<p>The RA 2020 Standard applies to all farms producing certified commodities, including <strong>coffee</strong> (Laos, Vietnam) and <strong>cacao</strong> (Indonesia). It covers:</p>
<ul>
  <li>Smallholder farmer groups (like Slow Forest cooperatives)</li>
  <li>Individual large estates</li>
  <li>Supply chain actors (traders, processors, manufacturers)</li>
</ul>

<h2>Benefits of RA Certification</h2>
<ul>
  <li>Access to premium markets and sustainability-conscious buyers</li>
  <li>Improved farm management practices and yields</li>
  <li>Better working conditions for farmers and workers</li>
  <li>Environmental protection and biodiversity conservation</li>
  <li>Sustainability differential (premium) payments</li>
</ul>

<div class="warning-box">
  <strong>Important:</strong> The 2020 Standard requires annual internal inspections and external audits by an authorized Certification Body.
</div>`,

      vi: `<h2>Chứng nhận Rainforest Alliance là gì?</h2>
<p><strong>Rainforest Alliance</strong> là một tổ chức phi lợi nhuận quốc tế hoạt động nhằm bảo tồn đa dạng sinh học và đảm bảo sinh kế bền vững. Dấu chứng nhận RA—con ếch xanh—cho thấy nông trại hoặc sản phẩm đáp ứng các tiêu chuẩn xã hội, kinh tế và môi trường nghiêm ngặt.</p>

<h2>Tiêu chuẩn Nông nghiệp Bền vững 2020</h2>
<p>Tiêu chuẩn 2020 thay thế tiêu chuẩn SAN/RA trước đó và áp dụng <strong>mô hình cải tiến liên tục</strong>. Thay vì hệ thống đạt/không đạt, nó sử dụng phương pháp ba cấp:</p>
<ul>
  <li><strong>Yêu cầu Cốt lõi</strong> — Bắt buộc cho tất cả nông trại từ ngày đầu</li>
  <li><strong>Yêu cầu Cải tiến</strong> — Phải đạt được theo thời gian thông qua tiến bộ đo lường được</li>
  <li><strong>Chỉ số Thông minh</strong> — Thu thập dữ liệu để theo dõi hiệu suất bền vững</li>
</ul>

<div class="highlight-box">
  <strong>Nguyên tắc chính:</strong> Tiêu chuẩn dựa trên 4 trụ cột: Xã hội (lao động công bằng, nhân quyền), Môi trường (đa dạng sinh học, khí hậu), Kinh tế (khả thi nông trại, sinh kế), và Quản lý (lập kế hoạch, truy xuất nguồn gốc).
</div>

<h2>Áp dụng cho ai?</h2>
<p>Tiêu chuẩn RA 2020 áp dụng cho tất cả nông trại sản xuất hàng hóa được chứng nhận, bao gồm <strong>cà phê</strong> (Lào, Việt Nam) và <strong>ca cao</strong> (Indonesia).</p>

<h2>Lợi ích của chứng nhận RA</h2>
<ul>
  <li>Tiếp cận thị trường cao cấp và người mua có ý thức bền vững</li>
  <li>Cải thiện quản lý nông trại và năng suất</li>
  <li>Điều kiện làm việc tốt hơn cho nông dân</li>
  <li>Bảo vệ môi trường và bảo tồn đa dạng sinh học</li>
  <li>Thanh toán chênh lệch bền vững (premium)</li>
</ul>

<div class="warning-box">
  <strong>Quan trọng:</strong> Tiêu chuẩn 2020 yêu cầu kiểm tra nội bộ hàng năm và đánh giá bên ngoài bởi Tổ chức Chứng nhận được ủy quyền.
</div>`,

      lo: `<h2>ການຢັ້ງຢືນ Rainforest Alliance ແມ່ນຫຍັງ?</h2>
<p><strong>Rainforest Alliance</strong> ແມ່ນອົງການບໍ່ຫວັງຜົນກຳໄລສາກົນທີ່ເຮັດວຽກເພື່ອອະນຸລັກຊີວະນາໆພັນ ແລະ ຮັບປະກັນການດຳລົງຊີວິດແບບຍືນຍົງ. ເຄື່ອງໝາຍການຢັ້ງຢືນ RA—ກົບຂຽວ—ສະແດງໃຫ້ເຫັນວ່ານາໄຮ່ ຫຼື ຜະລິດຕະພັນໄດ້ຕອບສະໜອງມາດຕະຖານທາງສັງຄົມ, ເສດຖະກິດ ແລະ ສິ່ງແວດລ້ອມຢ່າງເຂັ້ມງວດ.</p>

<h2>ມາດຕະຖານກະສິກຳແບບຍືນຍົງ 2020</h2>
<p>ມາດຕະຖານ 2020 ໄດ້ແທນທີ່ມາດຕະຖານ SAN/RA ກ່ອນໜ້ານີ້ ແລະ ນຳສະເໜີ<strong>ແບບຈຳລອງການປັບປຸງຢ່າງຕໍ່ເນື່ອງ</strong>:</p>
<ul>
  <li><strong>ຂໍ້ກຳນົດຫຼັກ</strong> — ບັງຄັບສຳລັບທຸກນາໄຮ່ຕັ້ງແຕ່ມື້ທຳອິດ</li>
  <li><strong>ຂໍ້ກຳນົດການປັບປຸງ</strong> — ຕ້ອງບັນລຸຕາມເວລາ</li>
  <li><strong>ຕົວຊີ້ວັດອັດສະລິຍະ</strong> — ການເກັບກຳຂໍ້ມູນເພື່ອຕິດຕາມ</li>
</ul>

<div class="highlight-box">
  <strong>ຫຼັກການສຳຄັນ:</strong> ມາດຕະຖານນີ້ສ້າງຂຶ້ນເທິງ 4 ເສົາຫຼັກ: ສັງຄົມ, ສິ່ງແວດລ້ອມ, ເສດຖະກິດ, ແລະ ການຄຸ້ມຄອງ.
</div>

<h2>ນຳໃຊ້ກັບໃຜ?</h2>
<p>ມາດຕະຖານ RA 2020 ນຳໃຊ້ກັບທຸກນາໄຮ່ ລວມທັງ <strong>ກາເຟ</strong> (ລາວ, ຫວຽດນາມ) ແລະ <strong>ໂກໂກ້</strong> (ອິນໂດເນເຊຍ).</p>

<h2>ຜົນປະໂຫຍດຂອງການຢັ້ງຢືນ RA</h2>
<ul>
  <li>ເຂົ້າເຖິງຕະຫຼາດລະດັບພຣີມຽມ</li>
  <li>ການຄຸ້ມຄອງນາໄຮ່ ແລະ ຜົນຜະລິດທີ່ດີຂຶ້ນ</li>
  <li>ສະພາບແວດລ້ອມການເຮັດວຽກທີ່ດີຂຶ້ນ</li>
  <li>ການປົກປ້ອງສິ່ງແວດລ້ອມ</li>
</ul>`,

      id: `<h2>Apa itu Sertifikasi Rainforest Alliance?</h2>
<p><strong>Rainforest Alliance</strong> adalah organisasi nirlaba internasional yang bekerja untuk melestarikan keanekaragaman hayati dan memastikan mata pencaharian berkelanjutan. Tanda sertifikasi RA—segel katak hijau—menunjukkan bahwa pertanian atau produk memenuhi standar sosial, ekonomi, dan lingkungan yang ketat.</p>

<h2>Standar Pertanian Berkelanjutan 2020</h2>
<p>Standar 2020 menggantikan standar SAN/RA sebelumnya dan memperkenalkan <strong>model perbaikan berkelanjutan</strong>. Alih-alih sistem lulus/gagal, menggunakan pendekatan tiga tingkat:</p>
<ul>
  <li><strong>Persyaratan Inti</strong> — Wajib untuk semua pertanian sejak hari pertama</li>
  <li><strong>Persyaratan Perbaikan</strong> — Harus dipenuhi dari waktu ke waktu</li>
  <li><strong>Metrik Cerdas</strong> — Pengumpulan data untuk melacak kinerja keberlanjutan</li>
</ul>

<div class="highlight-box">
  <strong>Prinsip Utama:</strong> Standar ini dibangun di atas 4 pilar: Sosial, Lingkungan, Ekonomi, dan Manajemen.
</div>

<h2>Untuk Siapa?</h2>
<p>Standar RA 2020 berlaku untuk semua pertanian termasuk <strong>kopi</strong> (Laos, Vietnam) dan <strong>kakao</strong> (Indonesia).</p>

<h2>Manfaat Sertifikasi RA</h2>
<ul>
  <li>Akses ke pasar premium</li>
  <li>Peningkatan manajemen pertanian dan hasil panen</li>
  <li>Kondisi kerja yang lebih baik bagi petani</li>
  <li>Perlindungan lingkungan dan konservasi keanekaragaman hayati</li>
  <li>Pembayaran premi keberlanjutan</li>
</ul>`,
    },
  },

  // ─── Article 2: Farm Requirements ───
  {
    id: 'ra-farm-requirements',
    type: 'ra',
    icon: 'ClipboardCheck',
    category: 'checklist',
    title: {
      en: 'Farm-Level Requirements & Checklist Guide',
      vi: 'Yêu cầu cấp Nông trại & Hướng dẫn Danh sách Kiểm tra',
      lo: 'ຂໍ້ກຳນົດລະດັບນາໄຮ່ ແລະ ຄູ່ມືລາຍການກວດສອບ',
      id: 'Persyaratan Tingkat Pertanian & Panduan Daftar Periksa',
    },
    summary: {
      en: 'Core farm management requirements under RA 2020: record keeping, farm plans, maps, shade trees, buffer zones, and yield improvement practices.',
      vi: 'Yêu cầu quản lý nông trại cốt lõi theo RA 2020: lưu trữ hồ sơ, kế hoạch nông trại, bản đồ, cây bóng mát, vùng đệm và cải thiện năng suất.',
      lo: 'ຂໍ້ກຳນົດການຄຸ້ມຄອງນາໄຮ່ຫຼັກ RA 2020: ການບັນທຶກ, ແຜນນາໄຮ່, ແຜນທີ່, ຕົ້ນໄມ້ບັງແດດ, ເຂດກັນຊົນ.',
      id: 'Persyaratan manajemen pertanian inti RA 2020: pencatatan, rencana pertanian, peta, pohon peneduh, zona penyangga.',
    },
    content: {
      en: `<h2>Farm Management System</h2>
<p>Every certified farm or group must establish a <strong>Farm Management System</strong> that includes proper planning, documentation, and monitoring. For group certification (like Slow Forest cooperatives), the group management system is the foundation.</p>

<h3>Record Keeping</h3>
<ul>
  <li>Maintain a register of all group members with farm details</li>
  <li>Record all farm inputs (fertilizers, pesticides) with quantities and dates</li>
  <li>Track harvest volumes and sales</li>
  <li>Document training attendance and topics covered</li>
  <li>Keep records of internal inspections and corrective actions</li>
</ul>

<h3>Farm Plan & Maps</h3>
<p>Each farm must have a basic <strong>farm plan</strong> that includes:</p>
<ul>
  <li>A sketch map or GPS-based map showing plot boundaries</li>
  <li>Location of water sources, buildings, and natural vegetation</li>
  <li>Areas designated for conservation or restoration</li>
  <li>Buffer zones around water bodies (minimum 5 meters)</li>
</ul>

<div class="highlight-box">
  <strong>Tip:</strong> The Slow Forest Impact app's EUDR module can help generate GPS-based plot maps that satisfy both EUDR and RA requirements.
</div>

<h3>Shade Management</h3>
<p>Shade trees are critical for both coffee and cacao:</p>
<ul>
  <li>Maintain or establish shade cover of at least 40% canopy</li>
  <li>Use diverse native tree species (minimum 5 species per hectare)</li>
  <li>No removal of native shade trees without replacement</li>
</ul>

<h3>Yield Improvement</h3>
<ul>
  <li>Implement Good Agricultural Practices (GAP)</li>
  <li>Regular pruning of coffee/cacao trees</li>
  <li>Soil fertility management through composting and organic matter</li>
  <li>Proper pest and disease monitoring</li>
</ul>

<div class="warning-box">
  <strong>Core Requirement:</strong> All farms must have a documented farm management plan reviewed and updated annually.
</div>`,

      vi: `<h2>Hệ thống Quản lý Nông trại</h2>
<p>Mỗi nông trại hoặc nhóm được chứng nhận phải thiết lập <strong>Hệ thống Quản lý Nông trại</strong> bao gồm lập kế hoạch, tài liệu và giám sát.</p>

<h3>Lưu trữ Hồ sơ</h3>
<ul>
  <li>Duy trì sổ đăng ký tất cả thành viên nhóm với chi tiết nông trại</li>
  <li>Ghi chép tất cả đầu vào nông trại (phân bón, thuốc trừ sâu)</li>
  <li>Theo dõi sản lượng thu hoạch và bán hàng</li>
  <li>Ghi nhận đào tạo và chủ đề</li>
  <li>Lưu giữ hồ sơ kiểm tra nội bộ và hành động khắc phục</li>
</ul>

<h3>Kế hoạch & Bản đồ Nông trại</h3>
<p>Mỗi nông trại phải có <strong>kế hoạch nông trại</strong> cơ bản:</p>
<ul>
  <li>Bản đồ GPS hoặc phác thảo ranh giới lô đất</li>
  <li>Vị trí nguồn nước, nhà cửa và thảm thực vật</li>
  <li>Khu vực bảo tồn hoặc phục hồi</li>
  <li>Vùng đệm quanh nguồn nước (tối thiểu 5 mét)</li>
</ul>

<div class="highlight-box">
  <strong>Mẹo:</strong> Module EUDR của ứng dụng Slow Forest Impact có thể giúp tạo bản đồ GPS đáp ứng cả yêu cầu EUDR và RA.
</div>

<h3>Quản lý Cây bóng mát</h3>
<ul>
  <li>Duy trì hoặc trồng cây bóng mát che phủ ít nhất 40%</li>
  <li>Sử dụng đa dạng cây bản địa (tối thiểu 5 loài/ha)</li>
  <li>Không chặt cây bóng mát bản địa nếu không trồng thay thế</li>
</ul>

<h3>Cải thiện Năng suất</h3>
<ul>
  <li>Triển khai Thực hành Nông nghiệp Tốt (GAP)</li>
  <li>Cắt tỉa cành cà phê/ca cao định kỳ để trẻ hóa cây</li>
  <li>Quản lý độ phì của đất thông qua ủ phân và chất hữu cơ</li>
  <li>Giám sát dịch hại và bệnh tật thường xuyên</li>
</ul>

<div class="warning-box">
  <strong>Yêu cầu Cốt lõi:</strong> Tất cả nông trại phải có kế hoạch quản lý nông trại bằng văn bản được xem xét và cập nhật hàng năm.
</div>
`,

      lo: `<h2>ລະບົບການຄຸ້ມຄອງນາໄຮ່</h2>
<p>ທຸກນາໄຮ່ ຫຼື ກຸ່ມທີ່ໄດ້ຮັບການຢັ້ງຢືນຕ້ອງສ້າງ<strong>ລະບົບການຄຸ້ມຄອງນາໄຮ່</strong>.</p>

<h3>ການບັນທຶກ</h3>
<ul>
  <li>ຮັກສາທະບຽນສະມາຊິກກຸ່ມທັງໝົດ</li>
  <li>ບັນທຶກປັດໃຈການຜະລິດ (ຝຸ່ນ, ຢາຂ້າແມງໄມ້)</li>
  <li>ຕິດຕາມປະລິມານຜົນຜະລິດ ແລະ ການຂາຍ</li>
  <li>ບັນທຶກການຝຶກອົບຮົມ</li>
</ul>

<h3>ແຜນ ແລະ ແຜນທີ່ນາໄຮ່</h3>
<ul>
  <li>ແຜນທີ່ GPS ສະແດງຂອບເຂດ</li>
  <li>ທີ່ຕັ້ງແຫຼ່ງນ້ຳ, ອາຄານ</li>
  <li>ພື້ນທີ່ອະນຸລັກ</li>
  <li>ເຂດກັນຊົນ (ຢ່າງໜ້ອຍ 5 ແມັດ)</li>
</ul>

<h3>ການຄຸ້ມຄອງຕົ້ນໄມ້ບັງແດດ</h3>
<ul>
  <li>ຮັກສາການປົກຫຸ້ມຢ່າງໜ້ອຍ 40%</li>
  <li>ໃຊ້ຕົ້ນໄມ້ພື້ນເມືອງຫຼາກຫຼາຍ</li>
</ul>`,

      id: `<h2>Sistem Manajemen Pertanian</h2>
<p>Setiap pertanian bersertifikat harus membangun <strong>Sistem Manajemen Pertanian</strong> yang mencakup perencanaan, dokumentasi, dan pemantauan.</p>

<h3>Pencatatan</h3>
<ul>
  <li>Memelihara daftar semua anggota kelompok</li>
  <li>Mencatat semua input pertanian (pupuk, pestisida)</li>
  <li>Melacak volume panen dan penjualan</li>
  <li>Mendokumentasikan pelatihan</li>
</ul>

<h3>Rencana & Peta Pertanian</h3>
<ul>
  <li>Peta GPS atau sketsa batas plot</li>
  <li>Lokasi sumber air, bangunan</li>
  <li>Area konservasi</li>
  <li>Zona penyangga (minimal 5 meter)</li>
</ul>

<h3>Pengelolaan Pohon Peneduh</h3>
<ul>
  <li>Pertahankan naungan minimal 40%</li>
  <li>Gunakan spesies pohon asli yang beragam (minimal 5 spesies/ha)</li>
</ul>`,
    },
  },

  // ─── Article 3: Social & Labor ───
  {
    id: 'ra-social-labor',
    type: 'ra',
    icon: 'Users',
    category: 'guidance',
    title: {
      en: 'Social & Labor Standards',
      vi: 'Tiêu chuẩn Xã hội & Lao động',
      lo: 'ມາດຕະຖານສັງຄົມ ແລະ ແຮງງານ',
      id: 'Standar Sosial & Ketenagakerjaan',
    },
    summary: {
      en: 'RA 2020 requirements for fair labor practices: no child labor, safe working conditions, fair wages, freedom of association, and protective equipment.',
      vi: 'Yêu cầu RA 2020 về thực hành lao động công bằng: không lao động trẻ em, điều kiện làm việc an toàn, lương công bằng, tự do hội họp.',
      lo: 'ຂໍ້ກຳນົດ RA 2020 ກ່ຽວກັບແຮງງານ: ບໍ່ມີແຮງງານເດັກ, ສະພາບການເຮັດວຽກທີ່ປອດໄພ, ຄ່າຈ້າງທີ່ເປັນທຳ.',
      id: 'Persyaratan RA 2020 untuk praktik tenaga kerja: tanpa pekerja anak, kondisi kerja aman, upah layak.',
    },
    content: {
      en: `<h2>Protecting Workers' Rights</h2>
<p>The RA 2020 Standard places <strong>strong emphasis on social and labor conditions</strong>. These are core requirements that must be met from day one of certification.</p>

<h3>No Child Labor</h3>
<div class="danger-box">
  <strong>Zero Tolerance:</strong> No children under 15 may be employed. Children aged 15-17 may only do light, non-hazardous work that does not interfere with schooling.
</div>
<ul>
  <li>Maintain records of all workers with proof of age</li>
  <li>Children of farm families may help with light tasks but not during school hours</li>
  <li>No hazardous work for anyone under 18 (pesticide handling, heavy loads, machete use)</li>
</ul>

<h3>No Forced Labor</h3>
<ul>
  <li>All employment must be voluntary</li>
  <li>Workers must be free to leave employment</li>
  <li>No retention of identity documents</li>
  <li>No debt bondage or trafficking</li>
</ul>

<h3>Fair Wages & Working Hours</h3>
<ul>
  <li>Pay at least the legal minimum wage or above</li>
  <li>Overtime must be voluntary and compensated</li>
  <li>Maximum 48 regular hours per week</li>
  <li>Workers must receive written employment terms</li>
</ul>

<h3>Health & Safety</h3>
<ul>
  <li>Provide Personal Protective Equipment (PPE) for pesticide handling</li>
  <li>First aid kit available at the farm</li>
  <li>Training on safe use of chemicals and equipment</li>
  <li>Access to clean drinking water and sanitary facilities</li>
  <li>No discrimination based on gender, ethnicity, religion, or disability</li>
</ul>

<div class="highlight-box">
  <strong>Slow Forest Policy:</strong> Slow Forest upholds a strict no child labor and fair wages policy across all operations. Report any concerns to your supervisor immediately.
</div>`,

      vi: `<h2>Bảo vệ Quyền lợi Người lao động</h2>
<p>Tiêu chuẩn RA 2020 <strong>nhấn mạnh mạnh mẽ về điều kiện xã hội và lao động</strong>.</p>

<h3>Không Lao động Trẻ em</h3>
<div class="danger-box">
  <strong>Không khoan nhượng:</strong> Không trẻ em dưới 15 tuổi được tuyển dụng. Trẻ từ 15-17 chỉ làm việc nhẹ, không nguy hiểm.
</div>
<ul>
  <li>Lưu hồ sơ tất cả công nhân với bằng chứng tuổi</li>
  <li>Không làm việc nguy hiểm cho người dưới 18 tuổi</li>
</ul>

<h3>Không Lao động Cưỡng bức</h3>
<ul>
  <li>Mọi việc làm phải tự nguyện</li>
  <li>Không giữ giấy tờ tùy thân</li>
</ul>

<h3>Lương Công bằng</h3>
<ul>
  <li>Trả ít nhất lương tối thiểu theo luật</li>
  <li>Tối đa 48 giờ/tuần</li>
  <li>Trang bị bảo hộ lao động (PPE) khi xử lý thuốc trừ sâu</li>
</ul>

<h3>Sức khỏe & An toàn</h3>
<ul>
  <li>Cung cấp Thiết bị Bảo hộ Cá nhân (PPE) miễn phí</li>
  <li>Luôn có bộ sơ cứu tại nông trại</li>
  <li>Đào tạo về sử dụng hóa chất và thiết bị an toàn</li>
  <li>Tiếp cận nước uống sạch và nhà vệ sinh</li>
  <li>Không phân biệt đối xử dựa trên giới tính, sắc tộc hoặc tôn giáo</li>
</ul>

<div class="highlight-box">
  <strong>Chính sách Slow Forest:</strong> Slow Forest tuân thủ nghiêm ngặt chính sách không lao động trẻ em và lương công bằng. Báo cáo ngay mọi vi phạm cho điều phối viên.
</div>
`,

      lo: `<h2>ການປົກປ້ອງສິດທິຂອງຜູ້ອອກແຮງງານ</h2>
<p>ມາດຕະຖານ RA 2020 <strong>ເນັ້ນໜັກກ່ຽວກັບສະພາບສັງຄົມ ແລະ ແຮງງານ</strong>.</p>

<h3>ບໍ່ມີແຮງງານເດັກ</h3>
<div class="danger-box">
  <strong>ບໍ່ອົດທົນ:</strong> ບໍ່ມີເດັກນ້ອຍອາຍຸຕ່ຳກວ່າ 15 ປີ. ເດັກອາຍຸ 15-17 ເຮັດວຽກເບົາເທົ່ານັ້ນ.
</div>

<h3>ບໍ່ມີແຮງງານບັງຄັບ</h3>
<ul>
  <li>ການຈ້າງງານທັງໝົດຕ້ອງເປັນແບບສະໝັກໃຈ</li>
  <li>ບໍ່ເກັບຮັກສາເອກະສານສ່ວນຕົວ</li>
</ul>

<h3>ຄ່າຈ້າງທີ່ເປັນທຳ</h3>
<ul>
  <li>ຈ່າຍຢ່າງໜ້ອຍຄ່າຈ້າງຂັ້ນຕ່ຳຕາມກົດໝາຍ</li>
  <li>ສະໜອງອຸປະກອນປ້ອງກັນ (PPE)</li>
</ul>`,

      id: `<h2>Melindungi Hak Pekerja</h2>
<p>Standar RA 2020 <strong>menekankan kondisi sosial dan ketenagakerjaan</strong>.</p>

<h3>Tanpa Pekerja Anak</h3>
<div class="danger-box">
  <strong>Toleransi Nol:</strong> Tidak ada anak di bawah 15 tahun yang boleh dipekerjakan.
</div>

<h3>Tanpa Kerja Paksa</h3>
<ul>
  <li>Semua pekerjaan harus sukarela</li>
  <li>Tidak ada penahanan dokumen identitas</li>
</ul>

<h3>Upah Layak</h3>
<ul>
  <li>Bayar minimal upah minimum sesuai hukum</li>
  <li>Maksimal 48 jam/minggu</li>
  <li>Sediakan APD untuk penanganan pestisida</li>
</ul>`,
    },
  },

  // ─── Article 4: Environmental Requirements ───
  {
    id: 'ra-environment',
    type: 'ra',
    icon: 'Leaf',
    category: 'guidance',
    title: {
      en: 'Environmental Requirements',
      vi: 'Yêu cầu về Môi trường',
      lo: 'ຂໍ້ກຳນົດດ້ານສິ່ງແວດລ້ອມ',
      id: 'Persyaratan Lingkungan',
    },
    summary: {
      en: 'RA environmental standards: no deforestation, biodiversity protection, water management, soil conservation, integrated pest management, and waste handling.',
      vi: 'Tiêu chuẩn môi trường RA: không phá rừng, bảo vệ đa dạng sinh học, quản lý nước, bảo tồn đất, quản lý dịch hại tổng hợp.',
      lo: 'ມາດຕະຖານສິ່ງແວດລ້ອມ RA: ບໍ່ທຳລາຍປ່າ, ປົກປ້ອງຊີວະນາໆພັນ, ຄຸ້ມຄອງນ້ຳ, ອະນຸລັກດິນ.',
      id: 'Standar lingkungan RA: tanpa deforestasi, perlindungan keanekaragaman hayati, pengelolaan air, konservasi tanah.',
    },
    content: {
      en: `<h2>Zero Deforestation</h2>
<div class="danger-box">
  <strong>Core Requirement:</strong> No deforestation or degradation of any natural ecosystem after January 1, 2014. This applies to all farms, regardless of size.
</div>
<p>Farms must not convert natural forests, wetlands, or other natural ecosystems into agricultural land. This cutoff date aligns with the EUDR requirements.</p>

<h3>Biodiversity Protection</h3>
<ul>
  <li>Identify and protect High Conservation Value (HCV) areas on or near the farm</li>
  <li>Maintain native vegetation along waterways and on steep slopes</li>
  <li>Create or maintain wildlife corridors between forest patches</li>
  <li>Do not hunt, capture, or trade endangered species</li>
  <li>Minimize habitat disruption during farm operations</li>
</ul>

<h3>Water Management</h3>
<ul>
  <li>Maintain buffer zones of at least 5m along streams and rivers</li>
  <li>Prevent contamination of water sources from agrochemicals</li>
  <li>Reduce water usage in processing (wet mills, washing stations)</li>
  <li>Proper wastewater treatment before discharge</li>
</ul>

<h3>Soil Conservation</h3>
<ul>
  <li>Use cover crops, mulching, and contour planting on slopes</li>
  <li>Prevent erosion through terracing and drainage management</li>
  <li>Regular soil testing and nutrient management</li>
  <li>Promote composting and organic matter return</li>
</ul>

<h3>Integrated Pest Management (IPM)</h3>
<p>IPM is a core principle requiring:</p>
<ul>
  <li>Prevention first: healthy plants resist pests naturally</li>
  <li>Monitoring: regular scouting for pests and diseases</li>
  <li>Biological controls before chemical ones</li>
  <li>No WHO Class Ia/Ib (highly hazardous) pesticides</li>
  <li>Proper storage, handling, and disposal of all chemicals</li>
</ul>

<div class="highlight-box">
  <strong>Slow Forest Practice:</strong> Our farms prioritize shade-grown agroforestry systems that naturally support biodiversity and reduce pest pressure.
</div>`,

      vi: `<h2>Không phá rừng</h2>
<div class="danger-box">
  <strong>Yêu cầu cốt lõi:</strong> Không phá rừng sau ngày 1 tháng 1 năm 2014.
</div>

<h3>Bảo vệ Đa dạng Sinh học</h3>
<ul>
  <li>Xác định và bảo vệ khu vực Giá trị Bảo tồn Cao (HCV)</li>
  <li>Duy trì thảm thực vật ven suối và đất dốc</li>
  <li>Không săn bắt hoặc buôn bán loài nguy cấp</li>
</ul>

<h3>Quản lý Nước</h3>
<ul>
  <li>Duy trì vùng đệm ít nhất 5m dọc suối</li>
  <li>Ngăn ô nhiễm nguồn nước từ hóa chất</li>
</ul>

<h3>Bảo tồn Đất</h3>
<ul>
  <li>Sử dụng cây phủ đất, phủ rơm, trồng theo đường đồng mức</li>
  <li>Xét nghiệm đất định kỳ</li>
</ul>

<h3>Quản lý Dịch hại Tổng hợp (IPM)</h3>
<ul>
  <li>Phòng ngừa trước: cây khỏe chống sâu bệnh tự nhiên</li>
  <li>Không sử dụng thuốc trừ sâu WHO Class Ia/Ib</li>
</ul>`,

      lo: `<h2>ບໍ່ທຳລາຍປ່າ</h2>
<div class="danger-box">
  <strong>ຂໍ້ກຳນົດຫຼັກ:</strong> ບໍ່ມີການທຳລາຍປ່າຫຼັງ 1 ມັງກອນ 2014.
</div>

<h3>ການປົກປ້ອງຊີວະນາໆພັນ</h3>
<ul>
  <li>ປົກປ້ອງພື້ນທີ່ມູນຄ່າການອະນຸລັກສູງ</li>
  <li>ບໍ່ລ່າສັດ ຫຼື ຄ້າສັດໃກ້ສູນພັນ</li>
</ul>

<h3>ການຄຸ້ມຄອງນ້ຳ</h3>
<ul>
  <li>ຮັກສາເຂດກັນຊົນຢ່າງໜ້ອຍ 5 ແມັດ</li>
  <li>ປ້ອງກັນການປົນເປື້ອນແຫຼ່ງນ້ຳ</li>
</ul>

<h3>ການຄຸ້ມຄອງສັດຕູພືດແບບປະສົມປະສານ (IPM)</h3>
<ul>
  <li>ການປ້ອງກັນກ່ອນ</li>
  <li>ບໍ່ໃຊ້ຢາຂ້າແມງໄມ້ WHO Class Ia/Ib</li>
</ul>`,

      id: `<h2>Nol Deforestasi</h2>
<div class="danger-box">
  <strong>Persyaratan Inti:</strong> Tidak ada deforestasi setelah 1 Januari 2014.
</div>

<h3>Perlindungan Keanekaragaman Hayati</h3>
<ul>
  <li>Lindungi area Nilai Konservasi Tinggi (HCV)</li>
  <li>Jangan berburu atau memperdagangkan spesies terancam</li>
</ul>

<h3>Pengelolaan Air</h3>
<ul>
  <li>Pertahankan zona penyangga minimal 5m</li>
  <li>Cegah kontaminasi sumber air</li>
</ul>

<h3>Pengendalian Hama Terpadu (IPM)</h3>
<ul>
  <li>Pencegahan terlebih dahulu</li>
  <li>Tidak menggunakan pestisida WHO Kelas Ia/Ib</li>
</ul>`,
    },
  },

  // ─── Article 5: FAQ ───
  {
    id: 'ra-faq',
    type: 'ra',
    icon: 'HelpCircle',
    category: 'faq',
    title: {
      en: 'RA Certification FAQ for Slow Forest Farmers',
      vi: 'Câu hỏi thường gặp về Chứng nhận RA cho Nông dân Slow Forest',
      lo: 'ຄຳຖາມທີ່ຖາມເລື້ອຍໆກ່ຽວກັບ RA ສຳລັບຊາວກະສິກອນ Slow Forest',
      id: 'FAQ Sertifikasi RA untuk Petani Slow Forest',
    },
    summary: {
      en: 'Common questions about RA certification process, costs, timeline, internal audits, group certification, and Slow Forest support.',
      vi: 'Câu hỏi phổ biến về quy trình chứng nhận RA, chi phí, thời gian, kiểm tra nội bộ, chứng nhận nhóm.',
      lo: 'ຄຳຖາມທົ່ວໄປກ່ຽວກັບຂະບວນການຢັ້ງຢືນ RA, ຄ່າໃຊ້ຈ່າຍ, ໄລຍະເວລາ, ການກວດສອບພາຍໃນ.',
      id: 'Pertanyaan umum tentang proses sertifikasi RA, biaya, timeline, audit internal.',
    },
    content: {
      en: `<h2>Frequently Asked Questions</h2>

<h3>1. What is group certification?</h3>
<p>Group certification allows smallholder farmers to be certified collectively under a single certificate managed by the group administrator (Slow Forest). Individual farmers do not need their own separate certificates. The group is responsible for ensuring all members comply with RA standards through an Internal Management System (IMS).</p>

<h3>2. How long does certification take?</h3>
<p>The initial certification process typically takes <strong>6-12 months</strong>, including:</p>
<ul>
  <li>Training of farmers and internal inspectors (2-3 months)</li>
  <li>Implementation of requirements at farm level (3-6 months)</li>
  <li>Internal inspection of all farms (1-2 months)</li>
  <li>External audit by Certification Body (1-2 weeks)</li>
</ul>

<h3>3. How much does it cost?</h3>
<p>For group certification with Slow Forest, the costs are managed centrally. Farmers do not pay certification fees directly. Costs include Certification Body audit fees, RA licensing fees, and internal management costs.</p>

<h3>4. What happens during an internal inspection?</h3>
<p>A trained internal inspector visits each farm annually to check compliance with RA requirements. The inspector fills out a checklist covering farm management, social conditions, and environmental practices. This is what the <strong>Internal Audit</strong> tool in this app is designed for.</p>

<h3>5. What if a farm fails the inspection?</h3>
<p>If non-conformities are found:</p>
<ul>
  <li><strong>Minor:</strong> Corrective action within 30-90 days</li>
  <li><strong>Major:</strong> Immediate corrective action required, may result in temporary suspension</li>
  <li><strong>Critical (zero tolerance):</strong> Child labor, forced labor, or deforestation = immediate exclusion from the group</li>
</ul>

<h3>6. Can we have both RA and EU Organic certification?</h3>
<p>Yes. Many Slow Forest farms pursue dual certification. While there is overlap in requirements, EU Organic has additional restrictions on synthetic inputs. The internal inspection can cover both standards simultaneously.</p>

<h3>7. What is the sustainability differential (premium)?</h3>
<p>RA-certified products earn a <strong>sustainability differential</strong>—an additional payment on top of the market price. This premium is managed by Slow Forest and invested back into farmer support programs, training, and community development.</p>

<h3>8. How does Slow Forest support farmers?</h3>
<div class="highlight-box">
  Slow Forest provides: training on RA requirements, free internal inspections, farm improvement support (shade trees, composting), premium management, and this digital Impact Management system to track compliance.
</div>`,

      vi: `<h2>Câu hỏi Thường gặp</h2>

<h3>1. Chứng nhận nhóm là gì?</h3>
<p>Chứng nhận nhóm cho phép nông dân nhỏ được chứng nhận tập thể dưới một chứng chỉ do Slow Forest quản lý.</p>

<h3>2. Mất bao lâu để được chứng nhận?</h3>
<p>Quá trình chứng nhận ban đầu mất <strong>6-12 tháng</strong>.</p>

<h3>3. Chi phí bao nhiêu?</h3>
<p>Nông dân không trả phí chứng nhận trực tiếp. Slow Forest quản lý tập trung.</p>

<h3>4. Điều gì xảy ra trong kiểm tra nội bộ?</h3>
<p>Kiểm tra viên nội bộ thăm mỗi nông trại hàng năm để kiểm tra tuân thủ.</p>

<h3>5. Nếu nông trại không đạt?</h3>
<ul>
  <li><strong>Nhỏ:</strong> Hành động khắc phục trong 30-90 ngày</li>
  <li><strong>Lớn:</strong> Hành động ngay lập tức</li>
  <li><strong>Nghiêm trọng:</strong> Loại trừ khỏi nhóm</li>
</ul>

<h3>6. Có thể có cả RA và EU Organic?</h3>
<p>Có. Nhiều nông trại Slow Forest theo đuổi chứng nhận kép.</p>

<h3>7. Premium bền vững là gì?</h3>
<p>Sản phẩm RA nhận được khoản thanh toán bổ sung trên giá thị trường.</p>

<h3>8. Slow Forest hỗ trợ nông dân như thế nào?</h3>
<div class="highlight-box">
  Slow Forest cung cấp: đào tạo, kiểm tra nội bộ miễn phí, hỗ trợ cải thiện nông trại, quản lý premium, và hệ thống quản lý Impact số này.
</div>`,

      lo: `<h2>ຄຳຖາມທີ່ຖາມເລື້ອຍໆ</h2>

<h3>1. ການຢັ້ງຢືນກຸ່ມແມ່ນຫຍັງ?</h3>
<p>ການຢັ້ງຢືນກຸ່ມອະນຸຍາດໃຫ້ຊາວກະສິກອນຂະໜາດນ້ອຍໄດ້ຮັບການຢັ້ງຢືນຮ່ວມກັນ ພາຍໃຕ້ການຄຸ້ມຄອງຂອງ Slow Forest.</p>

<h3>2. ໃຊ້ເວລາດົນປານໃດ?</h3>
<p>ຂະບວນການຢັ້ງຢືນເບື້ອງຕົ້ນໃຊ້ເວລາ <strong>6-12 ເດືອນ</strong>.</p>

<h3>3. ຄ່າໃຊ້ຈ່າຍເທົ່າໃດ?</h3>
<p>ຊາວກະສິກອນບໍ່ຈ່າຍຄ່າທຳນຽມໂດຍກົງ.</p>

<h3>4. ຫາກນາໄຮ່ບໍ່ຜ່ານ?</h3>
<ul>
  <li><strong>ເລັກນ້ອຍ:</strong> ແກ້ໄຂພາຍໃນ 30-90 ມື້</li>
  <li><strong>ໃຫຍ່:</strong> ແກ້ໄຂທັນທີ</li>
  <li><strong>ຮ້າຍແຮງ:</strong> ຖືກຍົກເລີກຈາກກຸ່ມ</li>
</ul>

<h3>5. Slow Forest ຊ່ວຍເຫຼືອແນວໃດ?</h3>
<div class="highlight-box">
  Slow Forest ສະໜອງ: ການຝຶກອົບຮົມ, ການກວດສອບພາຍໃນຟຣີ, ການສະໜັບສະໜູນ, ແລະ ລະບົບ Impact ດິຈິຕອນນີ້.
</div>`,

      id: `<h2>Pertanyaan yang Sering Diajukan</h2>

<h3>1. Apa itu sertifikasi kelompok?</h3>
<p>Sertifikasi kelompok memungkinkan petani kecil disertifikasi bersama di bawah pengelolaan Slow Forest.</p>

<h3>2. Berapa lama prosesnya?</h3>
<p>Proses sertifikasi awal memakan waktu <strong>6-12 bulan</strong>.</p>

<h3>3. Berapa biayanya?</h3>
<p>Petani tidak membayar biaya sertifikasi langsung.</p>

<h3>4. Jika pertanian gagal?</h3>
<ul>
  <li><strong>Minor:</strong> Perbaikan dalam 30-90 hari</li>
  <li><strong>Mayor:</strong> Tindakan segera</li>
  <li><strong>Kritis:</strong> Pengecualian dari kelompok</li>
</ul>

<h3>5. Bagaimana Slow Forest mendukung petani?</h3>
<div class="highlight-box">
  Slow Forest menyediakan: pelatihan, inspeksi internal gratis, dukungan perbaikan pertanian, dan sistem Impact digital ini.
</div>`,
    },
  },
];
