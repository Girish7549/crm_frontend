import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch } from 'react-redux'
import { baseUrl } from '../API/Api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState('')
  const [role, setRole] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const login = async (email, password) => {
    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      
      const data = await response.json()
      console.log('Response :', data)
     
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.data))
        setUser(data.data)
        setRole(data.data.role)
        toast.success('Login Successful')
        redirectUser(data.data.role)
      } else {
        toast.error(res.message || 'Login failed')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error('Login error:', error)
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const redirectUser = (role) => {
    switch (role) {
      case 'sales_agent':
        navigate('/employee')
        break
      case 'manager':
        navigate('/manager')
        break
      case 'admin':
        navigate('/admin')
        break
      case 'support':
        navigate('/support')
        break
      case 'activation':
        navigate('/activation')
        break
      default:
        navigate('/authentication/sign-in')
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>{children}</AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useAuth = () => useContext(AuthContext)
