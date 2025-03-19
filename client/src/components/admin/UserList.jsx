"use client"

function UserList({ users, onEdit, onDelete }) {
  if (!users || users.length === 0) {
    return <p className="text-center py-4">No users found.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Created At</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="py-3 px-4">{user.name}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="py-3 px-4 text-center">
                <button onClick={() => onEdit(user)} className="btn btn-secondary py-1 px-3 mr-2">
                  Edit
                </button>
                <button onClick={() => onDelete(user._id)} className="btn btn-danger py-1 px-3">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList

