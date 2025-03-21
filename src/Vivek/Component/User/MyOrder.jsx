import React, { useEffect, useState } from 'react';
import Map from '../Map';
import { useNavigate } from 'react-router-dom';

const MyOrder = () => {
    const navigate = useNavigate();
    const myorder = [
        {
            id: 1,
            name: "Full pair stretched",
            description: "Lorem ipsum dolor sit amet consectetur. Ac iaculis viverra purus malesuada quam dolor.",
            color: "Light Brown",
            size: "XL",
            price: 120,
            status: "arriving",
            status_date: "26 Oct, 2023",
            image: "order1.png"
        },
        {
            id: 2,
            name: "Samsung S24 Ultra",
            description: "Lorem ipsum dolor sit amet consectetur. Ac iaculis viverra purus malesuada quam dolor.",
            price: 220,
            message: "Your item has been delivered successfully",
            status: "Delivered",
            status_date: "20 Oct, 2023",
            image: "order2.png"
        },
        {
            id: 3,
            name: "Rule zip jacket",
            description: "Lorem ipsum dolor sit amet consectetur. Ac iaculis viverra purus malesuada quam dolor.",
            color: "Brown",
            size: "XL",
            price: 120,
            message: "Your item has been cancelled successfully",
            status: "Cancelled",
            status_date: "10 Oct, 2023",
            image: "order3.png"
        },
    ];

    const [orders, setOrders] = useState(myorder);
    const [current, setCurrent] = useState(myorder);

    useEffect(() => {
        setOrders(current);
    }, [current]);

    const handle_filter = (e, orderby) => {
        let filteredOrders = [];

        const buttons = document.querySelectorAll('.VK_order_btn');
        buttons.forEach(button => button.classList.remove('VK_order_btn_active'));

        e.target.classList.add('VK_order_btn_active');

        if (orderby === 'All') {
            filteredOrders = myorder;
        } else if (orderby === 'Delivered') {
            filteredOrders = myorder.filter(el => el.status === 'Delivered');
        } else if (orderby === 'Cancelled') {
            filteredOrders = myorder.filter(el => el.status === 'Cancelled');
        } else if (orderby === 'Progress') {
            filteredOrders = myorder.filter(el => el.status === 'arriving');
        }

        setOrders(filteredOrders);
    };

    const handleClick = (item) => {
        if (item.status === 'Delivered') {
            navigate('/ratereview');
        } else if (item.status === 'arriving') {
            navigate('/trackorder');
        } else if (item.status === 'Cancelled') {
            navigate('/trackrefund');
        }
    };

    return (
        <React.Fragment>
            <section className='VK_user_profile mb-4 h-100'>
                <h2 className='VK_profile_heading mb-4'>My Order</h2>

                {/* Filter buttons */}
                <div className='d-flex flex-wrap gap-3 mb-4'>
                    <button className='VK_order_btn VK_order_btn_active' onClick={(e) => handle_filter(e, 'All')}>
                        All
                    </button>
                    <button className='VK_order_btn' onClick={(e) => handle_filter(e, 'Progress')}>
                        In Progress
                    </button>
                    <button className='VK_order_btn' onClick={(e) => handle_filter(e, 'Delivered')}>
                        Delivered
                    </button>
                    <button className='VK_order_btn' onClick={(e) => handle_filter(e, 'Cancelled')}>
                        Cancelled
                    </button>
                </div>

                {/* Order list */}
                <div className='VK_order_parent'>
                    <Map data={orders}>
                        {(item) => (
                            <div className='VK_order_card my-3' key={item.id}>
                                <div className='VK_order_product h-100 w-100 justify-content-between d-flex flex-wrap'>
                                    <div className='VK_order_detail d-flex flex-sm-row flex-column'>
                                        <div>
                                            <img src={require(`../../assets/${item.image}`)} className='VK_order_images object_cover' alt={item.name} />
                                        </div>
                                        <div className='ps-sm-4 my-4 my-sm-0'>
                                            <h5 className='text-black fw-bold'>{item.name}</h5>
                                            <p className='font_14 mb-1 text-black fw-500'>{item.description}</p>
                                            {item.color && <p className='font_14 light_color mb-1'>{item.color}</p>}
                                            {item.size && <p className='font_14 light_color m-0'>{item.size}</p>}
                                        </div>
                                    </div>
                                    <div className='VK_order_price'>
                                        <p className='m-0'>${item.price}</p>
                                    </div>
                                    <div className='VK_order_status ms-xl-0 ms-auto mt-xl-0 mt-4'>
                                        <div className='h-100 d-flex flex-column'>
                                            <h4 className='d-flex flex-wrap align-items-center'>
                                                <span className='VK_order_dots me-sm-3 me-2'></span>
                                                <span className={`VK_order_stu ${item.status === 'Delivered' ? 'text-success' : item.status === 'arriving' ? 'text-warning' : item.status === 'Cancelled' ? 'text-danger' : ''}`}>
                                                    Order {item.status}
                                                </span>
                                                <span className='VK_order_date ps-2'>On {item.status_date}</span>
                                            </h4>
                                            <p className='font_14 fw-bold light_color'>{item.message}</p>
                                            <p className='mt-auto text-end m-0 font_16 VK_track fw-500'>
                                                <div onClick={() => handleClick(item)}>
                                                    {item.status === 'Delivered'
                                                        ? 'Add Rate & Review'
                                                        : item.status === 'arriving'
                                                            ? 'Track Order'
                                                            : item.status === 'Cancelled'
                                                                ? 'View refund status'
                                                                : null}
                                                </div>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Map>
                </div>
            </section>
        </React.Fragment>
    );
};

export default MyOrder;
