import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
        <li><NavLink to="/segmentation" className={({ isActive }) => isActive ? 'active' : ''}>Segmentation</NavLink></li>
        <li><NavLink to="/campaign-creation" className={({ isActive }) => isActive ? 'active' : ''}>Campaign Creation</NavLink></li>
        <li><NavLink to="/campaign-report" className={({ isActive }) => isActive ? 'active' : ''}>Campaign Report</NavLink></li>
        <li><NavLink to="/help" className={({ isActive }) => isActive ? 'active' : ''}>Help</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;
