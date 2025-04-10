import React from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import img1 from "../assets/product5.jpg";
import { FaArrowRight } from "react-icons/fa";
import "./product.css"
const Products = () => {
  const products = [
    {
      image: img1,
      name: "Product 1",
      description: "This is a small description of Product 1.",
      price: "$99.99",
      tag1: "New",
      tag2: "Best Seller",
    },
    {
      image: img1,
      name: "Product 2",
      description: "This is a small description of Product 2.",
      price: "$149.99",
      tag1: "Sale",
      tag2: "Popular",
    },
    {
      image: img1,
      name: "Product 3",
      description: "This is a small description of Product 3.",
      price: "$199.99",
      tag1: "Trending",
      tag2: "Limited Edition",
    },
    {
      image: img1,
      name: "Product 4",
      description: "This is a small description of Product 4.",
      price: "$299.99",
      tag1: "Exclusive",
      tag2: "Best Deal",
    },
    {
      image: img1,
      name: "Product 5",
      description: "This is a small description of Product 5.",
      price: "$249.99",
      tag1: "New Arrival",
      tag2: "Top Rated",
    },
    {
      image: img1,
      name: "Product 6",
      description: "This is a small description of Product 1.",
      price: "$99.99",
      tag1: "New",
      tag2: "Best Seller",
    }
  ];

  return (
    <div className="m-5 contain p-5">
      <div className="text-center mb-5">
        <h5 className="text-primary text-uppercase">Explore Our Products</h5>
        <h2 className="font-weight-bold py-2 text-dark">Accelerate Your Shopping Experience</h2>
      </div>

      <Row className="g-4">
        {products.map((product, index) => (
          <Col key={index} sm={12} md={6} lg={4}>
            <Card className="product-card shadow-lg h-100 border-0">
              <div className="product-img-container">
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                  className="product-img"
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-primary">{product.name}</Card.Title>
                <Card.Text className="text-muted">{product.description}</Card.Text>
                <div className="font-weight-bold text-dark">{product.price}</div>
                <div className="mb-3">
                  {product.tag1 && (
                    <span className="badge bg-info text-white me-2">{product.tag1}</span>
                  )}
                  {product.tag2 && (
                    <span className="badge bg-primary text-white">{product.tag2}</span>
                  )}
                </div>
                <Button variant="primary" className="mt-auto w-100">
                  Buy Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-4">
        <Button variant="link" className="text-primary">
          Show more products <FaArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default Products;
