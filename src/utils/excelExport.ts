import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Patient, Doctor, Schedule, MyHistoryResponse } from '../services/api';

/**
 * Utility functions for exporting data to Excel files
 */

// Export Patients to Excel
export const exportPatientsToExcel = (patients: Patient[], filename: string = 'patients') => {
  if (patients.length === 0) {
    alert('Không có dữ liệu để xuất!');
    return;
  }

  // Prepare data for export
  const exportData = patients.map((patient, index) => ({
    'STT': index + 1,
    'ID': patient.id || '',
    'Họ tên': patient.FullName,
    'Tên đăng nhập': patient.Username,
    'Số điện thoại': patient.PhoneNumber,
    'Email': patient.Email || '',
    'Ngày sinh': patient.DateOfBirth ? new Date(patient.DateOfBirth).toLocaleDateString('vi-VN') : '',
    'Giới tính': patient.Gender === 'Male' ? 'Nam' : patient.Gender === 'Female' ? 'Nữ' : 'Khác',
    'Địa chỉ': patient.Address || '',
    'Trạng thái': patient.Status === 'Completed' ? 'Hoàn thành' : 
                  patient.Status === 'Scheduled' ? 'Đã đặt' : 'Đã hủy',
    'Ngày khám': patient.AppointDate ? new Date(patient.AppointDate).toLocaleDateString('vi-VN') : '',
    'Giờ khám': patient.AppointHour || '',
    'Triệu chứng': patient.Symptoms || '',
    'Đơn thuốc': patient.Prescription || '',
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const columnWidths = [
    { wch: 5 },  // STT
    { wch: 10 }, // ID
    { wch: 25 }, // Họ tên
    { wch: 15 }, // Tên đăng nhập
    { wch: 15 }, // Số điện thoại
    { wch: 25 }, // Email
    { wch: 12 }, // Ngày sinh
    { wch: 10 }, // Giới tính
    { wch: 30 }, // Địa chỉ
    { wch: 12 }, // Trạng thái
    { wch: 12 }, // Ngày khám
    { wch: 12 }, // Giờ khám
    { wch: 30 }, // Triệu chứng
    { wch: 30 }, // Đơn thuốc
  ];
  worksheet['!cols'] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách bệnh nhân');

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Save file with timestamp
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  saveAs(data, `${filename}_${timestamp}.xlsx`);
};

// Export Doctors to Excel
export const exportDoctorsToExcel = (doctors: Doctor[], filename: string = 'doctors') => {
  if (doctors.length === 0) {
    alert('Không có dữ liệu để xuất!');
    return;
  }

  // Prepare data for export
  const exportData = doctors.map((doctor, index) => ({
    'STT': index + 1,
    'Mã BS': doctor.DoctorId,
    'Họ tên': doctor.Name,
    'Số điện thoại': doctor.Phone,
    'Email': doctor.Email,
    'Chuyên khoa': doctor.Department || '',
    'Kinh nghiệm': doctor.Experience_year ? `${doctor.Experience_year} năm` : '',
    'Giới tính': doctor.Gender === 'Male' ? 'Nam' : doctor.Gender === 'Female' ? 'Nữ' : 'Khác',
    'Ngày sinh': doctor.DateOfBirth ? new Date(doctor.DateOfBirth).toLocaleDateString('vi-VN') : '',
    'Địa chỉ': doctor.Address || '',
    'CCCD': doctor.Identification || '',
    'Trạng thái': doctor.IsActive ? 'Hoạt động' : 'Không hoạt động',
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const columnWidths = [
    { wch: 5 },  // STT
    { wch: 10 }, // Mã BS
    { wch: 25 }, // Họ tên
    { wch: 15 }, // Số điện thoại
    { wch: 25 }, // Email
    { wch: 20 }, // Chuyên khoa
    { wch: 12 }, // Kinh nghiệm
    { wch: 10 }, // Giới tính
    { wch: 12 }, // Ngày sinh
    { wch: 30 }, // Địa chỉ
    { wch: 15 }, // CCCD
    { wch: 15 }, // Trạng thái
  ];
  worksheet['!cols'] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách bác sĩ');

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Save file with timestamp
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  saveAs(data, `${filename}_${timestamp}.xlsx`);
};

// Export Schedules to Excel
export const exportSchedulesToExcel = (schedules: Schedule[], filename: string = 'schedules') => {
  if (schedules.length === 0) {
    alert('Không có dữ liệu để xuất!');
    return;
  }

  // Prepare data for export
  const exportData = schedules.map((schedule, index) => ({
    'STT': index + 1,
    'Mã lịch': schedule.ScheduleId || '',
    'Mã bác sĩ': schedule.DoctorId,
    'Tên bác sĩ': schedule.DoctorName || '',
    'Ngày làm việc': schedule.WorkDate ? new Date(schedule.WorkDate).toLocaleDateString('vi-VN') : '',
    'Thời gian bắt đầu': schedule.StartTime || '',
    'Thời gian kết thúc': schedule.EndTime || '',
    'Trạng thái': schedule.Status || '',
    'Hoạt động': schedule.IsActive ? 'Có' : 'Không',
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const columnWidths = [
    { wch: 5 },  // STT
    { wch: 12 }, // Mã lịch
    { wch: 10 }, // Mã bác sĩ
    { wch: 25 }, // Tên bác sĩ
    { wch: 15 }, // Ngày làm việc
    { wch: 12 }, // Thời gian bắt đầu
    { wch: 12 }, // Thời gian kết thúc
    { wch: 15 }, // Trạng thái
    { wch: 12 }, // Hoạt động
  ];
  worksheet['!cols'] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Lịch làm việc');

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Save file with timestamp
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  saveAs(data, `${filename}_${timestamp}.xlsx`);
};

// Export Booking History to Excel (for patient view)
export const exportBookingHistoryToExcel = (bookings: MyHistoryResponse[], filename: string = 'booking_history') => {
  if (bookings.length === 0) {
    alert('Không có dữ liệu để xuất!');
    return;
  }

  // Prepare data for export
  const exportData = bookings.map((booking, index) => ({
    'STT': index + 1,
    'Mã đặt chỗ': booking.AppointId,
    'Bệnh nhân': booking.NamePatient,
    'Bác sĩ': booking.NameDoctor,
    'SĐT bác sĩ': booking.PhoneDoctor,
    'Chuyên khoa': booking.Department,
    'Ngày khám': booking.AppointDate ? new Date(booking.AppointDate).toLocaleDateString('vi-VN') : '',
    'Giờ khám': booking.AppointHour,
    'Trạng thái': booking.Status === 'Completed' ? 'Hoàn thành' : 
                  booking.Status === 'Scheduled' ? 'Đã đặt' : 'Đã hủy',
    'Triệu chứng': booking.Symptoms || '',
    'Đơn thuốc': booking.Prescription || '',
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const columnWidths = [
    { wch: 5 },  // STT
    { wch: 12 }, // Mã đặt chỗ
    { wch: 25 }, // Bệnh nhân
    { wch: 25 }, // Bác sĩ
    { wch: 15 }, // SĐT bác sĩ
    { wch: 20 }, // Chuyên khoa
    { wch: 12 }, // Ngày khám
    { wch: 12 }, // Giờ khám
    { wch: 12 }, // Trạng thái
    { wch: 30 }, // Triệu chứng
    { wch: 30 }, // Đơn thuốc
  ];
  worksheet['!cols'] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Lịch sử đặt khám');

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Save file with timestamp
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  saveAs(data, `${filename}_${timestamp}.xlsx`);
};
