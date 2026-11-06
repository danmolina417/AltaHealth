import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { AreasLayout } from '../features/areas/AreasLayout';
import { DentalPage } from '../features/areas/DentalPage';
import { LifestylePage } from '../features/areas/LifestylePage';
import { MedicalPage } from '../features/areas/MedicalPage';
import { MyHealthPage } from '../features/myHealth/MyHealthPage';
import { SkinPage } from '../features/areas/SkinPage';
import { LoginPage } from '../features/auth/LoginPage';
import { SignupPage } from '../features/auth/SignupPage';
import { LandingPage } from '../features/landing/LandingPage';
import { paths } from './paths';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => (
  <Routes>
    <Route path={paths.login} element={<LoginPage />} />
    <Route path={paths.signup} element={<SignupPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path={paths.home} element={<LandingPage />} />
        <Route path={paths.myHealth} element={<MyHealthPage />} />
        <Route element={<AreasLayout />}>
          <Route path={paths.skin} element={<SkinPage />} />
          <Route path={paths.dental} element={<DentalPage />} />
          <Route path={paths.medical} element={<MedicalPage />} />
          <Route path={paths.lifestyle} element={<LifestylePage />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to={paths.home} replace />} />
  </Routes>
);
