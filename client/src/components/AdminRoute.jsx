import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Spinner from "./Spinner"

function AdminRoute({ children }) {
  const { admin, isLoading } = useSelector((state) => state.admin)

  // Only show spinner during initial load
  if (isLoading && admin === null) {
    return <Spinner />
  }

  // Only redirect if we're not loading and there's no admin
  if (!isLoading && !admin) {
    return <Navigate to="/admin/login" />
  }

  return children
}

export default AdminRoute