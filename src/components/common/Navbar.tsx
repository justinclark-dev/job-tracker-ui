import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <header>
      <section>
        <nav>
          <ul>
            <li><Link to='/'>Dashboard</Link></li>
            <li><Link to='/jobs'>Jobs</Link></li>
            <li><Link to='/applications'>Applications</Link></li>
            <li><Link to='/interviews'>Interviews</Link></li>
            <li><Link to='/followups'>Follow Ups</Link></li>
          </ul>
        </nav>
      </section>
    </header>
  );
}

export default Navbar;