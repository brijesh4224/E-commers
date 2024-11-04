import React, { useEffect, useRef, useState } from 'react';
import { IoClose, IoLocationSharp, IoShareSocialSharp } from 'react-icons/io5';
import detailImg1 from './../d_img/detailimg1.png';
import detailImg2 from './../d_img/detailimg2.png';
import detailImg3 from './../d_img/detailimg3.png';
import detailImg4 from './../d_img/detailimg4.png';
import detailVideo from './../d_img/detailvideo.mp4';
import playIcon from './../d_img/play1.png';
import icon360 from './../d_img/360.png';
import './../css/womendetail.css';
import { FaStar } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { CiHeart } from 'react-icons/ci';
import Accordion from 'react-bootstrap/Accordion';
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';
import Bought from '../components/Bought';
import Like from '../components/Like';
import Recentlyviewed from '../components/Recentlyviewed';
import Customerlike from '../components/Customerlike';
import { Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ReactImageTurntable } from 'react-image-turntable';
import OwlCarousel from 'react-owl-carousel';
import Header from '../../Vivek/Component/header/Header';
import Subscribe from '../../Vivek/Component/common/Subscribe';
import Process from '../../Vivek/Component/common/Process';
import Footer from '../../Vivek/Component/footer/Footer';
import ReactImageMagnify from 'react-image-magnify';

import ReactImageMagnify from 'react-image-magnify';


