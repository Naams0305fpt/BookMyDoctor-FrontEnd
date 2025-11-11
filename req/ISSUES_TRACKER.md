# 🚨 ISSUES TRACKER - DỰ ÁN BOOKMYDOCTOR

**Cập nhật**: 11/11/2025  
**Branch**: API_Web  
**Mục đích**: Theo dõi tất cả vấn đề, bugs, và thiếu sót cần khắc phục

---

## 📊 TỔNG QUAN

```
┌─────────────────────────────────────────────────────────────┐
│  TỔNG SỐ VẤN ĐỀ: 18 issues                                 │
│                                                             │
│  🔴 CRITICAL (Cần fix ngay):      5 issues                  │
│  🟡 HIGH (Fix trong tuần):        8 issues                  │
│  🟢 MEDIUM (Fix sau):             3 issues                  │
│  ⏳ BLOCKED (Chờ backend):        2 issues                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔴 CRITICAL ISSUES (5) - PRIORITY 1

### CRIT-01: Testing Coverage = 0% ⚠️ HIGHEST RISK
**Status**: 🔴 Open  
**Priority**: 🔥 CRITICAL  
**Category**: Code Quality  
**Impact**: HIGH - No safety net, high bug risk in production

**Problem**:
- Không có unit tests
- Không có integration tests
- Không có E2E tests
- Test coverage: 0%

**Risks**:
- ❌ Regression bugs khi thêm features mới
- ❌ Không phát hiện bugs trước production
- ❌ Refactoring rất riskyvà
- ❌ Code quality không đảm bảo

**Solution**:
```
Phase 1 (Day 1-2): Setup & Critical Tests
- Setup Jest + React Testing Library
- Test api.ts (API calls, interceptors)
- Test AuthContext (login/logout flows)
- Target: 30% coverage

Phase 2 (Day 3-4): Component Tests
- Test BookingForm.tsx (booking flow)
- Test ScheduleManagement.tsx (CRUD)
- Test Login.tsx, SignUp.tsx (auth flows)
- Target: 50% coverage

Phase 3 (Day 5): Integration Tests
- Test complete user flows
- Test error scenarios
- Target: 70% coverage
```

**Effort**: 5 days  
**Assigned**: TBD  
**Deadline**: Week 2

---

### CRIT-02: Field-level Error Display Missing
**Status**: 🔴 Open  
**Priority**: 🔥 CRITICAL  
**Category**: UX  
**Impact**: MEDIUM - Users frustrated by generic errors

**Problem**:
- API trả về field-level errors: `{ errors: { email: ["Email is required"] } }`
- Frontend chỉ hiển thị generic error message
- Users không biết field nào bị lỗi

**Affected Files**:
- `BookingForm.tsx`
- `SignUp.tsx`
- `Login.tsx`
- `ScheduleFormModal.tsx`
- All forms với validation

**Current Behavior**:
```typescript
// api.ts - Interceptor
catch (error) {
  toast.error(error.response?.data?.message || "An error occurred");
  // ❌ Không parse field errors
}
```

**Expected Behavior**:
```typescript
// Parse API errors
const parseApiErrors = (error) => {
  if (error.response?.data?.errors) {
    return error.response.data.errors; // { email: ["Email required"] }
  }
  return null;
};

// Show under specific field
<input name="email" />
{fieldErrors.email && (
  <span className="error">{fieldErrors.email[0]}</span>
)}
```

**Solution**:
1. Update `api.ts` interceptor để parse field errors
2. Create `useFormErrors` hook
3. Update all forms để hiển thị field-level errors
4. Add styling cho error states

**Effort**: 4-6 hours  
**Assigned**: TBD  
**Deadline**: This week

---

### CRIT-03: No CI/CD Pipeline ⚠️ DEPLOYMENT RISK
**Status**: 🔴 Open  
**Priority**: 🔥 CRITICAL  
**Category**: DevOps  
**Impact**: HIGH - Manual deployment error-prone

**Problem**:
- Manual build/deploy process
- No automated testing before deploy
- No staging environment
- No rollback strategy
- Human error risk

**Risks**:
- ❌ Deploy broken code to production
- ❌ No automated quality checks
- ❌ Slow deployment process
- ❌ Difficult to rollback

**Solution**:
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, API_Web]
  pull_request:
    branches: [main]

jobs:
  lint:
    - ESLint
    - TypeScript check
    
  test:
    - Run unit tests
    - Check coverage (70% minimum)
    
  build:
    - npm run build
    - Check bundle size
    
  deploy-staging:
    - Deploy to Vercel/Netlify staging
    - Run smoke tests
    
  deploy-production:
    - Manual approval required
    - Deploy to production
    - Health check
```

