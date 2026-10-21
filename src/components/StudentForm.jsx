import { useState, useEffect, useRef } from "react";

const INITIAL_FORM = {
  studentCode: "",
  name: "",
  email: "",
  major: "CNTT",
  gpa: "",
};

export default function StudentForm({ onSubmit, editingStudent, onCancelEdit }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const nameInputRef = useRef(null);

  // Tự động focus vào ô Họ tên khi mở trang (Slide 18)
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Điền dữ liệu vào form khi bấm nút "Sửa"
  useEffect(() => {
    if (editingStudent) {
      setForm({
        studentCode: editingStudent.studentCode || "",
        name: editingStudent.name || "",
        email: editingStudent.email || "",
        major: editingStudent.major || "CNTT",
        gpa: editingStudent.gpa ?? "",
      });
      nameInputRef.current?.focus();
    } else {
      setForm(INITIAL_FORM);
    }
  }, [editingStudent]);

  // Controlled component với Object spread (Slide 11)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.studentCode.trim() || !form.email.trim()) {
      alert("Vui lòng nhập đầy đủ Mã SV, Họ tên và Email!");
      return;
    }
    onSubmit({
      ...form,
      gpa: form.gpa ? parseFloat(form.gpa) : 0,
    });
    setForm(INITIAL_FORM);
    nameInputRef.current?.focus();
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <h3>{editingStudent ? "✏️ Cập nhật sinh viên" : "➕ Thêm sinh viên mới"}</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Mã SV:</label>
          <input
            name="studentCode"
            value={form.studentCode}
            onChange={handleChange}
            placeholder="VD: B21DCCN001"
          />
        </div>

        <div className="form-group">
          <label>Họ và tên:</label>
          <input
            ref={nameInputRef}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nhập họ tên sinh viên..."
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="sv@stu.ptit.edu.vn"
          />
        </div>

        <div className="form-group">
          <label>Ngành học:</label>
          <select name="major" value={form.major} onChange={handleChange}>
            <option value="CNTT">Công nghệ thông tin (CNTT)</option>
            <option value="ATTT">An toàn thông tin (ATTT)</option>
            <option value="KHMT">Khoa học máy tính (KHMT)</option>
            <option value="DTVT">Điện tử viễn thông (ĐTVT)</option>
            <option value="MKT">Marketing</option>
          </select>
        </div>

        <div className="form-group">
          <label>Điểm GPA (Hệ 4):</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="4"
            name="gpa"
            value={form.gpa}
            onChange={handleChange}
            placeholder="VD: 3.45"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editingStudent ? "Lưu thay đổi" : "Thêm sinh viên"}
        </button>
        {editingStudent && (
          <button type="button" className="btn-secondary" onClick={onCancelEdit}>
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}