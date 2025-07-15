import './Navbar.css';

function Navbar() {
  return (
    <div className="navbar">
      <h1>🌾 Digital Kisan Hub</h1>
      <nav>
        <a href="/dashboard">Dashboard</a>
        <a href="/mandi-prices">Mandi Prices</a>
        <a href="/weather">Weather</a>
        <a href="/schemes">Schemes</a>
      </nav>
    </div>
  );
}

export default Navbar;
