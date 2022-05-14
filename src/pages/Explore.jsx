import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {collection, getDocs, query, where, orderBy, limit, startAfter} from "firebase/firestore";
import {db} from "../firebase.config";
import {toast} from "react-toastify";
import Spinner from "../components/Spinner";
import EventListingItem from "../components/EventListingItem";

function Explore() {

    const [eventListings, setEventListings] = useState(null)
    const [loading, setLoading] = useState(true) // will set to false after fetching the movie listings

    const params = useParams()

    useEffect(() => {
        const fetchEventListings = async () => {
            try {
                // Get reference
                const listingsRef = collection(db, 'events')

                // Create a query
                const q = query(listingsRef, orderBy('name', 'desc')) // SELECT * FROM events

                // Execute query
                const querySnap = await getDocs(q)
                let eventListings = []
                querySnap.forEach((doc) => {
                    return eventListings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setEventListings(eventListings)
                setLoading(false)
            } catch (error) {
                toast.error('Could not fetch events from firebase :(')
            }
        }

        fetchEventListings()
    }, [])

    return (
        <div className='mb-10'>
            <header>
                <p className='pageHeader text-5xl'>
                    Explore your movie
                </p>
            </header>

            {loading ? (
                <Spinner/>
            ) : (eventListings && eventListings.length > 0) ? (
                <>
                    <main>
                        <ul className='categoryListings'>
                            {eventListings.map((eventListing) => (
                                <EventListingItem listing={eventListing.data} id={eventListing.id} key={eventListing.id}/>
                            ))}
                        </ul>
                    </main>
                </>
            ) : (
                <p>No movie is available</p>
            )}
        </div>
    )
}

export default Explore