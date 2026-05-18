import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import CallAnalytics from "./pages/CallAnalytics";
import Reservations from "./pages/Reservations";
import KnowledgeBaseManager from "./pages/KnowledgeBaseManager";
import AIConfig from "./pages/AIConfig";
import TeamSettings from "./pages/TeamSettings";
import Billing from "./pages/Billing";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/call-analytics" element={<CallAnalytics />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/knowledge-base" element={<KnowledgeBaseManager />} />
          <Route path="/ai-config" element={<AIConfig />} />
          <Route path="/team" element={<TeamSettings />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
