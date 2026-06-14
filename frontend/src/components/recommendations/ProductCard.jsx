import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { BiDollarCircle, BiPurchaseTagAlt } from 'react-icons/bi';

function ProductCard({ product }) {
  const { t } = useTranslation();

  // Create fallback gradients to act as product placeholder images
  const gradientStyles = [
    'linear-gradient(135deg, #fce38a, #f38181)', // Warm pink/orange
    'linear-gradient(135deg, #abecd6, #111d5e)', // Deep blue/green
    'linear-gradient(135deg, #f5f7fa, #c3cfe2)', // Clean gray
    'linear-gradient(135deg, #a1c4fd, #c2e9fb)', // Light blue
  ];

  // Pick a gradient based on the product ID or name length to keep it consistent
  const selectedGradient =
    gradientStyles[(product?.id || product?.name?.length || 0) % gradientStyles.length];

  return (
    <Card className="product-card border-0 shadow-sm h-100 overflow-hidden glassmorphism">
      <div
        className="product-card__image-container d-flex align-items-center justify-content-center text-white"
        style={{
          height: '180px',
          background: selectedGradient,
          position: 'relative'
        }}
      >
        {product?.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-card__img w-100 h-100 object-fit-cover"
            onError={(e) => {
              e.target.style.display = 'none'; // Fallback to gradient if image fails to load
            }}
          />
        ) : null}
        <span className="product-card__category-badge position-absolute top-2 right-2 badge bg-dark bg-opacity-75">
          {product?.category?.toUpperCase()}
        </span>
      </div>

      <Card.Body className="p-3 d-flex flex-column">
        <div className="product-card__brand text-muted small mb-1 fw-bold text-uppercase">
          {product?.brand}
        </div>
        <Card.Title className="product-card__title fs-6 fw-bold mb-2">
          {product?.name}
        </Card.Title>
        <Card.Text className="product-card__desc text-muted mb-3 flex-grow-1" style={{ fontSize: '0.825rem' }}>
          {product?.description}
        </Card.Text>

        <div className="product-card__ingredients mb-3">
          {product?.keyIngredients?.map((ing, idx) => (
            <Badge
              key={idx}
              bg="light"
              text="dark"
              className="me-1 mb-1 border border-light-subtle"
              style={{ fontSize: '0.7rem' }}
            >
              {ing}
            </Badge>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-light">
          <span className="product-card__price text-primary fw-bold d-flex align-items-center small">
            <BiDollarCircle className="me-1" />
            {t('products.price_range')}: {product?.priceRange}
          </span>
          {product?.suitableForAcne && product?.suitableForOily && (
            <Badge bg="danger-subtle" text="danger" className="small border border-danger-subtle">
              {t('products.oily_acne')}
            </Badge>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
