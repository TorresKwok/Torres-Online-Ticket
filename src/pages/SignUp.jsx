import {useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {setDoc, doc, serverTimestamp} from "firebase/firestore";
import {db} from '../firebase.config';
import {toast} from 'react-toastify';
import OAuth from "../components/OAuth";

function SignUp() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })
    const {name, email, password} = formData
    const navigate = useNavigate()

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const auth = getAuth()

            const userCredentials = await createUserWithEmailAndPassword(auth, email, password)

            const user = userCredentials.user

            updateProfile(auth.currentUser, {
                displayName: name
            })

            const formDataCopy = {...formData}
            delete formDataCopy.password
            formDataCopy.timestamp = serverTimestamp()

            await setDoc(doc(db, 'users', user.uid), formDataCopy)

            navigate('/')
            toast.success('Sign up successfully!')

        } catch (error) {
            toast.error('Can not sign up now :(')
        }
    }

    return (
        <div className="hero bg-base-100">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Sign Up now!</h1>
                    <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiadfsafdsdfsdaf.</p>
                </div>
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <form onSubmit={onSubmit}>
                            <div className="card-body">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Name</span>
                                        </label>
                                        <input type="text"
                                               placeholder="Name"
                                               className="input input-bordered"
                                               id="name"
                                               value={name}
                                               onChange={onChange}
                                        />
                                    </div>
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
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input type="password"
                                               placeholder="Password"
                                               className="input input-bordered"
                                               id="password"
                                               value={password}
                                               onChange={onChange}
                                        />
                                    </div>

                                <OAuth />

                                <div className="form-control mt-6">
                                    <button className="btn btn-primary">Sign Up</button>
                                </div>
                            </div>
                        </form>
                    </div>
            </div>
        </div>
    )
}

export default SignUp