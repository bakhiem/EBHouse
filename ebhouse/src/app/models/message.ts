export enum CommonMessage {
  defaultErrMess  = "Có lỗi xảy ra, vui lòng thử lại sau",
  notChangeMess  = "Dữ liệu chưa được sửa đổi",
  inputAllFiel  = "Bạn cần điền đủ các trường cần thiết",
  toSmallerThanFrom = "Phòng bắt đầu phải nhỏ hơn phòng kết thúc",
  vaildatorInputProfile = "Vui lòng kiểm tra lại các thông tin cá nhân",
  errGetProfile = "Có lỗi xảy ra, không thể lấy được thông tin cá nhân",
  BhHaveNoRoom = 'Nhà trọ chưa có phòng nào, vui lòng chọn nhà trọ khác hoặc thêm phòng.',
  PhoneNumber = 'Số điện thoại không bao gồm chữ',
  OverCapacity = 'Vượt quá số lượng người cho phép',
  OverImage = 'Chỉ được tải lên tối đa 5 ảnh',
  NoTenant = 'Không tìm thấy khách thuê',
  SelectRoomFirst = 'Bạn cần chọn phòng hợp lệ trước',
  DuplicateTenant = 'Khách thuê đã được chọn',
  NoExitstRoom = 'Không tồn tại phòng trong nhà trọ, mời bạn chọn phòng trong danh sách',
  DateFormat = 'Vui lòng chọn tháng bắt đầu và tháng kết thúc hợp lệ',
  HaveContractInDate = 'Đã tồn tại hợp đồng trong thời gian này',
  Utility_InputAllField = 'Vui lòng điền vào tất cả các trường, trường nào không có có thể nhập giá trị 0',
  Electric = 'Số điện tháng sau lớn hơn hoặc bằng số điện tháng trước',
  InputElectricBefore = 'Bạn cần chốt số điện trước khi hủy hợp đồng',
  HaveDisableContractInMonth = 'Không thể tạo do phòng đã có hợp đồng đã xóa trong tháng này',

  InvalidInput= 'Vui lòng đúng dữ liệu',

  InputUserName = 'Vui lòng nhập họ và tên',
  InputPhone = 'Vui lòng nhập số điện thoại',
  InputPassword = 'Vui lòng nhập mật khẩu',
  InvalidPassword = 'Mật khẩu ít nhất 8 kí tự',
  InvalidPhone = 'Số điện thoại gồm 10 chữ số',
  PasswordNotMatch = 'Mật khẩu cần trùng nhau',

  //bhInfo
  InputRequire = 'Vui lòng nhập ',
  RedirectUtility = 'Bạn vừa tạo nhà trọ, mời bạn đến trang Dịch Vụ để tạo đơn giá cho các dịch vụ trong nhà trọ',
  //room
  InputBh = 'Vui lòng tạo nhà trọ trước',
  InputRoom = 'Vui lòng tạo phòng trước',
  InputRt = 'Vui lòng tạo loại phòng trước',
  InputMaxRoom = 'Mỗi lần được tạo tối đa 150 phòng, bạn vui lòng tạo thành nhiều lần',
  //tenant
  TenantNoBh = 'Hiện tại bạn chưa ở trong nhà trọ nào',


  //landlord
}
  export class Message {
    content : string;
    type : number;
  }
