import { RouterProvider } from 'react-router'
import { router } from './routes'
import { AuthProvider } from './features/auth/context'

function App() {

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
