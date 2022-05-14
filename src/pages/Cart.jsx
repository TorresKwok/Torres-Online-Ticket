import {useState, useEffect, useRef} from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase.config";
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import CheckItem from "../components/CheckItem";
import Spinner from "../components/Spinner";
import {BiMoviePlay} from "react-icons/bi";
import {FaRegCalendarTimes} from "react-icons/fa";
import {AiOutlineMoneyCollect} from "react-icons/ai";

function Cart() {

    const auth = getAuth()
    const navigate = useNavigate()

    const [checkItemList, setCheckItemList] = useState(null)
    const [loading, setLoading] = useState(true)

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
                        setLoading(false)
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

    if (loading) {
        return <Spinner />
    }

    const onCheckOutAll = async (e) => {
        e.preventDefault()

        try {
            // update in firestore
            await checkItemList.map((item) => {
                const userRef = doc(db, 'tickets', item.id)
                updateDoc(userRef, {
                    hasChecked: true,
                })
            })

            navigate('/profile')
            toast.success("All tickets are successfully checked out!")
        } catch (error) {
            toast.error('Could not checked them out :(')
        }
    }

    return (
        <div className='mb-10'>
            <header className='profileHeader'>
                <p className='pageHeader text-5xl'>
                    Proceed To Checkout
                </p>
                <div className="card-actions justify-end mt-4">
                    <label htmlFor="my-modal-2" className="btn btn-secondary modal-button rounded-2xl mb-10">Check Out All Tickets</label>
                    <input type="checkbox" id="my-modal-2" className="modal-toggle" />
                    {checkItemList.length !== 0 && (
                        <div className="modal">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">Are you sure you want to buy all these {checkItemList.length} {checkItemList.length > 1 ? 'tickets' : 'ticket'}?</h3>
                                <div className="modal-action">
                                    <label htmlFor="my-modal-2" className="btn btn-primary" onClick={onCheckOutAll}>Accept</label>
                                    <label htmlFor="my-modal-2" className="btn">Close</label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>
            <div className="grid grid-cols-3">
                {checkItemList.map((item) => (
                    <>
                        <CheckItem key={item.id} id={item.id} data={item.data}/>
                    </>
                ))}
            </div>
        </div>
    )
}

export default Cart