**Effort**: 2 days  
**Assigned**: TBD  
**Deadline**: Week 2

---

### CRIT-04: Excel Export Missing (Admin Blocker)
**Status**: 🔴 Open  
**Priority**: 🔥 CRITICAL  
**Category**: Feature  
**Impact**: HIGH - Admin requirement

**Problem**:
- Admin không thể export data
- No reporting capability
- Manual data collection

**Required Exports**:
- ✅ Patient list (with filters)
- ✅ Doctor list
- ✅ Appointment history
- ✅ Schedule data

**Affected Pages**:
- `PatientManagement.tsx`
- `DoctorManagement.tsx`
- `BookingHistory.tsx`
- `admin/ScheduleManagement.tsx`

**Solution**:
```typescript
// Install packages
npm install xlsx file-saver

// utils/exportToExcel.ts
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data, filename) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}_${new Date().toISOString()}.xlsx`);
};

// PatientManagement.tsx
<button onClick={() => exportToExcel(filteredPatients, 'patients')}>
  📊 Export Excel
</button>
```

**Effort**: 1 day  
**Assigned**: TBD  
**Deadline**: This week

---

### CRIT-05: Cancel Booking Policy Warning Missing
**Status**: 🔴 Open  
**Priority**: 🔥 CRITICAL  
**Category**: UX + Business Logic  
**Impact**: HIGH - Business rule violation

**Problem**:
- API có policy: Không cho hủy < 24h trước giờ hẹn
- Frontend không hiển thị warning
- Users bị surprise khi Cancel fails

**Current Behavior**:
```typescript
// BookingHistory.tsx
const handleCancel = async (id) => {
  if (window.confirm("Are you sure?")) {
    await api.cancelBooking(id); // ❌ Có thể fail nếu < 24h
  }
};
```

**Expected Behavior**:
```typescript
const handleCancel = async (appointment) => {
  const hoursDiff = calculateHoursDiff(appointment.appointmentDate, new Date());
  
  if (hoursDiff < 24) {
    alert("⚠️ Cannot cancel within 24 hours of appointment");
    return;
  }
  
  if (window.confirm(`Cancel appointment with Dr. ${appointment.doctorName}?`)) {
    try {
      await api.cancelBooking(appointment.id);
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Cannot cancel: Less than 24 hours before appointment");
      }
    }
  }
};
```

**Solution**:
1. Calculate hours until appointment
2. Show warning if < 24h
3. Disable Cancel button if < 24h
4. Handle API 400 error gracefully
5. Update UI to show policy

**Effort**: 2 hours  
**Assigned**: TBD  
**Deadline**: This week

---

## 🟡 HIGH PRIORITY ISSUES (8) - PRIORITY 2

### HIGH-01: Profile Update UI Missing (API Ready)
**Status**: 🟡 Open  
**Priority**: HIGH  
**Category**: Feature  
**Impact**: MEDIUM - User self-service blocked

**Problem**:
- API `PUT /api/Profile/update-me` sẵn sàng
- Frontend chỉ có READ profile
- Users không thể tự update thông tin

**Solution**:
```typescript
// Profile.tsx - Add Edit Mode
const [editMode, setEditMode] = useState(false);
const [formData, setFormData] = useState(profile);

const handleUpdate = async () => {
  try {
    await api.updateProfile(formData);
    toast.success("Profile updated successfully");
    setEditMode(false);
  } catch (error) {
    toast.error("Failed to update profile");
  }
};

return (
  <div>
    {editMode ? (
      <form onSubmit={handleUpdate}>
        <input value={formData.fullName} onChange={...} />
        <input value={formData.phone} onChange={...} />
        <button type="submit">Save</button>
      </form>
    ) : (
      <div>
        <p>Name: {profile.fullName}</p>
        <button onClick={() => setEditMode(true)}>Edit</button>
      </div>
    )}
  </div>
);
```

**Effort**: 6-8 hours  
**Deadline**: This week

---

### HIGH-02: Update Doctor UI Missing (Admin Feature)
**Status**: 🟡 Open  
**Priority**: HIGH  
**Category**: Feature  
**Impact**: MEDIUM - Admin flexibility limited

**Problem**:
- API `PUT /api/Doctors/UpdateDoctor` available
- Admin can Create/Delete but not Update
- Need to delete+recreate to fix typos

**Solution**:
```typescript
// DoctorManagement.tsx
const [editingDoctor, setEditingDoctor] = useState(null);

<Modal show={editingDoctor !== null}>
  <UpdateDoctorForm 
    doctor={editingDoctor}
    onSave={handleUpdate}
    onCancel={() => setEditingDoctor(null)}
  />
