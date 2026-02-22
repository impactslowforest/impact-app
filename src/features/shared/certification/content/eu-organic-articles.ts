import type { CertArticle } from './ra-articles';

export const EU_ORGANIC_ARTICLES: CertArticle[] = [
  // ─── Article 1: EU Organic Overview ───
  {
    id: 'euo-overview',
    type: 'eu_organic',
    icon: 'Leaf',
    category: 'standard',
    title: {
      en: 'EU Organic Certification — Regulation 2018/848 Overview',
      vi: 'Chứng nhận Hữu cơ EU — Tổng quan Quy định 2018/848',
      lo: 'ການຢັ້ງຢືນກະສິກຳອິນຊີ EU — ພາບລວມກົດລະບຽບ 2018/848',
      id: 'Sertifikasi Organik EU — Gambaran Regulasi 2018/848',
    },
    summary: {
      en: 'Overview of EU Organic Regulation 2018/848: principles of organic farming, the EU organic logo, scope for coffee and cacao, and market access benefits.',
      vi: 'Tổng quan Quy định Hữu cơ EU 2018/848: nguyên tắc canh tác hữu cơ, logo hữu cơ EU, phạm vi cho cà phê và ca cao.',
      lo: 'ພາບລວມກົດລະບຽບອິນຊີ EU 2018/848: ຫຼັກການກະສິກຳອິນຊີ, ໂລໂກ້ EU, ຂອບເຂດສຳລັບກາເຟ ແລະ ໂກໂກ້.',
      id: 'Gambaran Regulasi Organik EU 2018/848: prinsip pertanian organik, logo EU, cakupan kopi dan kakao.',
    },
    content: {
      en: `<h2>What is EU Organic Certification?</h2>
<p><strong>EU Organic certification</strong> verifies that agricultural products are grown and processed according to the European Union's organic farming standards. Products carrying the <strong>EU Organic logo</strong> (the green leaf made of stars) meet strict requirements on natural inputs, no synthetic chemicals, and environmental sustainability.</p>

<h2>Regulation (EU) 2018/848</h2>
<p>This regulation, effective from January 1, 2022, replaced the previous Regulation 834/2007. Key changes include:</p>
<ul>
  <li>Stricter controls on imports from third countries</li>
  <li>Group certification rules for smallholder farmer groups</li>
  <li>Enhanced traceability requirements</li>
  <li>New rules for organic seeds and plant reproductive material</li>
</ul>

<div class="highlight-box">
  <strong>Key Principles of Organic Farming:</strong>
  <ul>
    <li>No synthetic pesticides or herbicides</li>
    <li>No synthetic fertilizers — only organic-approved inputs</li>
    <li>No GMOs (genetically modified organisms)</li>
    <li>Biodiversity conservation and ecological balance</li>
    <li>Soil health through natural processes</li>
  </ul>
</div>

<h2>Scope: Coffee & Cacao</h2>
<p>EU Organic certification applies to all stages of coffee and cacao production:</p>
<ul>
  <li><strong>Farm level:</strong> Growing, harvesting, post-harvest processing</li>
  <li><strong>Processing:</strong> Drying, hulling, roasting, grinding</li>
  <li><strong>Trading:</strong> Storage, transport, export</li>
</ul>

<h2>Market Benefits</h2>
<ul>
  <li>Access to the EU organic market (worth over EUR 50 billion)</li>
  <li>Premium prices — organic coffee/cacao commands 15-30% above conventional</li>
  <li>Growing consumer demand for certified organic products</li>
  <li>Enhanced brand reputation and buyer trust</li>
</ul>

<div class="warning-box">
  <strong>Note:</strong> Products can only carry the EU Organic logo if certified by an EU-recognized control body. Slow Forest works with accredited certification bodies for all three countries.
</div>`,

      vi: `<h2>Chứng nhận Hữu cơ EU là gì?</h2>
<p><strong>Chứng nhận Hữu cơ EU</strong> xác minh sản phẩm nông nghiệp được trồng và chế biến theo tiêu chuẩn hữu cơ của Liên minh Châu Âu. Sản phẩm mang <strong>logo Hữu cơ EU</strong> (lá xanh làm từ sao) đáp ứng yêu cầu nghiêm ngặt.</p>

<h2>Quy định (EU) 2018/848</h2>
<p>Có hiệu lực từ 1/1/2022, thay thế Quy định 834/2007:</p>
<ul>
  <li>Kiểm soát chặt chẽ hơn đối với nhập khẩu</li>
  <li>Quy tắc chứng nhận nhóm cho hộ nông dân nhỏ</li>
  <li>Yêu cầu truy xuất nguồn gốc nâng cao</li>
</ul>

<div class="highlight-box">
  <strong>Nguyên tắc chính:</strong> Không thuốc trừ sâu tổng hợp, không phân bón tổng hợp, không GMO, bảo tồn đa dạng sinh học, sức khỏe đất qua quy trình tự nhiên.
</div>

<h2>Lợi ích Thị trường</h2>
<ul>
  <li>Tiếp cận thị trường hữu cơ EU (trị giá hơn 50 tỷ EUR)</li>
  <li>Giá premium 15-30% cao hơn sản phẩm thông thường</li>
  <li>Nhu cầu tiêu dùng ngày càng tăng</li>
</ul>`,

      lo: `<h2>ການຢັ້ງຢືນອິນຊີ EU ແມ່ນຫຍັງ?</h2>
<p><strong>ການຢັ້ງຢືນອິນຊີ EU</strong> ຢັ້ງຢືນວ່າຜະລິດຕະພັນກະສິກຳປູກ ແລະ ປຸງແຕ່ງຕາມມາດຕະຖານກະສິກຳອິນຊີຂອງ EU.</p>

<h2>ກົດລະບຽບ 2018/848</h2>
<ul>
  <li>ການຄວບຄຸມທີ່ເຂັ້ມງວດຂຶ້ນ</li>
  <li>ກົດລະບຽບການຢັ້ງຢືນກຸ່ມ</li>
  <li>ຂໍ້ກຳນົດການຕິດຕາມທີ່ປັບປຸງ</li>
</ul>

<div class="highlight-box">
  <strong>ຫຼັກການ:</strong> ບໍ່ມີຢາຂ້າແມງໄມ້ສັງເຄາະ, ບໍ່ມີຝຸ່ນສັງເຄາະ, ບໍ່ມີ GMO.
</div>

<h2>ຜົນປະໂຫຍດ</h2>
<ul>
  <li>ເຂົ້າເຖິງຕະຫຼາດອິນຊີ EU</li>
  <li>ລາຄາ premium 15-30% ສູງກວ່າ</li>
</ul>`,

      id: `<h2>Apa itu Sertifikasi Organik EU?</h2>
<p><strong>Sertifikasi Organik EU</strong> memverifikasi bahwa produk pertanian ditanam dan diproses sesuai standar pertanian organik Uni Eropa.</p>

<h2>Regulasi 2018/848</h2>
<ul>
  <li>Kontrol lebih ketat atas impor</li>
  <li>Aturan sertifikasi kelompok</li>
  <li>Persyaratan ketertelusuran yang ditingkatkan</li>
</ul>

<div class="highlight-box">
  <strong>Prinsip:</strong> Tanpa pestisida sintetis, tanpa pupuk sintetis, tanpa GMO, konservasi keanekaragaman hayati.
</div>

<h2>Manfaat Pasar</h2>
<ul>
  <li>Akses ke pasar organik EU (senilai lebih dari EUR 50 miliar)</li>
  <li>Harga premium 15-30% lebih tinggi</li>
</ul>`,
    },
  },

  // ─── Article 2: Conversion ───
  {
    id: 'euo-conversion',
    type: 'eu_organic',
    icon: 'Clock',
    category: 'guidance',
    title: {
      en: 'Conversion Requirements & Timeline',
      vi: 'Yêu cầu Chuyển đổi & Lộ trình',
      lo: 'ຂໍ້ກຳນົດການປ່ຽນ ແລະ ໄລຍະເວລາ',
      id: 'Persyaratan Konversi & Timeline',
    },
    summary: {
      en: 'How to transition from conventional to organic: 3-year conversion period for perennial crops, record keeping, milestones, and retroactive recognition.',
      vi: 'Chuyển đổi từ thông thường sang hữu cơ: thời gian chuyển đổi 3 năm cho cây lâu năm, lưu trữ hồ sơ.',
      lo: 'ການປ່ຽນຈາກທຳມະດາເປັນອິນຊີ: ໄລຍະ 3 ປີ ສຳລັບພືດຫຼາຍປີ.',
      id: 'Transisi dari konvensional ke organik: periode konversi 3 tahun untuk tanaman tahunan.',
    },
    content: {
      en: `<h2>The Conversion Period</h2>
<p>Before a farm can sell products as "organic," it must complete a <strong>conversion period</strong> during which organic practices are followed but the product cannot yet be labeled as organic.</p>

<h3>Duration</h3>
<ul>
  <li><strong>Perennial crops</strong> (coffee, cacao): <strong>3 years</strong> before harvest</li>
  <li><strong>Annual crops:</strong> 2 years before sowing</li>
  <li><strong>Grassland/forage:</strong> 2 years before use as organic feed</li>
</ul>

<div class="highlight-box">
  <strong>Key Point:</strong> During conversion, you must follow ALL organic rules, but your product is sold as "in-conversion" (often at a lower premium than fully certified organic).
</div>

<h3>What Farmers Must Do During Conversion</h3>
<ul>
  <li>Stop using ALL synthetic pesticides and fertilizers immediately</li>
  <li>Switch to organic-approved inputs only</li>
  <li>Begin record keeping from day one</li>
  <li>Undergo annual inspections by the control body</li>
  <li>Implement buffer zones between organic and conventional areas</li>
</ul>

<h3>Retroactive Recognition</h3>
<p>In some cases, the conversion period can be <strong>shortened retroactively</strong> if the farmer can demonstrate that no prohibited substances were used for the required period. Evidence may include:</p>
<ul>
  <li>Soil and leaf tissue analysis results</li>
  <li>Declarations from local authorities or village chiefs</li>
  <li>Satellite imagery showing no agricultural changes</li>
  <li>Historical records of traditional farming practices</li>
</ul>

<h3>Conversion Timeline for Slow Forest Farms</h3>
<table style="width:100%; border-collapse:collapse; margin:1rem 0;">
  <tr style="background:#f0f7f1;"><th style="padding:8px; text-align:left; border:1px solid #d9eddb;">Year</th><th style="padding:8px; text-align:left; border:1px solid #d9eddb;">Activities</th></tr>
  <tr><td style="padding:8px; border:1px solid #d9eddb;">Year 1</td><td style="padding:8px; border:1px solid #d9eddb;">Stop chemicals, start organic inputs, ICS registration, first inspection</td></tr>
  <tr><td style="padding:8px; border:1px solid #d9eddb;">Year 2</td><td style="padding:8px; border:1px solid #d9eddb;">Continued organic management, soil improvement, second inspection</td></tr>
  <tr><td style="padding:8px; border:1px solid #d9eddb;">Year 3</td><td style="padding:8px; border:1px solid #d9eddb;">Final conversion year, third inspection, certification application</td></tr>
  <tr style="background:#f0f7f1;"><td style="padding:8px; border:1px solid #d9eddb;">Year 4+</td><td style="padding:8px; border:1px solid #d9eddb;">Fully certified organic — products can carry EU Organic logo</td></tr>
</table>

<div class="warning-box">
  <strong>Warning:</strong> If prohibited substances are found during conversion, the clock resets to zero and the full conversion period must start again.
</div>`,

      vi: `<h2>Thời gian Chuyển đổi</h2>
<p>Trước khi bán sản phẩm "hữu cơ," nông trại phải hoàn thành <strong>thời gian chuyển đổi</strong>.</p>

<h3>Thời hạn</h3>
<ul>
  <li><strong>Cây lâu năm</strong> (cà phê, ca cao): <strong>3 năm</strong></li>
  <li><strong>Cây hàng năm:</strong> 2 năm</li>
</ul>

<h3>Nông dân cần làm gì</h3>
<ul>
  <li>Ngừng sử dụng tất cả thuốc trừ sâu và phân bón tổng hợp</li>
  <li>Chuyển sang đầu vào được phê duyệt hữu cơ</li>
  <li>Bắt đầu lưu trữ hồ sơ từ ngày đầu</li>
  <li>Kiểm tra hàng năm bởi tổ chức kiểm soát</li>
</ul>

<div class="warning-box">
  <strong>Cảnh báo:</strong> Nếu phát hiện chất cấm, đồng hồ reset về 0 và phải bắt đầu lại.
</div>`,

      lo: `<h2>ໄລຍະການປ່ຽນ</h2>
<p>ກ່ອນຂາຍຜະລິດຕະພັນ "ອິນຊີ" ນາໄຮ່ຕ້ອງສຳເລັດ<strong>ໄລຍະການປ່ຽນ</strong>.</p>
<ul>
  <li><strong>ພືດຫຼາຍປີ</strong> (ກາເຟ, ໂກໂກ້): <strong>3 ປີ</strong></li>
  <li><strong>ພືດປະຈຳປີ:</strong> 2 ປີ</li>
</ul>

<h3>ຊາວກະສິກອນຕ້ອງເຮັດ</h3>
<ul>
  <li>ຢຸດໃຊ້ຢາຂ້າແມງໄມ້ ແລະ ຝຸ່ນສັງເຄາະ</li>
  <li>ເລີ່ມບັນທຶກຕັ້ງແຕ່ມື້ທຳອິດ</li>
</ul>`,

      id: `<h2>Periode Konversi</h2>
<p>Sebelum menjual produk "organik," pertanian harus menyelesaikan <strong>periode konversi</strong>.</p>
<ul>
  <li><strong>Tanaman tahunan</strong> (kopi, kakao): <strong>3 tahun</strong></li>
  <li><strong>Tanaman semusim:</strong> 2 tahun</li>
</ul>

<h3>Yang Harus Dilakukan Petani</h3>
<ul>
  <li>Hentikan semua pestisida dan pupuk sintetis</li>
  <li>Beralih ke input yang disetujui organik</li>
  <li>Mulai pencatatan dari hari pertama</li>
</ul>

<div class="warning-box">
  <strong>Peringatan:</strong> Jika ditemukan zat terlarang, waktu direset ke nol.
</div>`,
    },
  },

  // ─── Article 3: Organic Farming Practices ───
  {
    id: 'euo-farming',
    type: 'eu_organic',
    icon: 'Sprout',
    category: 'guidance',
    title: {
      en: 'Organic Farming Practices',
      vi: 'Thực hành Canh tác Hữu cơ',
      lo: 'ການປະຕິບັດກະສິກຳອິນຊີ',
      id: 'Praktik Pertanian Organik',
    },
    summary: {
      en: 'Practical guide to organic farming: prohibited substances, allowed inputs, composting, biological pest control, soil fertility, and buffer zones.',
      vi: 'Hướng dẫn thực hành: chất cấm, đầu vào cho phép, ủ phân, kiểm soát sinh học, độ phì đất, vùng đệm.',
      lo: 'ຄູ່ມືປະຕິບັດ: ສານຕ້ອງຫ້າມ, ປັດໃຈທີ່ອະນຸຍາດ, ການເຮັດຝຸ່ນ, ການຄວບຄຸມຊີວະພາບ.',
      id: 'Panduan praktis: zat terlarang, input yang diizinkan, pengomposan, pengendalian hayati.',
    },
    content: {
      en: `<h2>Prohibited Substances</h2>
<div class="danger-box">
  <strong>Strictly Prohibited in EU Organic:</strong>
  <ul>
    <li>ALL synthetic pesticides and herbicides (e.g., glyphosate, paraquat)</li>
    <li>ALL synthetic fertilizers (e.g., urea, NPK chemical blends)</li>
    <li>Genetically Modified Organisms (GMOs)</li>
    <li>Growth regulators and synthetic hormones</li>
    <li>Sewage sludge as fertilizer</li>
  </ul>
</div>

<h2>Allowed Inputs</h2>
<p>Only inputs approved under EU Organic Annex I and II may be used:</p>
<ul>
  <li><strong>Fertilizers:</strong> Compost, animal manure (composted), bone meal, rock phosphate, wood ash, seaweed extracts</li>
  <li><strong>Pest control:</strong> Neem oil, pyrethrum (natural), Bacillus thuringiensis (Bt), copper compounds (limited), sulfur</li>
  <li><strong>Soil amendments:</strong> Lime (calcium carbonate), gypsum, bentonite clay</li>
</ul>

<div class="highlight-box">
  <strong>Slow Forest Tip:</strong> Our agronomists can help you source approved organic inputs locally. Always check with your field officer before using any new product.
</div>

<h3>Composting</h3>
<p>Composting is the foundation of organic soil fertility:</p>
<ul>
  <li>Use coffee/cacao pulp, pruning residues, animal manure, and green materials</li>
  <li>Compost pile should reach 55-65°C for proper decomposition</li>
  <li>Turn piles every 2-3 weeks for aeration</li>
  <li>Ready compost should be dark, crumbly, and odorless (3-6 months)</li>
</ul>

<h3>Biological Pest Control</h3>
<ul>
  <li>Encourage natural predators (birds, beneficial insects)</li>
  <li>Use pheromone traps for pest monitoring</li>
  <li>Plant companion crops that repel pests</li>
  <li>Remove and destroy infected plant material</li>
  <li>Maintain shade diversity to reduce pest pressure</li>
</ul>

<h3>Buffer Zones</h3>
<p>Buffer zones separate organic from conventional areas:</p>
<ul>
  <li>Minimum <strong>8 meters</strong> from conventional fields using synthetic inputs</li>
  <li>Buffer zone crops cannot be sold as organic</li>
  <li>Physical barriers (hedgerows, ditches) can reduce required width</li>
  <li>Buffer zones also protect waterways — minimum 5m from streams</li>
</ul>`,

      vi: `<h2>Chất cấm</h2>
<div class="danger-box">
  <strong>Nghiêm cấm:</strong> Tất cả thuốc trừ sâu tổng hợp, phân bón tổng hợp, GMO, chất điều hòa tăng trưởng.
</div>

<h2>Đầu vào được phép</h2>
<ul>
  <li><strong>Phân bón:</strong> Phân ủ, phân chuồng, bột xương, đá phosphate, tro gỗ</li>
  <li><strong>Thuốc trừ sâu:</strong> Dầu neem, pyrethrum tự nhiên, Bt, đồng (hạn chế)</li>
</ul>

<h3>Ủ phân</h3>
<ul>
  <li>Sử dụng vỏ cà phê/ca cao, cành cắt tỉa, phân chuồng</li>
  <li>Đảo đống phân 2-3 tuần/lần</li>
  <li>Phân ủ sẵn sàng sau 3-6 tháng</li>
</ul>

<h3>Vùng đệm</h3>
<ul>
  <li>Tối thiểu <strong>8 mét</strong> từ ruộng thông thường</li>
  <li>Cây trồng vùng đệm không bán như hữu cơ</li>
</ul>`,

      lo: `<h2>ສານຕ້ອງຫ້າມ</h2>
<div class="danger-box">
  <strong>ຫ້າມເດັດຂາດ:</strong> ຢາຂ້າແມງໄມ້ສັງເຄາະ, ຝຸ່ນສັງເຄາະ, GMO.
</div>

<h2>ປັດໃຈທີ່ອະນຸຍາດ</h2>
<ul>
  <li><strong>ຝຸ່ນ:</strong> ຝຸ່ນໝັກ, ຝຸ່ນສັດ, ຜົງກະດູກ</li>
  <li><strong>ຢາຂ້າແມງໄມ້:</strong> ນ້ຳມັນ neem, pyrethrum ທຳມະຊາດ</li>
</ul>

<h3>ເຂດກັນຊົນ</h3>
<ul>
  <li>ຢ່າງໜ້ອຍ <strong>8 ແມັດ</strong> ຈາກໄຮ່ທຳມະດາ</li>
</ul>`,

      id: `<h2>Zat Terlarang</h2>
<div class="danger-box">
  <strong>Dilarang ketat:</strong> Semua pestisida sintetis, pupuk sintetis, GMO.
</div>

<h2>Input yang Diizinkan</h2>
<ul>
  <li><strong>Pupuk:</strong> Kompos, pupuk kandang, tepung tulang</li>
  <li><strong>Pestisida:</strong> Minyak neem, pyrethrum alami</li>
</ul>

<h3>Zona Penyangga</h3>
<ul>
  <li>Minimal <strong>8 meter</strong> dari lahan konvensional</li>
</ul>`,
    },
  },

  // ─── Article 4: ICS & Inspections ───
  {
    id: 'euo-ics-inspection',
    type: 'eu_organic',
    icon: 'ClipboardCheck',
    category: 'checklist',
    title: {
      en: 'Internal Control System (ICS) & Inspections',
      vi: 'Hệ thống Kiểm soát Nội bộ (ICS) & Kiểm tra',
      lo: 'ລະບົບການຄວບຄຸມພາຍໃນ (ICS) ແລະ ການກວດສອບ',
      id: 'Sistem Kontrol Internal (ICS) & Inspeksi',
    },
    summary: {
      en: 'How the Internal Control System works: role of internal inspectors, annual inspection requirements, documentation, non-conformity handling, and external audit preparation.',
      vi: 'Cách hoạt động của ICS: vai trò kiểm tra viên nội bộ, yêu cầu kiểm tra hàng năm, tài liệu, xử lý không phù hợp.',
      lo: 'ວິທີການເຮັດວຽກຂອງ ICS: ບົດບາດຂອງຜູ້ກວດສອບພາຍໃນ, ຂໍ້ກຳນົດການກວດສອບປະຈຳປີ.',
      id: 'Cara kerja ICS: peran inspektur internal, persyaratan inspeksi tahunan, dokumentasi.',
    },
    content: {
      en: `<h2>What is the Internal Control System (ICS)?</h2>
<p>The <strong>ICS</strong> is a documented quality management system that allows a group of smallholder farmers to collectively achieve and maintain organic certification. Under EU Regulation 2018/848, group certification requires a functioning ICS.</p>

<h3>Key Components of ICS</h3>
<ul>
  <li><strong>ICS Manager:</strong> Coordinates all ICS activities, maintains the central database, manages documentation</li>
  <li><strong>Internal Inspectors:</strong> Trained staff who inspect each farmer annually</li>
  <li><strong>Approval Committee:</strong> Reviews inspection results and approves/sanctions farmers</li>
  <li><strong>Farmer Database:</strong> Complete register of all group members with farm details</li>
</ul>

<div class="highlight-box">
  <strong>Slow Forest ICS:</strong> This Impact Management app serves as the digital ICS platform. Internal inspections are recorded using the EU Organic Inspection form, and all farmer data is stored in the system.
</div>

<h3>Annual Inspection Requirements</h3>
<p>Every group member must be inspected <strong>at least once per year</strong>. The inspection covers:</p>
<ul>
  <li>Farm boundaries and buffer zones</li>
  <li>Input storage — no prohibited substances present</li>
  <li>Input purchase records — only approved products</li>
  <li>Harvest and sales records — traceability</li>
  <li>Parallel production controls (if both organic and conventional)</li>
  <li>Processing and storage practices</li>
</ul>

<h3>Documentation Requirements</h3>
<ul>
  <li>Signed inspection checklists for each farm</li>
  <li>Corrective action plans for non-conformities</li>
  <li>Risk assessment categorization (low/medium/high risk)</li>
  <li>Training records for farmers and inspectors</li>
  <li>Input purchase receipts and approval records</li>
</ul>

<h3>Handling Non-Conformities</h3>
<ul>
  <li><strong>Minor:</strong> Written warning + corrective action within 30 days</li>
  <li><strong>Major:</strong> Product downgraded to conventional + 90-day corrective plan</li>
  <li><strong>Critical:</strong> Immediate suspension from group + full re-conversion required</li>
</ul>

<h3>Preparing for External Audits</h3>
<p>The external certification body audits a <strong>sample of farms</strong> (square root of total members, minimum 10). To prepare:</p>
<ul>
  <li>Ensure all internal inspections are complete and documented</li>
  <li>Resolve all outstanding non-conformities</li>
  <li>Update the farmer database with current information</li>
  <li>Prepare input purchase records and sales documents</li>
  <li>Brief selected farmers on what to expect during the audit</li>
</ul>

<div class="warning-box">
  <strong>Re-inspection requirement:</strong> At least 10% of farms must be re-inspected annually to verify corrective actions were implemented.
</div>`,

      vi: `<h2>ICS là gì?</h2>
<p><strong>ICS</strong> là hệ thống quản lý chất lượng cho phép nhóm nông dân nhỏ đạt và duy trì chứng nhận hữu cơ.</p>

<h3>Thành phần chính</h3>
<ul>
  <li><strong>Quản lý ICS:</strong> Điều phối hoạt động, quản lý cơ sở dữ liệu trung tâm và tài liệu</li>
  <li><strong>Kiểm tra viên nội bộ:</strong> Nhân viên được đào tạo kiểm tra mỗi nông dân hàng năm</li>
  <li><strong>Hội đồng phê duyệt:</strong> Xem xét kết quả kiểm tra và phê duyệt/xử phạt thành viên</li>
  <li><strong>Cơ sở dữ liệu nông dân:</strong> Sổ đăng ký đầy đủ thông tin chi tiết từng thành viên</li>
</ul>

<div class="highlight-box">
  <strong>ICS Slow Forest:</strong> Ứng dụng Impact này đóng vai trò là nền tảng ICS kỹ thuật số. Các đợt kiểm tra nội bộ được ghi lại bằng mẫu Kiểm tra Hữu cơ EU, và dữ liệu được lưu trữ tập trung.
</div>

<h3>Yêu cầu Kiểm tra Hàng năm</h3>
<p>Mỗi thành viên nhóm phải được kiểm tra <strong>ít nhất một lần mỗi năm</strong>. Nội dung kiểm tra bao gồm:</p>
<ul>
  <li>Ranh giới nông trại và vùng đệm</li>
  <li>Kho vật tư — không có chất bị cấm</li>
  <li>Hồ sơ mua vật tư — chỉ sản phẩm được phê duyệt</li>
  <li>Hồ sơ thu hoạch và bán hàng — truy xuất nguồn gốc</li>
  <li>Kiểm soát sản xuất song song (nếu có cả hữu cơ và thông thường)</li>
</ul>

<h3>Chuẩn bị cho Kiểm toán Bên ngoài</h3>
<p>Tổ chức chứng nhận bên ngoài sẽ kiểm tra <strong>một mẫu các nông trại</strong>. Để chuẩn bị:</p>
<ul>
  <li>Đảm bảo tất cả kiểm tra nội bộ đã hoàn tất và có hồ sơ</li>
  <li>Giải quyết các vi phạm còn tồn đọng</li>
  <li>Cập nhật cơ sở dữ liệu nông dân với thông tin mới nhất</li>
  <li>Chuẩn bị hồ sơ mua vật tư và tài liệu bán hàng</li>
</ul>

<h3>Xử lý không phù hợp</h3>
<ul>
  <li><strong>Nhỏ:</strong> Cảnh cáo bằng văn bản + khắc phục trong 30 ngày</li>
  <li><strong>Lớn:</strong> Hạ cấp sản phẩm sang thông thường + kế hoạch khắc phục 90 ngày</li>
  <li><strong>Nghiêm trọng:</strong> Đình chỉ ngay khỏi nhóm + yêu cầu chuyển đổi lại toàn bộ</li>
</ul>
`,

      lo: `<h2>ICS ແມ່ນຫຍັງ?</h2>
<p><strong>ICS</strong> ແມ່ນລະບົບການຄຸ້ມຄອງຄຸນນະພາບສຳລັບກຸ່ມຊາວກະສິກອນ.</p>

<h3>ອົງປະກອບຫຼັກ</h3>
<ul>
  <li><strong>ຜູ້ຈັດການ ICS:</strong> ປະສານງານ, ຄຸ້ມຄອງຖານຂໍ້ມູນ</li>
  <li><strong>ຜູ້ກວດສອບພາຍໃນ:</strong> ກວດສອບແຕ່ລະຊາວກະສິກອນ</li>
</ul>

<h3>ການກວດສອບປະຈຳປີ</h3>
<p>ທຸກສະມາຊິກກວດສອບ<strong>ຢ່າງໜ້ອຍ 1 ຄັ້ງ/ປີ</strong>.</p>`,

      id: `<h2>Apa itu ICS?</h2>
<p><strong>ICS</strong> adalah sistem manajemen mutu untuk kelompok petani kecil.</p>

<h3>Komponen Utama</h3>
<ul>
  <li><strong>Manajer ICS:</strong> Koordinasi, mengelola database</li>
  <li><strong>Inspektur Internal:</strong> Memeriksa setiap petani setiap tahun</li>
</ul>

<h3>Inspeksi Tahunan</h3>
<p>Setiap anggota diperiksa <strong>minimal 1 kali/tahun</strong>.</p>

<h3>Penanganan Ketidaksesuaian</h3>
<ul>
  <li><strong>Minor:</strong> Peringatan + perbaikan 30 hari</li>
  <li><strong>Mayor:</strong> Penurunan produk + rencana 90 hari</li>
  <li><strong>Kritis:</strong> Penangguhan segera</li>
</ul>`,
    },
  },

  // ─── Article 5: FAQ ───
  {
    id: 'euo-faq',
    type: 'eu_organic',
    icon: 'HelpCircle',
    category: 'faq',
    title: {
      en: 'EU Organic Certification FAQ for Slow Forest Farmers',
      vi: 'Câu hỏi thường gặp về Chứng nhận Hữu cơ EU cho Nông dân Slow Forest',
      lo: 'ຄຳຖາມທີ່ຖາມເລື້ອຍໆກ່ຽວກັບການຢັ້ງຢືນອິນຊີ EU',
      id: 'FAQ Sertifikasi Organik EU untuk Petani Slow Forest',
    },
    summary: {
      en: 'Common questions about EU Organic certification: costs, timeline, dual certification with RA, market premiums, and what happens if violations are found.',
      vi: 'Câu hỏi phổ biến: chi phí, thời gian, chứng nhận kép với RA, premium, xử lý vi phạm.',
      lo: 'ຄຳຖາມທົ່ວໄປ: ຄ່າໃຊ້ຈ່າຍ, ເວລາ, ການຢັ້ງຢືນຄູ່ກັບ RA, premium.',
      id: 'Pertanyaan umum: biaya, waktu, sertifikasi ganda dengan RA, premi.',
    },
    content: {
      en: `<h2>Frequently Asked Questions</h2>

<h3>1. What's the difference between EU Organic and RA certification?</h3>
<p><strong>EU Organic</strong> focuses on input restrictions — no synthetic chemicals, no GMOs. <strong>Rainforest Alliance</strong> focuses on continuous improvement across social, environmental, and economic dimensions. Both are valuable and many Slow Forest farms hold dual certification.</p>

<h3>2. How long does it take to get certified?</h3>
<p>The conversion period is <strong>3 years for perennial crops</strong> (coffee, cacao). During this time, you follow all organic rules but cannot label your product as fully organic. Some farms may qualify for retroactive recognition to shorten this period.</p>

<h3>3. What does it cost?</h3>
<p>Slow Forest covers certification costs centrally. Individual farmers do not pay fees. Costs include control body inspection fees, ICS management, and organic input subsidies during conversion.</p>

<h3>4. Can I use any fertilizer?</h3>
<p>Only <strong>organic-approved</strong> fertilizers. This means compost, animal manure (composted), bone meal, rock phosphate, and wood ash. No urea, DAP, or any synthetic fertilizer.</p>

<div class="danger-box">
  <strong>Critical:</strong> Using even a small amount of synthetic fertilizer or pesticide will result in loss of organic status and require a full new conversion period.
</div>

<h3>5. What if pests attack my crops?</h3>
<p>Use Integrated Pest Management (IPM): prevention first, then biological controls (neem oil, Bt), then approved organic pesticides as a last resort. Always consult your field officer before using any pest control product.</p>

<h3>6. What happens during an external audit?</h3>
<p>The certification body visits a sample of farms (square root formula). They check: farm conditions, input storage, purchase records, harvest records, and interview farmers. The ICS Manager accompanies the auditors.</p>

<h3>7. What if violations are found?</h3>
<ul>
  <li>Minor issues: corrective action + follow-up inspection</li>
  <li>Product contamination: the affected harvest is declassified to conventional</li>
  <li>Intentional fraud: exclusion from the group + legal consequences</li>
</ul>

<h3>8. Can I sell to non-organic markets too?</h3>
<p>Yes, but you must maintain strict separation. Organic and conventional products cannot be mixed during harvest, transport, or storage. This is called "parallel production" and requires extra documentation.</p>

<h3>9. How does Slow Forest help with organic certification?</h3>
<div class="highlight-box">
  Slow Forest provides: ICS management, internal inspectors, organic input sourcing, farmer training, conversion support (shade trees, composting assistance), premium management, and this digital Impact system for documentation and compliance tracking.
</div>`,

      vi: `<h2>Câu hỏi Thường gặp</h2>

<h3>1. Khác biệt giữa EU Organic và RA?</h3>
<p><strong>EU Organic</strong> tập trung vào hạn chế đầu vào. <strong>RA</strong> tập trung vào cải tiến liên tục. Nhiều nông trại Slow Forest có chứng nhận kép.</p>

<h3>2. Mất bao lâu?</h3>
<p>Thời gian chuyển đổi <strong>3 năm cho cây lâu năm</strong>.</p>

<h3>3. Chi phí?</h3>
<p>Slow Forest chi trả tập trung. Nông dân không trả phí.</p>

<h3>4. Có thể dùng phân bón nào?</h3>
<p>Chỉ phân bón <strong>được phê duyệt hữu cơ</strong>: phân ủ, phân chuồng, bột xương.</p>

<div class="danger-box">
  <strong>Quan trọng:</strong> Sử dụng bất kỳ lượng phân bón tổng hợp nào sẽ mất trạng thái hữu cơ.
</div>

<h3>5. Nếu phát hiện vi phạm?</h3>
<ul>
  <li>Nhỏ: hành động khắc phục + kiểm tra theo dõi</li>
  <li>Ô nhiễm sản phẩm: lô hàng bị ảnh hưởng sẽ bị hạ cấp xuống thông thường</li>
  <li>Gian lận cố ý: loại trừ khỏi nhóm + chịu hậu quả pháp lý</li>
</ul>

<h3>5. Điều gì xảy ra trong kiểm toán bên ngoài?</h3>
<p>Tổ chức chứng nhận sẽ đến thăm một mẫu các nông trại. Họ kiểm tra: điều kiện nông trại, kho vật tư, hồ sơ mua hàng, hồ sơ thu hoạch và phỏng vấn nông dân. Quản lý ICS sẽ đi cùng các kiểm toán viên.</p>

<h3>6. Nếu sâu bệnh tấn công cây trồng?</h3>
<p>Sử dụng Quản lý Dịch hại Tổng hợp (IPM): ưu tiên phòng ngừa, sau đó là kiểm soát sinh học (dầu neem, Bt), cuối cùng là thuốc bảo vệ thực vật hữu cơ được phê duyệt. Luôn hỏi ý kiến nhân viên hiện trường trước khi sử dụng.</p>

<h3>7. Tôi có thể bán cho thị trường không hữu cơ không?</h3>
<p>Có, nhưng phải duy trì sự tách biệt nghiêm ngặt. Sản phẩm hữu cơ và thông thường không được trộn lẫn trong thu hoạch, vận chuyển hoặc bảo quản. Điều này gọi là "sản xuất song song" và yêu cầu thêm hồ sơ theo dõi.</p>

<h3>8. Slow Forest hỗ trợ thế nào?</h3>
<div class="highlight-box">
  Slow Forest cung cấp: Quản lý ICS, kiểm tra viên nội bộ, nguồn đầu vào hữu cơ, đào tạo nông dân, hỗ trợ chuyển đổi (cây bóng mát, hỗ trợ ủ phân), quản lý premium, và hệ thống Impact kỹ thuật số này để theo dõi tuân thủ.
</div>
`,

      lo: `<h2>ຄຳຖາມທີ່ຖາມເລື້ອຍໆ</h2>

<h3>1. ຄວາມແຕກຕ່າງລະຫວ່າງ EU Organic ແລະ RA?</h3>
<p><strong>EU Organic</strong> ເນັ້ນການຫ້າມສານເຄມີ. <strong>RA</strong> ເນັ້ນການປັບປຸງຕໍ່ເນື່ອງ.</p>

<h3>2. ໃຊ້ເວລາດົນປານໃດ?</h3>
<p><strong>3 ປີ ສຳລັບພືດຫຼາຍປີ</strong>.</p>

<h3>3. ຄ່າໃຊ້ຈ່າຍ?</h3>
<p>Slow Forest ຈ່າຍສ່ວນກາງ.</p>

<h3>4. Slow Forest ຊ່ວຍເຫຼືອແນວໃດ?</h3>
<div class="highlight-box">
  ການຄຸ້ມຄອງ ICS, ຜູ້ກວດສອບພາຍໃນ, ການຝຶກອົບຮົມ, ການສະໜັບສະໜູນ, ແລະ ລະບົບ Impact ດິຈິຕອນ.
</div>`,

      id: `<h2>Pertanyaan yang Sering Diajukan</h2>

<h3>1. Perbedaan EU Organic dan RA?</h3>
<p><strong>EU Organic</strong> fokus pada pembatasan input. <strong>RA</strong> fokus pada perbaikan berkelanjutan.</p>

<h3>2. Berapa lama?</h3>
<p><strong>3 tahun untuk tanaman tahunan</strong>.</p>

<h3>3. Biaya?</h3>
<p>Slow Forest menanggung secara terpusat.</p>

<h3>4. Pupuk apa yang boleh?</h3>
<p>Hanya pupuk <strong>organik yang disetujui</strong>.</p>

<div class="danger-box">
  <strong>Kritis:</strong> Menggunakan pupuk sintetis akan menghilangkan status organik.
</div>

<h3>5. Bagaimana Slow Forest membantu?</h3>
<div class="highlight-box">
  Manajemen ICS, inspektur internal, pelatihan petani, dukungan konversi, dan sistem Impact digital.
</div>`,
    },
  },
];
