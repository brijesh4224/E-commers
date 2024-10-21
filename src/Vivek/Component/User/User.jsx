import React from 'react'
import Header from '../header/Header'
import Footer from '../footer/Footer'
import './user.css';
import '../common.css'
import { Col, Row } from 'react-bootstrap';
import LogoutModel from './LogoutModel';
import UserSidebar from './UserSidebar';
import { Outlet } from 'react-router-dom';

const User = () => {

    const [modalShow, setModalShow] = React.useState(false);

    return (
        <React.Fragment>
            {/* header */}
            <Header />
            <section className='pb-5'>
                <div className='pt-5'>
                    <aside className='inter'>
                        <div className='d_container'>
                            <Row>
                                {/* user Side Bar */}
                                <Col lg={3} md={4} className='pe-4'>
                                    <UserSidebar setModalShow={setModalShow} />
                                </Col>
                                <Col>
                                    <Outlet />
                                </Col>
                            </Row>
                        </div>
                    </aside>
                </div>
            </section>
            


            {/* footer */}
            <Footer />

            <LogoutModel show={modalShow}
                onHide={() => setModalShow(false)} />

        </React.Fragment>
    )
}

export default User