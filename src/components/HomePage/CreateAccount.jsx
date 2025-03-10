import React, { useState, useRef } from 'react';
import GeneralNavBar from '../../layout/GeneralNavBar';
import { Form, Button, Col, Image, Container, Row } from 'react-bootstrap';

const CreateAccount = () => {
  // State to hold the image preview URL
  const [image, setImage] = useState(null);

  // Reference to the hidden file input
  const fileInputRef = useRef(null);

  // Function to handle image click
  const handleImageClick = () => {
    // Trigger the file input click to open the file dialog
    fileInputRef.current.click();
  };

  // Function to handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <>
      <GeneralNavBar userRole="create" />
      <Container>
        <Row>
          <Col xs={6} md={4} className="text-center">
            {/* Display the image or a placeholder icon */}
            <div
              onClick={handleImageClick}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'inline-block',
                backgroundColor: '#f0f0f0',
                lineHeight: '100px',
                textAlign: 'center',
              }}
            >
              {image ? (
                <Image
                  src={image}
                  alt="Uploaded Preview"
                  roundedCircle
                  width="100"
                  height="100"
                />
              ) : (
                <i
                  className="bi bi-image"
                  style={{ fontSize: '50px', color: '#6c757d' }}
                ></i>
              )}
            </div>
            {/* Hidden file input */}
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
          </Col>
        </Row>
      </Container>

      <Form>
        {image && (
          <Form.Group>
          </Form.Group>
        )}
        <Button type="submit">Submit</Button>
      </Form>
    </>
  );
};

export default CreateAccount;
