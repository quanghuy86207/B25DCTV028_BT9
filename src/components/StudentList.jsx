export default function StudentList({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return <p className="empty-msg">Không tìm thấy sinh viên nào phù hợp.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            <th>Mã SV</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Ngành</th>
            <th>GPA</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv) => (
            <tr key={sv.id}>
              <td><strong>{sv.studentCode}</strong></td>
              <td>{sv.name}</td>
              <td>{sv.email}</td>
              <td><span className="badge">{sv.major}</span></td>
              <td>{sv.gpa}</td>
              <td className="actions-cell">
                <button className="btn-edit" onClick={() => onEdit(sv)}>
                  Sửa
                </button>
                <button className="btn-delete" onClick={() => onDelete(sv.id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}