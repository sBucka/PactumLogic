import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ContractListPage from "../pages/contracts/ContractListPage";
import ContractDetailPage from "../pages/contracts/ContractDetailPage";
import ContractFormPage from "../pages/contracts/ContractFormPage";
import ClientListPage from "../pages/clients/ClientListPage";
import ClientDetailPage from "../pages/clients/ClientDetailPage";
import ClientFormPage from "../pages/clients/ClientFormPage";
import AdvisorListPage from "../pages/advisors/AdvisorListPage";
import AdvisorDetailPage from "../pages/advisors/AdvisorDetailPage";
import AdvisorFormPage from "../pages/advisors/AdvisorFormPage";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import ContractEditPage from "../pages/contracts/ContractEditPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path='contracts'>
          <Route index element={<ContractListPage />} />
          <Route path=':id' element={<ContractDetailPage />} />
          <Route path='new' element={<ContractFormPage />} />
          <Route path=':id/edit' element={<ContractEditPage />} />
        </Route>
        <Route path='clients'>
          <Route index element={<ClientListPage />} />
          <Route path=':id' element={<ClientDetailPage />} />
          <Route path='new' element={<ClientFormPage />} />
        </Route>
        <Route path='advisors'>
          <Route index element={<AdvisorListPage />} />
          <Route path=':id' element={<AdvisorDetailPage />} />
          <Route path='new' element={<AdvisorFormPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
