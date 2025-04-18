import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const FilterDropdown = ({
  discountTypeFilter,
  selectedBrands,
  selectedCategories,
  availableBrands,
  availableCategories,
  onDiscountTypeChange,
  onBrandChange,
  onCategoryChange,
  onClearFilters,
}) => {
  return (
    <div
      style={{
        border: "1px solid #ffa500",
        borderRadius: "10px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        backgroundColor: "#fff",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Filters</h5>
        <Button variant="outline-secondary" size="sm" onClick={onClearFilters}>
          Clear All
        </Button>
      </div>

      <Form>
        <Row>
          {/* Discount Type */}
          <Col md={4} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Discount Type</Form.Label>
              {["all", "flat", "percentage"].map((type) => (
                <Form.Check
                  key={type}
                  type="radio"
                  id={`discount-${type}`}
                  label={
                    type === "all"
                      ? "All Types"
                      : `${
                          type.charAt(0).toUpperCase() + type.slice(1)
                        } Discount`
                  }
                  name="discountType"
                  checked={discountTypeFilter === type}
                  onChange={() => onDiscountTypeChange(type)}
                />
              ))}
            </Form.Group>
          </Col>

          {/* Brands */}
          <Col md={4} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Brands ({selectedBrands.length} selected)</Form.Label>
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  padding: "8px",
                }}
              >
                {availableBrands.map((brand) => (
                  <Form.Check
                    key={brand}
                    type="checkbox"
                    id={`brand-${brand}`}
                    label={brand}
                    checked={selectedBrands.includes(brand)}
                    onChange={() => onBrandChange(brand)}
                  />
                ))}
              </div>
            </Form.Group>
          </Col>

          {/* Categories */}
          <Col md={4} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>
                Categories ({selectedCategories.length} selected)
              </Form.Label>
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  padding: "8px",
                }}
              >
                {availableCategories.map((category) => (
                  <Form.Check
                    key={category}
                    type="checkbox"
                    id={`category-${category}`}
                    label={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => onCategoryChange(category)}
                  />
                ))}
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default FilterDropdown;
