# 📋 Kế Hoạch Hành Động Tuần 1 - BookMyDoctor Frontend

**Mục tiêu**: Sửa các vấn đề nghiêm trọng, triển khai AI Chatbot  
**Thời gian**: 5 ngày làm việc  
**Điểm kỳ vọng**: 81% → 90%

---

## 🎯 Kế Hoạch Từng Ngày

### Ngày 1: Xác Minh API Endpoints ✅

**Buổi Sáng (2-3 giờ)**

- [x] ~~Liên hệ team backend qua Slack/Email~~
- [x] ~~Xác minh endpoints:~~
  - ~~`POST /Register/user` ✅ Đã xác nhận~~
  - ~~`GET /Profile/profile-me` ✅ Đã xác nhận~~
- [x] ~~Cập nhật `API_Documentation.md`~~ ✅ Hoàn thành

**Buổi Chiều (2-3 giờ)**

- [x] ~~Xác minh tất cả 31 endpoints~~ ✅ Hoàn thành
- [x] ~~Tạo file `07-api-integration-summary.md`~~ ✅ Hoàn thành
- [x] ~~Cập nhật `06-progress-report.md`~~ ✅ Hoàn thành
- [x] ~~Test SignUp flow end-to-end~~
- [x] Commit: `docs: verify all 31 API endpoints and update reports`

**Kết quả**: ✅ Tất cả API endpoints đã xác minh và hoạt động

---

### Ngày 2-3: Triển Khai AI Chatbot 🤖

#### Ngày 2 Buổi Sáng: Thiết lập & UI (3-4 giờ)

- [ ] Tạo cấu trúc component

  ```bash
  mkdir src/components/chatbot
  touch src/components/chatbot/ChatBot.tsx
  touch src/components/chatbot/ChatBot.css
  touch src/components/chatbot/ChatMessage.tsx
  ```

- [ ] Cài đặt dependencies (nếu cần)

  ```bash
  npm install react-markdown  # Để render bot responses
  npm install date-fns        # Để format timestamp
  ```

- [ ] Tạo component ChatBot cơ bản

  ```typescript
  // ChatBot.tsx
  interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }

  const ChatBot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // TODO: Triển khai logic chat
  };
  ```

- [ ] Design UI:
  - [ ] Floating button (bottom-right, z-index: 1000)
  - [ ] Chat window (400x600px, animated slide-up)
  - [ ] Message bubbles (user: right/blue, bot: left/gray)
  - [ ] Input box with send button
  - [ ] Typing indicator

**Checkpoint**: Chat UI renders, can open/close

#### Ngày 2 Buổi Chiều: Tích Hợp API (3-4 giờ)

- [ ] Cập nhật `api.ts` - Thêm phương thức chat

  ```typescript
  // api.ts
  export interface ChatRequest {
    messages: Array<{
      role: "user" | "assistant";
      content: string;
    }>;
  }

  // ⚠️ LƯU Ý: API trả về field "Reply" KHÔNG PHẢI "response"!
  export interface ChatResponse {
    Reply: string; // ✅ ĐÚNG - theo API docs
    // response: string;  // ❌ SAI
  }

  export const api = {
    // ... các methods hiện tại
    sendChatMessage: async (data: ChatRequest): Promise<ChatResponse> => {
      const response = await apiClient.post<ChatResponse>(
        "/Chat/send-message",
        data
      );
      return response.data;
    },

    getChatHistory: async (userId: string) => {
      const response = await apiClient.get(`/Chat/conversation/${userId}`);
      return response.data;
    },
  };
  ```

- [ ] Triển khai logic chat trong component ChatBot

  ```typescript
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Thêm tin nhắn user vào state
    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Gọi API
      const response = await api.sendChatMessage({
        messages: [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      // Thêm phản hồi bot - ⚠️ Dùng field "Reply"
      const botMessage: Message = {
        role: "assistant",
        content: response.Reply, // ✅ ĐÚNG
        // content: response.response,  // ❌ SAI - sẽ undefined
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      // Xử lý lỗi
      showNotification("error", "Lỗi Chat", err.message);
    } finally {
      setIsLoading(false);
    }
  };
  ```

- [ ] Test với các câu hỏi mẫu:
  - [ ] "Tìm bác sĩ khoa Nội"
  - [ ] "Bác sĩ ID 12 ngày 2025-11-15 còn giờ nào?"
  - [ ] "Giờ làm việc của phòng khám?"

**Checkpoint**: API chat hoạt động, responses hiển thị đúng

#### Ngày 3 Buổi Sáng: Tính Năng Nâng Cao (3 giờ)

#### Ngày 3 Buổi Sáng: Tính Năng Nâng Cao (3 giờ)