</Modal>

// Table row
<button onClick={() => setEditingDoctor(doctor)}>
  ✏️ Edit
</button>
```

**Effort**: 6-8 hours  
**Deadline**: This week

---

### HIGH-03: Doctor Search Client-side Only
**Status**: 🟡 Open  
**Priority**: HIGH  
**Category**: Performance  
**Impact**: LOW - Slow với nhiều bác sĩ

**Problem**:
- API có `GET /api/Doctors/Search-Doctors`
- Frontend đang filter client-side
- Slow khi có 100+ doctors

**Current**:
```typescript
// BookingForm.tsx
const filtered = allDoctors.filter(d => 
  d.fullName.toLowerCase().includes(search.toLowerCase())
);
```

**Should be**:
```typescript
const searchDoctors = async (query) => {
  const results = await api.searchDoctors(query);
  setDoctors(results);
};

// Debounce search
const debouncedSearch = useDebounce(searchDoctors, 300);
```

**Effort**: 3-4 hours  
**Deadline**: Week 2

---

### HIGH-04: No Error Tracking/Monitoring
**Status**: 🟡 Open  
**Priority**: HIGH  
**Category**: DevOps  
**Impact**: MEDIUM - Blind in production

**Problem**:
- No Sentry/error tracking
- Can't see production errors
- No user session replay
- No performance monitoring

**Solution**:
```bash
npm install @sentry/react @sentry/tracing

# .env
REACT_APP_SENTRY_DSN=https://...

# index.tsx
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.1,
});
```

**Effort**: 4 hours  
**Deadline**: Week 2

---

### HIGH-05: No Performance Optimization
**Status**: 🟡 Open  
**Priority**: HIGH  
**Category**: Performance  
**Impact**: MEDIUM - Slow load times

**Issues**:
- ❌ No code splitting
- ❌ No lazy loading routes
- ❌ No React.memo on expensive components
- ❌ Large bundle size
- ❌ No image optimization

**Solution**:
```typescript
// Lazy load routes
const AdminDashboard = lazy(() => import('./components/dashboard/AdminDashboard'));
const DoctorDashboard = lazy(() => import('./components/dashboard/DoctorDashboard'));

// Code splitting
<Suspense fallback={<LoadingSpinner />}>
  <Route path="/admin" element={<AdminDashboard />} />
</Suspense>

// Memoize expensive components
export default React.memo(DoctorsCarousel);

// Optimize images
<img src="/images/doctor.jpg" loading="lazy" />
```

**Effort**: 1-2 days  
**Deadline**: Week 3

---

### HIGH-06: No TypeScript Strict Mode
**Status**: 🟡 Open  
**Priority**: HIGH  
**Category**: Code Quality  
**Impact**: MEDIUM - Type safety issues

**Problem**:
- Nhiều `any` types
- Interface definitions thiếu
- No strict null checks
- Type errors hidden

**Solution**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

**Effort**: 2-3 days (fix all type errors)  
**Deadline**: Week 3

---

### HIGH-07: No Analytics Tracking
**Status**: 🟡 Open  
**Priority**: HIGH  
**Category**: Business Intelligence  
**Impact**: MEDIUM - No user insights

**Problem**:
- No Google Analytics
- Can't track user behavior
- No conversion tracking
- No funnel analysis

**Solution**:
```typescript
// Install GA4
npm install react-ga4

// App.tsx
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');

// Track page views
const location = useLocation();
useEffect(() => {
  ReactGA.send({ hitType: "pageview", page: location.pathname });
}, [location]);

