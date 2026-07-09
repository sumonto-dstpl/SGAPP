import { useState } from 'react';
import { Plus, Trash2, Search, MoreHorizontal, Car, IndianRupee, Wallet, FileWarning, X, ChevronLeft, ChevronRight, Banknote } from 'lucide-react';
import { useData } from '../store/DataContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import { Garage } from '../types';
import Modal from '../components/Modal';

const PER_PAGE = 8;

function fmt(n: number) { return `₹${n.toLocaleString('en-IN')}`; }

function fmtDate(s: string) {
  if (!s) return '—';
  try { return new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return s; }
}

// ─── Add Garage Modal ──────────────────────────────────────────────────────────

function AddGarageModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addGarage } = useData();
  const { showSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    garageNo: '', ownerName: '', mobileNumber: '', vehicleNumber: '',
    vehicleType: 'Car' as Garage['vehicleType'],
    monthlyRent: '', leaseType: 'Monthly' as Garage['leaseType'],
    startDate: new Date().toISOString().split('T')[0],
    leaseEndDate: '',
  });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.garageNo || !form.ownerName || !form.mobileNumber || !form.vehicleNumber || !form.monthlyRent || !form.startDate || (form.leaseType === 'Long-term' && !form.leaseEndDate)) {
      showSnackbar('Please fill all required fields', 'warning');
      return;
    }
    setSaving(true);
    try {
      await addGarage({
        ...form,
        monthlyRent: Number(form.monthlyRent),
        currentDue: Number(form.monthlyRent),
        paymentStatus: 'Due',
        dueDate: form.startDate,
        leaseEndDate: form.leaseEndDate || form.startDate,
      });
      showSnackbar(`Garage ${form.garageNo} added successfully`, 'success');
      setForm({
        garageNo: '', ownerName: '', mobileNumber: '', vehicleNumber: '',
        vehicleType: 'Car', monthlyRent: '', leaseType: 'Monthly',
        startDate: new Date().toISOString().split('T')[0], leaseEndDate: '',
      });
      onClose();
    } catch { showSnackbar('Failed to add garage', 'error'); }
    finally { setSaving(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New Garage" width="max-w-lg">
      <div className="space-y-4">
        {[
          { label: 'Garage No. *', key: 'garageNo', placeholder: 'G-13' },
          { label: 'Owner Name *', key: 'ownerName', placeholder: 'Mr. Roy' },
          { label: 'Mobile Number *', key: 'mobileNumber', placeholder: '9876543210' },
          { label: 'Vehicle Number *', key: 'vehicleNumber', placeholder: 'WB 02 AB 1234' },
          { label: 'Monthly Rent (₹) *', key: 'monthlyRent', placeholder: '5000', type: 'number' },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input
              type={f.type || 'text'} placeholder={f.placeholder}
              value={form[f.key as keyof typeof form] as string}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
          <select value={form.vehicleType} onChange={e => setForm(p => ({ ...p, vehicleType: e.target.value as Garage['vehicleType'] }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {['Car', 'Bike', 'Truck', 'Other'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lease Type</label>
          <select value={form.leaseType} onChange={e => setForm(p => ({ ...p, leaseType: e.target.value as Garage['leaseType'] }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {['Monthly', 'Yearly', 'Long-term'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
            <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date {form.leaseType === 'Long-term' && '*'}</label>
            <input type="date" value={form.leaseEndDate} onChange={e => setForm(p => ({ ...p, leaseEndDate: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={submit} disabled={saving} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">{saving ? 'Saving...' : 'Add Garage'}</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── View Garage Modal ─────────────────────────────────────────────────────────

function GarageDetailModal({ garage, onClose }: { garage: Garage; onClose: () => void }) {
  const { updateGarage } = useData();
  const { showSnackbar } = useSnackbar();

  const handlePayment = async () => {
    try {
      await updateGarage(garage.id, { currentDue: 0, paymentStatus: 'Paid' });
      showSnackbar(`Payment marked as Paid for ${garage.garageNo}`, 'success');
      onClose();
    } catch { showSnackbar('Failed to update payment status', 'error'); }
  };

  return (
    <Modal open={true} onClose={onClose} title={`${garage.garageNo} — ${garage.ownerName}`} width="max-w-xl">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Garage No.', value: garage.garageNo },
            { label: 'Owner Name', value: garage.ownerName },
            { label: 'Mobile Number', value: garage.mobileNumber },
            { label: 'Vehicle Number', value: garage.vehicleNumber },
            { label: 'Vehicle Type', value: garage.vehicleType },
            { label: 'Monthly Rent', value: fmt(garage.monthlyRent) },
            { label: 'Current Due', value: fmt(garage.currentDue) },
            { label: 'Lease Type', value: garage.leaseType },
            { label: 'Start Date', value: fmtDate(garage.startDate) },
            { label: 'Lease End Date', value: fmtDate(garage.leaseEndDate) },
          ].map(f => (
            <div key={f.label}>
              <p className="text-xs text-gray-500 mb-1">{f.label}</p>
              <p className="text-sm font-semibold text-gray-800">{f.value}</p>
            </div>
          ))}
          <div>
            <p className="text-xs text-gray-500 mb-1">Payment Status</p>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${garage.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${garage.paymentStatus === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`} />
              {garage.paymentStatus}
            </span>
          </div>
        </div>
        {garage.paymentStatus === 'Due' && (
          <button onClick={handlePayment} className="w-full px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
            Mark as Paid ({fmt(garage.monthlyRent)})
          </button>
        )}
      </div>
    </Modal>
  );
}

// ─── Edit Garage Modal ─────────────────────────────────────────────────────────

function EditGarageModal({ garage, onClose }: { garage: Garage; onClose: () => void }) {
  const { updateGarage } = useData();
  const { showSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    garageNo: garage.garageNo,
    ownerName: garage.ownerName,
    mobileNumber: garage.mobileNumber,
    vehicleNumber: garage.vehicleNumber,
    vehicleType: garage.vehicleType,
    monthlyRent: String(garage.monthlyRent),
    leaseType: garage.leaseType,
    startDate: garage.startDate,
    leaseEndDate: garage.leaseEndDate,
  });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.garageNo || !form.ownerName || !form.mobileNumber || !form.vehicleNumber || !form.monthlyRent || !form.startDate || (form.leaseType === 'Long-term' && !form.leaseEndDate)) {
      showSnackbar('Please fill all required fields', 'warning');
      return;
    }
    setSaving(true);
    try {
      await updateGarage(garage.id, {
        garageNo: form.garageNo,
        ownerName: form.ownerName,
        mobileNumber: form.mobileNumber,
        vehicleNumber: form.vehicleNumber,
        vehicleType: form.vehicleType as Garage['vehicleType'],
        monthlyRent: Number(form.monthlyRent),
        leaseType: form.leaseType as Garage['leaseType'],
        startDate: form.startDate,
        leaseEndDate: form.leaseEndDate,
      });
      showSnackbar(`${form.garageNo} updated successfully`, 'success');
      onClose();
    } catch { showSnackbar('Failed to update garage', 'error'); }
    finally { setSaving(false); }
  };

  return (
    <Modal open={true} onClose={onClose} title={`Edit ${garage.garageNo}`} width="max-w-lg">
      <div className="space-y-4">
        {[
          { label: 'Garage No. *', key: 'garageNo', placeholder: 'G-01' },
          { label: 'Owner Name *', key: 'ownerName', placeholder: 'Mr. Roy' },
          { label: 'Mobile Number *', key: 'mobileNumber', placeholder: '9876543210' },
          { label: 'Vehicle Number *', key: 'vehicleNumber', placeholder: 'WB 02 AB 1234' },
          { label: 'Monthly Rent (₹) *', key: 'monthlyRent', placeholder: '5000', type: 'number' },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input
              type={f.type || 'text'} placeholder={f.placeholder}
              value={form[f.key as keyof typeof form] as string}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
          <select value={form.vehicleType} onChange={e => setForm(p => ({ ...p, vehicleType: e.target.value as Garage['vehicleType'] }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {['Car', 'Bike', 'Truck', 'Other'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lease Type</label>
          <select value={form.leaseType} onChange={e => setForm(p => ({ ...p, leaseType: e.target.value as Garage['leaseType'] }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {['Monthly', 'Yearly', 'Long-term'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
            <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date {form.leaseType === 'Long-term' && '*'}</label>
            <input type="date" value={form.leaseEndDate} onChange={e => setForm(p => ({ ...p, leaseEndDate: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={submit} disabled={saving} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Garages Page ─────────────────────────────────────────────────────────

export default function Garages() {
  const { garages, deleteGarage, updateGarage, addPayment } = useData();
  const { showSnackbar } = useSnackbar();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [leaseFilter, setLeaseFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [viewGarage, setViewGarage] = useState<Garage | null>(null);
  const [editGarage, setEditGarage] = useState<Garage | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [collecting, setCollecting] = useState<string | null>(null);

  const handleCollect = async (garage: Garage) => {
    setCollecting(garage.id);
    try {
      await updateGarage(garage.id, { currentDue: 0, paymentStatus: 'Paid' });
      await addPayment({
        date: new Date().toISOString().split('T')[0],
        name: `${garage.ownerName} (${garage.garageNo})`,
        type: 'Garage',
        amount: garage.currentDue,
        reference: `COLL-${Date.now().toString(36).toUpperCase()}`,
      });
      showSnackbar(`${fmt(garage.currentDue)} collected from ${garage.garageNo}`, 'success');
    } catch { showSnackbar('Failed to collect payment', 'error'); }
    finally { setCollecting(null); }
  };

  const handleDelete = async (id: string) => {
    setMenuOpen(null);
    try {
      await deleteGarage(id);
      showSnackbar('Garage deleted successfully', 'success');
    } catch { showSnackbar('Failed to delete garage', 'error'); }
  };

  const filtered = garages.filter(g => {
    const q = search.toLowerCase();
    const matchQ = !q || g.garageNo.toLowerCase().includes(q) || g.ownerName.toLowerCase().includes(q) || g.vehicleNumber.toLowerCase().includes(q) || g.mobileNumber.includes(q);
    const matchS = !statusFilter || g.paymentStatus === statusFilter;
    const matchV = !vehicleFilter || g.vehicleType === vehicleFilter;
    const matchL = !leaseFilter || g.leaseType === leaseFilter;
    return matchQ && matchS && matchV && matchL;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalRent = garages.reduce((s, g) => s + g.monthlyRent, 0);
  const totalPaid = garages.filter(g => g.paymentStatus === 'Paid').reduce((s, g) => s + g.monthlyRent, 0);
  const totalDue = garages.filter(g => g.paymentStatus === 'Due').reduce((s, g) => s + g.currentDue, 0);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Garages</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage all rented and leased garages</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          <Plus size={18} /> Add Garage
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Garages', value: garages.length, sub: 'All garages', icon: <Car size={22} />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Rent', value: fmt(totalRent), sub: 'Expected rent', icon: <IndianRupee size={22} />, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Paid', value: fmt(totalPaid), sub: 'Amount received', icon: <Wallet size={22} />, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Total Due', value: fmt(totalDue), sub: 'Pending amount', icon: <FileWarning size={22} />, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3 shadow-sm">
            <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.color} flex items-center justify-center flex-shrink-0`}>{c.icon}</div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{c.label}</p>
              <p className={`text-xl font-bold mt-0.5 ${c.color}`}>{c.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search by garage no, owner, vehicle, phone..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Due">Due</option>
          </select>
          <select value={vehicleFilter} onChange={e => { setVehicleFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Vehicles</option>
            {['Car', 'Bike', 'Truck', 'Other'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <select value={leaseFilter} onChange={e => { setLeaseFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Leases</option>
            {['Monthly', 'Yearly', 'Long-term'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Garage No', 'Owner', 'Mobile', 'Vehicle No', 'Type', 'Monthly Rent', 'Current Due', 'Lease End', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {current.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-10 text-gray-400 text-sm">No garages found</td></tr>
              ) : current.map(g => (
                <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{g.garageNo}</td>
                  <td className="px-4 py-3 text-gray-700">{g.ownerName}</td>
                  <td className="px-4 py-3 text-gray-600">{g.mobileNumber}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{g.vehicleNumber}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                      g.vehicleType === 'Car' ? 'bg-blue-100 text-blue-700' :
                      g.vehicleType === 'Bike' ? 'bg-amber-100 text-amber-700' :
                      g.vehicleType === 'Truck' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{g.vehicleType}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{g.monthlyRent.toLocaleString('en-IN')}</td>
                  <td className={`px-4 py-3 font-semibold ${g.currentDue > 0 ? 'text-red-600' : 'text-gray-700'}`}>{g.currentDue.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmtDate(g.leaseEndDate)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${g.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${g.paymentStatus === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {g.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {g.paymentStatus === 'Due' && g.currentDue > 0 && (
                        <button
                          onClick={() => handleCollect(g)}
                          disabled={collecting === g.id}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                        >
                          <Banknote size={13} />
                          {collecting === g.id ? '...' : 'Collect'}
                        </button>
                      )}
                      <div className="relative">
                        <button onClick={() => setMenuOpen(menuOpen === g.id ? null : g.id)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal size={15} />
                        </button>
                        {menuOpen === g.id && (
                          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden min-w-[140px]">
                            <button onClick={() => { setViewGarage(g); setMenuOpen(null); }} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50">View</button>
                            <button onClick={() => { setEditGarage(g); setMenuOpen(null); }} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50">Edit</button>
                            <button onClick={() => handleDelete(g.id)} className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
          <span>Showing {filtered.length === 0 ? 0 : (page-1)*PER_PAGE+1} to {Math.min(page*PER_PAGE, filtered.length)} of {filtered.length} entries</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">‹</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = totalPages <= 5 ? i+1 : page <= 3 ? i+1 : page >= totalPages-2 ? totalPages-4+i : page-2+i;
              return (
                <button key={pg} onClick={() => setPage(pg)} className={`px-3 py-1.5 rounded-lg border ${page===pg ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:bg-gray-50'}`}>{pg}</button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>

      <AddGarageModal open={showAdd} onClose={() => setShowAdd(false)} />
      {viewGarage && <GarageDetailModal garage={viewGarage} onClose={() => setViewGarage(null)} />}
      {editGarage && <EditGarageModal garage={editGarage} onClose={() => setEditGarage(null)} />}
      {menuOpen && <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />}
    </div>
  );
}
