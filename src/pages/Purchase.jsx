import {useState, useEffect} from "react";
import {getDoc, doc} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {db} from "../firebase.config";
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import Spinner from "../components/Spinner";

function Purchase() {

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectDate, setSelectDate] = useState(null)
    const [selectTime, setSelectTime] = useState(null)
    const [selectType, setSelectType] = useState(null)

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'events', params.eventId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setListing(docSnap.data())
                setLoading(false)
            }
        }
        fetchListing()
    }, [navigate, params.eventId])

    if (loading) {
        return <Spinner />
    }

    const onDateChange = (e) => {
        setSelectDate(e.target.value)
        setSelectTime(null)
        setSelectType(null)
    }

    const onTimeChange = (e) => {
        e.preventDefault()
        setSelectTime(e.target.innerText)
        setSelectType(null)
    }

    const onTypeChange = (e) => {
        e.preventDefault()
        setSelectType(e.target.innerText)
    }

    const {
        description,
        imageUrl,
        imdbUrl,
        name,
        director,
        stars,
        types,
        prices,
        imdbRating,
        time,
        year,
        showTimes,
    } = listing

    const onSubmit = async (e) => {

        e.preventDefault()
        setLoading(true)

        const ticket = {
            ...listing,
            hasPassed: false,
            price: prices[selectType],
            selectDate: selectDate,
            selectTime: selectTime,
            seatType: selectType,
            hasChecked: false,
            eventId: params.eventId,
            userRef: auth.currentUser.uid,
            userName: auth.currentUser.displayName,
        }

        await addDoc(collection(db, 'tickets'), ticket)
        setLoading(false)
        toast.success("Event added successfully!")
        navigate('/cart')
    }

    return (
        <div className='mb-10'>
            <header>
                <p className='pageHeader text-5xl'>
                    Find Showtime
                </p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
                    <div className='w-full mx-auto lg:w-10/12'>
                        <div className='grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 mb-8 md:gap-8'>
                            <div className='custom-card-image mb-6 md:mb-0'>
                                <div className='rounded-lg shadow-xl card image-full'>
                                    <figure>
                                        <img src={imageUrl} alt='' />
                                    </figure>
                                </div>
                            </div>
                            <div className='col-span-2'>
                                <div className='mb-6'>
                                    <h1 className='text-3xl card-title'>
                                        {listing.name} ({year})
                                        <div className='ml-2 badge badge-accent'>
                                            IMDb: {imdbRating}
                                        </div>
                                        <div className='ml-2 badge badge-secondary'>
                                            {time}
                                        </div>
                                    </h1>
                                    {listing.types.map((type) => (
                                        <div className='ml-1 mt-4 mr-3 badge badge-primary'>
                                            {type}
                                        </div>
                                    ))}
                                </div>

                                {/*Select Date Button*/}
                                <select className="select select-primary w-full max-w-xs mt-16 flex" onChange={onDateChange}>
                                    <option disabled selected>Pick a movie date</option>
                                    {Object.keys(showTimes).map((showDate) => (
                                        <option>{showDate}</option>
                                    ))}
                                </select>

                                {/*Select DateTime Button*/}
                                {selectDate !== null && Object.values(showTimes[selectDate]).map((dateTime) => (
                                    <button
                                        onClick={onTimeChange}
                                        className={"btn btn-secondary rounded-full mr-4 my-10 " + (dateTime === selectTime ? "btn-active" : "btn-outline")}
                                    >
                                        {dateTime}
                                    </button>
                                ))}

                                <br></br>

                                {selectTime !== null && Object.entries(prices).map((price) => (
                                    <button
                                        onClick={onTypeChange}
                                        className={"btn btn-info rounded-xl mr-4 my-2 tooltip " +
                                            (price[0] == selectType ? "" : "btn-outline")}
                                        data-tip={'$' + price[1]}
                                    >
                                        {price[0]}
                                    </button>
                                ))}

                                <br></br>

                                {/*Check-out Button*/}
                                {selectType !== null && (
                                    <button
                                        className="btn btn-wide btn-lg btn-outline btn-primary mt-11 flex"
                                        type='submit'
                                    >
                                        Add To Cart
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </main>

        </div>
    )
}

export default Purchase