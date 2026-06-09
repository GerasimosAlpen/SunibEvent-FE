import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Tag,
  FileText,
  Image,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Link2,
  ChevronDown,
  Clock,
} from 'lucide-react';
import { createOrgEvent, type CreateEventPayload } from '../../API/POST/OrgCreateEvent';
import { getCategories, type Category } from '../../API/GET/GetCategories';
import { viewEventById } from '../../API/GET/ViewOne';
import { updateOrgEvent } from '../../API/PUT/UpdateEvent';

// ── Ganti dengan ID org yang sedang login ──
const ORG_ID = 1;

// ── Field wrapper ──
const Field = ({
  label,
  icon,
  children,
  error,
  required,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
      <span className="text-gray-400">{icon}</span>
      {label}
      {required && <span className="text-orange-500">*</span>}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1 text-xs text-red-500">
        <AlertCircle className="w-3 h-3" />
        {error}
      </p>
    )}
  </div>
);

// ── Toast ──
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
type FormErrors = Partial<Record<keyof CreateEventPayload | 'startTime' | 'endTime', string>>;

function CreateEvent() {
  const navigate = useNavigate();

  const { id } = useParams();

  // Categories from BE
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [form, setForm] = useState<CreateEventPayload & { startTime: string; endTime: string }>({
    title: '',
    category: '', // will store category id as string
    date: '',
    location: '',
    description: '',
    capacity: 0,
    image_url: '',
    registrationLink: '',
    startTime: '09:00',
    endTime: '17:00',
    status: 'ONLINE',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCatError(true))
      .finally(() => setCatLoading(false));
  }, []);

  // Fetch event details if in Edit mode
  useEffect(() => {
    if (id) {
      setLoading(true);
      viewEventById(id)
        .then(res => {
          const data = res?.data;
          if (data) {
            const formatTime = (isoString: string) => {
              if (!isoString) return '';
              const d = new Date(isoString);
              const hrs = String(d.getHours()).padStart(2, '0');
              const mins = String(d.getMinutes()).padStart(2, '0');
              return `${hrs}:${mins}`;
            };

            const formatDate = (isoString: string) => {
              if (!isoString) return '';
              const d = new Date(isoString);
              const year = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const date = String(d.getDate()).padStart(2, '0');
              return `${year}-${month}-${date}`;
            };

            setForm({
              title: data.title || '',
              category: String(data.category?.id || ''),
              date: data.datetime ? formatDate(data.datetime) : '',
              location: data.location || '',
              description: data.description || '',
              capacity: data.quota || 0,
              image_url: data.imageUrl || '',
              registrationLink: data.registrationLink || '',
              startTime: data.datetime ? formatTime(data.datetime) : '09:00',
              endTime: data.endtime ? formatTime(data.endtime) : '17:00',
              status: data.status || 'ONLINE',
            });
          }
        })
        .catch(err => {
          console.error("Gagal memuat detail event:", err);
          showToast("Gagal memuat detail event", "error");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const set = (key: keyof (CreateEventPayload & { startTime: string; endTime: string }), value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    const errorKey = key as keyof FormErrors;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[errorKey];
        return copy;
      });
    }
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.title.trim()) e.title = 'Judul wajib diisi';
    if (!form.category) e.category = 'Kategori wajib dipilih';
    if (!form.date) e.date = 'Tanggal wajib diisi';
    if (!form.location.trim()) e.location = 'Lokasi wajib diisi';
    if (!form.description.trim()) e.description = 'Deskripsi wajib diisi';
    if (!form.capacity || form.capacity < 1) e.capacity = 'Kapasitas minimal 1';
    if (!form.startTime) e.startTime = 'Jam mulai wajib diisi';
    if (!form.endTime) e.endTime = 'Jam selesai wajib diisi';
    
    if (!form.registrationLink?.trim()) {
      e.registrationLink = 'Link registrasi wajib diisi';
    } else {
      try {
        new URL(form.registrationLink);
      } catch {
        e.registrationLink = 'Link registrasi tidak valid (contoh: https://example.com)';
      }
    }

    if (form.image_url?.trim()) {
      try {
        new URL(form.image_url);
      } catch {
        e.image_url = 'URL gambar tidak valid (contoh: https://example.com/gambar-event.jpg)';
      }
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const backendPayload = {
        title: form.title,
        description: form.description,
        categoryId: Number(form.category),
        datetime: form.date && form.startTime ? new Date(form.date + "T" + form.startTime + ":00").toISOString() : new Date().toISOString(),
        endtime: form.date && form.endTime ? new Date(form.date + "T" + form.endTime + ":00").toISOString() : new Date().toISOString(),
        location: form.location,
        quota: Number(form.capacity),
        imageUrl: form.image_url?.trim() || undefined,
        registrationLink: form.registrationLink?.trim() || undefined,
        status: form.status,
      };

      if (id) {
        await updateOrgEvent(id, backendPayload as unknown as CreateEventPayload);
        showToast('Event berhasil diperbarui! 🎉', 'success');
      } else {
        await createOrgEvent(ORG_ID, backendPayload as unknown as CreateEventPayload);
        showToast('Event berhasil dibuat! 🎉', 'success');
      }
      setTimeout(() => navigate('/organizer/posts'), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Object && 'message' in err
        ? String((err as { message: string }).message)
        : 'Gagal memproses event';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };
  // Get local date string for 'min' attribute in YYYY-MM-DD format
  const today = new Date().toLocaleDateString('sv-SE'); // sv-SE locale outputs YYYY-MM-DD

  return (
    <div className="min-h-full bg-gray-50 pb-16">



      {/* ─── Form ─── */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors w-fit"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
            Kembali
          </button>

          {/* Header section (huge text) */}
          <div className="mb-6">
            <h1 className="leading-none" style={{ marginTop: '16px', marginBottom: '8px' }}>
              {id ? 'Edit Event' : 'Buat Event Baru'}
            </h1>
            <p className="text-sm text-gray-500">
              {id ? 'Perbarui detail event yang sudah dipublikasikan' : 'Isi detail event yang akan dipublikasikan ke platform'}
            </p>
          </div>

          {/* Card: Info Utama */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Informasi Utama
            </div>

            {/* Title */}
            <Field
              label="Judul Event"
              icon={<FileText className="w-3.5 h-3.5" />}
              error={errors.title}
              required
            >
              <input
                type="text"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Contoh: Seminar Nasional Teknologi 2025"
                maxLength={120}
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-800
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all
                  ${errors.title
                    ? 'border-red-300 focus:ring-red-400/30'
                    : 'border-gray-200 focus:ring-orange-400/40 focus:border-orange-300'}`}
              />
            </Field>

            {/* Category + Date (side by side) */}
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Kategori"
                icon={<Tag className="w-3.5 h-3.5" />}
                error={errors.category}
                required
              >
                <div className="relative">
                  {/* Backdrop to close dropdown when clicking outside */}
                  {isDropdownOpen && (
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsDropdownOpen(false)}
                    />
                  )}

                  <button
                    type="button"
                    disabled={catLoading}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`relative z-20 w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-left transition-all text-gray-800
                      focus:outline-none focus:ring-2 focus:bg-white
                      disabled:opacity-60 disabled:cursor-wait
                      ${errors.category
                        ? 'border-red-300 focus:ring-red-400/30'
                        : 'border-gray-200 focus:ring-orange-400/40 focus:border-orange-300'}`}
                  >
                    <span className={categories.find(c => String(c.id) === form.category) ? 'text-gray-800' : 'text-gray-400'}>
                      {categories.find(c => String(c.id) === form.category)?.name || 
                        (catLoading ? 'Memuat kategori...' : catError ? 'Gagal memuat, coba lagi' : 'Pilih kategori...')}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-205 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && !catLoading && (
                    <div className="absolute z-30 left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl py-1 animate-in fade-in slide-in-from-top-1 duration-150 custom-scrollbar">
                      {categories.map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            set('category', String(c.id));
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors
                            ${form.category === String(c.id) ? 'bg-orange-50 font-bold text-orange-600' : 'text-gray-700'}`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Field>

              <Field
                label="Tanggal"
                icon={<CalendarDays className="w-3.5 h-3.5" />}
                error={errors.date}
                required
              >
                <input
                  type="date"
                  value={form.date}
                  min={today}
                  onChange={e => set('date', e.target.value)}
                  onClick={(e) => {
                    try {
                      if ('showPicker' in HTMLInputElement.prototype) {
                        e.currentTarget.showPicker();
                      }
                    } catch (err) {
                      // ignore
                    }
                  }}
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-800
                    focus:outline-none focus:ring-2 focus:bg-white transition-all cursor-pointer
                    ${errors.date
                      ? 'border-red-300 focus:ring-red-400/30'
                      : 'border-gray-200 focus:ring-orange-400/40 focus:border-orange-300'}`}
                />
              </Field>
            </div>

            {/* Jam Mulai + Jam Selesai (side by side) */}
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Jam Mulai"
                icon={<Clock className="w-3.5 h-3.5" />}
                error={errors.startTime}
                required
              >
                <input
                  type="time"
                  value={form.startTime}
                  onChange={e => set('startTime', e.target.value)}
                  onClick={(e) => {
                    try {
                      if ('showPicker' in HTMLInputElement.prototype) {
                        e.currentTarget.showPicker();
                      }
                    } catch (err) {
                      // ignore
                    }
                  }}
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-800
                    focus:outline-none focus:ring-2 focus:bg-white transition-all cursor-pointer
                    ${errors.startTime
                      ? 'border-red-300 focus:ring-red-400/30'
                      : 'border-gray-200 focus:ring-orange-400/40 focus:border-orange-300'}`}
                />
              </Field>

              <Field
                label="Jam Selesai"
                icon={<Clock className="w-3.5 h-3.5" />}
                error={errors.endTime}
                required
              >
                <input
                  type="time"
                  value={form.endTime}
                  onChange={e => set('endTime', e.target.value)}
                  onClick={(e) => {
                    try {
                      if ('showPicker' in HTMLInputElement.prototype) {
                        e.currentTarget.showPicker();
                      }
                    } catch (err) {
                      // ignore
                    }
                  }}
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-800
                    focus:outline-none focus:ring-2 focus:bg-white transition-all cursor-pointer
                    ${errors.endTime
                      ? 'border-red-300 focus:ring-red-400/30'
                      : 'border-gray-200 focus:ring-orange-400/40 focus:border-orange-300'}`}
                />
              </Field>
            </div>

            {/* Location */}
            <Field
              label="Lokasi"
              icon={<MapPin className="w-3.5 h-3.5" />}
              error={errors.location}
              required
            >
              <input
                type="text"
                value={form.location}
                onChange={e => set('location', e.target.value)}
                placeholder="Contoh: Auditorium Sunib, Gedung A Lt. 3"
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-800
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all
                  ${errors.location
                    ? 'border-red-300 focus:ring-red-400/30'
                    : 'border-gray-200 focus:ring-orange-400/40 focus:border-orange-300'}`}
              />
            </Field>

            {/* Capacity */}
            <Field
              label="Kapasitas Peserta"
              icon={<Users className="w-3.5 h-3.5" />}
              error={errors.capacity}
              required
            >
              <div className="relative">
                <input
                  type="number"
                  value={form.capacity || ''}
                  min={1}
                  max={100000}
                  onChange={e => set('capacity', parseInt(e.target.value) || 0)}
                  placeholder="Contoh: 200"
                  className={`w-full px-4 py-2.5 pr-14 bg-gray-50 border rounded-xl text-sm text-gray-800
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all
                    ${errors.capacity
                      ? 'border-red-300 focus:ring-red-400/30'
                      : 'border-gray-200 focus:ring-orange-400/40 focus:border-orange-300'}`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  orang
                </span>
              </div>
            </Field>

            {/* Registration Link */}
            <Field
              label="Link Registrasi"
              icon={<Link2 className="w-3.5 h-3.5" />}
              error={errors.registrationLink}
              required
            >
              <input
                type="url"
                value={form.registrationLink || ''}
                onChange={e => set('registrationLink', e.target.value)}
                placeholder="Contoh: https://form.binus.edu/seminar-registrasi"
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-800
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all
                  ${errors.registrationLink
                    ? 'border-red-300 focus:ring-red-400/30'
                    : 'border-gray-200 focus:ring-orange-400/40 focus:border-orange-300'}`}
              />
            </Field>

            {/* Status (Only show when editing) */}
            {id && (
              <Field
                label="Status Registrasi"
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => set('status', 'ONLINE')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all duration-200
                      ${form.status === 'ONLINE'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold ring-2 ring-emerald-400/20 shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${form.status === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                    Registration Open
                  </button>
                  <button
                    type="button"
                    onClick={() => set('status', 'CLOSED')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all duration-200
                      ${form.status === 'CLOSED'
                        ? 'bg-red-50 border-red-300 text-red-700 font-bold ring-2 ring-red-400/20 shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${form.status === 'CLOSED' ? 'bg-red-500' : 'bg-gray-400'}`} />
                    Closed
                  </button>
                </div>
              </Field>
            )}
          </div>

          {/* Card: Deskripsi */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Deskripsi
            </div>

            <Field
              label="Deskripsi Event"
              icon={<FileText className="w-3.5 h-3.5" />}
              error={errors.description}
              required
            >
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Ceritakan tentang event ini: tujuan, manfaat, agenda, dll."
                rows={6}
                maxLength={2000}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm text-gray-800
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none
                  ${errors.description
                    ? 'border-red-300 focus:ring-red-400/30'
                    : 'border-gray-200 focus:ring-orange-400/40 focus:border-orange-300'}`}
              />
              <p className="text-right text-[11px] text-gray-400 -mt-1">
                {form.description.length} / 2000
              </p>
            </Field>
          </div>

          {/* Card: Gambar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Gambar Event <span className="text-gray-300 font-normal normal-case tracking-normal">(opsional)</span>
            </div>

            <Field
              label="URL Gambar"
              icon={<Image className="w-3.5 h-3.5" />}
              error={errors.image_url}
            >
              <input
                type="url"
                value={form.image_url}
                onChange={e => set('image_url', e.target.value)}
                placeholder="https://example.com/gambar-event.jpg"
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-800
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all
                  ${errors.image_url
                    ? 'border-red-300 focus:ring-red-400/30'
                    : 'border-gray-200 focus:ring-orange-400/40 focus:border-orange-300'}`}
              />
            </Field>

            {/* Preview */}
            {form.image_url && (
              <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-video">
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => set('image_url', '')}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full
                    bg-black/40 text-white hover:bg-black/60 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/40 rounded-md text-[10px] text-white backdrop-blur-sm">
                  Preview
                </div>
              </div>
            )}

            {!form.image_url && (
              <div className="flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                <Upload className="w-6 h-6 text-gray-300" />
                <p className="text-xs">Tempel URL gambar di atas untuk melihat preview</p>
              </div>
            )}
          </div>

          {/* ─── Actions ─── */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200
                hover:bg-gray-50 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500
                hover:from-orange-600 hover:to-amber-600 disabled:opacity-60 disabled:cursor-not-allowed
                text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-200
                transition-all duration-200 active:scale-95"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
                : <><CheckCircle2 className="w-4 h-4" /> {id ? 'Simpan Perubahan' : 'Publikasikan Event'}</>
              }
            </button>
          </div>
        </div>
      </form>

      {/* ─── Toast ─── */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default CreateEvent;
