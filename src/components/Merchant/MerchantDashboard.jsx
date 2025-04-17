import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Spinner,
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Modal,
  Form,
  Pagination,
  Alert
} from 'react-bootstrap';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis
} from 'recharts';
import { FaExclamationTriangle } from 'react-icons/fa';
import { parseISO, format } from 'date-fns';

// Colors for Redeemed vs. Available pie chart
const COLORS = ['#8884d8', '#82ca9d'];
// Colors for Category Distribution chart
const CAT_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#f9966b', '#c766ba'];

/**
 * Custom legend for the Category Distribution chart arranged in a two-column grid.
 */
function renderMyCategoryLegend({ payload }) {
  if (!payload) return null;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: '10px',
        rowGap: '6px',
        maxWidth: '150px'
      }}
    >
      {payload.map((entry, index) => (
        <div key={`legend-item-${index}`} style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: entry.color,
              marginRight: '6px'
            }}
          />
          <span style={{ fontSize: '0.85rem' }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Aggregates daily usage (# codes used per day) from coupon.uniqueCodes,
 * filling in missing days with usage = 0.
 */
function aggregateDailyUsage(coupons) {
  let usageByDay = {};
  let minDate = null;
  let maxDate = null;
  coupons.forEach((coupon) => {
    if (Array.isArray(coupon.uniqueCodes)) {
      coupon.uniqueCodes.forEach((code) => {
        if (code.isUsed && code.usedAt) {
          const dateObj = parseISO(code.usedAt);
          if (!minDate || dateObj < minDate) minDate = dateObj;
          if (!maxDate || dateObj > maxDate) maxDate = dateObj;
          const dayStr = format(dateObj, 'yyyy-MM-dd');
          usageByDay[dayStr] = (usageByDay[dayStr] || 0) + 1;
        }
      });
    }
  });
  if (!minDate || !maxDate) return [];
  let results = [];
  let day = new Date(minDate);
  while (day <= maxDate) {
    const dayStr = format(day, 'yyyy-MM-dd');
    results.push({ date: dayStr, used: usageByDay[dayStr] || 0 });
    day.setDate(day.getDate() + 1);
  }
  return results;
}

/** Aggregates coupon counts by category. */
function aggregateCategoryCounts(coupons) {
  const catCounts = {};
  coupons.forEach((coupon) => {
    const cat = coupon.category || 'Uncategorized';
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  });
  return Object.keys(catCounts).map((category) => ({
    name: category,
    value: catCounts[category]
  }));
}

/** Formats X-axis date labels as dd month */
function dateTickFormatter(dateStr) {
  const d = parseISO(dateStr);
  return format(d, 'd MMM');
}

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');
  const API_URL = 'https://nusteals-express.onrender.com';

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [coupons, setCoupons] = useState([]);

  // Merchant name -> no longer used for filtering
  const [merchantName, setMerchantName] = useState('');

  // Pagination for Disabled Coupons
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  // Edit & Confirmation Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [editForm, setEditForm] = useState({});

  // form validation for edit coupon modal
  const [formValidated, setFormValidated] = useState(false);

  // 1. Verify user is merchant -> redirect if not
  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }
    const verifyUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          if (res.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }
        const data = await res.json();
        if (data.role !== 'merchant') {
          alert('Access denied. Redirecting...');
          if (data.role === 'admin') navigate('/adminLogin');
          else if (data.role === 'student') navigate('/studentLogin');
          else navigate('/login');
          return;
        }
        setMerchantName(data.name);
        setAuthorized(true);
      } catch (error) {
        console.error('Error verifying user:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [token, userId, API_URL, navigate]);

  // 2. Fetch coupons for this merchant -> check new endpoint
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch(`${API_URL}/api/coupons/merchant`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch coupons');
        const data = await res.json();
        setCoupons(data);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };
    if (authorized) {
      fetchCoupons();
    }
  }, [API_URL, authorized, token]);

  // Summaries
  const totalCampaigns = coupons.length;
  const totalCodes = coupons.reduce(
    (sum, c) => sum + (c.uniqueCodes ? c.uniqueCodes.length : c.totalNum),
    0
  );
  const redeemedCodes = coupons.reduce((sum, c) => sum + (c.redeemedNum || 0), 0);
  const availableCodes = totalCodes - redeemedCodes;
  const disabledCoupons = coupons.filter((c) => c.disable);

  // Pagination for Disabled Coupons
  const realTotalPages = Math.ceil(disabledCoupons.length / itemsPerPage);
  const totalPages = Math.max(1, realTotalPages);
  const currentDisabledCoupons = disabledCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Chart data
  const dailyUsageData = aggregateDailyUsage(coupons);
  const codeStatusData = [
    { name: 'Redeemed', value: redeemedCodes },
    { name: 'Available', value: availableCodes }
  ];
  const categoryData = aggregateCategoryCounts(coupons);

  // Open Edit Modal
  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setEditForm({
      couponName: coupon.couponName,
      discount: coupon.discount,
      discountType: coupon.discountType,
      description: coupon.description,
      termsConditions: coupon.termsConditions,
      category: coupon.category,
      totalNum: coupon.totalNum,
      expiryDate: coupon.expiryDate ? coupon.expiryDate.slice(0, 10) : '',
      disabledMessage: coupon.disabledMessage || ''
    });
    setFormValidated(false);
    setShowEditModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setFormValidated(true);
      return;
    }

    setFormValidated(false);
    setShowEditModal(false);
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    try {
      const res = await fetch(`${API_URL}/api/coupons/${selectedCoupon._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...editForm, disable: false })
      });
      if (!res.ok) throw new Error('Failed to update coupon');
      const updatedCoupon = await res.json();
      setCoupons((prev) =>
        prev.map((c) => (c._id === selectedCoupon._id ? updatedCoupon : c))
      );
      alert('Coupon updated and enabled successfully!');
      setShowConfirmModal(false);
      setSelectedCoupon(null);
    } catch (error) {
      console.error('Error updating coupon:', error);
      alert('Error updating coupon. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setSelectedCoupon(null);
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setShowEditModal(true);
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <Container className="mt-5 d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }
  if (!authorized) return null;

  return (
    <>
      <Container fluid className="mt-4">
        {/* Row 1: Summaries */}
        <Row className="g-4 mb-3">
          <Col md={4}>
            <Card className="h-100 p-3 text-center">
              <Card.Title>Total Campaigns</Card.Title>
              <Card.Text style={{ fontSize: '1.5rem' }}>{totalCampaigns}</Card.Text>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 p-3 text-center">
              <Card.Title>Redeemed / Total Codes</Card.Title>
              <Card.Text style={{ fontSize: '1.5rem' }}>
                {redeemedCodes} / {totalCodes}
              </Card.Text>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 p-3 text-center">
              <Card.Title>
                {disabledCoupons.length > 0 && (
                  <FaExclamationTriangle style={{ color: 'red', marginRight: '8px' }} />
                )}
                Disabled Coupons
              </Card.Title>
              <Card.Text style={{ fontSize: '1.5rem', color: 'red' }}>
                {disabledCoupons.length}
              </Card.Text>
            </Card>
          </Col>
        </Row>

        {/* Row 2: Charts & Disabled Coupons List */}
        <Row className="g-4 mb-3">
          <Col md={4}>
            <Card className="h-100 p-3">
              <Card.Title className="text-center">Coupon Code Status</Card.Title>
              <PieChart width={280} height={240}>
                <Pie
                  data={codeStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {codeStatusData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
                <Legend layout="horizontal" verticalAlign="bottom" height={24} />
              </PieChart>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 p-3">
              <Card.Title className="text-center">Daily Usage</Card.Title>
              {dailyUsageData.length === 0 ? (
                <p className="text-center mt-2">No daily usage data yet.</p>
              ) : (
                <LineChart
                  width={320}
                  height={260}
                  data={dailyUsageData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={dateTickFormatter}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis allowDecimals={false} />
                  <ReTooltip />
                  <Line type="monotone" dataKey="used" stroke="#8884d8" />
                </LineChart>
              )}
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 d-flex flex-column">
              <Card.Body className="flex-grow-1">
                <Card.Title>Disabled Coupons List</Card.Title>
                {disabledCoupons.length === 0 ? (
                  <p className="text-center mt-2">No disabled coupons.</p>
                ) : (
                  <Table hover size="sm">
                    <thead>
                      <tr>
                        <th>Campaign</th>
                        <th>Discount</th>
                        <th>Redeemed</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDisabledCoupons.map((c) => (
                        <tr key={c._id}>
                          <td>{c.couponName}</td>
                          <td>
                            {c.discountType === 'percentage'
                              ? `${c.discount}%`
                              : `$${c.discount}`}
                          </td>
                          <td>{c.redeemedNum || 0}</td>
                          <td>{c.uniqueCodes ? c.uniqueCodes.length : c.totalNum}</td>
                          <td>
                            <Button variant="primary" size="sm" onClick={() => openEditModal(c)}>
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
              <Card.Footer>
                <Pagination className="justify-content-center">
                  <Pagination.Prev
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages)].map((_, idx) => (
                    <Pagination.Item
                      key={idx + 1}
                      active={idx + 1 === currentPage}
                      onClick={() => handlePageChange(idx + 1)}
                    >
                      {idx + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </Card.Footer>
            </Card>
          </Col>
        </Row>

        {/* Row 3: Category Distribution */}
        <Row className="g-4 mb-3">
          <Col>
            <Card className="p-3">
              <Card.Title className="text-center">Category Distribution</Card.Title>
              {categoryData.length === 0 ? (
                <p className="text-center mt-2">No categories found.</p>
              ) : (
                <div className="d-flex justify-content-center">
                  <PieChart width={450} height={320}>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="40%"
                      cy="50%"
                      outerRadius={90}
                      label
                      labelLine={false}
                    >
                      {categoryData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={CAT_COLORS[idx % CAT_COLORS.length]} />
                      ))}
                    </Pie>
                    <ReTooltip />
                    <Legend
                      content={renderMyCategoryLegend}
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      wrapperStyle={{ paddingLeft: '10px' }}
                    />
                  </PieChart>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Edit Coupon Modal */}
      <Modal
        show={showEditModal}
        onHide={handleCancelEdit}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editForm.disabledMessage && (
            <Alert variant="warning" className="mb-3">
              <strong>Reason for disabling:</strong> {editForm.disabledMessage}
            </Alert>
          )}
          <Form
            noValidate
            validated={formValidated}
            onSubmit={handleEditFormSubmit}
          >
            <Row>
              <Col md={6}>
                <Form.Group controlId="formCouponName" className="mb-3">
                  <Form.Label>Campaign Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="couponName"
                    value={editForm.couponName || ''}
                    onChange={handleFormChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a campaign name.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formDiscount" className="mb-3">
                  <Form.Label>Discount</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount"
                    value={editForm.discount || ''}
                    onChange={handleFormChange}
                    required
                    min={0}
                  />
                  <Form.Control.Feedback type="invalid">
                    Enter a non-negative value.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formDiscountType" className="mb-3">
                  <Form.Label>Discount Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="discountType"
                    value={editForm.discountType || ''}
                    onChange={handleFormChange}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    value={editForm.description || ''}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formTermsConditions" className="mb-3">
                  <Form.Label>Terms &amp; Conditions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="termsConditions"
                    value={editForm.termsConditions || ''}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formCategory" className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    name="category"
                    value={editForm.category || ''}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Food & Beverages">Food & Beverages</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Sports">Sports</option>
                    <option value="Others">Others</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Please select a category.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="formTotalNum" className="mb-3">
              <Form.Label>Total Codes</Form.Label>
              <Form.Control
                type="number"
                name="totalNum"
                value={editForm.totalNum || ''}
                onChange={handleFormChange}
                required
                min={1}
              />
              <Form.Control.Feedback type="invalid">
                Enter a positive value.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formExpiryDate" className="mb-3">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                name="expiryDate"
                value={editForm.expiryDate || ''}
                onChange={handleFormChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please select an expiry date.
              </Form.Control.Feedback>
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save and Enable
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} backdrop="static">
        <Modal.Header>
          <Modal.Title>Confirm Update</Modal.Title>
        </Modal.Header>  
        <Modal.Body>
          Are you sure you want to save the changes and enable this coupon?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelConfirm}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmSave}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MerchantDashboard;
