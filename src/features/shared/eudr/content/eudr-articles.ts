export interface EudrArticle {
  id: string;
  icon: string;
  category: 'regulation' | 'guidance' | 'checklist' | 'faq';
  title: { en: string; vi: string; lo: string; id: string };
  summary: { en: string; vi: string; lo: string; id: string };
  content: { en: string; vi: string; lo: string; id: string };
}

export const EUDR_ARTICLES: EudrArticle[] = [
  // ─── Article 1: EUDR Overview ───
  {
    id: 'eudr-overview',
    icon: 'ShieldCheck',
    category: 'regulation',
    title: {
      en: 'Understanding the EU Deforestation Regulation (EUDR)',
      vi: 'Tìm hiểu Quy định Chống phá rừng của EU (EUDR)',
      lo: 'ການເຂົ້າໃຈກົດລະບຽບຕ້ານການທຳລາຍປ່າໄມ້ຂອງ EU (EUDR)',
      id: 'Memahami Regulasi Deforestasi Uni Eropa (EUDR)',
    },
    summary: {
      en: 'Overview of EU Regulation 2023/1115 on deforestation-free products, applicable commodities, key dates, and who it applies to.',
      vi: 'Tổng quan về Quy định EU 2023/1115 về sản phẩm không gây phá rừng, các mặt hàng áp dụng, mốc thời gian quan trọng.',
      lo: 'ພາບລວມຂອງກົດລະບຽບ EU 2023/1115 ກ່ຽວກັບຜະລິດຕະພັນທີ່ບໍ່ທຳລາຍປ່າ, ສິນຄ້າທີ່ກ່ຽວຂ້ອງ, ວັນທີສຳຄັນ.',
      id: 'Gambaran umum Regulasi EU 2023/1115 tentang produk bebas deforestasi, komoditas yang berlaku, tanggal penting.',
    },
    content: {
      en: `<h2>What is the EUDR?</h2>
<p>The <strong>EU Deforestation Regulation (EUDR)</strong>, officially Regulation (EU) 2023/1115, is a landmark European Union law that aims to minimize the EU's contribution to global deforestation and forest degradation. It replaces the earlier EU Timber Regulation (EUTR).</p>

<div class="highlight-box">
<strong>Key Objective:</strong> Ensure that products placed on or exported from the EU market are "deforestation-free" — meaning they were not produced on land that was deforested after December 31, 2020.
</div>

<h2>Which Commodities Are Covered?</h2>
<p>The EUDR covers seven key commodities and their derived products:</p>
<ul>
<li><strong>Cattle</strong> — beef, leather products</li>
<li><strong>Cocoa</strong> — chocolate, cocoa butter, cocoa powder</li>
<li><strong>Coffee</strong> — roasted, instant, extracts</li>
<li><strong>Oil palm</strong> — palm oil, palm kernel oil, derivatives</li>
<li><strong>Rubber</strong> — natural rubber, tyres, rubber products</li>
<li><strong>Soya</strong> — soybean oil, soy meal, animal feed</li>
<li><strong>Wood</strong> — timber, pulp, paper, furniture, charcoal</li>
</ul>

<h2>Key Dates</h2>
<div class="warning-box">
<ul>
<li><strong>June 29, 2023:</strong> Regulation entered into force</li>
<li><strong>December 30, 2024:</strong> Application date for large operators and traders</li>
<li><strong>June 30, 2025:</strong> Application date for SMEs (micro and small enterprises)</li>
<li><strong>December 31, 2020:</strong> Deforestation cut-off date — land must not have been deforested after this date</li>
</ul>
</div>

<h2>Who Does It Apply To?</h2>
<p>The regulation applies to:</p>
<ul>
<li><strong>Operators</strong> — any entity that places relevant commodities or derived products on the EU market for the first time, or exports them</li>
<li><strong>Traders</strong> — entities in the supply chain that make relevant products available on the market after initial placement</li>
<li><strong>Third-country producers</strong> — while not directly regulated, they must provide the necessary data and evidence to EU operators</li>
</ul>

<h3>Penalties for Non-Compliance</h3>
<p>Member States must establish penalties that are effective, proportionate, and dissuasive, including fines of at least 4% of the operator's total annual EU turnover.</p>`,

      vi: `<h2>EUDR là gì?</h2>
<p><strong>Quy định Chống phá rừng của EU (EUDR)</strong>, chính thức là Quy định (EU) 2023/1115, là một đạo luật mang tính bước ngoặt của Liên minh Châu Âu nhằm giảm thiểu đóng góp của EU vào nạn phá rừng và suy thoái rừng toàn cầu. Nó thay thế Quy định Gỗ EU (EUTR) trước đó.</p>

<div class="highlight-box">
<strong>Mục tiêu chính:</strong> Đảm bảo rằng các sản phẩm được đưa vào hoặc xuất khẩu từ thị trường EU là "không gây phá rừng" — nghĩa là chúng không được sản xuất trên đất đã bị phá rừng sau ngày 31 tháng 12 năm 2020.
</div>

<h2>Những mặt hàng nào được áp dụng?</h2>
<p>EUDR áp dụng cho bảy mặt hàng chính và các sản phẩm phái sinh:</p>
<ul>
<li><strong>Gia súc</strong> — thịt bò, sản phẩm da</li>
<li><strong>Ca cao</strong> — sô cô la, bơ ca cao, bột ca cao</li>
<li><strong>Cà phê</strong> — rang, hòa tan, chiết xuất</li>
<li><strong>Dầu cọ</strong> — dầu cọ, dầu nhân cọ, dẫn xuất</li>
<li><strong>Cao su</strong> — cao su tự nhiên, lốp xe, sản phẩm cao su</li>
<li><strong>Đậu nành</strong> — dầu đậu nành, bột đậu nành, thức ăn chăn nuôi</li>
<li><strong>Gỗ</strong> — gỗ xẻ, bột giấy, giấy, đồ nội thất, than củi</li>
</ul>

<h2>Các mốc thời gian quan trọng</h2>
<div class="warning-box">
<ul>
<li><strong>29/06/2023:</strong> Quy định có hiệu lực</li>
<li><strong>30/12/2024:</strong> Ngày áp dụng cho các doanh nghiệp lớn và thương nhân</li>
<li><strong>30/06/2025:</strong> Ngày áp dụng cho doanh nghiệp vừa và nhỏ (SME)</li>
<li><strong>31/12/2020:</strong> Ngày mốc phá rừng — đất không được phá rừng sau ngày này</li>
</ul>
</div>

<h2>Ai phải tuân thủ?</h2>
<p>Quy định áp dụng cho:</p>
<ul>
<li><strong>Nhà vận hành</strong> — bất kỳ tổ chức nào đưa hàng hóa hoặc sản phẩm phái sinh liên quan vào thị trường EU lần đầu, hoặc xuất khẩu</li>
<li><strong>Thương nhân</strong> — các tổ chức trong chuỗi cung ứng phân phối sản phẩm trên thị trường sau khi đã được đưa vào</li>
<li><strong>Nhà sản xuất tại nước thứ ba</strong> — tuy không bị điều chỉnh trực tiếp, nhưng phải cung cấp dữ liệu và bằng chứng cần thiết cho nhà vận hành EU</li>
</ul>

<h3>Hình phạt khi không tuân thủ</h3>
<p>Các quốc gia thành viên phải đặt ra mức phạt hiệu quả, tương xứng và có tính răn đe, bao gồm mức phạt tối thiểu 4% tổng doanh thu hàng năm tại EU của doanh nghiệp.</p>`,

      lo: `<h2>EUDR ແມ່ນຫຍັງ?</h2>
<p><strong>ກົດລະບຽບຕ້ານການທຳລາຍປ່າໄມ້ຂອງ EU (EUDR)</strong>, ຢ່າງເປັນທາງການແມ່ນກົດລະບຽບ (EU) 2023/1115, ເປັນກົດໝາຍສຳຄັນຂອງສະຫະພາບເອີຣົບ ທີ່ມີຈຸດປະສົງເພື່ອຫຼຸດຜ່ອນການປະກອບສ່ວນຂອງ EU ຕໍ່ການທຳລາຍປ່າໄມ້ ແລະ ການເສື່ອມໂຊມຂອງປ່າໄມ້ທົ່ວໂລກ.</p>

<div class="highlight-box">
<strong>ຈຸດປະສົງຫຼັກ:</strong> ຮັບປະກັນວ່າຜະລິດຕະພັນທີ່ວາງຂາຍ ຫຼື ສົ່ງອອກຈາກຕະຫຼາດ EU ເປັນ "ບໍ່ທຳລາຍປ່າ" — ໝາຍຄວາມວ່າ ບໍ່ໄດ້ຜະລິດເທິງດິນທີ່ຖືກທຳລາຍປ່າຫຼັງຈາກ 31 ທັນວາ 2020.
</div>

<h2>ສິນຄ້າໃດແດ່ທີ່ກ່ຽວຂ້ອງ?</h2>
<p>EUDR ກວມເອົາ 7 ສິນຄ້າຫຼັກ ແລະ ຜະລິດຕະພັນທີ່ໄດ້ມາຈາກ:</p>
<ul>
<li><strong>ງົວ</strong> — ຊີ້ນງົວ, ຜະລິດຕະພັນໜັງ</li>
<li><strong>ໂກໂກ້</strong> — ຊັອກໂກແລັດ, ເນີຍໂກໂກ້</li>
<li><strong>ກາເຟ</strong> — ຄົ່ວ, ສຳເລັດຮູບ, ສານສະກັດ</li>
<li><strong>ນ້ຳມັນປາມ</strong> — ນ້ຳມັນປາມ, ອະນຸພັນ</li>
<li><strong>ຢາງພາລາ</strong> — ຢາງທຳມະຊາດ, ຢາງລົດ</li>
<li><strong>ຖົ່ວເຫຼືອງ</strong> — ນ້ຳມັນຖົ່ວເຫຼືອງ, ອາຫານສັດ</li>
<li><strong>ໄມ້</strong> — ໄມ້ແປຮູບ, ເຈ້ຍ, ເຟີນິເຈີ</li>
</ul>

<h2>ວັນທີສຳຄັນ</h2>
<div class="warning-box">
<ul>
<li><strong>29/06/2023:</strong> ກົດລະບຽບມີຜົນບັງຄັບໃຊ້</li>
<li><strong>30/12/2024:</strong> ວັນທີນຳໃຊ້ສຳລັບຜູ້ປະກອບການໃຫຍ່</li>
<li><strong>30/06/2025:</strong> ວັນທີນຳໃຊ້ສຳລັບ SME</li>
<li><strong>31/12/2020:</strong> ວັນທີຕັດຂາດ — ດິນບໍ່ໄດ້ຖືກທຳລາຍປ່າຫຼັງວັນນີ້</li>
</ul>
</div>

<h2>ໃຜຕ້ອງປະຕິບັດຕາມ?</h2>
<ul>
<li><strong>ຜູ້ປະກອບການ</strong> — ອົງກອນທີ່ນຳສິນຄ້າເຂົ້າຕະຫຼາດ EU ຄັ້ງທຳອິດ ຫຼື ສົ່ງອອກ</li>
<li><strong>ພໍ່ຄ້າ</strong> — ອົງກອນໃນຕ່ອງໂສ້ການສະໜອງ</li>
<li><strong>ຜູ້ຜະລິດປະເທດທີສາມ</strong> — ຕ້ອງສະໜອງຂໍ້ມູນ ແລະ ຫຼັກຖານໃຫ້ຜູ້ປະກອບການ EU</li>
</ul>

<h3>ການລົງໂທດ</h3>
<p>ປະເທດສະມາຊິກຕ້ອງກຳນົດບົດລົງໂທດ ລວມທັງປັບໃໝຢ່າງໜ້ອຍ 4% ຂອງລາຍໄດ້ລວມປະຈຳປີ EU.</p>`,

      id: `<h2>Apa itu EUDR?</h2>
<p><strong>Regulasi Deforestasi Uni Eropa (EUDR)</strong>, secara resmi Regulasi (UE) 2023/1115, adalah undang-undang penting Uni Eropa yang bertujuan meminimalkan kontribusi UE terhadap deforestasi dan degradasi hutan global. Regulasi ini menggantikan EU Timber Regulation (EUTR) sebelumnya.</p>

<div class="highlight-box">
<strong>Tujuan Utama:</strong> Memastikan bahwa produk yang ditempatkan di atau diekspor dari pasar UE adalah "bebas deforestasi" — artinya produk tersebut tidak diproduksi di lahan yang mengalami deforestasi setelah 31 Desember 2020.
</div>

<h2>Komoditas Apa Saja yang Tercakup?</h2>
<p>EUDR mencakup tujuh komoditas utama dan produk turunannya:</p>
<ul>
<li><strong>Sapi</strong> — daging sapi, produk kulit</li>
<li><strong>Kakao</strong> — cokelat, mentega kakao, bubuk kakao</li>
<li><strong>Kopi</strong> — sangrai, instan, ekstrak</li>
<li><strong>Kelapa sawit</strong> — minyak sawit, minyak inti sawit, turunan</li>
<li><strong>Karet</strong> — karet alam, ban, produk karet</li>
<li><strong>Kedelai</strong> — minyak kedelai, tepung kedelai, pakan ternak</li>
<li><strong>Kayu</strong> — kayu gergajian, pulp, kertas, furnitur, arang</li>
</ul>

<h2>Tanggal Penting</h2>
<div class="warning-box">
<ul>
<li><strong>29 Juni 2023:</strong> Regulasi mulai berlaku</li>
<li><strong>30 Desember 2024:</strong> Tanggal penerapan untuk operator dan pedagang besar</li>
<li><strong>30 Juni 2025:</strong> Tanggal penerapan untuk UKM</li>
<li><strong>31 Desember 2020:</strong> Tanggal batas deforestasi — lahan tidak boleh mengalami deforestasi setelah tanggal ini</li>
</ul>
</div>

<h2>Siapa yang Harus Mematuhi?</h2>
<ul>
<li><strong>Operator</strong> — entitas yang menempatkan komoditas di pasar UE pertama kali, atau mengekspornya</li>
<li><strong>Pedagang</strong> — entitas dalam rantai pasokan</li>
<li><strong>Produsen negara ketiga</strong> — harus menyediakan data dan bukti kepada operator UE</li>
</ul>

<h3>Sanksi Ketidakpatuhan</h3>
<p>Negara anggota harus menetapkan sanksi yang efektif, proporsional, dan menghalangi, termasuk denda minimal 4% dari total omset tahunan UE operator.</p>`,
    },
  },

  // ─── Article 2: Key Compliance Requirements ───
  {
    id: 'eudr-requirements',
    icon: 'Scale',
    category: 'regulation',
    title: {
      en: 'Key Compliance Requirements',
      vi: 'Các Yêu cầu Tuân thủ Chính',
      lo: 'ຂໍ້ກຳນົດການປະຕິບັດຕາມຫຼັກ',
      id: 'Persyaratan Kepatuhan Utama',
    },
    summary: {
      en: 'The three pillars of EUDR compliance: deforestation-free, legal production, and due diligence statements.',
      vi: 'Ba trụ cột tuân thủ EUDR: không phá rừng, sản xuất hợp pháp, và báo cáo thẩm định.',
      lo: 'ສາມເສົາຫຼັກຂອງການປະຕິບັດ EUDR: ບໍ່ທຳລາຍປ່າ, ການຜະລິດຖືກກົດໝາຍ, ແລະ ການລາຍງານ.',
      id: 'Tiga pilar kepatuhan EUDR: bebas deforestasi, produksi legal, dan pernyataan uji tuntas.',
    },
    content: {
      en: `<h2>The Three Pillars of EUDR Compliance</h2>
<p>To comply with the EUDR, all relevant commodities and derived products must meet three fundamental requirements before they can be placed on or exported from the EU market.</p>

<h3>Pillar 1: Deforestation-Free</h3>
<div class="highlight-box">
<strong>Cut-off Date: December 31, 2020</strong><br/>
Products must be produced on land that has not been subject to deforestation after this date. This applies to all seven covered commodities.
</div>
<p><strong>Deforestation</strong> is defined as the conversion of forest to agricultural use, whether human-induced or not. <strong>Forest degradation</strong> means structural changes to forest canopy cover that reduce it from primary forest or naturally regenerating forest to plantation forest or other wooded land.</p>

<h3>Pillar 2: Legal Production</h3>
<p>Products must be produced in accordance with the <strong>relevant legislation of the country of production</strong>, including:</p>
<ul>
<li>Land use rights and tenure</li>
<li>Environmental protection laws</li>
<li>Forest-related regulations (management, harvesting, biodiversity)</li>
<li>Third-party rights (indigenous peoples, local communities)</li>
<li>Labor rights and human rights</li>
<li>Tax, anti-corruption, and trade regulations</li>
<li>Free, Prior and Informed Consent (FPIC) requirements</li>
</ul>

<h3>Pillar 3: Due Diligence Statement</h3>
<p>Before placing products on the market or exporting, operators must submit a <strong>due diligence statement</strong> through the EU Information System, confirming:</p>
<ul>
<li>Due diligence has been carried out</li>
<li>No or only negligible risk was found</li>
<li>The statement contains specific information including geolocation data, quantity, supplier details</li>
</ul>

<div class="warning-box">
<strong>Important:</strong> Due diligence statements must be retained for 5 years and made available to competent authorities upon request.
</div>

<h2>Country Benchmarking System</h2>
<p>The EU Commission classifies countries (or parts thereof) into three risk categories:</p>
<ul>
<li><strong>Low risk</strong> — simplified due diligence allowed</li>
<li><strong>Standard risk</strong> — full due diligence required</li>
<li><strong>High risk</strong> — enhanced scrutiny and additional checks</li>
</ul>`,

      vi: `<h2>Ba Trụ cột của Tuân thủ EUDR</h2>
<p>Để tuân thủ EUDR, tất cả hàng hóa và sản phẩm phái sinh liên quan phải đáp ứng ba yêu cầu cơ bản trước khi được đưa vào hoặc xuất khẩu từ thị trường EU.</p>

<h3>Trụ cột 1: Không phá rừng</h3>
<div class="highlight-box">
<strong>Ngày mốc: 31 tháng 12 năm 2020</strong><br/>
Sản phẩm phải được sản xuất trên đất không bị phá rừng sau ngày này. Điều này áp dụng cho tất cả bảy mặt hàng được quy định.
</div>
<p><strong>Phá rừng</strong> được định nghĩa là việc chuyển đổi rừng sang sử dụng nông nghiệp. <strong>Suy thoái rừng</strong> là những thay đổi cấu trúc tán rừng làm giảm từ rừng nguyên sinh hoặc rừng tái sinh tự nhiên xuống rừng trồng hoặc đất có cây gỗ khác.</p>

<h3>Trụ cột 2: Sản xuất hợp pháp</h3>
<p>Sản phẩm phải được sản xuất tuân thủ <strong>pháp luật liên quan của quốc gia sản xuất</strong>, bao gồm:</p>
<ul>
<li>Quyền sử dụng đất và quyền sở hữu</li>
<li>Luật bảo vệ môi trường</li>
<li>Quy định liên quan đến rừng (quản lý, khai thác, đa dạng sinh học)</li>
<li>Quyền của bên thứ ba (người bản địa, cộng đồng địa phương)</li>
<li>Quyền lao động và nhân quyền</li>
<li>Quy định về thuế, chống tham nhũng và thương mại</li>
<li>Yêu cầu về Đồng ý Tự do, Trước và Được thông báo (FPIC)</li>
</ul>

<h3>Trụ cột 3: Báo cáo Thẩm định</h3>
<p>Trước khi đưa sản phẩm ra thị trường hoặc xuất khẩu, nhà vận hành phải nộp <strong>báo cáo thẩm định</strong> qua Hệ thống Thông tin EU, xác nhận:</p>
<ul>
<li>Đã thực hiện thẩm định</li>
<li>Không có rủi ro hoặc rủi ro không đáng kể</li>
<li>Báo cáo chứa thông tin cụ thể bao gồm dữ liệu định vị, số lượng, chi tiết nhà cung cấp</li>
</ul>

<div class="warning-box">
<strong>Quan trọng:</strong> Báo cáo thẩm định phải được lưu giữ trong 5 năm và sẵn sàng cung cấp cho cơ quan có thẩm quyền khi được yêu cầu.
</div>

<h2>Hệ thống Phân loại Quốc gia</h2>
<p>Ủy ban Châu Âu phân loại các quốc gia thành ba mức rủi ro:</p>
<ul>
<li><strong>Rủi ro thấp</strong> — được phép thẩm định đơn giản hóa</li>
<li><strong>Rủi ro tiêu chuẩn</strong> — yêu cầu thẩm định đầy đủ</li>
<li><strong>Rủi ro cao</strong> — kiểm tra tăng cường và bổ sung</li>
</ul>`,

      lo: `<h2>ສາມເສົາຫຼັກຂອງການປະຕິບັດ EUDR</h2>
<p>ເພື່ອປະຕິບັດຕາມ EUDR, ສິນຄ້າ ແລະ ຜະລິດຕະພັນທີ່ກ່ຽວຂ້ອງທັງໝົດຕ້ອງຕອບສະໜອງສາມຂໍ້ກຳນົດພື້ນຖານ.</p>

<h3>ເສົາ 1: ບໍ່ທຳລາຍປ່າ</h3>
<div class="highlight-box">
<strong>ວັນທີຕັດຂາດ: 31 ທັນວາ 2020</strong><br/>
ຜະລິດຕະພັນຕ້ອງຜະລິດເທິງດິນທີ່ບໍ່ໄດ້ຖືກທຳລາຍປ່າຫຼັງວັນນີ້.
</div>
<p><strong>ການທຳລາຍປ່າ</strong> ໝາຍເຖິງ ການປ່ຽນປ່າໄມ້ເປັນການນຳໃຊ້ກະສິກຳ. <strong>ການເສື່ອມໂຊມປ່າ</strong> ໝາຍເຖິງ ການປ່ຽນແປງໂຄງສ້າງທີ່ຫຼຸດຜ່ອນປ່າດົ້ນດັ້ງເປັນປ່າປູກ.</p>

<h3>ເສົາ 2: ການຜະລິດຖືກກົດໝາຍ</h3>
<p>ຜະລິດຕະພັນຕ້ອງຜະລິດຕາມ<strong>ກົດໝາຍຂອງປະເທດຜະລິດ</strong>:</p>
<ul>
<li>ສິດນຳໃຊ້ທີ່ດິນ ແລະ ກຳມະສິດ</li>
<li>ກົດໝາຍປົກປ້ອງສິ່ງແວດລ້ອມ</li>
<li>ກົດລະບຽບກ່ຽວກັບປ່າໄມ້</li>
<li>ສິດຂອງຊຸມຊົນທ້ອງຖິ່ນ ແລະ ຄົນພື້ນເມືອງ</li>
<li>ສິດແຮງງານ ແລະ ສິດທິມະນຸດ</li>
<li>ຂໍ້ກຳນົດ FPIC</li>
</ul>

<h3>ເສົາ 3: ຄຳຖະແຫຼງການກວດສອບ</h3>
<p>ກ່ອນວາງສິນຄ້າ, ຜູ້ປະກອບການຕ້ອງສົ່ງ<strong>ຄຳຖະແຫຼງ</strong>ຜ່ານລະບົບ EU:</p>
<ul>
<li>ໄດ້ດຳເນີນການກວດສອບແລ້ວ</li>
<li>ບໍ່ພົບຄວາມສ່ຽງ ຫຼື ຄວາມສ່ຽງເລັກນ້ອຍ</li>
<li>ມີຂໍ້ມູນພິກັດ, ປະລິມານ, ລາຍລະອຽດຜູ້ສະໜອງ</li>
</ul>

<div class="warning-box">
<strong>ສຳຄັນ:</strong> ຕ້ອງເກັບຮັກສາ 5 ປີ ແລະ ພ້ອມສະແດງຕໍ່ເຈົ້າໜ້າທີ່.
</div>

<h2>ລະບົບຈັດອັນດັບປະເທດ</h2>
<ul>
<li><strong>ຄວາມສ່ຽງຕ່ຳ</strong> — ອະນຸຍາດກວດສອບແບບງ່າຍ</li>
<li><strong>ຄວາມສ່ຽງມາດຕະຖານ</strong> — ຕ້ອງກວດສອບເຕັມ</li>
<li><strong>ຄວາມສ່ຽງສູງ</strong> — ກວດສອບເຂັ້ມງວດ</li>
</ul>`,

      id: `<h2>Tiga Pilar Kepatuhan EUDR</h2>
<p>Untuk mematuhi EUDR, semua komoditas dan produk turunan harus memenuhi tiga persyaratan mendasar sebelum dapat ditempatkan di atau diekspor dari pasar UE.</p>

<h3>Pilar 1: Bebas Deforestasi</h3>
<div class="highlight-box">
<strong>Tanggal Batas: 31 Desember 2020</strong><br/>
Produk harus diproduksi di lahan yang tidak mengalami deforestasi setelah tanggal ini.
</div>
<p><strong>Deforestasi</strong> didefinisikan sebagai konversi hutan menjadi penggunaan pertanian. <strong>Degradasi hutan</strong> berarti perubahan struktural kanopi hutan.</p>

<h3>Pilar 2: Produksi Legal</h3>
<p>Produk harus diproduksi sesuai dengan <strong>undang-undang negara produksi</strong>, termasuk:</p>
<ul>
<li>Hak penggunaan dan kepemilikan lahan</li>
<li>Undang-undang perlindungan lingkungan</li>
<li>Peraturan terkait kehutanan</li>
<li>Hak masyarakat adat dan komunitas lokal</li>
<li>Hak tenaga kerja dan hak asasi manusia</li>
<li>Persyaratan FPIC</li>
</ul>

<h3>Pilar 3: Pernyataan Uji Tuntas</h3>
<p>Operator harus mengajukan <strong>pernyataan uji tuntas</strong> melalui Sistem Informasi UE:</p>
<ul>
<li>Uji tuntas telah dilakukan</li>
<li>Tidak ditemukan risiko atau risiko minimal</li>
<li>Pernyataan berisi data geolokasi, kuantitas, detail pemasok</li>
</ul>

<div class="warning-box">
<strong>Penting:</strong> Pernyataan harus disimpan selama 5 tahun dan tersedia untuk otoritas yang berwenang.
</div>

<h2>Sistem Benchmarking Negara</h2>
<ul>
<li><strong>Risiko rendah</strong> — uji tuntas disederhanakan</li>
<li><strong>Risiko standar</strong> — uji tuntas penuh diperlukan</li>
<li><strong>Risiko tinggi</strong> — pemeriksaan yang lebih ketat</li>
</ul>`,
    },
  },

  // ─── Article 3: Due Diligence System ───
  {
    id: 'eudr-due-diligence',
    icon: 'ClipboardCheck',
    category: 'guidance',
    title: {
      en: 'Due Diligence System',
      vi: 'Hệ thống Thẩm định',
      lo: 'ລະບົບການກວດສອບ',
      id: 'Sistem Uji Tuntas',
    },
    summary: {
      en: 'How to implement the three-step due diligence process: information gathering, risk assessment, and risk mitigation.',
      vi: 'Cách thực hiện quy trình thẩm định ba bước: thu thập thông tin, đánh giá rủi ro, và giảm thiểu rủi ro.',
      lo: 'ວິທີປະຕິບັດຂະບວນການກວດສອບ 3 ຂັ້ນຕອນ: ເກັບກຳຂໍ້ມູນ, ປະເມີນຄວາມສ່ຽງ, ແລະ ຫຼຸດຜ່ອນຄວາມສ່ຽງ.',
      id: 'Cara menerapkan proses uji tuntas tiga langkah: pengumpulan informasi, penilaian risiko, dan mitigasi risiko.',
    },
    content: {
      en: `<h2>The Three Steps of Due Diligence</h2>
<p>The EUDR requires operators to establish and maintain a robust due diligence system with three key steps.</p>

<h3>Step 1: Information Gathering</h3>
<p>Operators must collect comprehensive information about the products and their supply chain:</p>
<ul>
<li><strong>Product description</strong> — commodity type, trade name, product description</li>
<li><strong>Country of production</strong> — country (or parts thereof) where the commodity was produced</li>
<li><strong>Geolocation</strong> — GPS coordinates of all plots of land where the commodity was produced</li>
<li><strong>Quantity</strong> — volume or weight of the product</li>
<li><strong>Supplier information</strong> — name, address, contact details of suppliers</li>
<li><strong>Buyer information</strong> — details of entities purchasing the product</li>
<li><strong>Evidence of compliance</strong> — documents showing legality and deforestation-free status</li>
</ul>

<div class="highlight-box">
<strong>Geolocation Requirements:</strong><br/>
For plots smaller than 4 hectares: a single GPS point (latitude/longitude) is sufficient.<br/>
For plots of 4 hectares or larger: polygon mapping with all vertex coordinates is required.
</div>

<h3>Step 2: Risk Assessment</h3>
<p>Based on the gathered information, operators must assess the risk that products are non-compliant:</p>
<ul>
<li>Country or regional risk as classified by the EU Commission</li>
<li>Presence of forests and deforestation patterns in the area</li>
<li>Indigenous peoples' territories or protected areas nearby</li>
<li>Reliability and credibility of supplier information</li>
<li>Complexity of the supply chain and risk of product mixing</li>
<li>Historical compliance record of suppliers</li>
<li>Concerns raised by third parties or civil society</li>
</ul>

<h3>Step 3: Risk Mitigation</h3>
<p>If risk is identified (not negligible), operators must take adequate measures to mitigate it:</p>
<ul>
<li>Request additional documentation from suppliers</li>
<li>Commission independent surveys or audits</li>
<li>Use satellite monitoring to verify deforestation-free status</li>
<li>Engage third-party verification bodies</li>
<li>Conduct field visits to production areas</li>
<li>Implement product segregation systems</li>
</ul>

<div class="warning-box">
<strong>Remember:</strong> Products may only be placed on the market when risk is assessed as negligible. If risk cannot be adequately mitigated, the product must not enter the EU market.
</div>`,

      vi: `<h2>Ba Bước Thẩm định</h2>
<p>EUDR yêu cầu nhà vận hành thiết lập và duy trì hệ thống thẩm định chặt chẽ với ba bước chính.</p>

<h3>Bước 1: Thu thập Thông tin</h3>
<p>Nhà vận hành phải thu thập thông tin đầy đủ về sản phẩm và chuỗi cung ứng:</p>
<ul>
<li><strong>Mô tả sản phẩm</strong> — loại hàng hóa, tên thương mại, mô tả sản phẩm</li>
<li><strong>Quốc gia sản xuất</strong> — quốc gia nơi hàng hóa được sản xuất</li>
<li><strong>Định vị địa lý</strong> — tọa độ GPS của tất cả các lô đất sản xuất</li>
<li><strong>Số lượng</strong> — thể tích hoặc trọng lượng sản phẩm</li>
<li><strong>Thông tin nhà cung cấp</strong> — tên, địa chỉ, chi tiết liên hệ</li>
<li><strong>Thông tin người mua</strong> — chi tiết đơn vị mua sản phẩm</li>
<li><strong>Bằng chứng tuân thủ</strong> — tài liệu chứng minh tính hợp pháp</li>
</ul>

<div class="highlight-box">
<strong>Yêu cầu Định vị:</strong><br/>
Lô nhỏ hơn 4 ha: một điểm GPS (vĩ độ/kinh độ) là đủ.<br/>
Lô từ 4 ha trở lên: cần bản đồ đa giác với tọa độ tất cả các đỉnh.
</div>

<h3>Bước 2: Đánh giá Rủi ro</h3>
<p>Dựa trên thông tin thu thập, nhà vận hành phải đánh giá rủi ro sản phẩm không tuân thủ:</p>
<ul>
<li>Mức rủi ro quốc gia/khu vực theo phân loại của Ủy ban EU</li>
<li>Sự hiện diện của rừng và mô hình phá rừng trong khu vực</li>
<li>Lãnh thổ người bản địa hoặc khu bảo tồn gần đó</li>
<li>Độ tin cậy thông tin nhà cung cấp</li>
<li>Độ phức tạp chuỗi cung ứng và rủi ro trộn lẫn</li>
<li>Lịch sử tuân thủ của nhà cung cấp</li>
</ul>

<h3>Bước 3: Giảm thiểu Rủi ro</h3>
<p>Nếu phát hiện rủi ro, nhà vận hành phải thực hiện các biện pháp giảm thiểu:</p>
<ul>
<li>Yêu cầu tài liệu bổ sung từ nhà cung cấp</li>
<li>Ủy thác khảo sát hoặc kiểm toán độc lập</li>
<li>Sử dụng giám sát vệ tinh để xác minh</li>
<li>Thuê bên thứ ba xác minh</li>
<li>Thực hiện khảo sát thực địa</li>
<li>Triển khai hệ thống phân tách sản phẩm</li>
</ul>

<div class="warning-box">
<strong>Lưu ý:</strong> Sản phẩm chỉ được đưa ra thị trường khi rủi ro được đánh giá là không đáng kể. Nếu không thể giảm thiểu rủi ro, sản phẩm không được phép vào thị trường EU.
</div>`,

      lo: `<h2>ສາມຂັ້ນຕອນການກວດສອບ</h2>
<p>EUDR ກຳນົດໃຫ້ຜູ້ປະກອບການສ້າງ ແລະ ຮັກສາລະບົບກວດສອບທີ່ເຂັ້ມແຂງ.</p>

<h3>ຂັ້ນ 1: ເກັບກຳຂໍ້ມູນ</h3>
<ul>
<li><strong>ລາຍລະອຽດສິນຄ້າ</strong> — ປະເພດ, ຊື່ການຄ້າ</li>
<li><strong>ປະເທດຜະລິດ</strong> — ສະຖານທີ່ຜະລິດ</li>
<li><strong>ພິກັດ GPS</strong> — ຂອງທຸກລອດດິນ</li>
<li><strong>ປະລິມານ</strong> — ນ້ຳໜັກ ຫຼື ປະລິມາດ</li>
<li><strong>ຂໍ້ມູນຜູ້ສະໜອງ</strong> — ຊື່, ທີ່ຢູ່, ລາຍລະອຽດ</li>
<li><strong>ຫຼັກຖານການປະຕິບັດ</strong> — ເອກະສານຢັ້ງຢືນ</li>
</ul>

<div class="highlight-box">
<strong>ຂໍ້ກຳນົດພິກັດ:</strong><br/>
ລອດດິນນ້ອຍກວ່າ 4 ເຮັກຕາ: ຈຸດ GPS ດຽວພຽງພໍ.<br/>
ລອດດິນ 4 ເຮັກຕາຂຶ້ນໄປ: ຕ້ອງມີແຜນທີ່ polygon ທຸກຈຸດ.
</div>

<h3>ຂັ້ນ 2: ປະເມີນຄວາມສ່ຽງ</h3>
<ul>
<li>ລະດັບຄວາມສ່ຽງປະເທດ/ພາກພື້ນ</li>
<li>ການມີປ່າໄມ້ ແລະ ຮູບແບບການທຳລາຍປ່າ</li>
<li>ເຂດທີ່ດິນຊົນເຜົ່າ ຫຼື ເຂດອະນຸລັກ</li>
<li>ຄວາມໜ້າເຊື່ອຖືຂອງຂໍ້ມູນຜູ້ສະໜອງ</li>
<li>ຄວາມຊັບຊ້ອນຂອງຕ່ອງໂສ້ການສະໜອງ</li>
</ul>

<h3>ຂັ້ນ 3: ຫຼຸດຜ່ອນຄວາມສ່ຽງ</h3>
<ul>
<li>ຮ້ອງຂໍເອກະສານເພີ່ມເຕີມ</li>
<li>ການສຳຫຼວດ ຫຼື ກວດກາອິດສະຫຼະ</li>
<li>ໃຊ້ການຕິດຕາມດາວທຽມ</li>
<li>ໃຊ້ບໍລິການຢັ້ງຢືນບຸກຄົນທີ 3</li>
<li>ໄປຢ້ຽມຢາມສະຖານທີ່ຜະລິດ</li>
</ul>

<div class="warning-box">
<strong>ສຳຄັນ:</strong> ສິນຄ້າຈະວາງຂາຍໄດ້ເມື່ອຄວາມສ່ຽງຖືກປະເມີນວ່າບໍ່ມີ. ຖ້າບໍ່ສາມາດຫຼຸດຄວາມສ່ຽງໄດ້, ສິນຄ້ານັ້ນບໍ່ສາມາດເຂົ້າຕະຫຼາດ EU.
</div>`,

      id: `<h2>Tiga Langkah Uji Tuntas</h2>
<p>EUDR mengharuskan operator untuk membangun dan memelihara sistem uji tuntas yang kuat.</p>

<h3>Langkah 1: Pengumpulan Informasi</h3>
<ul>
<li><strong>Deskripsi produk</strong> — jenis komoditas, nama dagang</li>
<li><strong>Negara produksi</strong> — lokasi produksi</li>
<li><strong>Geolokasi</strong> — koordinat GPS semua plot lahan</li>
<li><strong>Kuantitas</strong> — volume atau berat</li>
<li><strong>Informasi pemasok</strong> — nama, alamat, kontak</li>
<li><strong>Bukti kepatuhan</strong> — dokumen pendukung</li>
</ul>

<div class="highlight-box">
<strong>Persyaratan Geolokasi:</strong><br/>
Plot kurang dari 4 hektar: satu titik GPS cukup.<br/>
Plot 4 hektar atau lebih: pemetaan poligon dengan semua koordinat diperlukan.
</div>

<h3>Langkah 2: Penilaian Risiko</h3>
<ul>
<li>Klasifikasi risiko negara oleh Komisi UE</li>
<li>Keberadaan hutan dan pola deforestasi</li>
<li>Wilayah masyarakat adat atau area lindung</li>
<li>Keandalan informasi pemasok</li>
<li>Kompleksitas rantai pasokan</li>
</ul>

<h3>Langkah 3: Mitigasi Risiko</h3>
<ul>
<li>Minta dokumentasi tambahan dari pemasok</li>
<li>Lakukan survei atau audit independen</li>
<li>Gunakan pemantauan satelit</li>
<li>Libatkan lembaga verifikasi pihak ketiga</li>
<li>Lakukan kunjungan lapangan</li>
</ul>

<div class="warning-box">
<strong>Ingat:</strong> Produk hanya boleh dipasarkan jika risiko dinilai dapat diabaikan. Jika tidak bisa dimitigasi, produk tidak boleh masuk pasar UE.
</div>`,
    },
  },

  // ─── Article 4: Geolocation & Traceability ───
  {
    id: 'eudr-geolocation',
    icon: 'MapPin',
    category: 'guidance',
    title: {
      en: 'Geolocation & Traceability Requirements',
      vi: 'Yêu cầu Định vị & Truy xuất Nguồn gốc',
      lo: 'ຂໍ້ກຳນົດພິກັດ ແລະ ການຕິດຕາມແຫຼ່ງທີ່ມາ',
      id: 'Persyaratan Geolokasi & Ketertelusuran',
    },
    summary: {
      en: 'GPS requirements, polygon mapping, traceability from plot to export, and supply chain documentation.',
      vi: 'Yêu cầu GPS, bản đồ đa giác, truy xuất từ lô đất đến xuất khẩu, và tài liệu chuỗi cung ứng.',
      lo: 'ຂໍ້ກຳນົດ GPS, ແຜນທີ່ polygon, ການຕິດຕາມຈາກລອດດິນຫາການສົ່ງອອກ.',
      id: 'Persyaratan GPS, pemetaan poligon, ketertelusuran dari plot ke ekspor.',
    },
    content: {
      en: `<h2>Geolocation Requirements</h2>
<p>One of the most critical aspects of EUDR compliance is the geolocation of production plots. Every commodity entering the EU market must be traceable to the specific plot(s) of land where it was produced.</p>

<h3>GPS Data Specifications</h3>
<div class="highlight-box">
<strong>For plots smaller than 4 hectares:</strong><br/>
A single GPS coordinate point (latitude and longitude in decimal degrees) with at least 5 decimal places of precision (approximately 1.1 meter accuracy).

<strong>For plots of 4 hectares or larger:</strong><br/>
A complete polygon boundary defined by latitude/longitude coordinate pairs for each vertex. The polygon must accurately represent the plot boundary.
</div>

<h3>What Constitutes a "Plot of Land"?</h3>
<p>A plot of land is defined as a continuous area of land with a single producer, on which a single commodity is grown. Key considerations:</p>
<ul>
<li>Each distinct growing area must have its own geolocation data</li>
<li>Plots do not need to be contiguous (multiple plots can belong to one farm)</li>
<li>Shared or communal growing areas must still be individually mapped</li>
<li>GPS data must be regularly updated when plot boundaries change</li>
</ul>

<h2>Traceability Requirements</h2>
<p>The EUDR requires end-to-end traceability from the plot of production to the point of export or placement on the EU market.</p>

<h3>Supply Chain Documentation</h3>
<ul>
<li><strong>Plot-to-collection point:</strong> Records linking harvested product to specific plots</li>
<li><strong>Collection point to processing:</strong> Transport and handover records</li>
<li><strong>Processing records:</strong> Input-output tracking, batch numbers</li>
<li><strong>Processing to export:</strong> Shipping documents, customs records</li>
</ul>

<h3>Product Segregation</h3>
<p>Compliant products must be kept separate from non-compliant or unverified products throughout the supply chain. Mixing of products from verified and unverified sources is not permitted.</p>

<div class="warning-box">
<strong>For Slow Forest Operations:</strong> All coffee (Vietnam, Laos) and cacao (Indonesia) plots must have GPS coordinates recorded in this system. Use the Plot Management section to register each plot with its geolocation data.
</div>

<h3>Best Practices for Field Workers</h3>
<ul>
<li>Use a GPS-enabled smartphone or dedicated GPS device</li>
<li>Record coordinates at the center of small plots (&lt;4 ha)</li>
<li>Walk the boundary of larger plots to capture polygon coordinates</li>
<li>Take GPS readings on clear days for better satellite reception</li>
<li>Record at least 3 readings per point and average them</li>
<li>Photograph the plot from multiple angles as supporting evidence</li>
</ul>`,

      vi: `<h2>Yêu cầu Định vị Địa lý</h2>
<p>Một trong những khía cạnh quan trọng nhất của tuân thủ EUDR là định vị các lô đất sản xuất. Mọi hàng hóa vào thị trường EU phải truy xuất được đến lô đất cụ thể nơi sản xuất.</p>

<h3>Thông số Dữ liệu GPS</h3>
<div class="highlight-box">
<strong>Lô nhỏ hơn 4 hecta:</strong><br/>
Một điểm tọa độ GPS (vĩ độ và kinh độ dạng số thập phân) với ít nhất 5 chữ số thập phân (độ chính xác khoảng 1,1 mét).

<strong>Lô từ 4 hecta trở lên:</strong><br/>
Đường viền đa giác hoàn chỉnh xác định bởi các cặp tọa độ vĩ độ/kinh độ cho mỗi đỉnh.
</div>

<h3>"Lô đất" là gì?</h3>
<p>Lô đất được định nghĩa là một vùng đất liền mạch với một nhà sản xuất duy nhất, trên đó trồng một loại hàng hóa duy nhất:</p>
<ul>
<li>Mỗi khu vực canh tác riêng biệt phải có dữ liệu định vị riêng</li>
<li>Các lô không cần liền kề (nhiều lô có thể thuộc một trang trại)</li>
<li>Khu vực canh tác chung vẫn phải được lập bản đồ riêng</li>
<li>Dữ liệu GPS phải được cập nhật khi ranh giới lô thay đổi</li>
</ul>

<h2>Yêu cầu Truy xuất Nguồn gốc</h2>
<p>EUDR yêu cầu truy xuất nguồn gốc đầy đủ từ lô sản xuất đến điểm xuất khẩu.</p>

<h3>Tài liệu Chuỗi cung ứng</h3>
<ul>
<li><strong>Lô đến điểm thu gom:</strong> Hồ sơ liên kết sản phẩm thu hoạch với lô cụ thể</li>
<li><strong>Điểm thu gom đến chế biến:</strong> Hồ sơ vận chuyển và bàn giao</li>
<li><strong>Hồ sơ chế biến:</strong> Theo dõi đầu vào-đầu ra, số lô</li>
<li><strong>Chế biến đến xuất khẩu:</strong> Chứng từ vận chuyển, hải quan</li>
</ul>

<h3>Phân tách Sản phẩm</h3>
<p>Sản phẩm tuân thủ phải được tách riêng khỏi sản phẩm chưa xác minh trong toàn bộ chuỗi cung ứng.</p>

<div class="warning-box">
<strong>Đối với Slow Forest:</strong> Tất cả lô cà phê (Việt Nam, Lào) và ca cao (Indonesia) phải có tọa độ GPS ghi nhận trong hệ thống. Sử dụng phần Quản lý Lô đất để đăng ký mỗi lô kèm dữ liệu định vị.
</div>

<h3>Hướng dẫn thực hành cho Nhân viên hiện trường</h3>
<ul>
<li>Sử dụng điện thoại có GPS hoặc thiết bị GPS chuyên dụng</li>
<li>Ghi tọa độ tại tâm lô nhỏ (&lt;4 ha)</li>
<li>Đi vòng quanh ranh giới lô lớn để ghi tọa độ đa giác</li>
<li>Ghi GPS vào ngày quang đãng để thu tín hiệu vệ tinh tốt hơn</li>
<li>Ghi ít nhất 3 lần đọc mỗi điểm và lấy trung bình</li>
<li>Chụp ảnh lô từ nhiều góc làm bằng chứng hỗ trợ</li>
</ul>`,

      lo: `<h2>ຂໍ້ກຳນົດພິກັດ</h2>
<p>ໜຶ່ງໃນສ່ວນສຳຄັນທີ່ສຸດຂອງການປະຕິບັດ EUDR ແມ່ນການກຳນົດພິກັດລອດດິນຜະລິດ.</p>

<h3>ຂໍ້ມູນ GPS</h3>
<div class="highlight-box">
<strong>ລອດດິນນ້ອຍກວ່າ 4 ເຮັກຕາ:</strong><br/>
ຈຸດ GPS ດຽວ (ລະຕິຈູດ/ລອງຈິຈູດ) ຢ່າງໜ້ອຍ 5 ຕຳແໜ່ງທົດສະນິຍົມ.

<strong>ລອດດິນ 4 ເຮັກຕາຂຶ້ນໄປ:</strong><br/>
ແຜນທີ່ polygon ສົມບູນ ກັບທຸກຈຸດແຈ.
</div>

<h3>"ລອດດິນ" ແມ່ນຫຍັງ?</h3>
<ul>
<li>ແຕ່ລະພື້ນທີ່ປູກຕ້ອງມີພິກັດຂອງຕົນ</li>
<li>ລອດບໍ່ຈຳເປັນຕ້ອງຕິດກັນ</li>
<li>ພື້ນທີ່ປູກຮ່ວມກັນກໍ່ຕ້ອງລົງທະບຽນແຍກ</li>
<li>ຂໍ້ມູນ GPS ຕ້ອງອັບເດດເມື່ອຂອບເຂດປ່ຽນ</li>
</ul>

<h2>ການຕິດຕາມແຫຼ່ງທີ່ມາ</h2>
<ul>
<li><strong>ລອດດິນ-ຈຸດເກັບ:</strong> ບັນທຶກເຊື່ອມໂຍງຜະລິດຕະພັນກັບລອດ</li>
<li><strong>ຈຸດເກັບ-ໂຮງງານ:</strong> ບັນທຶກການຂົນສົ່ງ</li>
<li><strong>ບັນທຶກການແປຮູບ:</strong> ຕິດຕາມປ້ອນເຂົ້າ-ອອກ</li>
<li><strong>ແປຮູບ-ສົ່ງອອກ:</strong> ເອກະສານຂົນສົ່ງ, ສຸລະກາກອນ</li>
</ul>

<div class="warning-box">
<strong>ສຳລັບ Slow Forest:</strong> ທຸກລອດກາເຟ (ຫວຽດນາມ, ລາວ) ແລະ ໂກໂກ້ (ອິນໂດເນເຊຍ) ຕ້ອງບັນທຶກພິກັດ GPS ໃນລະບົບ.
</div>

<h3>ແນວທາງສຳລັບພະນັກງານພາກສະໜາມ</h3>
<ul>
<li>ໃຊ້ໂທລະສັບ GPS ຫຼື ອຸປະກອນ GPS</li>
<li>ບັນທຶກພິກັດຈຸດສູນກາງຂອງລອດນ້ອຍ</li>
<li>ຍ່າງຮອບຂອບລອດໃຫຍ່ ເພື່ອບັນທຶກ polygon</li>
<li>ບັນທຶກ GPS ວັນທີ່ອາກາດດີ</li>
<li>ບັນທຶກຢ່າງໜ້ອຍ 3 ຄັ້ງຕໍ່ຈຸດ</li>
</ul>`,

      id: `<h2>Persyaratan Geolokasi</h2>
<p>Salah satu aspek paling penting dari kepatuhan EUDR adalah geolokasi plot produksi.</p>

<h3>Spesifikasi Data GPS</h3>
<div class="highlight-box">
<strong>Plot kurang dari 4 hektar:</strong><br/>
Satu titik koordinat GPS (lintang/bujur) dengan minimal 5 desimal.

<strong>Plot 4 hektar atau lebih:</strong><br/>
Pemetaan poligon lengkap dengan semua koordinat titik sudut.
</div>

<h3>Apa itu "Plot Lahan"?</h3>
<ul>
<li>Setiap area tanam harus memiliki data geolokasi sendiri</li>
<li>Plot tidak perlu bersebelahan</li>
<li>Area tanam bersama tetap harus dipetakan terpisah</li>
<li>Data GPS harus diperbarui saat batas plot berubah</li>
</ul>

<h2>Persyaratan Ketertelusuran</h2>
<ul>
<li><strong>Plot ke titik pengumpulan:</strong> Catatan yang menghubungkan produk ke plot</li>
<li><strong>Titik pengumpulan ke pengolahan:</strong> Catatan transportasi</li>
<li><strong>Catatan pengolahan:</strong> Pelacakan input-output</li>
<li><strong>Pengolahan ke ekspor:</strong> Dokumen pengiriman, bea cukai</li>
</ul>

<div class="warning-box">
<strong>Untuk Slow Forest:</strong> Semua plot kopi (Vietnam, Laos) dan kakao (Indonesia) harus memiliki koordinat GPS dalam sistem ini.
</div>

<h3>Praktik Terbaik untuk Petugas Lapangan</h3>
<ul>
<li>Gunakan smartphone GPS atau perangkat GPS khusus</li>
<li>Catat koordinat di tengah plot kecil (&lt;4 ha)</li>
<li>Jalan mengelilingi batas plot besar untuk poligon</li>
<li>Ambil GPS di hari cerah untuk sinyal satelit lebih baik</li>
<li>Catat minimal 3 pembacaan per titik</li>
<li>Foto plot dari berbagai sudut sebagai bukti pendukung</li>
</ul>`,
    },
  },

  // ─── Article 5: Risk Assessment Guide ───
  {
    id: 'eudr-risk-assessment',
    icon: 'AlertTriangle',
    category: 'guidance',
    title: {
      en: 'Risk Assessment Guide',
      vi: 'Hướng dẫn Đánh giá Rủi ro',
      lo: 'ຄູ່ມືການປະເມີນຄວາມສ່ຽງ',
      id: 'Panduan Penilaian Risiko',
    },
    summary: {
      en: 'How to assess deforestation risk using satellite imagery, country classification, and field verification.',
      vi: 'Cách đánh giá rủi ro phá rừng bằng ảnh vệ tinh, phân loại quốc gia, và xác minh thực địa.',
      lo: 'ວິທີປະເມີນຄວາມສ່ຽງການທຳລາຍປ່າ ໂດຍໃຊ້ພາບດາວທຽມ ແລະ ການກວດສອບພາກສະໜາມ.',
      id: 'Cara menilai risiko deforestasi menggunakan citra satelit, klasifikasi negara, dan verifikasi lapangan.',
    },
    content: {
      en: `<h2>Understanding Risk Levels</h2>
<p>The EUDR assessment uses a risk-based approach. The goal is to determine whether there is a negligible, low, medium, or high risk that a product is non-compliant.</p>

<h3>Risk Categories</h3>
<ul>
<li><strong>Negligible Risk:</strong> No indicators of deforestation or non-compliance. Product can proceed to market.</li>
<li><strong>Low Risk:</strong> Minor concerns that can be addressed with standard documentation. Additional verification recommended.</li>
<li><strong>Medium Risk:</strong> Some indicators suggest potential non-compliance. Independent verification required.</li>
<li><strong>High Risk:</strong> Strong indicators of potential deforestation or illegality. Product must not enter the market without thorough mitigation.</li>
</ul>

<h3>Satellite Imagery Analysis</h3>
<div class="highlight-box">
<strong>Key Tool:</strong> Satellite imagery comparison before and after the cut-off date (December 31, 2020) is the primary method to verify deforestation-free status.
</div>
<p>Available resources for satellite analysis:</p>
<ul>
<li><strong>Global Forest Watch</strong> — free platform for monitoring forest change</li>
<li><strong>Copernicus Land Monitoring</strong> — EU satellite data service</li>
<li><strong>Google Earth Engine</strong> — historical satellite imagery analysis</li>
<li><strong>Planet Labs</strong> — high-resolution daily satellite imagery (commercial)</li>
</ul>

<h3>Field Verification Checklist</h3>
<p>When conducting field visits for risk assessment:</p>
<ol>
<li>Verify GPS coordinates match the actual plot location</li>
<li>Observe vegetation cover — look for signs of recent clearing</li>
<li>Check for tree stumps, burn marks, or evidence of recent deforestation</li>
<li>Interview local community members about land use history</li>
<li>Review land title documents and verify with local authorities</li>
<li>Check for proximity to protected areas or indigenous territories</li>
<li>Document evidence with photographs and GPS-tagged notes</li>
</ol>

<h3>Country Risk Classification</h3>
<p>The EU Commission publishes a country benchmarking system:</p>
<ul>
<li><strong>Indonesia:</strong> Currently classified as standard/high risk for deforestation</li>
<li><strong>Vietnam:</strong> Currently classified as standard risk</li>
<li><strong>Laos:</strong> Currently classified as standard risk</li>
</ul>

<div class="warning-box">
<strong>Note for Slow Forest:</strong> Given the country risk classifications, all operations in Indonesia, Vietnam, and Laos require full due diligence with enhanced documentation. Use the Assessment Checklist in this app to systematically evaluate each plot.
</div>`,

      vi: `<h2>Hiểu về Mức độ Rủi ro</h2>
<p>Đánh giá EUDR sử dụng phương pháp dựa trên rủi ro. Mục tiêu là xác định liệu rủi ro sản phẩm không tuân thủ là không đáng kể, thấp, trung bình hay cao.</p>

<h3>Các mức Rủi ro</h3>
<ul>
<li><strong>Không đáng kể:</strong> Không có dấu hiệu phá rừng. Sản phẩm có thể ra thị trường.</li>
<li><strong>Thấp:</strong> Lo ngại nhỏ, có thể giải quyết bằng tài liệu. Khuyến nghị xác minh bổ sung.</li>
<li><strong>Trung bình:</strong> Một số dấu hiệu cho thấy có thể không tuân thủ. Yêu cầu xác minh độc lập.</li>
<li><strong>Cao:</strong> Dấu hiệu mạnh về phá rừng tiềm ẩn. Sản phẩm không được vào thị trường khi chưa giảm thiểu triệt để.</li>
</ul>

<h3>Phân tích Ảnh Vệ tinh</h3>
<div class="highlight-box">
<strong>Công cụ chính:</strong> So sánh ảnh vệ tinh trước và sau ngày mốc (31/12/2020) là phương pháp chính để xác minh tình trạng không phá rừng.
</div>
<p>Tài nguyên có sẵn:</p>
<ul>
<li><strong>Global Forest Watch</strong> — nền tảng miễn phí giám sát thay đổi rừng</li>
<li><strong>Copernicus</strong> — dịch vụ dữ liệu vệ tinh EU</li>
<li><strong>Google Earth Engine</strong> — phân tích ảnh vệ tinh lịch sử</li>
<li><strong>Planet Labs</strong> — ảnh vệ tinh độ phân giải cao hàng ngày (thương mại)</li>
</ul>

<h3>Danh mục Xác minh Thực địa</h3>
<ol>
<li>Xác minh tọa độ GPS khớp với vị trí thực tế</li>
<li>Quan sát lớp phủ thực vật — tìm dấu hiệu khai hoang gần đây</li>
<li>Kiểm tra gốc cây, vết cháy, hoặc bằng chứng phá rừng</li>
<li>Phỏng vấn cộng đồng địa phương về lịch sử sử dụng đất</li>
<li>Xem xét giấy tờ đất và xác minh với chính quyền</li>
<li>Kiểm tra khoảng cách đến khu bảo tồn hoặc vùng đất bản địa</li>
<li>Ghi nhận bằng chứng bằng ảnh chụp và ghi chú GPS</li>
</ol>

<h3>Phân loại Rủi ro Quốc gia</h3>
<ul>
<li><strong>Indonesia:</strong> Phân loại rủi ro tiêu chuẩn/cao cho phá rừng</li>
<li><strong>Việt Nam:</strong> Phân loại rủi ro tiêu chuẩn</li>
<li><strong>Lào:</strong> Phân loại rủi ro tiêu chuẩn</li>
</ul>

<div class="warning-box">
<strong>Lưu ý cho Slow Forest:</strong> Với phân loại rủi ro quốc gia, tất cả hoạt động tại Indonesia, Việt Nam và Lào yêu cầu thẩm định đầy đủ với tài liệu tăng cường. Sử dụng Bảng kiểm Đánh giá trong ứng dụng này để đánh giá từng lô.
</div>`,

      lo: `<h2>ເຂົ້າໃຈລະດັບຄວາມສ່ຽງ</h2>
<p>ການປະເມີນ EUDR ໃຊ້ວິທີທີ່ອີງໃສ່ຄວາມສ່ຽງ.</p>

<h3>ປະເພດຄວາມສ່ຽງ</h3>
<ul>
<li><strong>ບໍ່ມີ:</strong> ບໍ່ມີສັນຍານການທຳລາຍປ່າ. ສິນຄ້າສາມາດເຂົ້າຕະຫຼາດ.</li>
<li><strong>ຕ່ຳ:</strong> ຄວາມກັງວົນເລັກນ້ອຍ. ແນະນຳໃຫ້ກວດເພີ່ມ.</li>
<li><strong>ກາງ:</strong> ມີສັນຍານບາງຢ່າງ. ຕ້ອງການການກວດສອບອິດສະຫຼະ.</li>
<li><strong>ສູງ:</strong> ສັນຍານແຂງແຮງ. ສິນຄ້າບໍ່ໄດ້ເຂົ້າຕະຫຼາດ.</li>
</ul>

<h3>ການວິເຄາະພາບດາວທຽມ</h3>
<div class="highlight-box">
<strong>ເຄື່ອງມືຫຼັກ:</strong> ການປຽບທຽບພາບດາວທຽມກ່ອນ ແລະ ຫຼັງ 31/12/2020.
</div>
<ul>
<li><strong>Global Forest Watch</strong> — ແພລດຟອມຟຣີ</li>
<li><strong>Copernicus</strong> — ບໍລິການຂໍ້ມູນ EU</li>
<li><strong>Google Earth Engine</strong> — ວິເຄາະພາບປະຫວັດສາດ</li>
</ul>

<h3>ການກວດສອບພາກສະໜາມ</h3>
<ol>
<li>ກວດສອບພິກັດ GPS ກັບສະຖານທີ່ຕົວຈິງ</li>
<li>ສັງເກດພືດຄຸມດິນ</li>
<li>ກວດຫາຕໍໄມ້, ຮອຍໄໝ້</li>
<li>ສຳພາດຊຸມຊົນທ້ອງຖິ່ນ</li>
<li>ກວດເອກະສານທີ່ດິນ</li>
<li>ກວດໄລຍະຫ່າງກັບເຂດປ້ອງກັນ</li>
<li>ບັນທຶກຫຼັກຖານດ້ວຍຮູບພາບ</li>
</ol>

<h3>ການຈັດອັນດັບປະເທດ</h3>
<ul>
<li><strong>ອິນໂດເນເຊຍ:</strong> ຄວາມສ່ຽງມາດຕະຖານ/ສູງ</li>
<li><strong>ຫວຽດນາມ:</strong> ຄວາມສ່ຽງມາດຕະຖານ</li>
<li><strong>ລາວ:</strong> ຄວາມສ່ຽງມາດຕະຖານ</li>
</ul>

<div class="warning-box">
<strong>ສຳລັບ Slow Forest:</strong> ທຸກການດຳເນີນງານຕ້ອງມີການກວດສອບເຕັມຮູບແບບ. ໃຊ້ບັນຊີລາຍການກວດສອບໃນແອັບນີ້.
</div>`,

      id: `<h2>Memahami Tingkat Risiko</h2>
<p>Penilaian EUDR menggunakan pendekatan berbasis risiko.</p>

<h3>Kategori Risiko</h3>
<ul>
<li><strong>Dapat diabaikan:</strong> Tidak ada indikator deforestasi. Produk dapat dipasarkan.</li>
<li><strong>Rendah:</strong> Kekhawatiran minor. Verifikasi tambahan direkomendasikan.</li>
<li><strong>Sedang:</strong> Beberapa indikator. Verifikasi independen diperlukan.</li>
<li><strong>Tinggi:</strong> Indikator kuat. Produk tidak boleh masuk pasar.</li>
</ul>

<h3>Analisis Citra Satelit</h3>
<div class="highlight-box">
<strong>Alat Utama:</strong> Perbandingan citra satelit sebelum dan sesudah 31/12/2020.
</div>
<ul>
<li><strong>Global Forest Watch</strong> — platform gratis</li>
<li><strong>Copernicus</strong> — layanan data satelit UE</li>
<li><strong>Google Earth Engine</strong> — analisis citra historis</li>
</ul>

<h3>Daftar Verifikasi Lapangan</h3>
<ol>
<li>Verifikasi koordinat GPS dengan lokasi aktual</li>
<li>Amati tutupan vegetasi</li>
<li>Periksa tunggul pohon, bekas bakar</li>
<li>Wawancara anggota komunitas lokal</li>
<li>Tinjau dokumen kepemilikan lahan</li>
<li>Periksa kedekatan dengan area lindung</li>
<li>Dokumentasikan bukti dengan foto</li>
</ol>

<h3>Klasifikasi Risiko Negara</h3>
<ul>
<li><strong>Indonesia:</strong> Risiko standar/tinggi</li>
<li><strong>Vietnam:</strong> Risiko standar</li>
<li><strong>Laos:</strong> Risiko standar</li>
</ul>

<div class="warning-box">
<strong>Untuk Slow Forest:</strong> Semua operasi memerlukan uji tuntas penuh. Gunakan Daftar Periksa Penilaian di aplikasi ini.
</div>`,
    },
  },

  // ─── Article 6: Assessment Checklist Guide ───
  {
    id: 'eudr-checklist-guide',
    icon: 'CheckCircle',
    category: 'checklist',
    title: {
      en: 'Assessment Checklist Guide',
      vi: 'Hướng dẫn Bảng kiểm Đánh giá',
      lo: 'ຄູ່ມືບັນຊີລາຍການກວດສອບ',
      id: 'Panduan Daftar Periksa Penilaian',
    },
    summary: {
      en: 'Detailed guide for each of the 6 sections in the EUDR compliance checklist: what to check, evidence needed, common issues.',
      vi: 'Hướng dẫn chi tiết 6 phần trong bảng kiểm tuân thủ EUDR: cần kiểm tra gì, bằng chứng cần thu thập, vấn đề thường gặp.',
      lo: 'ຄູ່ມືລະອຽດ 6 ພາກສ່ວນ: ກວດຫຍັງ, ຫຼັກຖານທີ່ຕ້ອງການ, ບັນຫາທົ່ວໄປ.',
      id: 'Panduan detail untuk 6 bagian daftar periksa: apa yang diperiksa, bukti yang diperlukan, masalah umum.',
    },
    content: {
      en: `<h2>Using the EUDR Assessment Checklist</h2>
<p>The Assessment Checklist in this app contains 36 items organized into 6 sections. This guide explains what to look for in each section.</p>

<h3>Section 1: Ownership & Legal Status (7 items)</h3>
<div class="highlight-box">
<strong>Purpose:</strong> Verify that the producer has legal rights to the land and is operating in compliance with local laws.
</div>
<p><strong>Key checks:</strong></p>
<ul>
<li><strong>Land ownership documentation</strong> — Look for land titles, certificates, lease agreements, or customary ownership documents recognized by local law</li>
<li><strong>Business registration</strong> — Cooperative or farmer group must have valid registration</li>
<li><strong>Environmental permits</strong> — Required permits for agricultural activities</li>
<li><strong>Tax compliance</strong> — Current tax registration and payment records</li>
</ul>
<p><strong>Common issues:</strong> Informal land tenure without documentation, expired permits, pending land disputes.</p>

<h3>Section 2: Geolocation & Plot Mapping (6 items)</h3>
<div class="highlight-box">
<strong>Purpose:</strong> Ensure all production plots are accurately located and mapped according to EUDR standards.
</div>
<p><strong>Key checks:</strong></p>
<ul>
<li><strong>GPS accuracy</strong> — Coordinates must be precise and match actual plot locations</li>
<li><strong>Polygon mapping</strong> — Plots over 4 hectares need complete boundary mapping</li>
<li><strong>Plot registry</strong> — All plots must be registered in the system</li>
<li><strong>Regular updates</strong> — GPS data must be current and updated when changes occur</li>
</ul>
<p><strong>Common issues:</strong> Outdated GPS data, missing polygon data for large plots, unregistered plots.</p>

<h3>Section 3: Deforestation & Land Use (7 items)</h3>
<div class="highlight-box">
<strong>Purpose:</strong> Confirm that no deforestation or forest degradation has occurred on the land after December 31, 2020.
</div>
<p><strong>Key checks:</strong></p>
<ul>
<li><strong>Satellite verification</strong> — Compare historical imagery to current state</li>
<li><strong>No burning activities</strong> — Zero-burning policy must be in place and enforced</li>
<li><strong>Agroforestry integration</strong> — Shade trees and forest buffer zones maintained</li>
<li><strong>Land use history</strong> — Documentation of how the land was used before current cultivation</li>
</ul>
<p><strong>Common issues:</strong> Evidence of recent clearing, missing historical documentation, uncontrolled burning nearby.</p>

<h3>Section 4: Traceability & Supply Chain (4 items)</h3>
<div class="highlight-box">
<strong>Purpose:</strong> Verify that products can be traced from specific plots through the entire supply chain.
</div>
<p><strong>Key checks:</strong></p>
<ul>
<li><strong>Product segregation</strong> — Compliant products kept separate from unverified</li>
<li><strong>Batch documentation</strong> — Each batch traceable to specific plots and dates</li>
<li><strong>Chain of custody</strong> — Complete documentation from farm to collection point</li>
</ul>

<h3>Section 5: Human Rights & Labor (6 items)</h3>
<div class="highlight-box">
<strong>Purpose:</strong> Confirm that production respects human rights and labor standards.
</div>
<p><strong>Key checks:</strong></p>
<ul>
<li><strong>No child labor</strong> — Workers must be of legal working age</li>
<li><strong>No forced labor</strong> — All work must be voluntary</li>
<li><strong>Fair wages</strong> — Workers receive at least minimum wage</li>
<li><strong>FPIC</strong> — Free, Prior and Informed Consent obtained from affected communities</li>
<li><strong>Indigenous rights</strong> — Traditional land rights respected</li>
</ul>

<h3>Section 6: Environmental Protection (6 items)</h3>
<div class="highlight-box">
<strong>Purpose:</strong> Verify environmental safeguards are in place.
</div>
<ul>
<li><strong>Biodiversity</strong> — Impact assessed, protection measures active</li>
<li><strong>Water protection</strong> — Watersheds and water sources safeguarded</li>
<li><strong>Soil conservation</strong> — Erosion control, cover crops, terracing</li>
<li><strong>Chemical management</strong> — Pesticide use documented and controlled</li>
<li><strong>Waste management</strong> — Proper disposal practices in place</li>
</ul>`,

      vi: `<h2>Sử dụng Bảng kiểm Đánh giá EUDR</h2>
<p>Bảng kiểm trong ứng dụng chứa 36 mục được tổ chức thành 6 phần. Hướng dẫn này giải thích cần tìm kiếm gì ở mỗi phần.</p>

<h3>Phần 1: Quyền sở hữu & Tình trạng Pháp lý (7 mục)</h3>
<div class="highlight-box">
<strong>Mục đích:</strong> Xác minh nhà sản xuất có quyền hợp pháp trên đất và tuân thủ luật địa phương.
</div>
<p><strong>Kiểm tra chính:</strong></p>
<ul>
<li><strong>Giấy tờ sở hữu đất</strong> — Giấy chứng nhận quyền sử dụng đất, hợp đồng thuê, tài liệu sở hữu</li>
<li><strong>Đăng ký kinh doanh</strong> — Hợp tác xã hoặc nhóm nông dân phải có đăng ký hợp lệ</li>
<li><strong>Giấy phép môi trường</strong> — Giấy phép cần thiết cho hoạt động nông nghiệp</li>
<li><strong>Tuân thủ thuế</strong> — Đăng ký thuế và hồ sơ thanh toán hiện hành</li>
</ul>
<p><strong>Vấn đề thường gặp:</strong> Quyền sử dụng đất không chính thức, giấy phép hết hạn, tranh chấp đất đai.</p>

<h3>Phần 2: Định vị & Lập bản đồ Lô đất (6 mục)</h3>
<div class="highlight-box">
<strong>Mục đích:</strong> Đảm bảo tất cả các lô sản xuất được định vị và lập bản đồ chính xác theo tiêu chuẩn EUDR.
</div>
<ul>
<li><strong>Độ chính xác GPS</strong> — Tọa độ phải chính xác và khớp vị trí thực tế</li>
<li><strong>Bản đồ đa giác</strong> — Lô trên 4 ha cần lập bản đồ ranh giới hoàn chỉnh</li>
<li><strong>Đăng ký lô</strong> — Tất cả lô phải đăng ký trong hệ thống</li>
<li><strong>Cập nhật thường xuyên</strong> — Dữ liệu GPS phải được cập nhật khi có thay đổi</li>
</ul>

<h3>Phần 3: Phá rừng & Sử dụng Đất (7 mục)</h3>
<div class="highlight-box">
<strong>Mục đích:</strong> Xác nhận không có phá rừng sau 31/12/2020.
</div>
<ul>
<li><strong>Xác minh vệ tinh</strong> — So sánh ảnh lịch sử với hiện tại</li>
<li><strong>Không đốt</strong> — Chính sách không đốt phải được thực thi</li>
<li><strong>Nông lâm kết hợp</strong> — Duy trì cây bóng mát và vùng đệm rừng</li>
<li><strong>Lịch sử sử dụng đất</strong> — Tài liệu về cách đất được sử dụng trước đó</li>
</ul>

<h3>Phần 4: Truy xuất & Chuỗi cung ứng (4 mục)</h3>
<div class="highlight-box">
<strong>Mục đích:</strong> Xác minh sản phẩm có thể truy xuất từ lô cụ thể qua toàn bộ chuỗi cung ứng.
</div>
<p><strong>Kiểm tra chính:</strong></p>
<ul>
<li><strong>Phân tách sản phẩm</strong> — Sản phẩm tuân thủ EUDR được tách biệt khỏi sản phẩm chưa xác minh</li>
<li><strong>Tài liệu lô hàng</strong> — Mỗi lô hàng truy xuất được đến lô đất và ngày thu hoạch cụ thể</li>
<li><strong>Chuỗi quản lý</strong> — Hồ sơ đầy đủ từ nông trại đến điểm thu gom và chế biến</li>
</ul>

<h3>Phần 5: Nhân quyền & Lao động (6 mục)</h3>
<div class="highlight-box">
<strong>Mục đích:</strong> Xác nhận quá trình sản xuất tôn trọng nhân quyền và các tiêu chuẩn lao động quốc tế.
</div>
<p><strong>Kiểm tra chính:</strong></p>
<ul>
<li><strong>Không lao động trẻ em</strong> — Công nhân phải đủ độ tuổi lao động theo luật định</li>
<li><strong>Không lao động cưỡng bức</strong> — Mọi công việc phải dựa trên tinh thần tự nguyện</li>
<li><strong>Lương công bằng</strong> — Người lao động nhận ít nhất mức lương tối thiểu vùng</li>
<li><strong>FPIC</strong> — Sự đồng ý Tự do, Trước và Được thông báo từ các cộng đồng bị ảnh hưởng</li>
<li><strong>Quyền người bản địa</strong> — Tôn trọng quyền sở hữu đất đai và truyền thống</li>
</ul>

<h3>Phần 6: Bảo vệ Môi trường (6 mục)</h3>
<div class="highlight-box">
<strong>Mục đích:</strong> Xác minh các biện pháp bảo vệ môi trường và đa dạng sinh học đang được thực thi.
</div>
<p><strong>Kiểm tra chính:</strong></p>
<ul>
<li><strong>Đa dạng sinh học</strong> — Đánh giá tác động và thực hiện các biện pháp bảo vệ</li>
<li><strong>Bảo vệ nguồn nước</strong> — Bảo vệ lưu vực sông và các nguồn nước tự nhiên</li>
<li><strong>Bảo tồn đất</strong> — Kiểm soát xói mòn, sử dụng cây che phủ và ruộng bậc thang</li>
<li><strong>Quản lý hóa chất</strong> — Sử dụng thuốc trừ sâu được ghi chép và kiểm soát chặt chẽ</li>
<li><strong>Quản lý chất thải</strong> — Thực hiện các quy trình thu gom và xử lý rác thải đúng quy định</li>
</ul>
`,

      lo: `<h2>ການນຳໃຊ້ບັນຊີລາຍການກວດສອບ</h2>
<p>ບັນຊີລາຍການໃນແອັບມີ 36 ລາຍການ ຈັດເປັນ 6 ພາກສ່ວນ.</p>

<h3>ພາກ 1: ກຳມະສິດ ແລະ ກົດໝາຍ (7 ລາຍການ)</h3>
<div class="highlight-box">
<strong>ຈຸດປະສົງ:</strong> ຢັ້ງຢືນວ່າຜູ້ຜະລິດມີສິດຕາມກົດໝາຍ.
</div>
<ul>
<li><strong>ໃບຕາດິນ</strong> — ເອກະສານກຳມະສິດ, ສັນຍາເຊົ່າ</li>
<li><strong>ທະບຽນທຸລະກິດ</strong> — ສະຫະກອນຕ້ອງມີທະບຽນ</li>
<li><strong>ໃບອະນຸຍາດສິ່ງແວດລ້ອມ</strong></li>
<li><strong>ການປະຕິບັດຕາມພາສີ</strong></li>
</ul>

<h3>ພາກ 2: ພິກັດ ແລະ ແຜນທີ່ (6 ລາຍການ)</h3>
<div class="highlight-box">
<strong>ຈຸດປະສົງ:</strong> ທຸກລອດຖືກບັນທຶກ ແລະ ລົງແຜນທີ່ຕາມ EUDR.
</div>
<ul>
<li><strong>ຄວາມແມ່ນຍຳ GPS</strong></li>
<li><strong>ແຜນທີ່ polygon</strong> ສຳລັບລອດ &gt;4 ຮຕ</li>
<li><strong>ອັບເດດເປັນປົກກະຕິ</strong></li>
</ul>

<h3>ພາກ 3: ການທຳລາຍປ່າ (7 ລາຍການ)</h3>
<div class="highlight-box">
<strong>ຈຸດປະສົງ:</strong> ບໍ່ມີການທຳລາຍປ່າຫຼັງ 31/12/2020.
</div>
<ul>
<li><strong>ກວດພາບດາວທຽມ</strong></li>
<li><strong>ນະໂຍບາຍບໍ່ເຜົາ</strong></li>
<li><strong>ຮັກສາປ່າກັນຊົນ</strong></li>
</ul>

<h3>ພາກ 4: ການຕິດຕາມ (4 ລາຍການ)</h3>
<ul>
<li><strong>ການແຍກສິນຄ້າ</strong></li>
<li><strong>ເອກະສານລອດ</strong></li>
<li><strong>ລະບົບຄວບຄຸມ</strong></li>
</ul>

<h3>ພາກ 5: ສິດທິມະນຸດ (6 ລາຍການ)</h3>
<ul>
<li>ບໍ່ມີແຮງງານເດັກ</li>
<li>ບໍ່ມີແຮງງານບັງຄັບ</li>
<li>ຄ່າຈ້າງເປັນທຳ</li>
<li>FPIC</li>
</ul>

<h3>ພາກ 6: ສິ່ງແວດລ້ອມ (6 ລາຍການ)</h3>
<ul>
<li>ຄວາມຫຼາກຫຼາຍທາງຊີວະພາບ</li>
<li>ປົກປ້ອງນ້ຳ</li>
<li>ອະນຸລັກດິນ</li>
<li>ຄຸ້ມຄອງສານເຄມີ</li>
<li>ຈັດການຂີ້ເຫຍື້ອ</li>
</ul>`,

      id: `<h2>Menggunakan Daftar Periksa Penilaian EUDR</h2>
<p>Daftar periksa berisi 36 item yang diorganisir dalam 6 bagian.</p>

<h3>Bagian 1: Kepemilikan & Status Hukum (7 item)</h3>
<div class="highlight-box">
<strong>Tujuan:</strong> Verifikasi bahwa produsen memiliki hak legal atas lahan.
</div>
<ul>
<li><strong>Dokumen kepemilikan lahan</strong> — sertifikat tanah, perjanjian sewa</li>
<li><strong>Registrasi bisnis</strong> — koperasi atau kelompok tani terdaftar</li>
<li><strong>Izin lingkungan</strong> — izin yang diperlukan untuk kegiatan pertanian</li>
<li><strong>Kepatuhan pajak</strong> — registrasi dan pembayaran pajak terkini</li>
</ul>

<h3>Bagian 2: Geolokasi & Pemetaan Plot (6 item)</h3>
<div class="highlight-box">
<strong>Tujuan:</strong> Semua plot produksi terlokasi dan terpetakan akurat.
</div>
<ul>
<li><strong>Akurasi GPS</strong> — koordinat harus presisi</li>
<li><strong>Pemetaan poligon</strong> — plot &gt;4 ha memerlukan pemetaan batas lengkap</li>
<li><strong>Registrasi plot</strong> — semua plot terdaftar dalam sistem</li>
<li><strong>Pembaruan rutin</strong></li>
</ul>

<h3>Bagian 3: Deforestasi & Penggunaan Lahan (7 item)</h3>
<div class="highlight-box">
<strong>Tujuan:</strong> Konfirmasi tidak ada deforestasi setelah 31/12/2020.
</div>
<ul>
<li><strong>Verifikasi satelit</strong></li>
<li><strong>Kebijakan tanpa pembakaran</strong></li>
<li><strong>Integrasi agroforestri</strong></li>
<li><strong>Riwayat penggunaan lahan</strong></li>
</ul>

<h3>Bagian 4: Ketertelusuran & Rantai Pasokan (4 item)</h3>
<ul>
<li><strong>Segregasi produk</strong></li>
<li><strong>Dokumentasi batch</strong></li>
<li><strong>Chain of custody</strong></li>
</ul>

<h3>Bagian 5: Hak Asasi Manusia & Ketenagakerjaan (6 item)</h3>
<ul>
<li>Tidak ada pekerja anak</li>
<li>Tidak ada kerja paksa</li>
<li>Upah yang adil</li>
<li>FPIC</li>
<li>Hak masyarakat adat</li>
</ul>

<h3>Bagian 6: Perlindungan Lingkungan (6 item)</h3>
<ul>
<li>Keanekaragaman hayati</li>
<li>Perlindungan air</li>
<li>Konservasi tanah</li>
<li>Pengelolaan bahan kimia</li>
<li>Pengelolaan limbah</li>
</ul>`,
    },
  },
];
