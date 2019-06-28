export enum CommonMessage {
  defaultErrMess  = "Có lỗi xảy ra, vui lòng thử lại sau",
  notChangeMess  = "Dữ liệu chưa được sửa đổi",
  inputAllFiel  = "Điền đủ các trường vào phần nhập phòng bắt đầu và kết thúc",
  toSmallerThanFrom = "Phòng bắt đầu phải nhỏ hơn phòng kết thúc",
  vaildatorInputProfile = "Vui lòng kiểm tra lại các thông tin cá nhân",
  errGetProfile = "Có lỗi xảy ra, không thể lấy được thông tin cá nhân",
  BhHaveNoRoom = 'Nhà trọ chưa có phòng nào, vui lòng chọn nhà trọ khác hoặc thêm phòng.',
  PhoneNumber = 'Số điện thoại không bao gồm chữ',
  OverCapacity = 'Vượt quá số lượng người cho phép',
  OverImage = 'Chỉ được tải lên tối đa 5 ảnh',
  NoTenant = 'Không tìm thấy khách thuê',
  SelectRoomFirst = 'Bạn cần chọn phòng trước',
  DuplicateTenant = 'Khách thuê đã được chọn',
  NoExitstRoom = 'Không tồn tại phòng trong nhà trọ, mời bạn chọn phòng trong danh sách'
  }
  export class Message {
    content : string;
    type : Number
  }