- [ ] Thêm nút hành động nhanh

  ```typescript
  const quickActions = [
    { label: "🔍 Tìm bác sĩ", query: "Tìm bác sĩ" },
    { label: "📅 Xem giờ trống", query: "Xem giờ trống" },
    { label: "❓ Hỏi đáp", query: "Giờ làm việc" },
  ];
  ```

- [ ] Parse và render responses đặc biệt

  ```typescript
  // Nếu response chứa danh sách bác sĩ, render thành cards
  // Nếu response chứa time slots, render thành buttons
  // Nếu response chứa xác nhận đặt lịch, hiện animation thành công
  ```

- [ ] Thêm tin nhắn chào (tự động hiện lần đầu mở)

  ```typescript
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Xin chào! Mình có thể giúp bạn tìm bác sĩ, xem giờ trống, hoặc đặt lịch. Bạn cần gì ạ?",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);
  ```

- [ ] Thêm lưu trữ lịch sử chat

  ```typescript
  // Lưu vào localStorage khi message thay đổi
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // Load khi mount
  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) setMessages(JSON.parse(saved));
  }, []);
  ```

**Checkpoint**: Các tính năng nâng cao hoạt động

#### Ngày 3 Buổi Chiều: Hoàn Thiện & Testing (3 giờ)

- [ ] Hoàn thiện styling:

  - [ ] Smooth animations (slide-up, fade-in)
  - [ ] Mobile responsive (full screen trên mobile)
  - [ ] Accessibility (keyboard navigation, ARIA labels)
  - [ ] Loading states (skeleton, typing indicator)

- [ ] Thêm ChatBot vào App.tsx

  ```typescript
  // App.tsx
  import ChatBot from "./components/chatbot/ChatBot";

  function App() {
    return (
      <>
        {/* ... các routes hiện tại */}
        <ChatBot /> {/* Luôn render, floating */}
      </>
    );
  }
  ```

- [ ] Test tất cả 6 intents:

  - [ ] SearchDoctors: "Tìm bác sĩ khoa Nhi"
  - [ ] GetBusySlots: "BS id 12 ngày 2025-11-15 còn giờ nào?"
  - [ ] CreatePublicBooking: "Đặt lịch BS id 12..."
  - [ ] CancelBooking: "Hủy lịch mã 101"
  - [ ] Faq: "Giờ làm việc?"
  - [ ] GreetingHelp: "Xin chào"

- [ ] Các trường hợp đặc biệt:

  - [ ] Tin nhắn rỗng
  - [ ] Tin nhắn rất dài
  - [ ] Lỗi API
  - [ ] Network timeout

- [ ] Commit: `feat: implement AI chatbot with Gemini integration`

**Kết quả**: ✅ AI Chatbot hoạt động đầy đủ

---

### Ngày 4: Cancel Policy & Xuất Excel 📊

#### Buổi Sáng: Cảnh Báo Cancel Policy (2 giờ)

- [ ] Cập nhật `BookingHistory.tsx`

  ```typescript
  import { differenceInHours } from "date-fns";

  const handleCancelClick = (appointment) => {
    const appointmentDateTime = new Date(
      `${appointment.AppointDate}T${appointment.AppointHour}`
    );
    const hoursUntilAppointment = differenceInHours(
      appointmentDateTime,
      new Date()
    );

    if (hoursUntilAppointment < 24) {
      showNotification(
        "warning",
        "Không Thể Hủy",
        "Bạn không thể hủy lịch hẹn trong vòng 24 giờ. Vui lòng liên hệ 1900 9000.",
        5000
      );
      return;
    }

    // Hiện modal xác nhận
    if (window.confirm("Bạn có chắc muốn hủy lịch hẹn này?")) {
      handleCancel(appointment.BookingId);
    }
  };
  ```

- [ ] Cập nhật UI nút Cancel

  ```tsx
  <button
    disabled={hoursUntilAppointment < 24}
    className={hoursUntilAppointment < 24 ? "btn-disabled" : "btn-cancel"}
    onClick={() => handleCancelClick(appointment)}
  >
    {hoursUntilAppointment < 24 ? "Không Thể Hủy" : "Hủy Lịch"}
  </button>
  ```

- [ ] Test các trường hợp:
  - [ ] Lịch hẹn trong 48 giờ → Có thể hủy
  - [ ] Lịch hẹn trong 12 giờ → Không thể hủy (hiện cảnh báo)
  - [ ] Lịch hẹn đã qua → Ẩn nút hủy

**Checkpoint**: Cancel policy hoạt động đúng

#### Buổi Chiều: Xuất Excel (3 giờ)

- [ ] Cài đặt dependencies

  ```bash
  npm install xlsx file-saver
  npm install --save-dev @types/file-saver
  ```

