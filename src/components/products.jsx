import React from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import img1 from "../assets/product5.jpg";
import "./product.css"; // Keep your hover and image styles here

const Products = () => {
  const products = [
    {
      image: img1,
      name: "MITR SOS Band",
      description: "Lightweight, wearable SOS device with real-time alerts.",
      price: "$99.99",
      tag1: "New",
      tag2: "Best Seller",
    },
    {
      image: img1,
      name: "MITR Pro",
      description: "Advanced SOS with GPS, voice trigger & secure tracking.",
      price: "$149.99",
      tag1: "Trending",
      tag2: "Hot Deal",
    },
    {
      image: img1,
      name: "MITR Mini",
      description: "Compact SOS device for kids and elders.",
      price: "$79.99",
      tag1: "Compact",
      tag2: "Safe",
    },
  ];

  return (
    <div className="bg-light py-5">
      <Container>
        <div className="text-center mb-5">
          <h5 className="text-primary text-uppercase">Our Products</h5>
          <h2 className="text-dark fw-bold">Secure Your Loved Ones</h2>
        </div>
        <Row className="g-4">
          {products.map((product, index) => (
            <Col key={index} md={4}>
              <Card className="shadow-sm border-0 rounded-4 h-100">
                <div className="product-img-container">
                  <Card.Img
                    src={product.image}
                    className="product-img"
                    alt={product.name}
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-primary">{product.name}</Card.Title>
                  <Card.Text className="text-muted">{product.description}</Card.Text>
                  <h5 className="text-dark">{product.price}</h5>
                  <div className="mb-3">
                    <span className="badge bg-info text-white me-2">{product.tag1}</span>
                    <span className="badge bg-primary text-white">{product.tag2}</span>
                  </div>
                  <Button variant="primary" className="mt-auto">
                    Buy Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-4">
          <Button variant="outline-primary" className="fw-medium">
            Show more products <FaArrowRight />
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Products;
