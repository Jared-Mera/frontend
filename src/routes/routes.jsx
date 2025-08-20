import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import ProductsPage from '../pages/admin/Products';
import UsersPage from '../pages/admin/Users';
import RolesPage from '../pages/admin/Roles';
import NewSalePage from '../pages/sales/NewSale';
import SalesHistoryPage from '../pages/sales/SalesHistory';
import SalesReportPage from '../pages/reports/SalesReport';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Rutas de administración */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin/products" element={<ProductsPage />} />
                        <Route path="/admin/users" element={<UsersPage />} />
                        <Route path="/admin/roles" element={<RolesPage />} />
                    </Route>

                    {/* Rutas de ventas */}
                    <Route path="/sales" element={<NewSalePage />} />
                    <Route path="/sales/history" element={<SalesHistoryPage />} />

                    {/* Rutas de reportes */}
                    <Route
                        path="/reports"
                        element={
                            <ErrorBoundary>
                                <SalesReportPage />
                            </ErrorBoundary>
                        }
                    />
                </Route>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;