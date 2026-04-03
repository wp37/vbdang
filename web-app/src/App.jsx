import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Packer } from 'docx';
import { generateDocx } from './engine/generator';
import './index.css';

const DS_LOAI_VB = [
  { value: 'nghi_quyet', label: 'Nghị quyết' },
  { value: 'chi_thi', label: 'Chỉ thị' },
  { value: 'ket_luan', label: 'Kết luận' },
  { value: 'quyet_dinh', label: 'Quyết định' },
  { value: 'quy_dinh', label: 'Quy định' },
  { value: 'quy_che', label: 'Quy chế' },
  { value: 'bao_cao', label: 'Báo cáo' },
  { value: 'to_trinh', label: 'Tờ trình' },
  { value: 'thong_bao', label: 'Thông báo' },
  { value: 'huong_dan', label: 'Hướng dẫn' },
  { value: 'chuong_trinh', label: 'Chương trình' },
  { value: 'thong_tri', label: 'Thông tri' },
  { value: 'cong_van', label: 'Công văn' },
  { value: 'bien_ban', label: 'Biên bản' }
];

function App() {
  const [data, setData] = useState({
    loai_van_ban: 'nghi_quyet',
    co_quan_cap_tren: 'ĐẢNG BỘ TỈNH HÀ GIANG',
    co_quan_ban_hanh: 'HUYỆN UỶ ĐỒNG VĂN',
    so_ky_hieu: 'Số 15-NQ/HU',
    dia_danh: 'Đồng Văn',
    ngay: '15',
    thang: '03',
    nam: '2026',
    trich_yeu: 'về công tác cán bộ',
    noi_dung: 'I- TÌNH HÌNH\n1. Kết quả đạt được...\n2. Hạn chế, yếu kém...\n\nII- MỤC TIÊU\nPhấn đấu đến năm 2030...\n\nIII- NHIỆM VỤ VÀ GIẢI PHÁP',
    quyen_han_ky: 'T/M HUYỆN UỶ',
    chuc_vu_ky: 'BÍ THƯ',
    nguoi_ky: 'Nguyễn Văn A',
    noi_nhan_text: 'Các chi bộ trực thuộc\nLưu VP Huyện uỷ',
    kinh_gui_text: '',
    can_cu_text: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      // Clean up array fields
      const payload = { ...data };
      payload.noi_nhan = data.noi_nhan_text.split('\n').filter(l => l.trim());
      payload.kinh_gui = data.kinh_gui_text.split('\n').filter(l => l.trim());
      payload.can_cu = data.can_cu_text.split('\n').filter(l => l.trim());

      const doc = generateDocx(payload);
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${data.loai_van_ban}_${Date.now()}.docx`);
    } catch (err) {
      console.error(err);
      alert('Đã có lỗi xảy ra: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-area">
          <svg className="icon-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1>Hệ Thống Sinh Văn Bản Đảng</h1>
        </div>
        <p>Tự động hoá xử lý tài liệu chuẩn Hướng dẫn số 36-HD/VPTW</p>
      </header>

      <main className="main-content">
        <div className="card glass-panel">
          <div className="form-grid">
            <div className="form-group span-full">
              <label>Loại văn bản</label>
              <select name="loai_van_ban" value={data.loai_van_ban} onChange={handleChange} className="input-control">
                {DS_LOAI_VB.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Cơ quan cấp trên</label>
              <input type="text" name="co_quan_cap_tren" value={data.co_quan_cap_tren} onChange={handleChange} className="input-control" placeholder="VD: ĐẢNG BỘ TỈNH HÀ GIANG" />
            </div>

            <div className="form-group">
              <label>Cơ quan ban hành (*)</label>
              <input type="text" name="co_quan_ban_hanh" value={data.co_quan_ban_hanh} onChange={handleChange} className="input-control" placeholder="VD: HUYỆN UỶ ĐỒNG VĂN" />
            </div>

            <div className="form-group">
              <label>Số / Ký hiệu (*)</label>
              <input type="text" name="so_ky_hieu" value={data.so_ky_hieu} onChange={handleChange} className="input-control" placeholder="VD: Số 15-NQ/HU" />
            </div>

            <div className="form-group select-date">
              <input type="text" name="dia_danh" value={data.dia_danh} onChange={handleChange} className="input-control" placeholder="Địa danh" />
              <span>Ngày</span>
              <input type="text" name="ngay" value={data.ngay} onChange={handleChange} className="input-control text-center" placeholder="DD" />
              <span>tháng</span>
              <input type="text" name="thang" value={data.thang} onChange={handleChange} className="input-control text-center" placeholder="MM" />
              <span>năm</span>
              <input type="text" name="nam" value={data.nam} onChange={handleChange} className="input-control text-center" placeholder="YYYY" />
            </div>

            {(data.loai_van_ban === 'cong_van' || data.loai_van_ban === 'to_trinh') && (
              <div className="form-group span-full">
                <label>Kính gửi (Mỗi CQ 1 dòng)</label>
                <textarea name="kinh_gui_text" value={data.kinh_gui_text} onChange={handleChange} className="input-control" rows="2" placeholder="VD: Ban Tổ chức Trung ương"></textarea>
              </div>
            )}

            <div className="form-group span-full">
              <label>Trích yếu</label>
              <textarea name="trich_yeu" value={data.trich_yeu} onChange={handleChange} className="input-control" rows="2" placeholder="VD: về công tác cán bộ"></textarea>
            </div>

            <div className="form-group span-full">
              <label>Căn cứ (Mỗi căn cứ 1 dòng, bỏ trống nếu không có)</label>
              <textarea name="can_cu_text" value={data.can_cu_text} onChange={handleChange} className="input-control" rows="2" placeholder="VD: Căn cứ Điều lệ Đảng..."></textarea>
            </div>

            <div className="form-group span-full">
              <label>Nội dung (*)</label>
              <textarea name="noi_dung" value={data.noi_dung} onChange={handleChange} className="input-control" rows="6" placeholder="Nội dung chính..."></textarea>
            </div>

            <div className="form-group">
              <label>Quyền hạn ký</label>
              <input type="text" name="quyen_han_ky" value={data.quyen_han_ky} onChange={handleChange} className="input-control" placeholder="VD: T/M HUYỆN UỶ" />
            </div>

            <div className="form-group">
              <label>Chức vụ ký</label>
              <input type="text" name="chuc_vu_ky" value={data.chuc_vu_ky} onChange={handleChange} className="input-control" placeholder="VD: BÍ THƯ" />
            </div>

            <div className="form-group">
              <label>Người ký</label>
              <input type="text" name="nguoi_ky" value={data.nguoi_ky} onChange={handleChange} className="input-control" placeholder="Họ và tên" />
            </div>

            <div className="form-group">
              <label>Nơi nhận (Mỗi KQ 1 dòng)</label>
              <textarea name="noi_nhan_text" value={data.noi_nhan_text} onChange={handleChange} className="input-control" rows="3" placeholder="Các chi bộ trực thuộc&#10;Lưu VP"></textarea>
            </div>

          </div>

          <div className="actions">
            <button 
              className={`btn btn-primary ${isLoading ? 'loading' : ''}`} 
              onClick={handleDownload}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="spinner" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                  Đang tạo file...
                </>
              ) : (
                <>
                  <svg className="icon-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Tải Văn Bản (.docx)
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Phát triển bởi <strong>Võ Ngọc Tùng</strong> (EZtool)</p>
        <p>Zalo hỗ trợ: <strong>0814666040</strong></p>
      </footer>
    </div>
  );
}

export default App;
