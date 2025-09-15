import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// FontAwesome setup
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faBars, 
  faSearch, 
  faUser, 
  faClock, 
  faPlus, 
  faChevronLeft, 
  faChevronRight, 
  faPhone, 
  faMapMarkerAlt, 
  faEnvelope,
  faUserMd,
  faHeart,
  faShieldAlt,
  faAward,
  faInfoCircle,
  faCalendarAlt,
  faStethoscope,
  faBrain,
  faEye,
  faChild,
  faBone,
  faChevronDown,
  faChevronUp,
  faCrown,
  faCheck,
  faHeadset,
  faStar,
  faGift,
  faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook, 
  faYoutube, 
  faTiktok 
} from '@fortawesome/free-brands-svg-icons';

// Add icons to library
library.add(
  faBars, 
  faSearch, 
  faUser, 
  faClock, 
  faPlus, 
  faChevronLeft, 
  faChevronRight, 
  faPhone, 
  faMapMarkerAlt, 
  faEnvelope,
  faFacebook, 
  faYoutube, 
  faTiktok,
  faUserMd,
  faHeart,
  faShieldAlt,
  faAward,
  faInfoCircle,
  faCalendarAlt,
  faStethoscope,
  faBrain,
  faEye,
  faChild,
  faBone,
  faChevronDown,
  faChevronUp,
  faCrown,
  faCheck,
  faHeadset,
  faStar,
  faGift,
  faCalendarCheck
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
