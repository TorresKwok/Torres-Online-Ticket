import PropTypes from 'prop-types';
import {BiMoviePlay} from "react-icons/bi";
import {FaTrashAlt} from "react-icons/fa";
import {FaRegCalendarTimes} from "react-icons/fa";
import {AiOutlineMoneyCollect, AiFillEdit} from "react-icons/ai";
import {BiEdit} from "react-icons/bi";
import { useNavigate, Link } from "react-router-dom";
import {toast} from "react-toastify";
import { db } from "../firebase.config";
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore';

function CheckItem({id, data}) {

    const navigate = useNavigate()
    const currTime = new Date()

    const {
        imageUrl,
        name,
        price,
        description,
        seatType,
        selectDate,
        selectTime,
        hasChecked,
        eventId,
    } = data

    // console.log(data)

    const onSingleAction = async (e) => {
        e.preventDefault()

        try {
            // update in firestore
            const userRef = doc(db, 'tickets', id)
            await updateDoc(userRef, {
                hasChecked: true,
            })

            navigate('/profile')
            toast.success("Successfully checked out!")
        } catch (error) {
            toast.error('Could not update profile details')
        }
    }

    const onEdit = (e) => {
        e.preventDefault()
        navigate(`/edit/${id}`)
    }

    const onDelete = async (id) => {
        toast.success('Successfully deleted!')
        await deleteDoc(doc(db, 'tickets', `${id}`))
        window.location.reload();
    }

    return (
        <div className="card w-96 bg-base-300 shadow-2xl my-4">
            <figure>
                <img className="object-contain h-80 mt-4 rounded-xl dropdown dropdown-right" src={imageUrl} alt="image"/>
                {/*<FaTrashAlt className="justify-self-end"/>*/}
                {/*<AiFillEdit className="justify-self-end"/>*/}
            </figure>
            <div className="card-body">
                <h2 className="card-title mb-2">
                    <BiMoviePlay />
                    {name}
                    {(!hasChecked || (hasChecked && ((new Date(selectDate + " 2022")) > currTime))) && (
                        <button className="btn btn-xs" onClick={onEdit}>Edit</button>
                    )}
                    <label htmlFor="my-modal-5" className="btn btn-xs modal-button">Cancel</label>
                    <input type="checkbox" id="my-modal-5" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">{hasChecked ? 'Are you sure you want to cancel this purchase?' : 'Are you sure you want to remove this ticket from cart?'}</h3>

                            <div className="modal-action">
                                <label htmlFor="my-modal-5" className="btn btn-primary" onClick={() => onDelete(id)}>Accept</label>
                                <label htmlFor="my-modal-5" className="btn">Close</label>
                            </div>
                        </div>
                    </div>
                </h2>
                <div className="stats bg-base-200">
                    <div className="stat place-items-center">
                        <div className="stat-title">Movie Date</div>
                        <div className="stat-value">{selectTime}</div>
                        <div className="stat-desc">{selectDate}</div>
                    </div>
                    <div className="stat place-items-center">
                        <div className="stat-title text-secondary">Price</div>
                        <div className="stat-value text-secondary">${price}</div>
                        <div className="stat-desc text-secondary">{seatType}</div>
                    </div>
                </div>

                {!hasChecked && (
                    <div className="card-actions justify-end mt-4">
                        <label htmlFor="my-modal-3" className="btn btn-primary modal-button rounded-2xl">Buy Now</label>
                        <input type="checkbox" id="my-modal-3" className="modal-toggle" />
                        <div className="modal">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">Are you sure you want to buy this ticket?</h3>
                                <div className="py-4"><BiMoviePlay /> {name}</div>
                                <div className="py-4"><FaRegCalendarTimes /> {selectDate}, {selectTime}</div>
                                <div className="py-4"><AiOutlineMoneyCollect /> ${price}, {seatType}</div>

                                <div className="modal-action">
                                    <label htmlFor="my-modal-3" className="btn btn-primary" onClick={onSingleAction}>Accept</label>
                                    <label htmlFor="my-modal-3" className="btn">Close</label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

CheckItem.prototype = {
    id: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
}

export default CheckItem