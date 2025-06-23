import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import MainLayout from './components/MainLayout.tsx'
import Home from './pages/Home/index.tsx'
import AllReviews from './pages/AllReviews/index.tsx'
import Register from './pages/Register/index.tsx'
import Login from './pages/Login/index.tsx'
import { store } from './store/index.tsx'
import { Provider } from 'react-redux'
import AddReview from './pages/AddReview/index.tsx'
import PrivateRoute from './components/PrivateRoute.tsx'
import MyReviews from './pages/MyReviews/MyReviews.tsx'
import ReviewDetails from './pages/ReviewDetails/ReviewDetails.tsx'
import AddMovie from './pages/AddMovie/index.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    children: [
      { index: true, element: <Home /> },
      {path: "/reviews", element: <AllReviews/>},
      {path: "/register", element: <Register/>},
      {path: "/login", element: <Login/>},
      {
        path: "/reviews/my",
        element: (
          <PrivateRoute>
            <MyReviews/>
          </PrivateRoute>
        )
      }
    ]
  },
  {
    path: "/reviews/new",
  element: (
    <PrivateRoute>
      <AddReview />
    </PrivateRoute>
  )
  },
  {
  path: "/reviews/:id",
  element: (
    <PrivateRoute>
      <ReviewDetails />
    </PrivateRoute>
  )
},
{
  path: "movies/new",
  element: (
    <PrivateRoute>
      <AddMovie/>
    </PrivateRoute>
  )
}
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>

  </StrictMode>,
)