- [ ] Tạo utility `src/utils/excelExport.ts`

  ```typescript
  import * as XLSX from "xlsx";
  import { saveAs } from "file-saver";

  export const exportToExcel = <T>(
    data: T[],
    filename: string,
    sheetName: string = "Sheet1"
  ) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Tự động điều chỉnh độ rộng cột
    const maxWidth = data.reduce(
      (w, r) => Math.max(w, Object.keys(r).length),
      10
    );
    worksheet["!cols"] = Array(maxWidth).fill({ wch: 15 });

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`);
  };
  ```

- [ ] Thêm nút Export vào `PatientManagement.tsx`

  ```typescript
  import { exportToExcel } from "@/utils/excelExport";

  const handleExportPatients = () => {
    const exportData = patients.map((p) => ({
      "Họ Tên": p.FullName,
      "Số ĐT": p.PhoneNumber,
      Email: p.Email,
      "Ngày Hẹn": p.AppointDate,
      "Trạng Thái": p.Status,
      "Triệu Chứng": p.Symptoms,
    }));
    exportToExcel(exportData, "benh-nhan", "Danh Sách Bệnh Nhân");
    showNotification(
      "success",
      "Đã Xuất",
      "Danh sách bệnh nhân đã được xuất thành công"
    );
  };

  // Thêm button vào UI
  <button onClick={handleExportPatients} className="btn-export">
    <FontAwesomeIcon icon={faFileExcel} /> Xuất Excel
  </button>;
  ```

- [ ] Thêm nút Export vào `DoctorManagement.tsx`

  ```typescript
  const handleExportDoctors = () => {
    const exportData = doctors.map((d) => ({
      "Họ Tên": d.Name,
      Khoa: d.Department,
      "Số ĐT": d.Phone,
      Email: d.Email,
      "Kinh Nghiệm (năm)": d.Experience_year,
    }));
    exportToExcel(exportData, "bac-si", "Danh Sách Bác Sĩ");
  };
  ```

- [ ] Test xuất file:

  - [ ] Danh sách rỗng
  - [ ] 1 dòng
  - [ ] 100+ dòng
  - [ ] Ký tự đặc biệt trong data
  - [ ] File download đúng
  - [ ] Data hiển thị đúng trong Excel

- [ ] Commit: `feat: add cancel policy warning and Excel export`

**Kết quả**: ✅ Cancel policy + Xuất Excel hoạt động

---

### Ngày 5: Testing & Hoàn Thiện ✨

#### Buổi Sáng: Viết Unit Tests (3 giờ)

- [ ] Test API module

  ```typescript
  // src/services/api.test.ts
  import { api } from './api';
  import axios from 'axios';

  jest.mock('axios');
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  describe('API Service', () => {
    describe('login', () => {
      it('should call login endpoint with correct data', async () => {
        mockedAxios.post.mockResolvedValue({ data: { message: 'Success' } });
        await api.login({ UsernameOrPhoneOrEmail: 'test', Password: 'pass' });
        expect(mockedAxios.post).toHaveBeenCalledWith(
          '/Auth/login',
          { UsernameOrPhoneOrEmail: 'test', Password: 'pass' }
        );
      });

      it('should handle login error', async () => {
        mockedAxios.post.mockRejectedValue(new Error('Invalid credentials'));
        await expect(api.login({...})).rejects.toThrow('Invalid credentials');
      });
    });

    // Thêm tests cho các API methods khác...
  });
  ```

- [ ] Test BookingForm validation

  ```typescript
  // src/components/booking/BookingForm.test.tsx
  import { render, screen, fireEvent, waitFor } from "@testing-library/react";
  import BookingForm from "./BookingForm";

  describe("BookingForm", () => {
    it("should show validation errors for empty fields", async () => {
      render(<BookingForm />);
      fireEvent.click(screen.getByText("ĐẶT LỊCH"));
      await waitFor(() => {
        expect(screen.getByText(/họ tên là bắt buộc/i)).toBeInTheDocument();
      });
    });

    it("should call API on valid submit", async () => {
      const mockSubmit = jest.spyOn(api, "submitBooking");
      render(<BookingForm />);
      // Điền form...
      fireEvent.click(screen.getByText("ĐẶT LỊCH"));
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled();
      });
    });
  });
  ```

- [ ] Chạy tests

  ```bash
  npm test -- --coverage
  ```

- [ ] Mục tiêu >50% coverage cho code mới

**Checkpoint**: Các tests quan trọng đã viết

#### Buổi Chiều: Hoàn Thiện Cuối & Tài Liệu (2-3 giờ)

- [ ] Cập nhật README.md

  ```markdown
  ## Tính Năng Mới ✨

  ### AI Chatbot

  - Trợ lý AI được hỗ trợ bởi Gemini
  - Hỗ trợ: tìm bác sĩ, kiểm tra giờ trống, đặt lịch, FAQ
  - Truy cập qua biểu tượng chat (góc dưới bên phải)

  ### Xuất Excel

  - Xuất danh sách bệnh nhân/bác sĩ ra Excel
  - Có sẵn trong các panel admin

  ### Cải Thiện UX

  - Cảnh báo chính sách hủy lịch (quy tắc 24h)
  - Thông báo lỗi được cải thiện
  ```

- [ ] Cập nhật `req/06-progress-report.md`

  - [ ] Đánh dấu Chatbot là ✅ Hoàn thành
  - [ ] Đánh dấu Xuất Excel là ✅ Hoàn thành
  - [ ] Cập nhật Điểm Tuân Thủ API: 81% → 90%

- [ ] Tạo PR

  ```
  Title: Tuần 1: Sửa lỗi nghiêm trọng - Chatbot, Excel, Xác minh API

  Mô tả:
  - ✅ Đã xác minh và sửa API endpoints
  - ✅ Triển khai AI Chatbot với 6 intents
  - ✅ Thêm cảnh báo chính sách hủy lịch (quy tắc 24h)
  - ✅ Triển khai xuất Excel cho admin
  - ✅ Thêm unit tests cho các luồng quan trọng

  Điểm Tuân Thủ API: 81% → 90%
  Test Coverage: 5% → 52%
  ```

- [ ] Checklist code review:
  - [ ] Tất cả cảnh báo ESLint đã sửa
  - [ ] Không có console.logs trong production code
  - [ ] Tất cả TODOs đã giải quyết hoặc ghi chép
  - [ ] TypeScript strict mode passing
  - [ ] Mobile responsive đã test

**Kết quả**: ✅ Tuần 1 hoàn thành, PR sẵn sàng

---

## 📊 Chỉ Số Thành Công

| Chỉ số                    | Bắt đầu | Mục tiêu | Thực tế  |
| ------------------------- | ------- | -------- | -------- |
| Điểm Tuân Thủ API         | 81%     | 90%      | \_\_\_ % |
| Test Coverage             | 5%      | 50%      | \_\_\_ % |
| Vấn Đề Nghiêm Trọng       | 4       | 0        | \_\_\_   |
| Tính Năng Đã Thêm         | 0       | 2        | \_\_\_   |
| API Endpoints Đã Xác Minh | 0       | 2        | \_\_\_   |

---

## 🚨 Rào Cản & Rủi Ro

**Rào Cản Tiềm Ẩn:**

- Team backend không phản hồi về API endpoints
  - **Giảm thiểu**: Test trực tiếp với Postman, ghi chép findings
- Gemini AI API rate limits
  - **Giảm thiểu**: Triển khai request throttling, hiện lỗi thân thiện
- Xuất Excel thất bại với datasets lớn
  - **Giảm thiểu**: Thêm pagination, giới hạn xuất 1000 dòng

**Quản Lý Rủi Ro:**

- Standup hàng ngày: Kiểm tra tiến độ so với kế hoạch
- Nếu Ngày 2 chatbot bị chặn → Làm tasks Ngày 4 trước
- Nếu tests mất quá nhiều thời gian → Chỉ tập trung vào API tests

---

## ✅ Định Nghĩa Hoàn Thành

**Ngày 1:**

- [x] API endpoints đã xác minh với team backend
- [x] `api.ts` đã cập nhật nếu cần
- [x] SignUp flow đã test end-to-end

**Ngày 2-3:**

- [ ] Component ChatBot render được
- [ ] Tích hợp Chat API hoạt động
- [ ] Tất cả 6 intents đã test
- [ ] Mobile responsive

**Ngày 4:**

- [ ] Nút Cancel bị disabled nếu < 24h
- [ ] Tin nhắn cảnh báo hiển thị
- [ ] Nút xuất Excel trong 2 trang admin
- [ ] Export hoạt động với test data

**Ngày 5:**

- [ ] Unit tests cho api.ts, BookingForm.tsx
- [ ] Coverage > 50%
- [ ] PR đã tạo và review
- [ ] Documentation đã cập nhật

---

## 📞 Check-in Hàng Ngày

**Format:** Standup 5 phút

**Câu hỏi:**

1. Tôi đã hoàn thành gì hôm qua?
2. Tôi sẽ làm gì hôm nay?
3. Có rào cản nào không?

**Nhật ký:**

- Ngày 1: **✅ Hoàn thành - Đã xác minh 31 API endpoints**
- Ngày 2: **\_\_\_**
- Ngày 3: **\_\_\_**
- Ngày 4: **\_\_\_**
- Day 5: **\_\_\_**

---

**Created**: 11/11/2025  
**Owner**: Development Team  
**Estimated Effort**: 40 hours (1 week)  
**Status**: 🟡 Not Started
