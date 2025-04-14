import React from "react";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loginpage from "./components/user/Loginpage";
import Registerpage from "./components/user/Registerpage";
import OrgAdminHome from "./components/orgAdmin/OrgAdminHome";
import DonorHome from "./components/donor/DonorHome";
import MainLayout from "./components/MainLayout";
import RegisterOrganization from "./components/orgAdmin/RegisterOrganization";
import AdminProfile from "./components/orgAdmin/OrgAdminProfile";
import NewCauseAdd from "./components/orgAdmin/NewCauseAdd";
import CauseDetail from "./components/Donations/CauseDetail";
import CauseList from "./components/Donations/CauseList";
import AdminHome from "./components/admin/AdminHome";
import OrganizationList from "./components/admin/OrganizationList";
import AdminsList from "./components/admin/AdminsList";
import DonorsList from "./components/admin/DonorsList";
import Home from "./components/home/home";
import About from "./pages/about";
import KnowMore from "./pages/know_more";
import DonatePage from "./components/Donations/DonatePage";
import ProtectedRoute from "./context/ProtectedRoute";
import Stats from "./pages/Stats";
import PaymentPage from "./components/Donations/PaymentPage";
import PaymentApprove from "./components/Donations/PaymentApprove";
import PaymentDone from "./components/Donations/PaymentSuccess";
import PaymentCancel from "./components/Donations/PaymentCancel";
import DonorReport from "./components/donor/DonationsDonor";
import DonationsDonor from "./components/donor/DonationsDonor";
import DonationsOrganizations from "./components/orgAdmin/DonationsOrganizations";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/know_more" element={<KnowMore />} />
            <Route path="/login" element={<Loginpage />} />
            <Route path="/register" element={<Registerpage />} />
            <Route path="/register-organization" element={<RegisterOrganization />} />
            <Route path = "/stats" element = {<Stats/>} />

            {/* ✅ Protected routes for Org Admins */}
            <Route element={<ProtectedRoute allowedRoles={["Organization_admin"]} />}>
              <Route path="/orgadmin-home" element={<OrgAdminHome />} />
              <Route path="/orgadmin/profile" element={<AdminProfile />} />
              <Route path="/orgadmin/new_cause" element={<NewCauseAdd />} />
              <Route path ="/orgadmin/donations" element={<DonationsOrganizations/>} />
            </Route>

            {/* ✅ Protected routes for Donors */}
            <Route element={<ProtectedRoute allowedRoles={["Donor"]} />}>
              <Route path="/donors/cause-list" element={<CauseList />} />
              <Route path="/cause/:cause_id" element={<CauseDetail />} />
              <Route path="/donor-home" element={<DonorHome />} />
              <Route path="/donor/donate" element={<DonatePage />} />
              <Route path="/donor/payment" element={<PaymentPage />} />
              <Route path="/payment-approve" element={<PaymentApprove />} />
              <Route path="/payment-success" element={<PaymentDone/>}/>
              <Route path="/payment-cancel" element={<PaymentCancel/>}/>
              <Route path="/donor/reports" element={<DonorReport/>}/>
              <Route path="/donor/donations" element={<DonationsDonor/>}/>


            </Route>

            {/* ✅ Protected routes for Admins */}
            <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
              <Route path="/admin-home" element={<AdminHome />} />
              <Route path="/admin/donors" element={<DonorsList />} />
              <Route path="/admin/organizations" element={<OrganizationList />} />
              <Route path="/admin/org-admins" element={<AdminsList />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
