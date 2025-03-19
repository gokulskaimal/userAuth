import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Spinner from "./Spinner"

function ProtectedRoute({ children }) {
  const { user, isLoading } = useSelector((state) => state.auth)

  if (isLoading) {
    return <Spinner />
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute

