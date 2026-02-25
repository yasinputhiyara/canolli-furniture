import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setLoading } from "../features/products/productSclice";
import ProductCard from "../components/product/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(setLoading(true));

    // Dummy data for now
    const dummyProducts = [
      { id: 1, name: "Modern Sofa", price: 25000 },
      { id: 2, name: "Wooden Bed", price: 40000 },
    ];

    dispatch(setProducts(dummyProducts));
    dispatch(setLoading(false));
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Shop Products</h1>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Shop;
