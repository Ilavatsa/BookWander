import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FirstPage.css';

const FirstPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex(prevIndex =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const images = [
    'https://i.pinimg.com/236x/be/d9/5f/bed95f67a0643a9dcd08b39554c52f0e.jpg',
    'https://i.pinimg.com/564x/c3/e6/02/c3e60200bdb67f86120738d30d35ca73.jpg',
    'https://i.pinimg.com/564x/55/65/ca/5565ca6a23996f765cb28efee7645c7c.jpg',
  ];

  return (
    <div className="container">
      <header className="header">
        <div className="header-title">
          <h1>Matwana Minder</h1>
        </div>
        <div className="login-button">
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </header>
      <div className="slideshow-wrapper">
        <div className="slideshow-container">
          <div className="slideshow">
            <img
              src={images[currentImageIndex]}
              alt="Slideshow"
              className="slideshow-image"
            />
          </div>
        </div>
        <div className="description-container">
          <div className="service-description">
            <p>
            Matwana Minder Road Transport is an innovative bus management system designed 
            to enhance the efficiency and reliability of public transportation. It offers 
            real-time tracking of buses, timely updates on schedules, and ensures safety 
            through robust monitoring. With a user-friendly interface, it simplifies 
            the management of bus operations and provides a seamless experience for 
            both operators and passengers. Matwana Minder aims to improve public transport
            services by integrating advanced technology for better connectivity and service delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstPage;
