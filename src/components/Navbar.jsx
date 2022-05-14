import {useNavigate, Link} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase.config";
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import {useEffect, useRef, useState} from "react";

function Navbar() {

    const auth = getAuth()
    const navigate = useNavigate()

    const onLogout = () => {
        auth.signOut()
        navigate('/')
    }

    const [checkItemList, setCheckItemList] = useState(null)
    const [checkItemCnt, setCheckItemCnt] = useState(0)
    const [checkItemPrice, setCheckItemPrice] = useState(0)
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
                            where('hasChecked', '==', false))

                        const querySnap = await getDocs(q)

                        let checkItemList = []
                        querySnap.forEach((doc) => {
                            return checkItemList.push({
                                id: doc.id,
                                data: doc.data(),
                            })
                        })
                        setCheckItemList(checkItemList)
                        checkItemList.map((item) => {
                            setCheckItemCnt(checkItemCnt + 1)
                            setCheckItemPrice(checkItemPrice + item.data.price)
                        })
                    }

                    fetchUserListings()
                } else {
                    navigate('/sign-in')
                }
            })
        }
        return () => {
            isMounted.current = false
        }
    }, [isMounted, auth, navigate])

    return (
        <div className="navbar bg-base-300">
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl" href="/">Torres Online Ticket Reservation</a>
            </div>
            <div className="flex-none">
                {/*<div className="dropdown dropdown-end">*/}
                {/*    <label tabIndex="0" className="btn btn-ghost btn-circle">*/}
                {/*        <div className="indicator">*/}
                {/*            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"*/}
                {/*                 stroke="currentColor">*/}
                {/*                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"*/}
                {/*                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>*/}
                {/*            </svg>*/}
                {/*            <span className="badge badge-sm indicator-item">{checkItemCnt}</span>*/}
                {/*        </div>*/}
                {/*    </label>*/}
                {/*    <div tabIndex="0" className="mt-3 card card-compact dropdown-content w-52 bg-base-300 shadow">*/}
                {/*        <div className="card-body">*/}
                {/*            <span className="font-bold text-lg">{checkItemCnt} {checkItemCnt < 2 ? 'Item' : 'Items'}</span>*/}
                {/*            <span className="text-info">Subtotal: ${checkItemPrice}</span>*/}
                {/*            <div className="card-actions">*/}
                {/*                <a href='/cart' className='btn btn-primary btn-block'>*/}
                {/*                    View Cart*/}
                {/*                </a>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <a href="/cart" rel='noreferrer' className='bg-base-300 ml-2 btn btn-ghost btn-circle'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        <a href='/cart' />
                    </svg>
                </a>

                <div className="dropdown dropdown-end">
                    <label tabIndex="0" className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                        </div>
                    </label>
                    <ul tabIndex="0"
                        className="menu menu-compact dropdown-content mt-3 p-2 shadow rounded-box w-52 bg-base-300">
                        <li>
                            <a className="justify-between" href="/profile">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a onClick={onLogout}>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar