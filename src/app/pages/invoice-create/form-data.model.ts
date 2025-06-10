export interface HangHoa {
  stt: number;
  ten: string;
  dvt: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
}

export interface FormData {
  donVi: string;
  maSoThue: string;
  diaChi: string;
  soTaiKhoan: string;
  dienThoai: string;
  tieuDe: string;
  ngayThang: string;
  tenNguoiMua: string;
  cccd: string;
  soHoChieu: string;
  maSoThueNguoiMua: string;
  hinhThucThanhToan: string;
  stkNguoiMua: string;
  hangHoa: HangHoa[];
  congTien: string;
  bangChu: string;
  nguoiMuaKy: string;
  thuTruongKy: string;
  phatHanh: string;
}
