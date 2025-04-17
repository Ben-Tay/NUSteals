import { Container, Accordion } from "react-bootstrap";
import "./StudentStyle.css";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StudentFaqs = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch token from local storage and check if user is logged in
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const role = localStorage.getItem("userRole");

    if (role === "admin") {
      navigate("/adminLogin");
    } else if (role === "merchant") {
      navigate("/merchantLogin");
    }
  }, []);

  return (
    <Container className="mt-4">
      <h1>Frequently Asked Questions</h1>
      <Accordion defaultActiveKey="0" className="mt-3">
        {/* FAQ #1 */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>How do I redeem a coupon?</Accordion.Header>
          <Accordion.Body>
            To redeem a coupon, browse through available offers and click the
            "Redeem" button on the coupon you want to use. A QR code will be
            generated which you can show to the merchant at their store.
          </Accordion.Body>
        </Accordion.Item>

        {/* FAQ #2 */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            Can I use multiple coupons at once?
          </Accordion.Header>
          <Accordion.Body>
            No, only one coupon can be redeemed per transaction. Make sure to
            choose the best coupon for your purchase.
          </Accordion.Body>
        </Accordion.Item>

        {/* FAQ #3 */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            Where can I see my redeemed coupons?
          </Accordion.Header>
          <Accordion.Body>
            You can view your coupon history by clicking on "View My History" in
            the navigation bar. This shows all coupons you've redeemed,
            including their redemption dates.
          </Accordion.Body>
        </Accordion.Item>

        {/* FAQ #4 */}
        <Accordion.Item eventKey="3">
          <Accordion.Header>How long are coupons valid for?</Accordion.Header>
          <Accordion.Body>
            Each coupon has its own validity period which is clearly displayed
            on the coupon card. Once a coupon expires, it can no longer be
            redeemed.
          </Accordion.Body>
        </Accordion.Item>

        {/* FAQ #5 */}
        <Accordion.Item eventKey="4">
          <Accordion.Header>
            What if a merchant refuses my coupon?
          </Accordion.Header>
          <Accordion.Body>
            If a merchant refuses to honor a valid coupon, please contact our
            support team through your profile page. Include details of the
            incident and we'll investigate the matter.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default StudentFaqs;
