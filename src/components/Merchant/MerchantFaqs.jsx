import React from 'react';
import GeneralNavBar from '../../layout/GeneralNavBar';
import { Container, Accordion } from 'react-bootstrap';
import './MerchantStyle.css';

const MerchantFaqs = () => {
  return (
    <>
      <GeneralNavBar userRole="merchant" />
      <Container className="mt-4">
        <h1>Frequently Asked Questions</h1>
        <Accordion defaultActiveKey="0" className="mt-3">
          {/* FAQ #1 */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              How do I create a coupon?
            </Accordion.Header>
            <Accordion.Body>
              To create a coupon, navigate to the "Manage Coupons" page, click on
              "Add Coupon", fill out the required fields (name, discount, etc.),
              and then click "Create". Your new coupon will be added to the list.
            </Accordion.Body>
          </Accordion.Item>

          {/* FAQ #2 */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              How can I edit or delete a coupon?
            </Accordion.Header>
            <Accordion.Body>
              Go to the "Manage Coupons" page and look for the list of your
              existing coupons. You can click on the "Edit" or "Delete" button
              next to each coupon to make changes or remove it entirely.
            </Accordion.Body>
          </Accordion.Item>

          {/* FAQ #3 */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              How do I check the status of my coupons?
            </Accordion.Header>
            <Accordion.Body>
              Once a coupon is created, you can monitor its redemption status
              (e.g., how many have been used) on the "Manage Coupons" dashboard.
              It will display the number of redeemed coupons and their expiry
              dates.
            </Accordion.Body>
          </Accordion.Item>

          {/* FAQ #4 */}
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              What if I need to change the discount value?
            </Accordion.Header>
            <Accordion.Body>
              You can edit the discount value by going to "Manage Coupons",
              selecting the coupon you wish to edit, and updating its discount
              field. Make sure to save your changes.
            </Accordion.Body>
          </Accordion.Item>

          {/* FAQ #5 */}
          <Accordion.Item eventKey="4">
            <Accordion.Header>
              Where can I see analytics or usage data?
            </Accordion.Header>
            <Accordion.Body>
              We provide basic coupon usage analytics under "Reports" or "Manage
              Coupons" (depending on your plan). You’ll see how many customers
              redeemed each coupon, along with other insights.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </>
  );
};

export default MerchantFaqs;
