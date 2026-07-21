import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import useAuthStore from "../store/authStore.js";
import socket from '../socket/socket.js'
import {register} from '../api/auth.js'

export default function Register() {
    const setAuth = useAuthStore(state => state.setAuth);
    const navigate = useNavigate();
    
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        
        try{
            const data = await register({name, email, password})
            setAuth(data.token, data.user)
            
            socket.connect()
            navigate('/dashboard')
        }catch(err){
            setError(err.error || 'Registration Failed')
        }finally{
            setLoading(false);
        }
    }
    
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Register</h1>
                    <p className="text-gray-500 text-sm mt-1">Create you account</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email"
                               value={email}
                               onChange={e => setEmail(e.target.value)}
                               required
                               placeholder="your@example.com"
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password"
                               value={password}
                               onChange={e => setPassword(e.target.value)}
                               required
                               placeholder="Password"
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"/>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
                    )}
                    
                    <button type="submit" disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">{loading ? 'Creating Account...' : 'Register'}</button>
                </form>
                
                <p className="text-center text-sm text-gray-500 mt-6">Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    )
}