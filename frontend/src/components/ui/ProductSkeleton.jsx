// import '../styles/ProductSkeleton.css';

export default function ProductSkeleton() {
  return (
    <div className="product-skeleton">
      {/* 
        This is a basic structure for the skeleton. 
        You can expand and style it further in ProductSkeleton.css 
      */}
      <div className="skeleton-img"></div>
      <div className="skeleton-info">
        <div className="skeleton-text title"></div>
        <div className="skeleton-text price"></div>
        <div className="skeleton-text desc-line1"></div>
        <div className="skeleton-text desc-line2"></div>
        <div className="skeleton-text button"></div>
      </div>
    </div>
  );
}