// Track events
ReactGA.event({
  category: "Booking",
  action: "Create Appointment",
  label: doctorName
});
```

**Effort**: 4 hours  
**Deadline**: Week 2

---

### HIGH-08: Duplicate Schedule Validation
**Status**: 🟡 Open  
**Priority**: HIGH  
**Category**: Bug  
**Impact**: MEDIUM - Business logic issue

**Problem**:
- Backend validation unclear
- Có thể tạo duplicate schedules?
- Time overlap detection?

**Need Clarification**:
- Can doctor have multiple schedules same day?
- Does backend check time overlap?
- What's the exact validation rule?

**Action**: Contact backend team  
**Deadline**: This week

---

## 🟢 MEDIUM PRIORITY ISSUES (3) - PRIORITY 3

### MED-01: No Staging Environment
**Status**: 🟢 Open  
**Priority**: MEDIUM  
**Impact**: LOW - Testing in production

**Solution**: Deploy to Vercel/Netlify staging  
**Effort**: 2 hours  
**Deadline**: Week 2

---

### MED-02: Console.log Cleanup Needed
**Status**: 🟢 Open  
**Priority**: MEDIUM  
**Impact**: LOW - Not professional

**Solution**: Remove all console.logs before production  
**Effort**: 1 hour  
**Deadline**: Before production

---

### MED-03: Better Modal Component Needed
**Status**: 🟢 Open  
**Priority**: MEDIUM  
**Impact**: LOW - UX improvement

**Problem**: Using window.confirm (ugly)  
**Solution**: Custom Modal component  
**Effort**: 4 hours  
**Deadline**: Week 3

---

## ⏳ BLOCKED ISSUES (2) - WAITING BACKEND

### BLOCK-01: AI Chatbot UI
**Status**: ⏳ Blocked  
**Priority**: HIGH (when unblocked)  
**Blocking Reason**: Backend API đang phát triển

**Frontend Ready**: Design mockup, component structure  
**Waiting For**: Backend completes Chat API  
**Estimated FE Effort**: 2-3 days when unblocked  
**Note**: Response field là `Reply` not `response`

---

### BLOCK-02: Email Notifications
**Status**: ⏳ Blocked  
**Priority**: HIGH (when unblocked)  
**Blocking Reason**: Backend MailKit chưa trigger

**Frontend Ready**: Toast notifications  
**Waiting For**: Backend email service  
**Estimated FE Effort**: Testing only (2 hours)

---

## 📊 ISSUE BREAKDOWN BY CATEGORY

### By Category
```
Code Quality:      3 issues (Testing, TypeScript, Console logs)
Features:          4 issues (Excel, Profile, Doctor update, Chatbot)
UX:                3 issues (Field errors, Cancel policy, Modal)
Performance:       2 issues (Optimization, Client-side search)
DevOps:            4 issues (CI/CD, Monitoring, Analytics, Staging)
Backend Blocked:   2 issues (Chatbot, Email)
```

### By Effort
```
< 4 hours:    6 issues (Quick wins!)
4-8 hours:    5 issues (Can do in 1 day)
1-2 days:     4 issues (Weekend tasks)
3-5 days:     3 issues (Need planning)
```

---

## 🎯 RECOMMENDED ACTION PLAN

### This Week (Priority 1)
**Goal**: Fix all CRITICAL issues

**Day 1** (4h):
- ✅ CRIT-05: Cancel policy warning (2h)
- ✅ CRIT-04: Excel export setup (2h)

**Day 2** (6h):
- ✅ CRIT-04: Excel export implementation (4h)
- ✅ CRIT-02: Field-level errors (2h)

**Day 3** (8h):
- ✅ HIGH-01: Profile update UI (6h)
- ✅ CRIT-02: Field-level errors complete (2h)

**Day 4** (8h):
- ✅ HIGH-02: Update Doctor UI (6h)
- ✅ MED-02: Console.log cleanup (1h)
- ✅ Testing manual flows (1h)

**Day 5** (8h):
- ✅ CRIT-01: Setup testing framework (4h)
- ✅ CRIT-01: Write critical tests (4h)

**Result**: 5 CRITICAL + 2 HIGH fixed = MVP Ready ✅

---

### Week 2 (Priority 2)
- CRIT-01: Complete testing to 70% coverage (3 days)
- CRIT-03: CI/CD pipeline (2 days)
- HIGH-03: Server-side doctor search (4h)
- HIGH-04: Sentry integration (4h)
- HIGH-07: Analytics (4h)

**Result**: Production Ready ✅

---

### Week 3+ (Priority 3)
- HIGH-05: Performance optimization (2 days)
- HIGH-06: TypeScript strict mode (3 days)
- MED-01: Staging environment (2h)
- MED-03: Custom Modal (4h)
- BLOCK-01: Chatbot UI (when unblocked)

**Result**: 100% Complete 🎉

---

## 📝 NOTES

### Key Observations
1. **Testing = Biggest Risk**: 0% coverage là red flag lớn nhất
2. **Quick Wins Available**: Excel, Profile UI, Cancel warning - có thể làm trong 1-2 ngày
3. **Backend Dependencies Clear**: Chỉ 2 features blocked, có thể proceed without
4. **Good Foundation**: Core features working, chỉ cần polish

### Recommendations
1. **Don't skip testing**: Setup framework ngay week này
2. **Fix CRITICAL first**: 5 critical issues before adding new features
3. **Backend sync**: Clarify duplicate schedule validation
4. **Track progress**: Update this file weekly

---

**Last Updated**: 11/11/2025  
**Next Review**: 18/11/2025  
**Owner**: Development Team
