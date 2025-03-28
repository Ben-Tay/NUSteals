import React , {useEffect} from 'react'
import { IoPersonCircleOutline } from "react-icons/io5";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import moment from 'moment';

// will require useEffect to fetch from express the admin profile in future

const AdminDashboard = () => {

    const mockAdmin = { name: "Cherry"};
    const today = moment().format('MMMM D, YYYY'); 

    return (
        <>
            <div className="mx-3">
                <div className="flex justify-between">
                    <div className="flex bg-white p-2 shadow-md border w-fit">
                        <h5 className="d-flex items-center gap-2 font-semibold ">
                            Hello  {mockAdmin.name}
                            <IoPersonCircleOutline className="mt-1"/>
                        </h5>
                    </div>
                    <p className="text-primary">{moment().format('MMMM D, YYYY')}</p>
                </div>
            
                <Card className="w-18 mt-3">
                    <Card.Body>
                        <Card.Title>Admin Dashboard</Card.Title>
                        <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                        </Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                    </Card.Body>
                </Card>
            </div>  
        </>
    )
}

export default AdminDashboard