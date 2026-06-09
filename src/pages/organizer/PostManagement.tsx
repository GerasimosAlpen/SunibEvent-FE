import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Eye,
  Search,
  CalendarDays,
  MapPin,
  Users,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Pencil,
} from 'lucide-react';
import { getOrgEvents, type OrgEvent } from '../../API/GET/ViewAllOrg';
import { deleteOrgEvent } from '../../API/DELETE/DeleteEventLow';

// ── Ganti dengan ID org yang sedang login ──
const ORG_ID = 1;

// ── Status badge ──
type EventStatus = OrgEvent['status'];

const STATUS_CONFIG: Record<EventStatus, { label: string; classes: string; dot: string }> = {
  upcoming:  { label: 'Upcoming',  classes: 'bg-orange-50 text-orange-600 border border-orange-200', dot: 'bg-orange-400' },
  ongoing:   { label: 'Ongoing',   classes: 'bg-emerald-50 text-emerald-600 border border-emerald-200', dot: 'bg-emerald-500' },
  completed: { label: 'Completed', classes: 'bg-gray-100 text-gray-500 border border-gray-200', dot: 'bg-gray-400' },
};

const StatusBadge = ({ status }: { status: EventStatus }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ── Delete confirm modal ──
const ConfirmModal = ({
  event,
  onConfirm,
  onCancel,
  loading,
}: {
  event: OrgEvent;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
      <button
        onClick={onCancel}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <Trash2 className="w-5 h-5 text-red-500" />
      </div>
      <h3 className="font-bold text-gray-900 text-base mb-1">Hapus Event?</h3>
      <p className="text-sm text-gray-500 mb-5">
        <span className="font-semibold text-gray-700">"{event.title}"</span> akan dihapus
        permanen dan tidak bisa dikembalikan.
      </p>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 rounded-xl transition-colors"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Hapus
        </button>
      </div>
    </div>
  </div>
);

// ── Toast notification ──
const Toast = ({ message, type }: { message: string; type: 'success' | 'error' }) => (
  <div
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium
      animate-in slide-in-from-bottom-4 duration-300
      ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
  >
    {type === 'success'
      ? <CheckCircle2 className="w-4 h-4 shrink-0" />
      : <AlertCircle className="w-4 h-4 shrink-0" />}
    {message}
  </div>
);

// ════════════════════════════════════════════
function ManageEvents() {
  const navigate = useNavigate();

  // List state
  const [events, setEvents]           = useState<OrgEvent[]>([]);
  const [total, setTotal]             = useState(0);
  const [totalPages, setTotalPages]   = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading]         = useState(true);
  const [fetchError, setFetchError]   = useState<string | null>(null);

  // Search / filter
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<OrgEvent | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await getOrgEvents(ORG_ID, currentPage);
      const backendData = (res as any).data;
      if (backendData && Array.isArray(backendData.events)) {
        setEvents(backendData.events.map((e: any) => ({
          id: e.id,
          title: e.title,
          category: e.category?.name || "Uncategorized",
          date: new Date(e.datetime).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" }),
          location: e.location,
          image_url: e.imageUrl,
          status: e.status === "ONLINE" ? "upcoming" : "completed",
          registered: 0,
          capacity: e.quota,
        })));
        setTotal(backendData.total);
        setTotalPages(Math.max(1, Math.ceil(backendData.total / 10)));
      } else {
        setEvents(res.data as any);
        setTotal((res as any).total);
        setTotalPages(Math.max(1, Math.ceil((res as any).total / 10)));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat events';
      setFetchError(msg);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  // Delete handler
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteOrgEvent(ORG_ID, deleteTarget.id);
      showToast('Event berhasil dihapus', 'success');
      setDeleteTarget(null);
      fetchEvents(); // refresh list
    } catch {
      showToast('Gagal menghapus event', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Client-side search + filter (sebelum API support filter)
  const displayed = events.filter(e => {
    const matchSearch =
      search === '' ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-6">

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Organizer Dashboard</h2>
          <p className="text-sm text-gray-400 mt-1">
            Kelola semua event dari organisasi kamu.
          </p>
        </div>
        <button
          onClick={() => navigate('/organizer/posts/create')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500
            hover:from-orange-600 hover:to-amber-600 text-white text-sm font-semibold
            rounded-xl shadow-lg shadow-orange-200 transition-all duration-200 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Post Event Baru
        </button>
      </div>

      {/* ─── Search + Filter bar ─── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama event atau kategori..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm
              text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/40
              shadow-sm transition-shadow"
          />
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'upcoming', 'completed'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === s
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500'
              }`}
            >
              {s === 'all' ? 'Semua' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Event list ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">Memuat events...</span>
          </div>
        )}

        {/* Error */}
        {!loading && fetchError && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle className="w-7 h-7 text-red-400" />
            <p className="text-sm font-medium text-red-500">{fetchError}</p>
            <button
              onClick={fetchEvents}
              className="text-xs text-orange-500 underline hover:text-orange-600"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !fetchError && displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <CalendarDays className="w-10 h-10 text-gray-200" />
            <p className="text-sm font-medium">Belum ada event ditemukan</p>
            <button
              onClick={() => navigate('/organizer/posts/create')}
              className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Post event pertamamu
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !fetchError && displayed.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[10px] font-bold tracking-widest text-gray-400 uppercase border-b border-gray-100 bg-gray-50/60">
                    <th className="px-6 py-3">Event</th>
                    <th className="px-6 py-3">Tanggal</th>
                    <th className="px-6 py-3">Lokasi</th>
                    <th className="px-6 py-3">Kuota</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayed.map(event => (
                    <tr
                      key={event.id}
                      className="hover:bg-orange-50/20 transition-colors group"
                    >
                      {/* Event name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-100 flex items-center justify-center shrink-0 overflow-hidden">
                            {event.image_url
                              ? <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                              : <CalendarDays className="w-4 h-4 text-orange-400" />
                            }
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-orange-600 transition-colors line-clamp-1">
                              {event.title}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{event.category}</p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                          {event.date}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </td>

                      {/* Quota */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-semibold text-gray-700">{event.capacity}</span>
                          <span>peserta</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={event.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* View detail */}
                          <button
                            onClick={() => navigate(`/organizer/posts/${event.id}`)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
                              hover:text-orange-500 hover:bg-orange-50 transition-colors"
                            title="Lihat detail"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {/* Edit event */}
                          <button
                            onClick={() => navigate(`/organizer/posts/edit/${event.id}`)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
                              hover:text-amber-500 hover:bg-amber-50 transition-colors"
                            title="Edit event"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTarget(event)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
                              hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Hapus event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing {displayed.length} dari{' '}
                <span className="font-semibold text-gray-700">{total} events</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200
                    hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                      currentPage === p
                        ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-200'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200
                    hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── Delete confirm modal ─── */}
      {deleteTarget && (
        <ConfirmModal
          event={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {/* ─── Toast ─── */}
      {toast && <Toast message={toast.message} type={toast.type} />}

    </div>
  );
}

export default ManageEvents;
