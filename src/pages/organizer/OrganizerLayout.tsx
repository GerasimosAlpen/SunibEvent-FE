import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Navigationbar } from '../../components';

function OrganizerLayout() {
  const navigate = useNavigate();
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    if (!user || (user.role !== "ORGANIZATION" && user.role !== "ORGANIZER")) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">

      {/* ─── TOP NAV ─── */}
      <Navigationbar />

      {/* ─── PAGE CONTENT ─── */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default OrganizerLayout;
