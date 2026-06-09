import { Outlet } from 'react-router-dom';
import { Navigationbar } from '../../components';

function OrganizerLayout() {
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
