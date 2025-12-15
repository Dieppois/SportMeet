import { Routes, Route, Navigate } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage";
import { AuthLoginPage } from "./pages/AuthLoginPage";
import { AuthSignupPage } from "./pages/AuthSignupPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ProfilePage } from "./pages/ProfilePage";
import { UserSearchPage } from "./pages/UserSearchPage";
import { GroupsPage } from "./pages/GroupsPage";
import { CreateActivityPage } from "./pages/CreateActivityPage";
import { ActivityDetailPage } from "./pages/ActivityDetailPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Auth */}
      <Route path="/login" element={<AuthLoginPage />} />
      <Route path="/signup" element={<AuthSignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Profil & recherche joueurs */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/users" element={<UserSearchPage />} />

      {/* Groupes & activités */}
      <Route path="/groups" element={<GroupsPage />} />
      <Route path="/activities/new" element={<CreateActivityPage />} />
      <Route
        path="/groups/:groupId/activities/new"
        element={<CreateActivityPage />}
      />
      <Route path="/activities/:activityId" element={<ActivityDetailPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