const WomenDetails = () => {



    const [imageLoaded, setImageLoaded] = useState(false);

    const [mainContent, setMainContent] = useState({
        type: 'image',
        src: detailImg4,
        index: 0
    });
    const [is360Active, setIs360Active] = useState(false);
    const [isquantityOpen, setIsquantityOpen] = useState(false);
    const [isImageVisible, setIsImageVisible] = useState(true); // Control image visibility
    const [sizemodalShow, setsizeModalShow] = useState(false);
    const [offermodalShow, setofferModalShow] = useState(false);
    const [imagemodalShow, setimageModalShow] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const viewerRef = useRef(null);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [lastX, setLastX] = useState(0);
    const imageCount = 4; // Number of images (adjust as needed)
    const images = useRef([]);
    const dragThreshold = 30; // Increase this value to slow down the image change speed

    const galleryItems = [
        { type: 'image', src: detailImg1, thumbnail: detailImg1 },
        { type: 'image', src: detailImg2, thumbnail: detailImg2 },
        { type: 'video', src: detailVideo, thumbnail: detailVideo },
        { type: 'image', src: detailImg3, thumbnail: detailImg3 }
    ];

    useEffect(() => {
        if (mainContent.type === 'image') {
            const img = new Image();
            img.src = mainContent.src;
            img.onload = () => {
                setImageLoaded(true);
            };
        }
    }, [mainContent.src]);


    const handleThumbnailClick = (item, index) => {
        setImageLoaded(false); // Reset the image loading state
        setMainContent({ ...item, index });
        setIs360Active(false);

        // If it's a video, play it
        if (item.type === 'video' && videoRef.current) {
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.play();
                }
            }, 0);
        }
    };


    const toggle360View = () => {
        setIs360Active(!is360Active);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Product Details',
                url: window.location.href
            });
        }
    };

    // Toggle dropdown visibility
    const togglequantity = (e) => {
        e.stopPropagation(); // Prevent immediate closure on toggle click
        setIsquantityOpen(!isquantityOpen);
    };

    // Function to load images from the public folder
    const loadImages = () => {
        return Array.from({ length: imageCount }, (_, i) => {
            const img = new Image();
            img.src = `/360-images/detailimg${i + 1}.png`; // Access images in public/360-images
            return img;
        });
    };

    // Preload all images on component mount
    useEffect(() => {
        images.current = loadImages(); // Load images into the ref array
    }, []);

    // Resize canvas on window resize
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            const viewer = viewerRef.current;

            if (viewer && canvas) {
                // Set canvas width to match viewer's width
                canvas.width = viewer.clientWidth;

                // Calculate height based on aspect ratio
                const aspectRatio = images.current[currentFrame].naturalWidth / images.current[currentFrame].naturalHeight;
                canvas.height = canvas.width / aspectRatio;

                renderImage();
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial resize

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [currentFrame]); // Also update when the current frame changes

    // Render the current image on the canvas
    const renderImage = () => {
        const canvas = canvasRef.current;

        if (canvas) {
            const ctx = canvas.getContext('2d');

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Ensure the image is loaded
            const img = images.current[currentFrame];
            if (img?.complete) {
                // Draw the image with original aspect ratio
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                const newHeight = canvas.width / aspectRatio;

                ctx.drawImage(img, 0, 0, canvas.width, newHeight);
            }
        }
    };

    // Handle mouse and touch drag logic
    const startDragging = (pageX) => {
        setDragging(true);
        setLastX(pageX);
    };

    const stopDragging = () => {
        setDragging(false);
    };

    const handleClick = () => {
        // Ensure rendering is triggered on click as well
        renderImage();
    };

    const handleDrag = (pageX) => {
        if (dragging) {
            const dx = pageX - lastX;

            // Change image only when the drag exceeds the threshold value
            if (Math.abs(dx) > dragThreshold) {
                if (dx > 0) {
                    setCurrentFrame((prev) => (prev + 1) % imageCount); // Next frame
                } else if (dx < 0) {
                    setCurrentFrame((prev) => (prev - 1 + imageCount) % imageCount); // Previous frame
                }

                // Reset the lastX to avoid continuous frame changes
                setLastX(pageX);
            }
        }
    };

    // Re-render the image when the current frame changes
    // useEffect(() => {
    //     renderImage();
    // }, [currentFrame]);

    // useEffect(() => {
    //     handleSubContentClick();
    // }, [mainContent.src])

    // const [activeIndex, setActiveIndex] = React.useState(0); // To track the current slide
    // const slidervideoRef = useRef(null); // Ref to control video playback

    // const mediaItems = [
    //     { id: 1, type: 'image', src: require('./../d_img/detailimg1.png') },
    //     { id: 2, type: 'image', src: require('./../d_img/detailimg2.png') },
    //     { id: 3, type: 'image', src: require('./../d_img/detailimg3.png') },
    //     { id: 4, type: 'video', src: require('./../d_img/detailvideo.mp4') },
    //     { id: 5, type: 'image', src: require('./../d_img/detailimg5.png') },
    // ];


    // const carouselSettings = {
    //     items: 1,
    //     center: true,
    //     nav: false,
    //     dots: false,
    //     loop: true,
    //     margin: -15,
    //     stagePadding: 400,
    //     // URLhashListener: true,
    //     startPosition: activeIndex,
    //     responsive: {
    //         300: {
    //             items: 1,
    //             stagePadding: 30,
    //         },
    //         350: {
    //             items: 1,
    //             stagePadding: 45,
    //         },
    //         400: {
    //             items: 1,
    //             stagePadding: 95,
    //             margin: -15
    //         },
    //         750: {
    //             items: 1,
    //             stagePadding: 180
    //         },
    //         1000: {
    //             items: 1,
    //             stagePadding: 250
    //         },
    //         1440: {
    //             items: 1,
    //             stagePadding: 350,
    //             margin: -25,
    //         }
    //     },
    //     onChange: (event) => {
    //         setActiveIndex(event.item.index);
    //     }
    // };

    // // Function to handle thumbnail click
    // const handleThumbnailClick = (index) => {
    //     setActiveIndex(index);
    //     if (mediaItems[index].type === 'video' && slidervideoRef.current) {
    //         slidervideoRef.current.play();
    //     }
    // };

    // // Whenever activeIndex changes, reset video playback (for videos)
    // useEffect(() => {
    //     if (mediaItems[activeIndex]?.type !== 'video' && slidervideoRef.current) {
    //         slidervideoRef.current.pause();
    //     }
    // }, [activeIndex, mediaItems]);

    return (
        <>

            {/* Header section  */}
            <Header />

            {/* Personal Details section start */}
            <section className='d_p-50 pb-0 d_womendetail'>
                <div className="d_container">
                    <div className="row">
                        <div className="col-sm-12 col-lg-6">
                            <div className="row flex-row flex-sm-row flex-column-reverse">
                                {/* Thumbnail Column */}
                                <div className="col-12 col-sm-3 d-flex justify-content-center">
                                    <div className="d_subimg">
                                        {galleryItems.map((item, index) => (
                                            <div
                                                key={index}
                                                className="d_img cursor-pointer"
                                                onClick={() => handleThumbnailClick(item, index)}
                                            >
                                                {item.type === 'image' ? (
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="w-100 h-100"
                                                    />
                                                ) : (
                                                    <div className="v_img">
                                                        <video>
                                                            <source src={item.thumbnail} type="video/mp4" />
                                                        </video>
                                                        <div className="d_play">
                                                            <img src={playIcon} alt="Play" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="col-12 col-sm-9">
                                    <div className="d_mainimg">
                                        {mainContent.type === 'image' && !is360Active && (
                                            <div className="d_img ">

                                                <div className='d_reactglass'>
                                                    <ReactImageMagnify
                                                        {...{
                                                            smallImage: {
                                                                alt: 'Main content',                
                                                                isFluidWidth: true,                 
                                                                src: mainContent.src,               
                                                            },
                                                            largeImage: {
                                                                src: mainContent.src,               
                                                                width: 1200,                        
                                                                height: 1800,                       
                                                            },
                                                            enlargedImagePosition: "over",          
                                                            lensStyle: {                            
                                                                backgroundColor: 'rgba(255,255,255,0.3)',
                                                            },
                                                        }}
                                                    />
                                                </div>

                                                <div className="d_delicon">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <img
                                                            src={icon360}
                                                            alt="360 View"
                                                            onClick={() => {
                                                                toggle360View();
                                                                setCurrentFrame(1); // Ensure you have this function defined
                                                            }}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                        <IoShareSocialSharp
                                                            className='d_shareicon'
                                                            onClick={handleShare}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {mainContent.type === 'video' && (
                                            <video
                                                ref={videoRef}
                                                controls>
                                                <source src={mainContent.src} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                        {is360Active && (
                                            <div>
                                                <div id="viewer" ref={viewerRef}>
                                                    <canvas
                                                        className='w-100'
                                                        ref={canvasRef}
                                                        onMouseDown={(e) => startDragging(e.pageX)}
                                                        onMouseUp={stopDragging}
                                                        onMouseMove={(e) => handleDrag(e.pageX)}
                                                        onClick={handleClick}
                                                        onTouchStart={(e) => startDragging(e.touches[0].pageX)}
                                                        onTouchEnd={stopDragging}
                                                        onTouchMove={(e) => {
                                                            e.preventDefault();
                                                            handleDrag(e.touches[0].pageX);
                                                        }}
                                                    ></canvas>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-lg-6">
                            <div className="d_detail">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d_name">Traditional Chaniya choli</div>
                                    <div className="d_starbg">
                                        <div className="d-flex ">
                                            <FaStar className=" d_staricon me-1" />
                                            <div className="d_review">4.5</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='d_colordesc'>Elegant peach cotton silk chaniya choli</div>
                                <div className="d_stock">In Stock</div>
                                {/* <div className="d_outofstock">Out of Stock</div> */}
                                <div className="d_desc">Lorem ipsum dolor sit amet consectetur. Massa facilisis scelerisque iaculis habitant congue est blandit amet. Tortor in vulputate nulla vitae quam.Lorem ipsum dolor sit amet consectetur. Massa </div>
                                <div className="d-flex align-items-end">
                                    <div className="d_price me-2">$120</div>
                                    <div className="d_originalprice me-2">$140</div>
                                    <div className="d_saveprice ">(Save $20)</div>
                                </div>
                                <div className="d_offer">
                                    <div className="d_acc">
                                        <div className="d_accitem">
                                            <div className="d_acctitle d-flex justify-content-between">
                                                <div className='d_title'>Best Offers</div>
                                                <div className='d_icon d_cur' onClick={() => setofferModalShow(true)}>View More</div>
                                            </div>
                                            <div className="d_acccon">
                                                <div className="d-flex align-items-center">
                                                    <img src={require('./../d_img/offer.png')} alt="" className='me-2' />
                                                    <div className="d-flex justify-content-between w-100 aling-items-center">
                                                        <div className="d_offertitle">NEW100</div>
                                                        <div className="d_savepri">Save $100 </div>
                                                    </div>
                                                </div>
                                                <div className="d_offerdesc ms-4">Lorem ipsum dolor sit amet consectetur. Massa facilisis scelerisque iaculis habitant congue est blandit amet. </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d_deliver">
                                    <div className="d_tit">
                                        <IoLocationSharp className='me-2 d_loc' />Deliver to
                                    </div>
                                    <div className="row">
                                        <div className="col-12 col-sm-6 col-lg-12 col-xl-6">
                                            <div className="d_input d-flex justify-content-between align-items-center">
                                                <input type="text" placeholder='Enter delivery Pincode' />
                                                <a href="">Check</a>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-6 col-lg-12 col-xl-6 d_psdeliver">
                                            <div className="d_delivertime">Delivery by 7 Oct, Monday</div>
                                            <div className="d_deliverordertoday">if ordered before 5:11PM</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d_color">
                                    <div className="d_title">Colors :</div>
                                    <div className="d-flex">
                                        <div className="d_colorcircle active"></div>
                                        <div className="d_colorcircle" style={{ background: "#1D45A9" }}></div>
                                        <div className="d_colorcircle" style={{ background: "#172631" }}></div>
                                    </div>
                                </div>
                                <div className="d_size">
                                    <div className="row">
                                        <div className="col-12 col-sm-6 col-lg-12 col-xl-6">
                                            <div className="d-flex justify-content-between">
                                                <div className="d_title">Size :</div>
                                                <Link className='text-decoration-underline d_cur' onClick={(e) => { e.preventDefault(); setsizeModalShow(true) }}>Size chart</Link>
                                            </div>
                                            <div className="d-flex">
                                                <div className="d_sizebox d_disable d-flex justify-content-center align-items-center">
                                                    <div className="d_diagonal-line"></div>
                                                    <p className='mb-0'>34</p>
                                                </div>
                                                <div className="d_sizebox d-flex justify-content-center align-items-center">
                                                    <p className='mb-0'>36</p>
                                                </div>
                                                <div className="d_sizebox active d-flex justify-content-center align-items-center">
                                                    <p className='mb-0'>38</p>
                                                </div>
                                                <div className="d_sizebox d-flex justify-content-center align-items-center">
                                                    <p className='mb-0'>40</p>
                                                </div>
                                                <div className="d_sizebox d-flex justify-content-center align-items-center">
                                                    <p className='mb-0'>42</p>
                                                </div>
                                                <div className="d_sizebox d-flex justify-content-center align-items-center">
                                                    <p className='mb-0'>44</p>
                                                </div>
                                                <div className="d_sizebox d-flex justify-content-center align-items-center">
                                                    <p className='mb-0'>46</p>
                                                </div>
                                                {/* <div className="d_sizebox d_gbsize d-flex justify-content-center align-items-center">
                                                    <p className='mb-0'>128 GB</p>
                                                </div>
                                                <div className="d_sizebox d_gbsize d-flex justify-content-center align-items-center">
                                                    <p className='mb-0'>256 GB</p>
                                                </div>
                                                <div className="d_sizebox d_gbsize d_disable d-flex justify-content-center align-items-center">
                                                    <div className="d_diagonal-line"></div>
                                                    <p className='mb-0'>512 GB</p>
                                                </div> */}
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-6 col-lg-12 col-xl-6 d_psdeliver">
                                            <div className="d_qun">Quantity :</div>
                                            <div class="d_dropdownqun">
                                                <button class="d_dropbtnqun" onClick={togglequantity}>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        Select
                                                        <MdKeyboardArrowDown className='ms-2 d_dropicon' />
                                                    </div>
                                                </button>
                                                {isquantityOpen && (
                                                    <div className="d_dropconqun">
                                                        <a href="#home">1</a>
                                                        <a href="#about">2</a>
                                                        <a href="#contact">3</a>
                                                        <a href="#contact">4</a>
                                                        <a href="#contact">5</a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d_delbtn">
                                    <div className="d-flex">
                                        <div className="d_cta d-flex justify-content-center align-items-center me-3">
                                            <a href="" className='d_hearticon'><CiHeart className='' /></a>
                                        </div>
                                        <div className="d_cta  d-flex justify-content-center align-items-center me-3">
                                            <a href="" className='text-decoration-none d_buy text-center'>Buy Now</a>
                                        </div>
                                        <div className="d_cta  d-flex justify-content-center align-items-center">
                                            <a href="" className='text-decoration-none d_addcartbtn text-center d-block'>Add to cart</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="d_feau">
                                    <div className="d-flex flex-wrap">
                                        <div className="d-flex align-items-center d_feabg">
                                            <img src={require('./../d_img/fea1.png')} className='me-1' alt="" />
                                            <p className='mb-0'>Dispatch in 2 days</p>
                                        </div>
                                        <div className="d-flex align-items-center d_feabg">
                                            <img src={require('./../d_img/fea2.png')} className='me-1' alt="" />
                                            <p className='mb-0'>Easy return</p>
                                        </div>
                                        <div className="d-flex align-items-center d_feabg">
                                            <img src={require('./../d_img/fea3.png')} className='me-1' alt="" />
                                            <p className='mb-0'>Worldwide Shipping</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="d_text">
                                    <p className='mb-1'>* Additional 5 - 6 business days is required for delivery.</p>
                                    <p className='mb-0'>* For Plus Size Extra 5 - 10 business days is required for delivery.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
            {/* Personal Details section end */}

            {/* Product Information section Start */}

            <section className='d_proinfo d_p-50'>
                <div className="d_container">
                    <div className="row">
                        <div className="col-12">
                            <div className="d_heading">Product Information</div>
                        </div>
                    </div>
                    <Accordion defaultActiveKey={['0']} alwaysOpen>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Product Description</Accordion.Header>
                            <Accordion.Body className="d_prodesc">
                                <div className="d_desc">The peach cotton silk garba special chaniya choli is a vibrant and graceful ensemble, enhanced with sequins, cutadana, beads, mirror, cowrie shells and gota work. The charming choli features a sleeveless pattern, comes with a dupatta. The print and work may slightly vary from the image.</div>
                                <div className="d_digitalphoto">
                                    <p className='mb-0'>Slight colour variation is possible due to digital photography.</p>
                                </div>
                                <div className="prodel">
                                    <div className="d_head">Product Details</div>
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="d_con">
                                                <p className='mb-0'>Fabric</p>
                                                <div className="d_conhead">Cotton Silk</div>
                                            </div>
                                            <div className="d_con">
                                                <p className='mb-0'>Wash Care</p>
                                                <div className="d_conhead">Dry Clean Only</div>
                                            </div>
                                            <div className="d_con">
                                                <p className='mb-0'>Work</p>
                                                <div className="d_conhead">Cutdana, Sequins, Beads, Mirror, Gota, shells</div>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="d_con">
                                                <p className='mb-0'>Colour</p>
                                                <div className="d_conhead">Peach</div>
                                            </div>
                                            <div className="d_con">
                                                <p className='mb-0'>Occasion</p>
                                                <div className="d_conhead">Navratri</div>
                                            </div>
                                            <div className="d_con">
                                                <p className='mb-0'>Country Origin</p>
                                                <div className="d_conhead">India</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d_con">
                                        <p className='mb-0'>Manufacturing details</p>
                                        <div className="d_conhead d_add">Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016</div>
                                    </div>
                                </div>
                                {/* <div className="prodel">
                                    <div className="d_head">Product Details</div>
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="d_con">
                                                <p className='mb-0'>Model Name</p>
                                                <div className="d_conhead">iPhone 13 (256GB) - Midnight</div>
                                            </div>
                                            <div className="d_con">
                                                <p className='mb-0'>Operating System</p>
                                                <div className="d_conhead">iOS 14</div>
                                            </div>
                                            <div className="d_con">
                                                <p className='mb-0'>Memory Storage Capacity</p>
                                                <div className="d_conhead">256 GB</div>
                                            </div>
                                            <div className="d_con">
                                                <p className='mb-0'>Camera and Video</p>
                                                <div className="d_conhead d_add">Dual 12MP cameras with Portrait mode, Depth Control, Portrait Lighting, Smart HDR</div>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="d_con">
                                                <p className='mb-0'>Colour</p>
                                                <div className="d_conhead">Dark Blue</div>
                                            </div>
                                            <div className="d_con">
                                                <p className='mb-0'>Screen Size</p>
                                                <div className="d_conhead">6.1 Inches</div>
                                            </div>
                                            <div className="d_con">
                                                <p className='mb-0'>Browse Type</p>
                                                <div className="d_conhead">Smart Phones</div>
                                            </div>
                                            <div className="d_con">
                                                <p className='mb-0'>Front Camera</p>
                                                <div className="d_conhead d_add">12MP TrueDepth front camera with Portrait mode, Depth Control, Portrait Lighting</div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Shipping</Accordion.Header>
                            <Accordion.Body className="d_proshipping">
                                <p>Once our system has processed the order that you have placed with us, your products are thoroughly inspected to ensure that they are in pristine condition. If they pass the final round of quality checks, we will pack and hand them over to our reliable logistic partner.</p>
                                <p>Once our system has processed the order that you have placed with us, your products are thoroughly inspected to ensure that they are in pristine condition. If they pass the final round of quality checks, we will pack and hand them over to our reliable logistic partner.</p>
                                <p>Once our system has processed the order that you have placed with us, your products are thoroughly inspected to ensure that they are in pristine condition. If they pass the final round of quality checks, we will pack and hand them over to our reliable logistic partner.</p>
                                <p>Once our system has processed the order that you have placed with us, your products are thoroughly inspected to ensure that they are in pristine condition. If they pass the final round of quality checks, we will pack and hand them over to our reliable logistic partner.</p>
                                <p>Once our system has processed the order that you have placed with us, your products are thoroughly inspected to ensure that they are in pristine condition. If they pass the final round of quality checks, we will pack and hand them over to our reliable logistic partner.</p>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Return/Exchange policy</Accordion.Header>
                            <Accordion.Body className="d_proshipping">
                                <p>For any product, you need to raise the request within 7 days of the product being delivered to you. Within these 7 days, you can thoroughly check the product, and if you do not like it, you can file a return or replacement request as you wish.</p>
                                <p>Lorem ipsum dolor sit amet consectetur. Massa facilisis scelerisque iaculis habitant congue est blandit amet. Tortor in vulputate nulla vitae quam.Lorem ipsum dolor sit amet consectetur. Massa facilisis scelerisque.</p>
                                <p>Lorem ipsum dolor sit amet consectetur. Massa facilisis scelerisque iaculis habitant congue est blandit amet. Tortor in vulputate nulla vitae quam.Lorem ipsum dolor sit amet consectetur. Massa facilisis scelerisque.</p>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>Rating & Review</Accordion.Header>
                            <Accordion.Body className="d_review">
                                <div className="row">
                                    <div className="col-12 col-sm-3 text-center mb-3 mb-sm-0">
                                        <div className="d_leftbox h-100 d-flex flex-column justify-content-center">
                                            <div className="d_number">4.5</div>
                                            <div className="d-flex justify-content-center mb-3">
                                                <FaStar className='me-1 d_staricon' />
                                                <FaStar className='me-1 d_staricon' />
                                                <FaStar className='me-1 d_staricon' />
                                                <FaStar className='me-1 d_staricon' />
                                                <FaStar className='me-1 d_staricon' />
                                            </div>
                                            <p className='mb-0'>Product Rating</p>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-9">
                                        <div className="d_rightbox">
                                            <div class="d-flex align-items-center d_rating">
                                                <div class="progress ">
                                                    <div class="progress-bar" role="progressbar" style={{ width: "70%" }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <div class="ms-3">
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                </div>
                                                <div class="ms-3 d_percetage">70%</div>
                                            </div>
                                            <div class="d-flex align-items-center d_rating">
                                                <div class="progress ">
                                                    <div class="progress-bar" role="progressbar" style={{ width: "15%" }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <div class="ms-3">
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_emptystar' />
                                                </div>
                                                <div class="ms-3 d_percetage">15%</div>
                                            </div>
                                            <div class="d-flex align-items-center d_rating">
                                                <div class="progress ">
                                                    <div class="progress-bar" role="progressbar" style={{ width: "10%" }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <div class="ms-3">
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_emptystar' />
                                                    <FaStar className='me-1 d_emptystar' />
                                                </div>
                                                <div class="ms-3 d_percetage">10%</div>
                                            </div>
                                            <div class="d-flex align-items-center d_rating">
                                                <div class="progress ">
                                                    <div class="progress-bar" role="progressbar" style={{ width: "3%" }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <div class="ms-3">
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_emptystar' />
                                                    <FaStar className='me-1 d_emptystar' />
                                                    <FaStar className='me-1 d_emptystar' />
                                                </div>
                                                <div class="ms-3 d_percetage">03%</div>
                                            </div>
                                            <div class="d-flex align-items-center d_rating">
                                                <div class="progress ">
                                                    <div class="progress-bar" role="progressbar" style={{ width: "2%" }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <div class="ms-3">
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_emptystar' />
                                                    <FaStar className='me-1 d_emptystar' />
                                                    <FaStar className='me-1 d_emptystar' />
                                                    <FaStar className='me-1 d_emptystar' />
                                                </div>
                                                <div class="ms-3 d_percetage">02%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d_reviewlist">
                                    <div className="d_head">Reviews</div>
                                    <div className="d_list">
                                        <div className="d-flex">
                                            <div>
                                                <div className="d_namecircle d-flex justify-content-center align-items-center">
                                                    <span>A.T</span>
                                                </div>
                                            </div>
                                            <div className="d_desc ms-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="d_name me-2">Nicolas cage</div>
                                                    <div className="d_dayago">3 Days ago</div>
                                                </div>
                                                <div className="d-flex mb-lg-3 mb-1">
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                </div>
                                                <div className="d_title">Great Product</div>
                                                <div className="d_desc">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour</div>
                                                <div className="d-flex align-items-center">
                                                    <div className="d_like me-3">
                                                        <AiFillLike className='d_icon me-1' /> Liked
                                                    </div>
                                                    <div className="d_dislike">
                                                        <AiOutlineDislike className='d_icon me-1' /> Dislike
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d_list">
                                        <div className="d-flex">
                                            <div>
                                                <div className="d_namecircle d-flex justify-content-center align-items-center">
                                                    <span>A.T</span>
                                                </div>
                                            </div>
                                            <div className="d_desc ms-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="d_name me-2">Nicolas cage</div>
                                                    <div className="d_dayago">3 Days ago</div>
                                                </div>
                                                <div className="d-flex mb-lg-3 mb-1">
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                </div>
                                                <div className="d_title">Great Product</div>
                                                <div className="d_desc">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humourThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour</div>
                                                <div className="d-flex align-items-center">
                                                    <div className="d_like me-3">
                                                        <AiOutlineLike className='d_icon me-1' /> Liked
                                                    </div>
                                                    <div className="d_dislike">
                                                        <AiFillDislike className='d_icon me-1' /> Dislike
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d_list">
                                        <div className="d-flex">
                                            <div>
                                                <div className="d_namecircle d-flex justify-content-center align-items-center">
                                                    <span>A.T</span>
                                                </div>
                                            </div>
                                            <div className="d_desc ms-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="d_name me-2">Nicolas cage</div>
                                                    <div className="d_dayago">3 Days ago</div>
                                                </div>
                                                <div className="d-flex mb-lg-3 mb-1">
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                </div>
                                                <div className="d_title">Great Product</div>
                                                <div className="d_desc">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humourThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour</div>
                                                <div className="d-flex mb-2">
                                                    <div className="d_img">
                                                        <img src={require('./../d_img/detailimg1.png')} alt="" />
                                                        <img src={require('./../d_img/detailimg1.png')} alt="" />
                                                        <img src={require('./../d_img/detailimg1.png')} alt="" />
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <div className="d_like me-3">
                                                        <AiOutlineLike className='d_icon me-1' /> Liked
                                                    </div>
                                                    <div className="d_dislike">
                                                        <AiOutlineDislike className='d_icon me-1' /> Dislike
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d_list">
                                        <div className="d-flex">
                                            <div>
                                                <div className="d_namecircle d-flex justify-content-center align-items-center">
                                                    <span>A.T</span>
                                                </div>
                                            </div>
                                            <div className="d_desc ms-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="d_name me-2">Nicolas cage</div>
                                                    <div className="d_dayago">3 Days ago</div>
                                                </div>
                                                <div className="d-flex mb-lg-3 mb-1">
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                    <FaStar className='me-1 d_staricon' />
                                                </div>
                                                <div className="d_title">Great Product</div>
                                                <div className="d_desc">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humourThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour</div>
                                                <div className="d-flex mb-2">
                                                    <div className="d_img">
                                                        <img src={require('./../d_img/detailimg1.png')} alt="" />
                                                        <img src={require('./../d_img/detailimg1.png')} alt="" />
                                                        <img src={require('./../d_img/detailimg1.png')} alt="" />
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <div className="d_like me-3">
                                                        <AiOutlineLike className='d_icon me-1' /> Liked
                                                    </div>
                                                    <div className="d_dislike">
                                                        <AiOutlineDislike className='d_icon me-1' /> Dislike
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </section>

            {/* Product Information section End */}

            {/* Frequently bought together section start */}

            <Bought />

            {/* Frequently bought together section end */}

            {/* You may also like this section start */}

            <Like />

            {/* You may also like this section end */}

            {/* Recently Viewed items section start */}

            <Recentlyviewed />

            {/* Recently Viewed items section end */}

            {/* Customer also like this section start */}

            <Customerlike />

            {/* Customer also like this section end */}

            {/* Subscribe section */}
            <Subscribe />

            {/* Process section */}
            <Process />

            {/* Footer section */}
            <Footer />

            {/* Size chart Women section start */}

            <Modal className="d_sizemodal"
                show={sizemodalShow}
                onHide={() => setsizeModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <div className="d_closeicon d-flex justify-content-end d_cur" onClick={() => setsizeModalShow(false)}>
                        <IoClose className='icon' />
                    </div>
                    <div className="row align-items-center">
                        <div className="col-12 col-sm-6">
                            <div className="d_img">
                                <img src={require('./../d_img/womensize.png')} alt="" />
                            </div>
                        </div>
                        <div className="col-12 col-sm-6">
                            <div className="d_text">
                                <h4>Size Chart for Women </h4>
                                <p className='mb-0'>This size chart shows product measurements taken when products are laid flat.</p>
                                <p className='mb-0'>Actual product measurements may vary by up to 1".</p>
                            </div>
                        </div>
                    </div>
                    <div className="d_inch">
                        <div className="table-responsive">
                            <Table bordered className="text-center mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th>
                                            <div className='d_inchbg'>Inch</div>
                                        </th>
                                        <th>S</th>
                                        <th>M</th>
                                        <th>L</th>
                                        <th>XL</th>
                                        <th>2XL</th>
                                        <th>3XL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>A Length</th>
                                        <td>25.2</td>
                                        <td>26</td>
                                        <td>26.6</td>
                                        <td>27.2</td>
                                        <td>27.6</td>
                                        <td>28</td>
                                    </tr>
                                    <tr>
                                        <th>B Bust</th>
                                        <td>34.6</td>
                                        <td>36.6</td>
                                        <td>38.6</td>
                                        <td>40.6</td>
                                        <td>42.5</td>
                                        <td>44.5</td>
                                    </tr>
                                    <tr>
                                        <th>C Shoulder</th>
                                        <td>14.9</td>
                                        <td>15.4</td>
                                        <td>15.8</td>
                                        <td>16.3</td>
                                        <td>17.2</td>
                                        <td>17.7</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <div className="d_inch">
                        <div className="table-responsive">
                            <Table bordered className="text-center mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th>
                                            <div className='d_inchbg'>Centimetre</div>
                                        </th>
                                        <th>S</th>
                                        <th>M</th>
                                        <th>L</th>
                                        <th>XL</th>
                                        <th>2XL</th>
                                        <th>3XL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>A Length</th>
                                        <td>64</td>
                                        <td>66</td>
                                        <td>67.5</td>
                                        <td>69</td>
                                        <td>70</td>
                                        <td>71</td>
                                    </tr>
                                    <tr>
                                        <th>B Bust</th>
                                        <td>88</td>
                                        <td>93</td>
                                        <td>98</td>
                                        <td>103</td>
                                        <td>108</td>
                                        <td>113</td>
                                    </tr>
                                    <tr>
                                        <th>C Shoulder</th>
                                        <td>37.8</td>
                                        <td>39</td>
                                        <td>40.2</td>
                                        <td>41.4</td>
                                        <td>42.6</td>
                                        <td>43.8</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Size chart women section End */}

            {/* Size chart Men section start */}

            <Modal className="d_sizemodal d-none"
                show={sizemodalShow}
                onHide={() => setsizeModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <div className="d_closeicon d-flex justify-content-end d_cur" onClick={() => setsizeModalShow(false)}>
                        <IoClose className='icon' />
                    </div>
                    <div className="row align-items-center">
                        <div className="col-12 col-sm-6">
                            <div className="d_img">
                                <img src={require('./../d_img/womensize.png')} alt="" />
                            </div>
                        </div>
                        <div className="col-12 col-sm-6">
                            <div className="d_text">
                                <h4>Size Chart for Men </h4>
                                <p className='mb-0'>This size chart shows product measurements taken when products are laid flat.</p>
                                <p className='mb-0'>Actual product measurements may vary by up to 1".</p>
                            </div>
                        </div>
                    </div>
                    <div className="d_inch">
                        <div className="table-responsive">
                            <Table bordered className="text-center mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th>
                                            <div className='d_inchbg'>Inch</div>
                                        </th>
                                        <th>S</th>
                                        <th>M</th>
                                        <th>L</th>
                                        <th>XL</th>
                                        <th>2XL</th>
                                        <th>3XL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>A Length</th>
                                        <td>28</td>
                                        <td>29.1</td>
                                        <td>29.9</td>
                                        <td>31.1</td>
                                        <td>31.9</td>
                                        <td>33.1</td>
                                    </tr>
                                    <tr>
                                        <th>B Bust</th>
                                        <td>36.2</td>
                                        <td>40.2</td>
                                        <td>44.1</td>
                                        <td>48</td>
                                        <td>52</td>
                                        <td>55.9</td>
                                    </tr>
                                    <tr>
                                        <th>C Shoulder</th>
                                        <td>15.7</td>
                                        <td>16.9</td>
                                        <td>18.1</td>
                                        <td>19.3</td>
                                        <td>20.5</td>
                                        <td>21.7</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <div className="d_inch">
                        <div className="table-responsive">
                            <Table bordered className="text-center mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th>
                                            <div className='d_inchbg'>Centimetre</div>
                                        </th>
                                        <th>S</th>
                                        <th>M</th>
                                        <th>L</th>
                                        <th>XL</th>
                                        <th>2XL</th>
                                        <th>3XL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>A Length</th>
                                        <td>71</td>
                                        <td>74</td>
                                        <td>76</td>
                                        <td>79</td>
                                        <td>80</td>
                                        <td>84</td>
                                    </tr>
                                    <tr>
                                        <th>B Bust</th>
                                        <td>82</td>
                                        <td>92</td>
                                        <td>102</td>
                                        <td>112</td>
                                        <td>122</td>
                                        <td>132</td>
                                    </tr>
                                    <tr>
                                        <th>C Shoulder</th>
                                        <td>37</td>
                                        <td>40</td>
                                        <td>43</td>
                                        <td>46</td>
                                        <td>49</td>
                                        <td>52</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Size chart Men section End */}

            {/* Size chart kids section start */}

            <Modal className="d_sizemodal d-none"
                show={sizemodalShow}
                onHide={() => setsizeModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <div className="d_closeicon d-flex justify-content-end d_cur" onClick={() => setsizeModalShow(false)}>
                        <IoClose className='icon' />
                    </div>
                    <div className="row align-items-center">
                        <div className="col-12 col-sm-6">
                            <div className="d_img">
                                <img src={require('./../d_img/womensize.png')} alt="" />
                            </div>
                        </div>
                        <div className="col-12 col-sm-6">
                            <div className="d_text">
                                <h4>Size Chart for Kid </h4>
                                <p className='mb-0'>This size chart shows product measurements taken when products are laid flat.</p>
                                <p className='mb-0'>Actual product measurements may vary by up to 1".</p>
                            </div>
                        </div>
                    </div>
                    <div className="d_inch">
                        <div className="table-responsive">
                            <Table bordered className="text-center mb-0 align-middle">
                                <thead>
                                    <tr className='d_yr'>
                                        <td></td>
                                        <td>5-6 yr</td>
                                        <td>7-8 yr</td>
                                        <td>9-10 yr</td>
                                        <td>11-12 yr</td>
                                        <td>13-14 yr</td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <div className='d_inchbg'>Inch</div>
                                        </th>
                                        <th>XS</th>
                                        <th>S</th>
                                        <th>M</th>
                                        <th>L</th>
                                        <th>XL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>A Length</th>
                                        <td>18.1</td>
                                        <td>20.1</td>
                                        <td>22</td>
                                        <td>24</td>
                                        <td>26</td>
                                    </tr>
                                    <tr>
                                        <th>B Bust</th>
                                        <td>23.6</td>
                                        <td>27.6</td>
                                        <td>31.5</td>
                                        <td>35.4</td>
                                        <td>40.2</td>
                                    </tr>
                                    <tr>
                                        <th>C Shoulder</th>
                                        <td>10.2</td>
                                        <td>11.8</td>
                                        <td>13.4</td>
                                        <td>15.0</td>
                                        <td>16.5</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <div className="d_inch">
                        <div className="table-responsive">
                            <Table bordered className="text-center mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th>
                                            <div className='d_inchbg'>Centimetre</div>
                                        </th>
                                        <th>XS</th>
                                        <th>S</th>
                                        <th>M</th>
                                        <th>L</th>
                                        <th>XL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>A Length</th>
                                        <td>46</td>
                                        <td>51</td>
                                        <td>56</td>
                                        <td>61</td>
                                        <td>66</td>
                                    </tr>
                                    <tr>
                                        <th>B Bust</th>
                                        <td>60</td>
                                        <td>70</td>
                                        <td>80</td>
                                        <td>90</td>
                                        <td>102</td>
                                    </tr>
                                    <tr>
                                        <th>C Shoulder</th>
                                        <td>26</td>
                                        <td>30</td>
                                        <td>34</td>
                                        <td>38</td>
                                        <td>42</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Size chart Men section End */}

            {/* Offer Modal section start */}

            <Modal className='d_offermodal'
                show={offermodalShow}
                onHide={() => setofferModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <div className="d_topsec">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 className='mb-0'>Best Offers</h4>
                            <IoClose className='icon d_cur' onClick={() => setofferModalShow(false)} />
                        </div>
                    </div>
                    <div className="d_offercon">
                        <div className="d-flex">
                            <div>
                                <div className="d_img me-2">
                                    <img src={require('./../d_img/offer.png')} alt="" />
                                </div>
                            </div>
                            <div className="d_text ms-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d_title">NEW100</div>
                                    <div className="d_saveprice">Save $100 </div>
                                </div>
                                <p className='mb-0'>Lorem ipsum dolor sit amet consectetur. Massa facilisis scelerisque iaculis habitant congue est blandit amet.</p>
                            </div>
                        </div>
                    </div>
                    <div className="d_offercon">
                        <div className="d-flex">
                            <div>
                                <div className="d_img me-2">
                                    <img src={require('./../d_img/offer.png')} alt="" />
                                </div>
                            </div>
                            <div className="d_text ms-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d_title">NEW100</div>
                                    <div className="d_saveprice">Save $100 </div>
                                </div>
                                <p className='mb-0'>Lorem ipsum dolor sit amet consectetur. Massa facilisis scelerisque iaculis habitant congue est blandit amet.</p>
                            </div>
                        </div>
                    </div>
                    <div className="d_offercon">
                        <div className="d-flex">
                            <div>
                                <div className="d_img me-2">
                                    <img src={require('./../d_img/td.png')} alt="" />
                                </div>
                            </div>
                            <div className="d_text ms-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d_title">TD Bank</div>
                                    {/* <div className="d_saveprice">Save $100 </div> */}
                                </div>
                                <p className='mb-0'>Extra ₹500 off on TD Bank Pixel Credit Card EMI Transactions. Min Txn Value: ₹5,000</p>
                            </div>
                        </div>
                    </div>
                    <div className="d_offercon">
                        <div className="d-flex">
                            <div>
                                <div className="d_img me-2">
                                    <img src={require('./../d_img/cob.png')} alt="" />
                                </div>
                            </div>
                            <div className="d_text ms-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d_title">Capital One bank</div>
                                    {/* <div className="d_saveprice">Save $100 </div> */}
                                </div>
                                <p className='mb-0'>Lorem ipsum dolor sit amet consectetur. Massa facilisis scelerisque iaculis habitant congue est blandit amet.</p>
                            </div>
                        </div>
                    </div>
                    <div className="d_offercon">
                        <div className="d-flex">
                            <div>
                                <div className="d_img me-2">
                                    <img src={require('./../d_img/wfb.png')} alt="" />
                                </div>
                            </div>
                            <div className="d_text ms-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d_title">Wells Fargo Bank</div>
                                    {/* <div className="d_saveprice">Save $100 </div> */}
                                </div>
                                <p className='mb-0'>Extra ₹500 off on TD Bank Pixel Credit Card EMI Transactions. Min Txn Value: ₹5,000</p>
                            </div>
                        </div>
                    </div>
                    <div className="d_offercon">
                        <div className="d-flex">
                            <div>
                                <div className="d_img me-2">
                                    <img src={require('./../d_img/citi.png')} alt="" />
                                </div>
                            </div>
                            <div className="d_text ms-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d_title">Citi Bank</div>
                                    {/* <div className="d_saveprice">Save $100 </div> */}
                                </div>
                                <p className='mb-0'>Extra ₹500 off on TD Bank Pixel Credit Card EMI Transactions. Min Txn Value: ₹5,000</p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Offer Modal section end */}

            {/* Images modal section Start */}

            {/* <Modal className="d_imagemodal"
                show={imagemodalShow}
                onHide={() => setimageModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <div className="d_closeicon d-flex justify-content-end d_cur me-3" onClick={() => setimageModalShow(false)}>
                        <IoClose className='icon' />
                    </div>
                    <OwlCarousel className='owl-theme'   {...carouselSettings}>
                        {mediaItems.map((item, index) => (
                            <div className="d_item" key={item.id}>
                                {item.type === 'image' ? (
                                    <>
                                        <img src={item.src} alt={`media-${index}`} className="img-fluid" />
                                        <img
                                            className='d_360view'
                                            src={icon360}
                                            alt="360 View"
                                            onClick={() => {
                                                toggle360View()
                                                setCurrentFrame(1)
                                            }}

                                            style={{ cursor: 'pointer' }}
                                        />
                                    </>
                                ) : (
                                    <video ref={slidervideoRef} controls>
                                        <source src={item.src} type="video/mp4" />
                                    </video>
                                )}
                            </div>
                        ))}
                    </OwlCarousel>
                    <div className="d_thumbnails w-100 d-flex justify-content-center mt-3 ">
                        <div className='d_overflowx'>
                        <div className='d-flex  flex-nowrap'>
                            {mediaItems.map((item, index) => (
                                <div className="d_img" key={item.id} onClick={() => handleThumbnailClick(index)} style={{ cursor: 'pointer' }}>
                                    {item.type === 'image' ? (
                                        <img src={item.src} alt={`thumb-${index}`} className="img-fluid small-img" />
                                    ) : (
                                        <video className="small-img">
                                            <source src={item.src} type="video/mp4" />
                                        </video>
                                    )}
                                </div>
                            ))}
                        </div>
                     </div>
                    </div>
                </Modal.Body>
            </Modal> */}

            {/* Images modal section end */}




        </>
    );
};

export default WomenDetails;