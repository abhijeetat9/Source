import {useState} from "react";
import {useRecoilState} from "recoil";
import {useNavigate, Link} from "react-router-dom";
import {authAtom} from "../atoms/authAtom";
import {register} from "../api/auth";

export default function Register() {
    const[,setAuth] = useRecoilState(authAtom);
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await register({name, email, password});
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            setAuth({token: data.token, user: data.user});

            navigate('/dashboard');
        } catch (err) {
            setError(err.error || 'Login failed.');
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required/>
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
                </div>
                {error && <p>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>
            </form>
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
    )
}