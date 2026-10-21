import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Header({ totalStudents }) {
  const { theme, toggle } = useContext(ThemeContext);

  return (
    <header className="header">
      <div>
        <h1>🎓 Quản lý Sinh viên (React Hooks)</h1>
        <p className="subtitle">
          Tổng số sinh viên hiện tại: <strong>{totalStudents}</strong>
        </p>
      </div>
      <button onClick={toggle} className="btn-theme">
        {theme === "light" ? "🌙 Chế độ Tối (Dark)" : "☀️ Chế độ Sáng (Light)"}
      </button>
    </header>
  );
}