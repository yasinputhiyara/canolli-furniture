
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


const Navbar = () => {
  const {items} = useSelector((state)=> state.cart)
  return (
    <nav style={{ padding: "20px", borderBottom: "1px solid #ddd" }}>
      <h2>Canolli Furniture</h2>

      <Link to='/shop' style={{marginRight:"20px"}}>
      shop
      </Link>

      <Link to="/cart" >
      Cart ({items.length})
      </Link>

    </nav>
  );
};

export default Navbar;