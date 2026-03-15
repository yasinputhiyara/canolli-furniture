import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="prod-card">
      {product.badge && (
        <div className={`prod-badge badge-${product.badge.toLowerCase()}`}>
          {product.badge}
        </div>
      )}

      <div className="prod-img-wrap">
        <img src={product.img} alt={product.name} />
      </div>

      <div className="prod-info">
        <div className="prod-cat">{product.cat}</div>
        <Link to={`/product/${product.id}`} className="prod-name">
          {product.name}
        </Link>
      </div>
    </div>
  );
}