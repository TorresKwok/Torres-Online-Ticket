import {useState, useEffect, useRef} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useNavigate, Link} from "react-router-dom";
import {BiCameraMovie} from "react-icons/bi";
import CheckItem from "../components/CheckItem";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebase.config";
import Spinner from "../components/Spinner";

function Profile() {

    const auth = getAuth()
    const [checkItemList, setCheckItemList] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })

    const {name, email} = formData
    const currTime = new Date()

    const isMounted = useRef(true)

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const fetchUserListings = async () => {
                        const listingsRef = collection(db, 'tickets')
                        const q = query(
                            listingsRef,
                            where('userRef', '==', user.uid),
                            where('hasChecked', '==', true))

                        const querySnap = await getDocs(q)

                        let checkItemList = []
                        querySnap.forEach((doc) => {
                            return checkItemList.push({
                                id: doc.id,
                                data: doc.data(),
                            })
                        })
                        setCheckItemList(checkItemList)
                        setLoading(false)
                    }

                    fetchUserListings()
                } else {
                    navigate('/sign-in')
                }
            })
            // window.location.reload()
        }
        return () => {
            isMounted.current = false
        }
    }, [isMounted, auth, navigate])

    const onLogout = () => {
        auth.signOut()
        navigate('/')
    }

    return (
        <>
            <div className="card w-auto bg-base-200 shadow-xl my-10 h-60">
                <div className="card-body my-10">
                    <h1 className="card-title text-3xl mb-2">{name}</h1>
                    <p>{email}</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary" onClick={onLogout}>Logout</button>
                    </div>
                </div>
            </div>

            <button className="btn gap-2 no-animation">
                <BiCameraMovie size='1.5em'/>
                Upcoming Events
            </button>

            <div className="flex flex-col w-full">
                <div className="divider"></div>
            </div>

            <div className="grid grid-cols-3">
                {checkItemList !== null &&checkItemList.map((item) => (
                    ((new Date(item.data.selectDate + " 2022")) > currTime) && (
                        <>
                            <CheckItem key={item.id} id={item.id} data={item.data}/>
                        </>
                    )
                ))}
            </div>

            <button className="btn gap-2 no-animation mt-20">
                <BiCameraMovie size='1.5em'/>
                Past Events
            </button>

            <div className="flex flex-col w-full">
                <div className="divider"></div>
            </div>

            <div className="grid grid-cols-3">
                {checkItemList !== null &&checkItemList.map((item) => (
                    !((new Date(item.data.selectDate + " 2022")) > currTime) && (
                        <>
                            <CheckItem key={item.id} id={item.id} data={item.data}/>
                        </>
                    )
                ))}
            </div>

        </>
    )
}

export default Profile