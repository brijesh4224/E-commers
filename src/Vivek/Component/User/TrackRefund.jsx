import React, { useEffect, useState } from 'react';
import '../User/user.css';
import Map from '../Map';
import { Modal } from 'react-bootstrap';
import Header from '../../Component/header/Header.jsx'
import Footer from '../footer/Footer.jsx';

function TrackRefund() {

    return (
        <React.Fragment>
            <Header />
            <section className='VK_user_profile mb-4 h-100 '>
                <div className="d_container">
                    <h2 className='VK_trackorder_heading py-5 mb-0'>
                        Track Refund
                    </h2>




                    {/* empty order */}
                    <div className='VK_my_order d-flex justify-content-center align-items-center h-100 d-none'>
                        <div className='VK_empty_order text-center'>
                            <div className='VK_empty_order_img'>
                                <img src={require('../../assets/empty_cart.png')} alt="" />
                            </div>
                            <div>
                                <p className='text-black fw-bold mb-1'>
                                    You have no orders
                                </p>
                                <p className='font_14 mb-4'>
                                    You have no order with us keep shopping with us
                                </p>
                                <button className='VK_empty_order_btn'>
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* my order */}
                    <div>
                        <div className='VK_order_parent'>
                            <div className='VK_order_card my-sm-3'>

                                <div className='V_pad'>
                                    <p className='m-0 fw-600 font_18'>
                                        Order Details
                                    </p>
                                </div>

                                <div className='d-flex justify-content-between flex-wrap align-items-center V_border_bottom '>
                                </div>
                                <div className='VK_order_product h-100 w-100 justify-content-between d-flex flex-wrap  py-3'>
                                    <div className="row m-0 flex-lg-row flex-column-reverse w-100 ">
                                        <div className="col-lg-4 px-0">
                                            <div className='d-flex'>
                                                <div className='px-0'>
                                                    <img src={require('../../assets/order1.png')} alt="" width="100px" height="120px" />
                                                </div>
                                                <div className='ps-2 ps-sm-4'>
                                                    <h1 className='V_full_pair'>Full pair stretched</h1>
                                                    <p className='V_full_child_text mb-0'>Lorem ipsum dolor sit amet consectetur. Ac iaculis viverra purus malesuada </p>
                                                    <p className='V_light mb-0 py-2'>Light Brown <span className='V_xl'>XL</span></p>
                                                    <p className='V_track_order_price mb-0'>$120</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-8 VK_subtrack py-3 pt-lg-0 pt-xl-3 position-relative overflow-auto">
                                            <div className='V_back-line'></div>
                                            <div className="d-flex justify-content-between px-md-3 px-lg-5 ">
                                                <div className='text-center'>
                                                    <p className='V_confirmed mb-0'>Refund Initiated</p>
                                                    <img src={require('../../assets/ordered confirmed.png')} alt="" className='py-2' />
                                                    <p className='V_track_time mb-0'>02 Oct, 2024  <span>5:21 PM</span></p>
                                                </div>
                                                <div className='text-center'>
                                                    <p className='V_confirmed mb-0'>Refund process</p>
                                                    <img src={require('../../assets/refund in process.png')} alt="" className='py-2' />
                                                    <p className='V_track_time mb-0'>05 Oct, 2024 <span>5:21 PM</span></p>
                                                </div>
                                                <div className='text-center'>
                                                    <p className='V_confirmed mb-0'>Refund Credited</p>
                                                    <img src={require('../../assets/delivered logo.png')} alt="" className='py-2' />
                                                    <p className='V_track_time mb-0'>08 Oct, 2024 <span>5:21 PM</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="V_pad  pt-lg-3 ">
                                    <p className='V_label '>Order ID:   <span className='V_label_value ps-2'> #5656565656</span></p>
                                    <p className='V_label mb-0'>Order Date:   <span className='V_label_value ps-2'> 21/09/2024</span> </p>
                                </div>

                            </div>
                        </div>
                        <div className='VK_order_card my-3 my-sm-5'>
                            <div className='VK_order_product h-100 w-100  py-3'>
                                <div className="row m-0">
                                    <div className=" col-6 V_right_border py-3">
                                        <div className='V_delivery_address_width'>
                                            <h1 className='V_delivery_address'>Delivery Address</h1>
                                            <p className='V_customer_name pt-3'>Jhon Wick</p>
                                            <p className='V_customer_address'>Ehrenkranz 13 Washington Square S, New York,Washington Square, NY 10012, USA</p>
                                            <p className='V_customer_number'>+1 56565 56565</p>
                                        </div>
                                    </div>
                                    <div className="col-6 py-3">
                                        <div className="V_invoice_width">
                                            <h1 className='V_invoice'>Invoice</h1>
                                            <p className='V_down_invoic mt-3'>Download Invoice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />

        </React.Fragment>
    )
}

export default TrackRefund