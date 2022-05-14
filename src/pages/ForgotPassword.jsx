import {useState} from "react";
import {Link} from 'react-router-dom'
import {getAuth, sendPasswordResetEmail} from "firebase/auth";
import {toast} from "react-toastify";

function ForgotPassword() {

    const [email, setEmail] = useState("")

    const onChange = (e) => {
        setEmail(e.target.value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth()
            await sendPasswordResetEmail(auth, email)
            toast.success('Email was sent')
        } catch (error) {
            toast.error('Could not reset email')
        }
    }

    return (
        <div className="hero bg-base-100">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Reset password</h1>
                    <p className="py-6">Provident cupiditate voluptatem et in.fsadfsad Quaerat fugiadfsafdsdfsdaf.</p>
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={onSubmit}>
                        <div className="card-body">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="text"
                                       placeholder="Email"
                                       className="input input-bordered"
                                       id="email"
                                       value={email}
                                       onChange={onChange}
                                />
                            </div>
                            <div className="form-control mt-6">
                                <button className="btn btn-primary">Send Reset Link</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword