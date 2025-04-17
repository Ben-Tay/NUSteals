import { Tabs, Tab, Card } from 'react-bootstrap';
import moment from 'moment';
import AdminUserDashboard from './AdminUserDashboard';
import AdminCouponDashboard from './AdminCouponDashboard';
import DashboardHeader from './DashboardHeader';


const AdminDashboardTab = () => {


  const today = moment().format('MMMM, YYYY');
  const API_URL = 'https://nusteals-express.onrender.com';

  return (
    <Card className="w-full max-w-7xl mx-auto p-4 min-h-[800px] mb-5">
      <DashboardHeader today={today} />
      <Tabs
        defaultActiveKey="Users"
        id="my-tabs"
        className="mb-3 mt-3"
        tabClassName="text-black hover:text-primary transition-all duration-200"
        activeTabClassName="!text-blue-500 !font-bold">
        <Tab eventKey="Users" title="Users">
          <AdminUserDashboard today={today} api={API_URL} />
        </Tab>
        <Tab eventKey="Coupons" title="Coupons">
          <AdminCouponDashboard today={today} api={API_URL} />
        </Tab>
      </Tabs>
    </Card>

  );
}

export default AdminDashboardTab;