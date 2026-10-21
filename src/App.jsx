import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import useFetch from "./hooks/useFetch";
import Header from "./components/Header";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import "./App.css";

// Thay bằng link MockAPI của bạn (Resource: students)
const API_URL = "https://67c83c540acf98d0708585f0.mockapi.io/students";

export default function App() {
  const { theme } = useContext(ThemeContext);
  const { data: students, setData: setStudents, loading, error } = useFetch(API_URL);

  const [editingStudent, setEditingStudent] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [majorFilter, setMajorFilter] = useState("ALL");

  // Effect cập nhật tiêu đề trang theo số lượng sinh viên (Slide 13)
  useEffect(() => {
    document.title = `Quản lý SV (${students.length} sinh viên)`;
  }, [students.length]);

  // Effect tìm kiếm có độ trễ (Debounce 400ms) + Cleanup (Slide 16)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 400);

    return () => clearTimeout(timer); // Hủy hẹn giờ cũ nếu người dùng gõ tiếp
  }, [keyword]);

  // Thêm hoặc Cập nhật sinh viên (Gọi API POST/PUT + cập nhật state)
  const handleAddOrUpdate = async (studentData) => {
    try {
      if (editingStudent) {
        // Cập nhật (PUT)
        const res = await fetch(`${API_URL}/${editingStudent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentData),
        });
        if (!res.ok) throw new Error("Không thể cập nhật trên server");
        const updated = await res.json();
        setStudents((prev) =>
          prev.map((sv) => (sv.id === editingStudent.id ? updated : sv))
        );
        setEditingStudent(null);
      } else {
        // Thêm mới (POST)
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentData),
        });
        if (!res.ok) throw new Error("Không thể thêm mới lên server");
        const created = await res.json();
        setStudents((prev) => [...prev, created]);
      }
    } catch (err) {
      // Fallback cập nhật local state nếu link MockAPI mẫu chưa cấu hình đúng
      if (editingStudent) {
        setStudents((prev) =>
          prev.map((sv) =>
            sv.id === editingStudent.id ? { ...studentData, id: sv.id } : sv
          )
        );
        setEditingStudent(null);
      } else {
        setStudents((prev) => [
          ...prev,
          { ...studentData, id: Date.now().toString() },
        ]);
      }
    }
  };

  // Xóa sinh viên (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    } finally {
      setStudents((prev) => prev.filter((sv) => sv.id !== id));
    }
  };

  // Lọc danh sách theo từ khóa (đã debounce) và ngành học
  const filteredStudents = students.filter((sv) => {
    const matchName =
      sv.name?.toLowerCase().includes(debouncedKeyword.toLowerCase()) ||
      sv.studentCode?.toLowerCase().includes(debouncedKeyword.toLowerCase());
    const matchMajor = majorFilter === "ALL" || sv.major === majorFilter;
    return matchName && matchMajor;
  });

  return (
    <div className={`app-container ${theme}`}>
      <div className="main-content">
        <Header totalStudents={students.length} />

        <StudentForm
          onSubmit={handleAddOrUpdate}
          editingStudent={editingStudent}
          onCancelEdit={() => setEditingStudent(null)}
        />

        {/* Thanh công cụ tìm kiếm & lọc */}
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Tìm theo tên hoặc mã SV (Debounce 400ms)..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select
            className="filter-select"
            value={majorFilter}
            onChange={(e) => setMajorFilter(e.target.value)}
          >
            <option value="ALL">Tất cả ngành</option>
            <option value="CNTT">CNTT</option>
            <option value="ATTT">ATTT</option>
            <option value="KHMT">KHMT</option>
            <option value="DTVT">ĐTVT</option>
            <option value="MKT">Marketing</option>
          </select>
        </div>

        {/* Hiển thị đủ 3 trạng thái: Đang tải, Lỗi, Thành công (Slide 15 & 30) */}
        {loading && <p className="status-loading">⏳ Đang tải dữ liệu từ MockAPI...</p>}
        {error && (
          <div className="status-error">
            <p>⚠️ Lỗi kết nối MockAPI: {error}</p>
            <small>
              Hãy kiểm tra lại biến <code>API_URL</code> trong file <code>src/App.jsx</code>.
              Bạn vẫn có thể thử thêm/sửa/xóa trực tiếp trên giao diện!
            </small>
          </div>
        )}
        {!loading && (
          <StudentList
            students={filteredStudents}
            onEdit={(sv) => setEditingStudent(sv)}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}