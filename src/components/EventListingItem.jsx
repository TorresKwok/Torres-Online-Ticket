import {FaCodepen, FaStore, FaUserFriends, FaUsers} from 'react-icons/fa'
import {GiSandsOfTime} from 'react-icons/gi'
import {Link} from "react-router-dom";
import {ReactComponent as DeleteIcon} from "../assets/svg/deleteIcon.svg";

function EventListingItem({listing, id}) {

    const {
        description,
        imageUrl,
        imdbUrl,
        name,
        director,
        stars,
        types,
        imdbRating,
        time,
        year,
    } = listing

    return (
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
                                {name} ({year})
                                <div className='ml-2 badge badge-accent'>
                                    IMDb: {imdbRating}
                                </div>
                                <div className='ml-2 badge badge-secondary'>
                                    {time}
                                </div>
                                {/*{types.map((type) => (*/}
                                {/*    <div className='ml-2 badge badge-primary'>*/}
                                {/*        {type}*/}
                                {/*    </div>*/}
                                {/*))}*/}
                            </h1>
                            {types.map((type) => (
                                <div className='ml-1 mt-4 mr-3 badge badge-primary'>
                                    {type}
                                </div>
                            ))}
                            <p className='mt-8'>{description}</p>
                            <div className='mt-10 card-actions'>
                                <a href={imdbUrl} target='_blank' rel='noreferrer' className='btn btn-outline mr-2'>
                                    Visit IMDB Page
                                </a>
                                <a href={`/purchase/${id}`} rel='noreferrer' className='btn btn-outline btn-primary ml-2'>
                                    Select an event
                                </a>
                            </div>
                        </div>

                        <div className='w-full rounded-lg shadow-md bg-base-100 mt-14 stats'>
                            <div className='stat'>
                                <div className='stat-title text-md'>Director</div>
                                <div className='text-lg stat-value'>{director}</div>
                            </div>
                            <div className='stat'>
                                <div className='stat-title text-md'>Main Characters</div>
                                <div className='text-lg stat-value'>{stars}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full py-5 mb-6 rounded-lg shadow-sm bg-base-100 stats'>
                </div>
                {/*<ReposList repos={repos}/>*/}
            </div>
    )
}

export default EventListingItem