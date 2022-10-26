import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { useCookies } from 'react-cookie';

const Login = () => {

    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['admin']);

    const [data, setData] = useState({
        email: "",
        password: ""
    });


    useEffect(() => {
        const getUserCookies = () => {
            const email = cookies.email;
            const password = cookies.password;

            if (!email || !password) return;
            LoginAdmin(email, password);
        }
        getUserCookies();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const LoginAdmin = async (email, pass) => {
        try {
            if (!email || !pass) {
                alert("Enter email and password");
                return false
            }


            const res = await axios.post(`${process.env.REACT_APP_SERVER}/admin/login`, {email, password:pass}, {
                headers:{"Content-Type":"application/json"}
            });

            if(res.data.success){
                setCookie('email', email, { path: '/adminLogin' });
                setCookie('password', pass, { path: '/adminLogin' });
                navigate("/table");
            }
            else{
                alert(res.data.msg);
                removeCookie("admin");
            }
        }
        catch (error) {
            alert("Unexpected error occurred")
        }
    }

    return (
        <div className="container bg-light d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <form className='shadow shadow-sm border p-3' style={{ minWidth: "50vw" }}>
                <h3 className='text-center'>Login</h3>

                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                    <input type="email" name='email' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" name='password' className="form-control" id="exampleInputPassword1" onChange={handleChange} />
                </div>

                <button type="button"
                    onClick={() => LoginAdmin(data.email, data.password)} className="btn btn-primary">Login</button>
            </form>
        </div>
    )
}

export default Login