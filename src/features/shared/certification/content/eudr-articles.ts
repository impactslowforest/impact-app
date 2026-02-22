import type { CertArticle } from './ra-articles';

export const EUDR_ARTICLES: CertArticle[] = [
  // ─── Article 1: EUDR Overview ───
  {
    id: 'eudr-overview',
    type: 'eudr',
    icon: 'Leaf',
    category: 'standard',
    title: {
      en: 'EU Deforestation Regulation (EUDR) — Overview',
      vi: 'Quy định Chống phá rừng của EU (EUDR) — Tổng quan',
      lo: 'ລະບຽບການຕ້ານການທຳລາຍປ່າຂອງ EU (EUDR) — ພາບລວມ',
      id: 'Regulasi Deforestasi UE (EUDR) — Gambaran Umum',
    },
    summary: {
      en: 'Overview of the EU Deforestation Regulation (EU 2023/1115): scope, commodities covered, key dates, and what it means for Slow Forest coffee and cacao supply chains.',
      vi: 'Tổng quan về Quy định Chống phá rừng của EU (EU 2023/1115): phạm vi, hàng hóa, ngày quan trọng và ý nghĩa đối với chuỗi cung ứng cà phê và ca cao Slow Forest.',
      lo: 'ພາບລວມກ່ຽວກັບລະບຽບການຕ້ານການທຳລາຍປ່າຂອງ EU (EU 2023/1115): ຂອບເຂດ, ສິນຄ້າ, ວັນທີສຳຄັນ ແລະ ຄວາມໝາຍສຳລັບກາເຟ ແລະ ໂກໂກ້ Slow Forest.',
      id: 'Gambaran umum Regulasi Deforestasi UE (EU 2023/1115): cakupan, komoditas, tanggal penting, dan dampaknya bagi rantai pasok kopi dan kakao Slow Forest.',
    },
    content: {
      en: `<h2>What is the EU Deforestation Regulation?</h2>
<p>The <strong>EU Deforestation Regulation (EUDR)</strong>, formally Regulation (EU) 2023/1115, is a landmark European Union law that prohibits placing products linked to deforestation or forest degradation on the EU market. It entered into force on 29 June 2023.</p>

<h2>Which Commodities Are Covered?</h2>
<p>The regulation covers seven key commodities and their derived products:</p>
<ul>
  <li><strong>Coffee</strong> — directly relevant to Slow Forest operations in Laos and Vietnam</li>
  <li><strong>Cocoa (Cacao)</strong> — directly relevant to Slow Forest operations in Indonesia</li>
  <li>Palm oil</li>
  <li>Soy</li>
  <li>Cattle (beef, leather)</li>
  <li>Wood (timber, paper, furniture)</li>
  <li>Rubber</li>
</ul>

<div class="highlight-box">
  <strong>Key Point:</strong> Both <strong>coffee</strong> and <strong>cacao</strong> are covered commodities — meaning all Slow Forest supply chains must comply with EUDR requirements.
</div>

<h2>Core Requirements</h2>
<p>To place covered products on the EU market, operators must ensure:</p>
<ol>
  <li><strong>Deforestation-free:</strong> Products were not produced on land deforested after 31 December 2020</li>
  <li><strong>Legal:</strong> Products were produced in compliance with the laws of the country of production</li>
  <li><strong>Due Diligence:</strong> A due diligence statement must be submitted before placing products on the market</li>
</ol>

<h2>Key Dates</h2>
<ul>
  <li><strong>29 June 2023:</strong> Regulation entered into force</li>
  <li><strong>30 December 2024:</strong> Application date for large operators</li>
  <li><strong>30 June 2025:</strong> Application date for SMEs (small and medium enterprises)</li>
</ul>

<h2>What Does This Mean for Slow Forest?</h2>
<p>Slow Forest must demonstrate that all coffee (Laos, Vietnam) and cacao (Indonesia) exported to EU markets was:</p>
<ul>
  <li>Grown on land that was not deforested after 31 December 2020</li>
  <li>Produced in compliance with local laws (labor, land use, environment)</li>
  <li>Traceable to the specific plots of land where it was produced</li>
</ul>

<div class="warning-box">
  <strong>Important:</strong> Geolocation data (GPS coordinates) for all production plots is mandatory. The Slow Forest Impact app's farm mapping module helps collect this data.
</div>`,

      vi: `<h2>Quy định Chống phá rừng của EU là gì?</h2>
<p><strong>Quy định Chống phá rừng của EU (EUDR)</strong>, chính thức là Quy định (EU) 2023/1115, là luật mang tính bước ngoặt của Liên minh Châu Âu cấm đưa các sản phẩm liên quan đến phá rừng lên thị trường EU.</p>

<h2>Hàng hóa nào được áp dụng?</h2>
<ul>
  <li><strong>Cà phê</strong> — liên quan trực tiếp đến Slow Forest tại Lào và Việt Nam</li>
  <li><strong>Ca cao</strong> — liên quan trực tiếp đến Slow Forest tại Indonesia</li>
  <li>Dầu cọ, Đậu nành, Gia súc, Gỗ, Cao su</li>
</ul>

<h2>Yêu cầu cốt lõi</h2>
<ol>
  <li><strong>Không phá rừng:</strong> Sản phẩm không được sản xuất trên đất bị phá rừng sau 31/12/2020</li>
  <li><strong>Hợp pháp:</strong> Sản xuất tuân thủ luật pháp nước sở tại</li>
  <li><strong>Thẩm định:</strong> Phải nộp báo cáo thẩm định trước khi đưa sản phẩm ra thị trường</li>
</ol>

<div class="highlight-box">
  <strong>Lưu ý:</strong> Dữ liệu vị trí GPS cho tất cả lô đất sản xuất là bắt buộc. Module bản đồ nông trại trong ứng dụng Impact giúp thu thập dữ liệu này.
</div>`,

      lo: `<h2>ລະບຽບການຕ້ານການທຳລາຍປ່າຂອງ EU ແມ່ນຫຍັງ?</h2>
<p><strong>EUDR</strong> ແມ່ນກົດໝາຍຂອງ EU ທີ່ຫ້າມວາງສິນຄ້າທີ່ກ່ຽວຂ້ອງກັບການທຳລາຍປ່າໃສ່ຕະຫຼາດ EU.</p>

<h2>ສິນຄ້າໃດທີ່ຖືກນຳໃຊ້?</h2>
<ul>
  <li><strong>ກາເຟ</strong> — ກ່ຽວຂ້ອງກັບ Slow Forest ໃນລາວ ແລະ ຫວຽດນາມ</li>
  <li><strong>ໂກໂກ້</strong> — ກ່ຽວຂ້ອງກັບ Slow Forest ໃນອິນໂດເນເຊຍ</li>
</ul>

<h2>ຂໍ້ກຳນົດຫຼັກ</h2>
<ol>
  <li><strong>ບໍ່ທຳລາຍປ່າ:</strong> ຜະລິດຕະພັນບໍ່ໄດ້ປູກໃນດິນທີ່ຖືກທຳລາຍປ່າຫຼັງ 31/12/2020</li>
  <li><strong>ຖືກກົດໝາຍ:</strong> ປະຕິບັດຕາມກົດໝາຍຂອງປະເທດຜະລິດ</li>
  <li><strong>ການກວດສອບ:</strong> ຕ້ອງຍື່ນບົດລາຍງານການກວດສອບ</li>
</ol>`,

      id: `<h2>Apa itu Regulasi Deforestasi UE?</h2>
<p><strong>EUDR</strong> adalah undang-undang UE yang melarang penempatan produk terkait deforestasi di pasar UE.</p>

<h2>Komoditas yang Dicakup</h2>
<ul>
  <li><strong>Kopi</strong> — relevan untuk Slow Forest di Laos dan Vietnam</li>
  <li><strong>Kakao</strong> — relevan untuk Slow Forest di Indonesia</li>
</ul>

<h2>Persyaratan Inti</h2>
<ol>
  <li><strong>Bebas deforestasi:</strong> Produk tidak diproduksi di lahan yang dideforestasi setelah 31/12/2020</li>
  <li><strong>Legal:</strong> Diproduksi sesuai hukum negara produksi</li>
  <li><strong>Uji tuntas:</strong> Pernyataan uji tuntas harus diajukan</li>
</ol>`,
    },
  },

  // ─── Article 2: Geolocation & Traceability ───
  {
    id: 'eudr-geolocation',
    type: 'eudr',
    icon: 'Search',
    category: 'guidance',
    title: {
      en: 'EUDR Geolocation & Traceability Requirements',
      vi: 'Yêu cầu Định vị & Truy xuất nguồn gốc EUDR',
      lo: 'ຂໍ້ກຳນົດສະຖານທີ່ ແລະ ການຕິດຕາມ EUDR',
      id: 'Persyaratan Geolokasi & Keterlacakan EUDR',
    },
    summary: {
      en: 'EUDR requires GPS coordinates for all production plots. Guide to collecting geolocation data, polygon mapping, and maintaining traceability from farm to export.',
      vi: 'EUDR yêu cầu tọa độ GPS cho tất cả lô sản xuất. Hướng dẫn thu thập dữ liệu vị trí, lập bản đồ đa giác và duy trì truy xuất nguồn gốc.',
      lo: 'EUDR ຕ້ອງການຈຸດ GPS ສຳລັບທຸກລອດດິນ. ຄູ່ມືການເກັບກຳຂໍ້ມູນສະຖານທີ່ ແລະ ການຕິດຕາມ.',
      id: 'EUDR memerlukan koordinat GPS untuk semua plot produksi. Panduan pengumpulan data geolokasi dan keterlacakan.',
    },
    content: {
      en: `<h2>Why Geolocation Matters</h2>
<p>EUDR requires operators to provide the <strong>geolocation of all plots of land</strong> where commodities were produced. This is the most significant practical requirement for smallholder supply chains like Slow Forest.</p>

<h3>Plot Size Rules</h3>
<ul>
  <li><strong>Plots ≤ 4 hectares:</strong> A single GPS point (latitude, longitude) is sufficient</li>
  <li><strong>Plots &gt; 4 hectares:</strong> A polygon (series of GPS points defining the boundary) is required</li>
</ul>

<div class="highlight-box">
  <strong>Slow Forest Practice:</strong> Most Slow Forest smallholder plots are under 4 hectares, so a single GPS point per farm is typically sufficient. However, collecting polygon data is recommended for future-proofing.
</div>

<h2>Collecting Geolocation Data</h2>
<h3>Using the Impact App</h3>
<p>The Slow Forest Impact app's farm registration module collects:</p>
<ul>
  <li>Farm latitude and longitude (auto-captured from device GPS)</li>
  <li>Farm area in hectares</li>
  <li>Plot boundary coordinates (for polygon mapping)</li>
</ul>

<h3>Data Quality Requirements</h3>
<ul>
  <li>Accuracy should be within ±10 meters</li>
  <li>Coordinates must be in WGS84 format (decimal degrees)</li>
  <li>Data must be collected on-site at the actual farm location</li>
  <li>Regular verification visits to confirm accuracy</li>
</ul>

<h2>Traceability Chain</h2>
<p>EUDR requires complete traceability from production to export:</p>
<ol>
  <li><strong>Farm Level:</strong> GPS coordinates + farmer identification + harvest records</li>
  <li><strong>Collection Point:</strong> Lot tracking from farmer to cooperative warehouse</li>
  <li><strong>Processing:</strong> Batch tracking through dry mill processing</li>
  <li><strong>Export:</strong> Due diligence statement linking shipment to source plots</li>
</ol>

<div class="warning-box">
  <strong>Critical:</strong> Mixing EUDR-compliant and non-compliant coffee/cacao in the same lot makes the entire lot non-compliant. Maintain physical separation throughout the supply chain.
</div>

<h2>Linking to Satellite Data</h2>
<p>The EU Information System will cross-reference provided GPS coordinates with satellite imagery to verify that no deforestation occurred after 31 December 2020. Ensure your geolocation data is accurate to avoid false flags.</p>`,

      vi: `<h2>Tại sao Định vị quan trọng</h2>
<p>EUDR yêu cầu cung cấp <strong>vị trí GPS của tất cả lô đất</strong> nơi sản xuất hàng hóa.</p>

<h3>Quy tắc kích thước lô</h3>
<ul>
  <li><strong>Lô ≤ 4 ha:</strong> Một điểm GPS duy nhất là đủ</li>
  <li><strong>Lô &gt; 4 ha:</strong> Cần đa giác (polygon) ranh giới</li>
</ul>

<h2>Thu thập dữ liệu</h2>
<ul>
  <li>Độ chính xác trong phạm vi ±10 mét</li>
  <li>Tọa độ WGS84 (độ thập phân)</li>
  <li>Thu thập tại vị trí thực tế của nông trại</li>
</ul>

<h2>Chuỗi truy xuất</h2>
<ol>
  <li><strong>Nông trại:</strong> GPS + nhận dạng nông dân + hồ sơ thu hoạch</li>
  <li><strong>Điểm thu gom:</strong> Theo dõi lô từ nông dân đến kho</li>
  <li><strong>Chế biến:</strong> Theo dõi mẻ qua xay khô</li>
  <li><strong>Xuất khẩu:</strong> Báo cáo thẩm định liên kết với lô nguồn</li>
</ol>

<div class="warning-box">
  <strong>Quan trọng:</strong> Trộn lẫn cà phê tuân thủ và không tuân thủ EUDR sẽ làm toàn bộ lô không đạt yêu cầu.
</div>`,

      lo: `<h2>ເປັນຫຍັງການລະບຸສະຖານທີ່ຈຶ່ງສຳຄັນ</h2>
<p>EUDR ຕ້ອງການ <strong>ຈຸດ GPS ຂອງທຸກລອດດິນ</strong> ທີ່ຜະລິດສິນຄ້າ.</p>

<h3>ກົດລະບຽບຂະໜາດລອດ</h3>
<ul>
  <li><strong>ລອດ ≤ 4 ເຮັກຕາ:</strong> ຈຸດ GPS ດຽວພຽງພໍ</li>
  <li><strong>ລອດ &gt; 4 ເຮັກຕາ:</strong> ຕ້ອງການ polygon</li>
</ul>

<h2>ການຕິດຕາມ</h2>
<ol>
  <li><strong>ນາໄຮ່:</strong> GPS + ບັດປະຈຳຕົວ + ບັນທຶກເກັບກ່ຽວ</li>
  <li><strong>ສາງ:</strong> ຕິດຕາມລອດ</li>
  <li><strong>ແປຮູບ:</strong> ຕິດຕາມແບດ</li>
  <li><strong>ສົ່ງອອກ:</strong> ລາຍງານການກວດສອບ</li>
</ol>`,

      id: `<h2>Mengapa Geolokasi Penting</h2>
<p>EUDR memerlukan <strong>koordinat GPS semua plot tanah</strong> tempat komoditas diproduksi.</p>

<h3>Aturan Ukuran Plot</h3>
<ul>
  <li><strong>Plot ≤ 4 ha:</strong> Satu titik GPS cukup</li>
  <li><strong>Plot &gt; 4 ha:</strong> Diperlukan polygon batas</li>
</ul>

<h2>Rantai Keterlacakan</h2>
<ol>
  <li><strong>Pertanian:</strong> GPS + identifikasi petani + catatan panen</li>
  <li><strong>Gudang:</strong> Pelacakan lot</li>
  <li><strong>Pengolahan:</strong> Pelacakan batch</li>
  <li><strong>Ekspor:</strong> Pernyataan uji tuntas</li>
</ol>`,
    },
  },

  // ─── Article 3: Due Diligence Process ───
  {
    id: 'eudr-due-diligence',
    type: 'eudr',
    icon: 'ClipboardCheck',
    category: 'checklist',
    title: {
      en: 'EUDR Due Diligence Process — Step-by-Step',
      vi: 'Quy trình Thẩm định EUDR — Từng bước',
      lo: 'ຂະບວນການກວດສອບ EUDR — ຂັ້ນຕອນ',
      id: 'Proses Uji Tuntas EUDR — Langkah demi Langkah',
    },
    summary: {
      en: 'Step-by-step guide to the EUDR due diligence process: information collection, risk assessment, risk mitigation, and due diligence statement submission.',
      vi: 'Hướng dẫn từng bước quy trình thẩm định EUDR: thu thập thông tin, đánh giá rủi ro, giảm thiểu rủi ro, nộp báo cáo thẩm định.',
      lo: 'ຄູ່ມືຂັ້ນຕອນການກວດສອບ EUDR: ເກັບກຳຂໍ້ມູນ, ປະເມີນຄວາມສ່ຽງ, ຫຼຸດຜ່ອນຄວາມສ່ຽງ, ຍື່ນບົດລາຍງານ.',
      id: 'Panduan langkah demi langkah proses uji tuntas EUDR: pengumpulan informasi, penilaian risiko, mitigasi risiko, pengajuan pernyataan.',
    },
    content: {
      en: `<h2>The Three Steps of Due Diligence</h2>
<p>EUDR due diligence is a three-step process that must be completed <strong>before</strong> placing covered products on the EU market.</p>

<h3>Step 1: Information Collection</h3>
<p>Gather and maintain the following for each shipment:</p>
<ul>
  <li><strong>Product description:</strong> Type, quantity, trade name</li>
  <li><strong>Country of production</strong></li>
  <li><strong>Geolocation:</strong> GPS coordinates of all production plots</li>
  <li><strong>Supplier information:</strong> Names, addresses of all actors in the chain</li>
  <li><strong>Date or time range of production</strong></li>
  <li><strong>Evidence of legality:</strong> Documents proving compliance with local laws</li>
  <li><strong>Evidence of deforestation-free status:</strong> Satellite imagery, land use records</li>
</ul>

<h3>Step 2: Risk Assessment</h3>
<p>Evaluate the risk that products in the supply chain are linked to deforestation or illegality:</p>
<ul>
  <li>Is the country/region classified as high, standard, or low risk by the EU?</li>
  <li>Are there known deforestation patterns in the production area?</li>
  <li>Is there evidence of land conflicts or illegal land conversion?</li>
  <li>Are suppliers certified under recognized schemes (RA, EU Organic)?</li>
  <li>Is the geolocation data accurate and verified?</li>
</ul>

<div class="highlight-box">
  <strong>Risk Classification:</strong> The EU assigns risk categories to producing countries. Laos, Vietnam, and Indonesia may be classified differently. Check the latest EU benchmarking data.
</div>

<h3>Step 3: Risk Mitigation</h3>
<p>If risks are identified, take adequate measures to reduce them:</p>
<ul>
  <li>Request additional documentation from suppliers</li>
  <li>Conduct independent verification (site visits, satellite analysis)</li>
  <li>Commission third-party audits</li>
  <li>Implement additional monitoring systems</li>
  <li>If risk cannot be adequately mitigated → do not place product on EU market</li>
</ul>

<h2>Due Diligence Statement</h2>
<p>After completing due diligence, submit a <strong>Due Diligence Statement</strong> through the EU Information System. This statement confirms:</p>
<ul>
  <li>Due diligence was performed</li>
  <li>No or only negligible risk was found</li>
  <li>Products are deforestation-free and legally produced</li>
</ul>

<div class="warning-box">
  <strong>Penalties:</strong> Non-compliance can result in fines up to 4% of the operator's total annual EU turnover, product confiscation, and temporary market exclusion.
</div>`,

      vi: `<h2>Ba bước Thẩm định</h2>

<h3>Bước 1: Thu thập Thông tin</h3>
<ul>
  <li>Mô tả sản phẩm, số lượng</li>
  <li>Nước sản xuất</li>
  <li>Tọa độ GPS của lô sản xuất</li>
  <li>Thông tin nhà cung cấp</li>
  <li>Bằng chứng hợp pháp và không phá rừng</li>
</ul>

<h3>Bước 2: Đánh giá Rủi ro</h3>
<ul>
  <li>Phân loại rủi ro quốc gia/khu vực</li>
  <li>Kiểm tra mẫu phá rừng trong vùng sản xuất</li>
  <li>Xác minh dữ liệu GPS</li>
</ul>

<h3>Bước 3: Giảm thiểu Rủi ro</h3>
<ul>
  <li>Yêu cầu tài liệu bổ sung</li>
  <li>Xác minh độc lập</li>
  <li>Kiểm toán bên thứ ba</li>
</ul>

<div class="warning-box">
  <strong>Hình phạt:</strong> Phạt đến 4% doanh thu EU hàng năm, tịch thu sản phẩm, loại trừ thị trường tạm thời.
</div>`,

      lo: `<h2>ສາມຂັ້ນຕອນຂອງການກວດສອບ</h2>

<h3>ຂັ້ນຕອນ 1: ເກັບກຳຂໍ້ມູນ</h3>
<ul>
  <li>ລາຍລະອຽດສິນຄ້າ, ຈຳນວນ</li>
  <li>ປະເທດຜະລິດ</li>
  <li>ຈຸດ GPS ຂອງລອດດິນ</li>
</ul>

<h3>ຂັ້ນຕອນ 2: ປະເມີນຄວາມສ່ຽງ</h3>
<ul>
  <li>ການຈັດປະເພດຄວາມສ່ຽງຂອງປະເທດ</li>
  <li>ກວດສອບຂໍ້ມູນ GPS</li>
</ul>

<h3>ຂັ້ນຕອນ 3: ຫຼຸດຜ່ອນຄວາມສ່ຽງ</h3>
<ul>
  <li>ຂໍເອກະສານເພີ່ມເຕີມ</li>
  <li>ກວດສອບອິດສະຫຼະ</li>
</ul>`,

      id: `<h2>Tiga Langkah Uji Tuntas</h2>

<h3>Langkah 1: Pengumpulan Informasi</h3>
<ul>
  <li>Deskripsi produk, kuantitas</li>
  <li>Negara produksi</li>
  <li>Koordinat GPS plot produksi</li>
</ul>

<h3>Langkah 2: Penilaian Risiko</h3>
<ul>
  <li>Klasifikasi risiko negara/wilayah</li>
  <li>Verifikasi data GPS</li>
</ul>

<h3>Langkah 3: Mitigasi Risiko</h3>
<ul>
  <li>Minta dokumentasi tambahan</li>
  <li>Verifikasi independen</li>
</ul>

<div class="warning-box">
  <strong>Sanksi:</strong> Denda hingga 4% omzet UE tahunan, penyitaan produk, pengecualian pasar sementara.
</div>`,
    },
  },

  // ─── Article 4: EUDR FAQ ───
  {
    id: 'eudr-faq',
    type: 'eudr',
    icon: 'HelpCircle',
    category: 'faq',
    title: {
      en: 'EUDR Frequently Asked Questions for Slow Forest',
      vi: 'Câu hỏi thường gặp về EUDR cho Slow Forest',
      lo: 'ຄຳຖາມທີ່ຖາມເລື້ອຍໆກ່ຽວກັບ EUDR ສຳລັບ Slow Forest',
      id: 'FAQ EUDR untuk Slow Forest',
    },
    summary: {
      en: 'Common questions about EUDR compliance: who is responsible, how it relates to RA certification, data requirements, and practical steps for farmer groups.',
      vi: 'Câu hỏi phổ biến về tuân thủ EUDR: ai chịu trách nhiệm, quan hệ với RA, yêu cầu dữ liệu và các bước thực tiễn.',
      lo: 'ຄຳຖາມທົ່ວໄປກ່ຽວກັບການປະຕິບັດ EUDR: ໃຜຮັບຜິດຊອບ, ຄວາມສຳພັນກັບ RA, ແລະ ຂັ້ນຕອນ.',
      id: 'Pertanyaan umum tentang kepatuhan EUDR: siapa yang bertanggung jawab, hubungan dengan RA, dan langkah praktis.',
    },
    content: {
      en: `<h2>Frequently Asked Questions</h2>

<h3>1. Who is responsible for EUDR compliance?</h3>
<p>The <strong>operator</strong> who first places the product on the EU market bears primary responsibility. For Slow Forest, this means the EU-based importer or buyer. However, Slow Forest as a supply chain partner must provide the necessary data and documentation to support compliance.</p>

<h3>2. Does RA or EU Organic certification satisfy EUDR?</h3>
<p>No. EUDR operates independently of voluntary certification schemes. However, RA and EU Organic certification can <strong>support</strong> the due diligence process by providing evidence of good practices. The key EUDR requirements — geolocation and the 2020 cutoff date — go beyond what RA/EU Organic currently requires.</p>

<h3>3. What is the deforestation cutoff date?</h3>
<p>31 December 2020. Products must not come from land that was forest on this date and has since been converted. This is verified using satellite imagery.</p>

<h3>4. What GPS data do I need for each farm?</h3>
<ul>
  <li>For farms ≤ 4 hectares: latitude and longitude (single point)</li>
  <li>For farms &gt; 4 hectares: polygon boundary coordinates</li>
  <li>Accuracy: ±10 meters recommended</li>
  <li>Format: WGS84 decimal degrees</li>
</ul>

<h3>5. What about mixing certified and non-certified coffee?</h3>
<p>Mixing is not allowed. EUDR-compliant and non-compliant products must be physically separated throughout the supply chain. If any non-compliant product enters a lot, the entire lot becomes non-compliant.</p>

<h3>6. How does Slow Forest help with EUDR compliance?</h3>
<div class="highlight-box">
  <p>Slow Forest provides:</p>
  <ul>
    <li><strong>Farm Registration System:</strong> GPS coordinates collected during farm registration</li>
    <li><strong>EUDR Assessment Tool:</strong> Plot-level deforestation risk assessment</li>
    <li><strong>Traceability:</strong> Lot tracking from farmer to export through the warehouse module</li>
    <li><strong>Documentation:</strong> Exportable records for due diligence statements</li>
    <li><strong>Training:</strong> Farmer awareness sessions on EUDR requirements</li>
  </ul>
</div>

<h3>7. What if my farm was forest before 2020?</h3>
<p>If the farm was established by converting forest <strong>after</strong> 31 December 2020, products from that farm <strong>cannot</strong> be sold to the EU market under EUDR. If the farm was established <strong>before</strong> this date, it is compliant (assuming legality requirements are also met).</p>

<h3>8. Will EUDR affect coffee/cacao prices?</h3>
<p>EUDR compliance adds costs to the supply chain (data collection, monitoring, administration). However, compliant products may command premium prices as EU buyers seek verified deforestation-free sources. Slow Forest's existing RA and EU Organic certifications position its products favorably.</p>`,

      vi: `<h2>Câu hỏi Thường gặp</h2>

<h3>1. Ai chịu trách nhiệm tuân thủ EUDR?</h3>
<p>Nhà nhập khẩu EU chịu trách nhiệm chính. Slow Forest cung cấp dữ liệu và tài liệu hỗ trợ.</p>

<h3>2. Chứng nhận RA hoặc EU Organic có đáp ứng EUDR không?</h3>
<p>Không. EUDR hoạt động độc lập nhưng chứng nhận hỗ trợ quá trình thẩm định.</p>

<h3>3. Ngày cắt mốc phá rừng là gì?</h3>
<p>31/12/2020. Sản phẩm không được từ đất bị phá rừng sau ngày này.</p>

<h3>4. Dữ liệu GPS cần gì cho mỗi nông trại?</h3>
<ul>
  <li>≤ 4 ha: 1 điểm GPS</li>
  <li>&gt; 4 ha: polygon ranh giới</li>
  <li>Độ chính xác: ±10 mét</li>
</ul>

<h3>5. Slow Forest hỗ trợ EUDR như thế nào?</h3>
<div class="highlight-box">
  Đăng ký nông trại với GPS, công cụ đánh giá EUDR, truy xuất nguồn gốc, tài liệu xuất khẩu, đào tạo nông dân.
</div>`,

      lo: `<h2>ຄຳຖາມທີ່ຖາມເລື້ອຍໆ</h2>

<h3>1. ໃຜຮັບຜິດຊອບ?</h3>
<p>ຜູ້ນຳເຂົ້າ EU ຮັບຜິດຊອບຫຼັກ. Slow Forest ສະໜອງຂໍ້ມູນ.</p>

<h3>2. RA ຫຼື EU Organic ພຽງພໍບໍ?</h3>
<p>ບໍ່. EUDR ຕ້ອງການເພີ່ມເຕີມຈາກການຢັ້ງຢືນ.</p>

<h3>3. ວັນທີຕັດມອກແມ່ນຫຍັງ?</h3>
<p>31/12/2020.</p>

<h3>4. Slow Forest ຊ່ວຍແນວໃດ?</h3>
<div class="highlight-box">
  ລົງທະບຽນນາໄຮ່ GPS, ເຄື່ອງມືປະເມີນ EUDR, ການຕິດຕາມ, ເອກະສານ.
</div>`,

      id: `<h2>FAQ</h2>

<h3>1. Siapa yang bertanggung jawab?</h3>
<p>Importir UE bertanggung jawab utama. Slow Forest menyediakan data.</p>

<h3>2. Apakah sertifikasi RA/EU Organic cukup?</h3>
<p>Tidak. EUDR memerlukan persyaratan tambahan.</p>

<h3>3. Tanggal batas deforestasi?</h3>
<p>31/12/2020.</p>

<h3>4. Bagaimana Slow Forest membantu?</h3>
<div class="highlight-box">
  Pendaftaran pertanian GPS, alat penilaian EUDR, keterlacakan, dokumentasi, pelatihan.
</div>`,
    },
  },
];
