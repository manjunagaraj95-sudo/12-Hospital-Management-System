
import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  FaUserMd, FaUsers, FaCalendarAlt, FaClipboardMedical, FaPills, FaFileMedicalAlt,
  FaChartLine, FaHistory, FaCog, FaSignOutAlt, FaPlus, FaSearch, FaBell, FaBars,
  FaArrowLeft, FaEdit, FaEye, FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle,
  FaCheck, FaCircleNotch, FaUser, FaStethoscope, FaFlask, FaVial, FaFilePdf, FaFileExcel,
  FaRegLightbulb
} from 'react-icons/fa';

// --- Contexts ---
const AuthContext = createContext(null);
const NavigationContext = createContext(null);
const DataContext = createContext(null);
const ToastContext = createContext(null);

// --- Dummy Data Generator ---
const generateId = () => Math.random().toString(36).substring(2, 11);
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const formatDateTime = (date) => date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
const formatDate = (date) => date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const DUMMY_DATA = (() => {
  const patients = [];
  const doctors = [];
  const appointments = [];
  const diagnoses = [];
  const medications = [];
  const auditLogs = [];

  const PATIENT_STATUSES = ['ACTIVE', 'INACTIVE', 'ARCHIVED'];
  const DOCTOR_SPECIALTIES = ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Oncology', 'Orthopedics'];
  const APPOINTMENT_STATUSES = ['REQUESTED', 'APPROVED', 'PENDING', 'COMPLETED', 'CANCELLED'];
  const DIAGNOSIS_STATUSES = ['DRAFT', 'PENDING_REVIEW', 'COMPLETED', 'REVIEWED'];
  const MEDICATION_STATUSES = ['ACTIVE', 'DISCONTINUED'];

  // Doctors
  for (let i = 1; i <= 10; i++) {
    doctors.push({
      id: `DOC${String(i).padStart(3, '0')}`,
      name: `Dr. ${['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'][i - 1]}`,
      specialty: DOCTOR_SPECIALTIES[Math.floor(Math.random() * DOCTOR_SPECIALTIES.length)],
      contact: `doc${i}@hospital.com`,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'ACTIVE',
      joinedDate: formatDate(randomDate(new Date(2010, 0, 1), new Date(2023, 0, 1))),
      bio: `Experienced in ${DOCTOR_SPECIALTIES[Math.floor(Math.random() * DOCTOR_SPECIALTIES.length)]}. Committed to patient care.`
    });
  }

  // Patients
  for (let i = 1; i <= 20; i++) {
    const patientId = `PAT${String(i).padStart(3, '0')}`;
    patients.push({
      id: patientId,
      name: `Patient ${['John Doe', 'Jane Smith', 'Peter Jones', 'Laura Davis', 'Michael Brown', 'Sophia Wilson', 'David Miller', 'Emily Garcia', 'Daniel Rodriguez', 'Olivia Martinez', 'Ethan Hernandez', 'Ava Lopez', 'Noah Gonzalez', 'Isabella Perez', 'Liam Sanchez', 'Mia Rivera', 'James Torres', 'Charlotte Flores', 'Benjamin King', 'Amelia Hill'][i - 1]}`,
      dob: formatDate(randomDate(new Date(1950, 0, 1), new Date(2005, 0, 1))),
      contact: `patient${i}@example.com`,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      address: `${Math.floor(Math.random() * 999) + 1} Main St, Anytown, USA`,
      status: PATIENT_STATUSES[Math.floor(Math.random() * PATIENT_STATUSES.length)],
      medicalHistory: `Patient has a history of ${['hypertension', 'diabetes', 'asthma', 'migraines', 'allergies'][Math.floor(Math.random() * 5)]}.`,
      allergies: ['Penicillin', 'Dust', 'Pollen'][Math.floor(Math.random() * 3)],
      primaryDoctorId: doctors[Math.floor(Math.random() * doctors.length)].id,
      documents: [
        { name: 'Consent Form', type: 'PDF', url: 'https://example.com/consent.pdf' },
        { name: 'X-Ray Scan', type: 'JPG', url: 'https://via.placeholder.com/600x400?text=X-Ray+Scan' }
      ]
    });
  }

  // Appointments
  for (let i = 1; i <= 30; i++) {
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    const appointmentDate = randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 2)));
    const status = APPOINTMENT_STATUSES[Math.floor(Math.random() * APPOINTMENT_STATUSES.length)];
    const workflowHistory = [
      { status: 'REQUESTED', date: formatDateTime(randomDate(new Date(appointmentDate.getTime() - 7 * 24 * 60 * 60 * 1000), appointmentDate)) },
    ];
    if (status !== 'REQUESTED') {
      workflowHistory.push({ status: 'APPROVED', date: formatDateTime(randomDate(new Date(appointmentDate.getTime() - 3 * 24 * 60 * 60 * 1000), appointmentDate)) });
    }
    if (status === 'COMPLETED') {
      workflowHistory.push({ status: 'COMPLETED', date: formatDateTime(randomDate(appointmentDate, new Date(appointmentDate.getTime() + 1 * 24 * 60 * 60 * 1000))) });
    } else if (status === 'CANCELLED') {
      workflowHistory.push({ status: 'CANCELLED', date: formatDateTime(randomDate(appointmentDate, new Date(appointmentDate.getTime() + 1 * 24 * 60 * 60 * 1000))) });
    }

    appointments.push({
      id: `APP${String(i).padStart(3, '0')}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: formatDateTime(appointmentDate),
      reason: ['General Checkup', 'Follow-up', 'Emergency', 'Consultation', 'Vaccination'][Math.floor(Math.random() * 5)],
      status: status,
      slaStatus: status === 'PENDING' && Math.random() < 0.3 ? 'SLA_BREACH' : 'ON_TRACK',
      workflowHistory: workflowHistory,
      notes: status === 'COMPLETED' ? `Patient visited on ${formatDate(appointmentDate)}. Discussion about ${patient.medicalHistory}.` : ''
    });
  }

  // Diagnoses
  for (let i = 1; i <= 25; i++) {
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    const diagnosisDate = randomDate(new Date(2023, 0, 1), new Date());
    const status = DIAGNOSIS_STATUSES[Math.floor(Math.random() * DIAGNOSIS_STATUSES.length)];
    const conditions = ['Flu', 'Common Cold', 'Hypertension', 'Diabetes Type 2', 'Asthma', 'Migraine', 'Bronchitis', 'Allergic Rhinitis'];

    diagnoses.push({
      id: `DIAG${String(i).padStart(3, '0')}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: formatDateTime(diagnosisDate),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      diagnosisDetails: `Patient presented with symptoms of ${conditions[Math.floor(Math.random() * conditions.length)].toLowerCase()}. Recommended treatment plan.`,
      status: status,
      attachments: [
        { name: 'Lab Results', type: 'PDF', url: 'https://example.com/lab_results.pdf' },
        { name: 'MRI Scan', type: 'JPG', url: 'https://via.placeholder.com/600x400?text=MRI+Scan' }
      ]
    });
  }

  // Medications
  for (let i = 1; i <= 20; i++) {
    const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
    const patient = patients.find(p => p.id === diagnosis.patientId);
    const doctor = doctors.find(d => d.id === diagnosis.doctorId);
    const prescribedDate = randomDate(new Date(diagnosis.date), new Date());
    const status = MEDICATION_STATUSES[Math.floor(Math.random() * MEDICATION_STATUSES.length)];

    medications.push({
      id: `MED${String(i).padStart(3, '0')}`,
      diagnosisId: diagnosis.id,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      medicationName: ['Paracetamol', 'Amoxicillin', 'Lisinopril', 'Metformin', 'Salbutamol', 'Sumatriptan'][Math.floor(Math.random() * 6)],
      dosage: `${Math.floor(Math.random() * 100) + 10}mg`,
      frequency: ['Once Daily', 'Twice Daily', 'Every 8 Hours', 'As Needed'][Math.floor(Math.random() * 4)],
      prescribedDate: formatDate(prescribedDate),
      status: status,
      notes: `Prescribed for ${diagnosis.condition}. Advised to take with food.`
    });
  }

  // Audit Logs
  const auditActions = ['CREATE_PATIENT', 'UPDATE_PATIENT', 'CREATE_APPOINTMENT', 'APPROVE_APPOINTMENT', 'REJECT_APPOINTMENT', 'CREATE_DIAGNOSIS', 'UPDATE_DOCTOR'];
  const auditUsers = [...patients.map(p => p.name), ...doctors.map(d => d.name), 'Admin User'];
  for (let i = 1; i <= 50; i++) {
    auditLogs.push({
      id: `AUDIT${String(i).padStart(3, '0')}`,
      timestamp: formatDateTime(randomDate(new Date(2023, 0, 1), new Date())),
      user: auditUsers[Math.floor(Math.random() * auditUsers.length)],
      action: auditActions[Math.floor(Math.random() * auditActions.length)],
      entityType: ['Patient', 'Appointment', 'Diagnosis', 'Doctor'][Math.floor(Math.random() * 4)],
      entityId: `ENT${String(Math.floor(Math.random() * 30)).padStart(3, '0')}`,
      details: 'Record updated successfully.'
    });
  }

  return { patients, doctors, appointments, diagnoses, medications, auditLogs };
})();

// --- RBAC Configuration ---
const ROLES = {
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  PATIENT: 'Patient',
};

const PERMISSIONS = {
  Admin: {
    dashboards: ['AdminDashboard'],
    screens: ['PatientsList', 'PatientDetail', 'PatientForm', 'DoctorsList', 'DoctorDetail', 'DoctorForm',
      'AppointmentsList', 'AppointmentDetail', 'AppointmentForm', 'DiagnosesList', 'DiagnosisDetail', 'DiagnosisForm',
      'MedicationsList', 'MedicationDetail', 'AuditLogsList', 'Settings'],
    data: {
      Patient: { view: true, edit: true, create: true, delete: true },
      Doctor: { view: true, edit: true, create: true, delete: true },
      Appointment: { view: true, edit: true, create: true, approve: true, reject: true, delete: true },
      Diagnosis: { view: true, edit: true, create: true, delete: true },
      Medication: { view: true, edit: true, create: true, delete: true },
      AuditLog: { view: true },
    },
    actions: ['ExportData', 'BulkActions', 'InlineEdit', 'ViewDocument', 'AddRecord'],
    workflowActions: {
      Appointment: ['approve', 'reject']
    }
  },
  Doctor: {
    dashboards: ['DoctorDashboard'],
    screens: ['PatientsList', 'PatientDetail', 'PatientForm', 'AppointmentsList', 'AppointmentDetail',
      'DiagnosesList', 'DiagnosisDetail', 'DiagnosisForm', 'MedicationsList', 'MedicationDetail'],
    data: {
      Patient: { view: true, edit: true }, // Can view/edit assigned patients
      Doctor: { view: true, edit: false }, // Can view own profile
      Appointment: { view: true, edit: true }, // Can update own appointments
      Diagnosis: { view: true, edit: true, create: true }, // Can create/edit for assigned patients
      Medication: { view: true, edit: true, create: true }, // Can create/edit for assigned patients
      AuditLog: { view: false },
    },
    actions: ['ViewDocument', 'AddRecord'],
    workflowActions: {
      Appointment: ['complete']
    }
  },
  Patient: {
    dashboards: ['PatientDashboard'],
    screens: ['PatientDetail', 'AppointmentForm', 'AppointmentsList', 'AppointmentDetail', 'DiagnosesList', 'DiagnosisDetail', 'MedicationsList', 'MedicationDetail'],
    data: {
      Patient: { view: true, edit: true }, // Can view/edit own profile
      Doctor: { view: true, edit: false },
      Appointment: { view: true, edit: false, create: true }, // Can request, view own
      Diagnosis: { view: true, edit: false }, // Can view own
      Medication: { view: true, edit: false }, // Can view own
      AuditLog: { view: false },
    },
    actions: ['ViewDocument', 'AddRecord'],
    workflowActions: {}
  }
};

const STATUS_LABELS = {
  APPROVED: 'Approved',
  COMPLETED: 'Completed',
  CLOSED: 'Closed',
  IN_PROGRESS: 'In Progress',
  ASSIGNED: 'Assigned',
  PENDING: 'Pending',
  ACTION_REQUIRED: 'Action Required',
  REQUESTED: 'Requested',
  REJECTED: 'Rejected',
  SLA_BREACH: 'SLA Breach',
  BLOCKED: 'Blocked',
  CANCELLED: 'Cancelled',
  EXCEPTION: 'Exception',
  ESCALATION: 'Escalation',
  DRAFT: 'Draft',
  ARCHIVED: 'Archived',
  HOLD: 'On Hold',
  NEW: 'New',
  ACTIVE: 'Active',
  REVIEWED: 'Reviewed'
};

const getStatusLabel = (status) => STATUS_LABELS[status] || status;

// --- Components ---

// Icon mapping for navigation
const NavIcon = ({ name }) => {
  switch (name) {
    case 'AdminDashboard': return <FaChartLine />;
    case 'DoctorDashboard': return <FaChartLine />;
    case 'PatientDashboard': return <FaChartLine />;
    case 'PatientsList': return <FaUsers />;
    case 'DoctorsList': return <FaUserMd />;
    case 'AppointmentsList': return <FaCalendarAlt />;
    case 'DiagnosesList': return <FaClipboardMedical />;
    case 'MedicationsList': return <FaPills />;
    case 'AuditLogsList': return <FaHistory />;
    case 'Settings': return <FaCog />;
    case 'AddAppointment': return <FaPlus />;
    default: return <FaRegLightbulb />;
  }
};

const Sidebar = ({ userRole, currentScreen, navigate, logout, toggleSidebar, isSidebarOpen }) => {
  const { loggedInUser } = useContext(AuthContext);

  const navItems = [
    { name: 'AdminDashboard', label: 'Admin Dashboard', roles: [ROLES.ADMIN] },
    { name: 'DoctorDashboard', label: 'Doctor Dashboard', roles: [ROLES.DOCTOR] },
    { name: 'PatientDashboard', label: 'Patient Dashboard', roles: [ROLES.PATIENT] },
    { name: 'PatientsList', label: 'Patients', roles: [ROLES.ADMIN, ROLES.DOCTOR] },
    { name: 'DoctorsList', label: 'Doctors', roles: [ROLES.ADMIN] },
    { name: 'AppointmentsList', label: 'Appointments', roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT] },
    { name: 'DiagnosesList', label: 'Diagnoses', roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT] },
    { name: 'MedicationsList', label: 'Medications', roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT] },
    { name: 'AuditLogsList', label: 'Audit Logs', roles: [ROLES.ADMIN] },
  ];

  const canAccessScreen = (screenName) => PERMISSIONS[userRole]?.screens.includes(screenName);

  return (
    <nav className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <div>
        <h3 className="sidebar-header">Hospital System</h3>
        <div className="sidebar-nav">
          <ul>
            {navItems.map(item =>
              item.roles.includes(userRole) && canAccessScreen(item.name) ? (
                <li key={item.name}>
                  <button
                    onClick={() => { navigate(item.name); toggleSidebar(); }}
                    className={currentScreen.startsWith(item.name.replace('List', '').replace('Dashboard', '')) ? 'active' : ''}
                  >
                    <NavIcon name={item.name} /> {item.label}
                  </button>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
      <div className="user-info">
        <p>{loggedInUser?.name}</p>
        <small>{userRole}</small>
        <button onClick={logout}>
          <FaSignOutAlt style={{ marginRight: 'var(--spacing-xs)' }} /> Logout
        </button>
      </div>
    </nav>
  );
};

const Header = ({ title, userRole, currentScreen, navigate, goBack, screenHistory, toggleSidebar }) => {
  const { loggedInUser } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { patients, doctors, appointments, diagnoses } = useContext(DataContext);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 2) {
      const allRecords = [
        ...patients.map(p => ({ type: 'Patient', id: p.id, name: p.name })),
        ...doctors.map(d => ({ type: 'Doctor', id: d.id, name: d.name })),
        ...appointments.map(a => ({ type: 'Appointment', id: a.id, name: `${a.patientName} - ${a.reason}` })),
        ...diagnoses.map(d => ({ type: 'Diagnosis', id: d.id, name: `${d.patientName} - ${d.condition}` })),
      ];
      const filtered = allRecords.filter(record =>
        record.name.toLowerCase().includes(value.toLowerCase()) ||
        record.id.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (recordType, recordId) => {
    switch (recordType) {
      case 'Patient': navigate('PatientDetail', { id: recordId }); break;
      case 'Doctor': navigate('DoctorDetail', { id: recordId }); break;
      case 'Appointment': navigate('AppointmentDetail', { id: recordId }); break;
      case 'Diagnosis': navigate('DiagnosisDetail', { id: recordId }); break;
      default: showToast('info', 'Navigation', `Cannot navigate to ${recordType} record detail.`); break;
    }
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <header className="header">
      <div className="flex-row gap-md">
        <button className="sidebar-toggle-button" onClick={toggleSidebar} aria-label="Toggle Sidebar">
          <FaBars />
        </button>
        {screenHistory.length > 1 && (
          <button onClick={goBack} className="button outline" style={{padding: 'var(--spacing-xs) var(--spacing-sm)'}}>
            <FaArrowLeft /> Back
          </button>
        )}
        <h2 className="header-title">{title}</h2>
      </div>
      <div className="header-right">
        <div className="global-search">
          <input
            type="text"
            placeholder="Global Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            onBlur={() => setTimeout(() => setSuggestions([]), 100)} // Delay to allow click
            onFocus={() => searchTerm.length > 2 && handleSearchChange({ target: { value: searchTerm } })}
          />
          {suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((s, index) => (
                <div key={index} onMouseDown={() => handleSuggestionClick(s.type, s.id)}>
                  <strong>{s.type}:</strong> {s.name} ({s.id})
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="header-actions">
          <button onClick={() => showToast('info', 'Notifications', 'No new notifications.')}>
            <FaBell />
          </button>
          <button onClick={() => showToast('info', 'Settings', 'Settings screen coming soon.')}>
            <FaCog />
          </button>
        </div>
      </div>
    </header>
  );
};

const Card = ({ title, status, meta, description, onClick, accentColor, children }) => (
  <div className="card" data-status={status} onClick={onClick}>
    <div className="card-header" style={accentColor ? { backgroundColor: accentColor } : {}}>
      <span>{title}</span>
      <span className="table-status-badge" data-status={status}>{getStatusLabel(status)}</span>
    </div>
    <div className="card-content">
      <h3 className="card-title">{title}</h3>
      <p className="card-meta">{meta}</p>
      {description && <p className="card-description">{description}</p>}
      {children}
    </div>
  </div>
);

const KPI = ({ title, value, subtext, color = 'var(--color-primary)' }) => (
  <div className="kpi-card">
    <div className="kpi-card-title">{title}</div>
    <div className="kpi-card-value" style={{ color: color }}>{value}</div>
    <div className="kpi-card-subtext">{subtext}</div>
  </div>
);

const ChartPlaceholder = ({ title, type }) => (
  <div className="chart-container">
    <h3>{title} <small>({type} Chart)</small></h3>
    <div className="chart-placeholder">
      <FaChartLine style={{ marginRight: 'var(--spacing-sm)' }} />
      Visual Chart Placeholder ({type})
    </div>
    <div className="flex-row justify-between mt-lg">
      <button className="button outline"><FaFilePdf /> Export PDF</button>
      <button className="button outline"><FaFileExcel /> Export Excel</button>
    </div>
  </div>
);

const EmptyState = ({ message, actionText, onAction }) => (
  <div className="empty-state">
    <FaRegLightbulb />
    <h3>{message}</h3>
    <p>It looks like there's no data to display here yet. Start by adding a new record.</p>
    {onAction && <button className="button primary" onClick={onAction}><FaPlus /> {actionText}</button>}
  </div>
);

const Toast = ({ type, title, message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000); // Toast disappears after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`toast ${type}`}>
      <h4>{title}</h4>
      <p>{message}</p>
    </div>
  );
};

const DocumentModal = ({ document, onClose }) => {
  if (!document) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="close-button">&times;</button>
        <h3>Document Preview: {document.name}</h3>
        <div className="document-viewer">
          {document.type === 'PDF' ? (
            <iframe src={document.url} title={document.name} width="100%" height="100%"></iframe>
          ) : document.type === 'JPG' || document.type === 'PNG' ? (
            <img src={document.url} alt={document.name} />
          ) : (
            <p>Cannot preview this document type. <a href={document.url} target="_blank" rel="noopener noreferrer">Download to view</a>.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Forms ---
const PatientForm = ({ patient = {}, onSave, onCancel, readOnly = false }) => {
  const [formData, setFormData] = useState({
    name: patient.name || '',
    dob: patient.dob || '',
    contact: patient.contact || '',
    phone: patient.phone || '',
    address: patient.address || '',
    medicalHistory: patient.medicalHistory || '',
    allergies: patient.allergies || '',
    primaryDoctorId: patient.primaryDoctorId || '',
    status: patient.status || 'ACTIVE',
    documents: patient.documents || []
  });
  const [errors, setErrors] = useState({});
  const { doctors } = useContext(DataContext);
  const { showToast } = useContext(ToastContext);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Patient Name is required.';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required.';
    if (!formData.contact) newErrors.contact = 'Contact Email is required.';
    if (!formData.phone) newErrors.phone = 'Phone Number is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map(file => ({
      name: file.name,
      type: file.type.startsWith('image/') ? 'JPG' : file.type.includes('pdf') ? 'PDF' : 'OTHER',
      url: URL.createObjectURL(file) // For preview purposes
    }));
    setFormData(prev => ({ ...prev, documents: [...prev.documents, ...files] }));
    showToast('success', 'File Upload', `Uploaded ${files.length} document(s).`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({ ...patient, ...formData });
    } else {
      showToast('error', 'Validation Error', 'Please fill in all mandatory fields.');
    }
  };

  return (
    <div className="form-container">
      <h3>{patient.id ? 'Edit Patient' : 'Add New Patient'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Patient Name <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-input" disabled={readOnly} />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} className="form-input" disabled={readOnly} />
          {errors.dob && <p className="error-message">{errors.dob}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="contact">Contact Email <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <input type="email" id="contact" name="contact" value={formData.contact} onChange={handleChange} className="form-input" disabled={readOnly} />
          {errors.contact && <p className="error-message">{errors.contact}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="form-input" disabled={readOnly} />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="form-input" disabled={readOnly} />
        </div>
        <div className="form-group">
          <label htmlFor="medicalHistory">Medical History</label>
          <textarea id="medicalHistory" name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} className="form-textarea" disabled={readOnly}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="allergies">Allergies</label>
          <input type="text" id="allergies" name="allergies" value={formData.allergies} onChange={handleChange} className="form-input" disabled={readOnly} />
        </div>
        <div className="form-group">
          <label htmlFor="primaryDoctorId">Primary Doctor</label>
          <select id="primaryDoctorId" name="primaryDoctorId" value={formData.primaryDoctorId} onChange={handleChange} className="form-select" disabled={readOnly}>
            <option value="">Select Doctor</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialty})</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} className="form-select" disabled={readOnly}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        {!readOnly && (
          <div className="form-group">
            <label htmlFor="documents">Upload Documents</label>
            <input type="file" id="documents" name="documents" multiple onChange={handleFileChange} className="form-input" />
            <div className="file-upload-preview">
              {formData.documents.map((doc, index) => (
                doc.type === 'JPG' || doc.type === 'PNG' ? <img key={index} src={doc.url} alt={doc.name} /> : <span key={index}>{doc.name}</span>
              ))}
            </div>
          </div>
        )}
        <div className="form-actions">
          <button type="button" className="button secondary" onClick={onCancel}>Cancel</button>
          {!readOnly && <button type="submit" className="button primary">Save Patient</button>}
        </div>
      </form>
    </div>
  );
};

const DoctorForm = ({ doctor = {}, onSave, onCancel, readOnly = false }) => {
  const [formData, setFormData] = useState({
    name: doctor.name || '',
    specialty: doctor.specialty || '',
    contact: doctor.contact || '',
    phone: doctor.phone || '',
    bio: doctor.bio || '',
    status: doctor.status || 'ACTIVE'
  });
  const [errors, setErrors] = useState({});
  const { showToast } = useContext(ToastContext);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Doctor Name is required.';
    if (!formData.specialty) newErrors.specialty = 'Specialty is required.';
    if (!formData.contact) newErrors.contact = 'Contact Email is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({ ...doctor, ...formData });
    } else {
      showToast('error', 'Validation Error', 'Please fill in all mandatory fields.');
    }
  };

  return (
    <div className="form-container">
      <h3>{doctor.id ? 'Edit Doctor' : 'Add New Doctor'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Doctor Name <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-input" disabled={readOnly} />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="specialty">Specialty <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <input type="text" id="specialty" name="specialty" value={formData.specialty} onChange={handleChange} className="form-input" disabled={readOnly} />
          {errors.specialty && <p className="error-message">{errors.specialty}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="contact">Contact Email <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <input type="email" id="contact" name="contact" value={formData.contact} onChange={handleChange} className="form-input" disabled={readOnly} />
          {errors.contact && <p className="error-message">{errors.contact}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="form-input" disabled={readOnly} />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} className="form-textarea" disabled={readOnly}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} className="form-select" disabled={readOnly}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="button" className="button secondary" onClick={onCancel}>Cancel</button>
          {!readOnly && <button type="submit" className="button primary">Save Doctor</button>}
        </div>
      </form>
    </div>
  );
};

const AppointmentForm = ({ appointment = {}, onSave, onCancel, readOnly = false }) => {
  const { patients, doctors, loggedInUser, userRole } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const isNew = !appointment.id;
  const initialPatientId = userRole === ROLES.PATIENT ? loggedInUser.id : (appointment.patientId || '');

  const [formData, setFormData] = useState({
    patientId: initialPatientId,
    doctorId: appointment.doctorId || '',
    date: appointment.date ? new Date(appointment.date).toISOString().slice(0, 16) : '',
    reason: appointment.reason || '',
    notes: appointment.notes || '',
    status: appointment.status || 'REQUESTED'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Auto-populate patientId for Patient role
    if (userRole === ROLES.PATIENT && loggedInUser && isNew) {
      setFormData(prev => ({ ...prev, patientId: loggedInUser.id }));
    }
    // Set initial date/time for new appointments
    if (isNew && !formData.date) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30); // Default to 30 mins from now
      setFormData(prev => ({ ...prev, date: now.toISOString().slice(0, 16) }));
    }
  }, [userRole, loggedInUser, isNew]); // eslint-disable-line react-hooks/exhaustive-deps


  const validate = () => {
    const newErrors = {};
    if (!formData.patientId) newErrors.patientId = 'Patient is required.';
    if (!formData.doctorId) newErrors.doctorId = 'Doctor is required.';
    if (!formData.date) newErrors.date = 'Date and Time are required.';
    if (!formData.reason) newErrors.reason = 'Reason for Appointment is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const patient = patients.find(p => p.id === formData.patientId);
      const doctor = doctors.find(d => d.id === formData.doctorId);
      onSave({
        ...appointment,
        ...formData,
        patientName: patient?.name || '',
        doctorName: doctor?.name || '',
        workflowHistory: appointment.workflowHistory || [{ status: 'REQUESTED', date: formatDateTime(new Date()) }]
      });
    } else {
      showToast('error', 'Validation Error', 'Please fill in all mandatory fields.');
    }
  };

  return (
    <div className="form-container">
      <h3>{isNew ? 'Request New Appointment' : 'Edit Appointment'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="patientId">Patient <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <select id="patientId" name="patientId" value={formData.patientId} onChange={handleChange} className="form-select" disabled={readOnly || userRole === ROLES.PATIENT}>
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {errors.patientId && <p className="error-message">{errors.patientId}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="doctorId">Doctor <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <select id="doctorId" name="doctorId" value={formData.doctorId} onChange={handleChange} className="form-select" disabled={readOnly}>
            <option value="">Select Doctor</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
            ))}
          </select>
          {errors.doctorId && <p className="error-message">{errors.doctorId}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="date">Date & Time <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <input type="datetime-local" id="date" name="date" value={formData.date} onChange={handleChange} className="form-input" disabled={readOnly} />
          {errors.date && <p className="error-message">{errors.date}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="reason">Reason for Appointment <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <input type="text" id="reason" name="reason" value={formData.reason} onChange={handleChange} className="form-input" disabled={readOnly} />
          {errors.reason && <p className="error-message">{errors.reason}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} className="form-textarea" disabled={readOnly}></textarea>
        </div>
        {(userRole === ROLES.ADMIN || userRole === ROLES.DOCTOR) && !isNew && (
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} className="form-select" disabled={readOnly}>
              {['REQUESTED', 'PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED'].map(s => (
                <option key={s} value={s}>{getStatusLabel(s)}</option>
              ))}
            </select>
          </div>
        )}
        <div className="form-actions">
          <button type="button" className="button secondary" onClick={onCancel}>Cancel</button>
          {!readOnly && <button type="submit" className="button primary">{isNew ? 'Submit Request' : 'Save Changes'}</button>}
        </div>
      </form>
    </div>
  );
};

const DiagnosisForm = ({ diagnosis = {}, onSave, onCancel, readOnly = false }) => {
  const { patients, doctors, loggedInUser } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const isNew = !diagnosis.id;
  const initialDoctorId = loggedInUser?.role === ROLES.DOCTOR ? loggedInUser.id : (diagnosis.doctorId || '');

  const [formData, setFormData] = useState({
    patientId: diagnosis.patientId || '',
    doctorId: initialDoctorId,
    date: diagnosis.date ? new Date(diagnosis.date).toISOString().slice(0, 16) : '',
    condition: diagnosis.condition || '',
    diagnosisDetails: diagnosis.diagnosisDetails || '',
    status: diagnosis.status || 'DRAFT',
    attachments: diagnosis.attachments || []
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Auto-populate doctorId for Doctor role
    if (loggedInUser?.role === ROLES.DOCTOR && loggedInUser && isNew) {
      setFormData(prev => ({ ...prev, doctorId: loggedInUser.id }));
    }
    // Set initial date/time for new diagnoses
    if (isNew && !formData.date) {
      setFormData(prev => ({ ...prev, date: new Date().toISOString().slice(0, 16) }));
    }
  }, [loggedInUser, isNew]); // eslint-disable-line react-hooks/exhaustive-deps

  const validate = () => {
    const newErrors = {};
    if (!formData.patientId) newErrors.patientId = 'Patient is required.';
    if (!formData.doctorId) newErrors.doctorId = 'Doctor is required.';
    if (!formData.date) newErrors.date = 'Date is required.';
    if (!formData.condition) newErrors.condition = 'Condition is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map(file => ({
      name: file.name,
      type: file.type.startsWith('image/') ? 'JPG' : file.type.includes('pdf') ? 'PDF' : 'OTHER',
      url: URL.createObjectURL(file) // For preview purposes
    }));
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
    showToast('success', 'File Upload', `Uploaded ${files.length} attachment(s).`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const patient = patients.find(p => p.id === formData.patientId);
      const doctor = doctors.find(d => d.id === formData.doctorId);
      onSave({
        ...diagnosis,
        ...formData,
        patientName: patient?.name || '',
        doctorName: doctor?.name || '',
      });
    } else {
      showToast('error', 'Validation Error', 'Please fill in all mandatory fields.');
    }
  };

  return (
    <div className="form-container">
      <h3>{isNew ? 'Record New Diagnosis' : 'Edit Diagnosis'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="patientId">Patient <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <select id="patientId" name="patientId" value={formData.patientId} onChange={handleChange} className="form-select" disabled={readOnly}>
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {errors.patientId && <p className="error-message">{errors.patientId}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="doctorId">Doctor <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <select id="doctorId" name="doctorId" value={formData.doctorId} onChange={handleChange} className="form-select" disabled={readOnly || loggedInUser?.role === ROLES.DOCTOR}>
            <option value="">Select Doctor</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
            ))}
          </select>
          {errors.doctorId && <p className="error-message">{errors.doctorId}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="date">Date & Time <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <input type="datetime-local" id="date" name="date" value={formData.date} onChange={handleChange} className="form-input" disabled={readOnly} />
          {errors.date && <p className="error-message">{errors.date}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="condition">Condition <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <input type="text" id="condition" name="condition" value={formData.condition} onChange={handleChange} className="form-input" disabled={readOnly} />
          {errors.condition && <p className="error-message">{errors.condition}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="diagnosisDetails">Diagnosis Details</label>
          <textarea id="diagnosisDetails" name="diagnosisDetails" value={formData.diagnosisDetails} onChange={handleChange} className="form-textarea" disabled={readOnly}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} className="form-select" disabled={readOnly}>
            {['DRAFT', 'PENDING_REVIEW', 'COMPLETED', 'REVIEWED'].map(s => (
              <option key={s} value={s}>{getStatusLabel(s)}</option>
            ))}
          </select>
        </div>
        {!readOnly && (
          <div className="form-group">
            <label htmlFor="attachments">Upload Attachments</label>
            <input type="file" id="attachments" name="attachments" multiple onChange={handleFileChange} className="form-input" />
            <div className="file-upload-preview">
              {formData.attachments.map((doc, index) => (
                doc.type === 'JPG' || doc.type === 'PNG' ? <img key={index} src={doc.url} alt={doc.name} /> : <span key={index}>{doc.name}</span>
              ))}
            </div>
          </div>
        )}
        <div className="form-actions">
          <button type="button" className="button secondary" onClick={onCancel}>Cancel</button>
          {!readOnly && <button type="submit" className="button primary">Save Diagnosis</button>}
        </div>
      </form>
    </div>
  );
};


// --- Detail Screens ---
const PatientDetailScreen = ({ patient, goBack, updateRecord }) => {
  const { userRole, canAccess, loggedInUser } = useContext(AuthContext);
  const { navigate } = useContext(NavigationContext);
  const { appointments, diagnoses, medications } = useContext(DataContext);
  const [isEditing, setIsEditing] = useState(false);
  const [modalDocument, setModalDocument] = useState(null);

  if (!patient) return <EmptyState message="Patient Not Found" />;

  const patientAppointments = appointments.filter(app => app.patientId === patient.id);
  const patientDiagnoses = diagnoses.filter(diag => diag.patientId === patient.id);
  const patientMedications = medications.filter(med => med.patientId === patient.id);

  const handleSave = (updatedPatient) => {
    updateRecord('patients', updatedPatient);
    setIsEditing(false);
  };

  const handleViewDocument = (doc) => {
    setModalDocument(doc);
  };

  const handleAddAppointment = () => {
    navigate('AppointmentForm', { patientId: patient.id });
  };
  const handleAddDiagnosis = () => {
    navigate('DiagnosisForm', { patientId: patient.id });
  };

  const isPatientOwner = userRole === ROLES.PATIENT && loggedInUser?.id === patient.id;
  const canEdit = (userRole === ROLES.ADMIN && canAccess('data', 'Patient', 'edit')) || (isPatientOwner && canAccess('data', 'Patient', 'edit'));

  return (
    <div className="full-screen-container">
      <div className="full-screen-header">
        <button onClick={goBack}><FaArrowLeft /></button>
        <h2>Patient: {patient.name}</h2>
        {canEdit && !isEditing && (
          <button className="button primary" onClick={() => setIsEditing(true)} style={{ marginLeft: 'auto' }}>
            <FaEdit /> Edit Patient
          </button>
        )}
      </div>

      {isEditing ? (
        <PatientForm patient={patient} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <div className="detail-content p-lg">
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <Card title="Patient Details" status={patient.status} onClick={() => {}} accentColor="var(--color-accent)">
              <p><strong>DOB:</strong> {patient.dob}</p>
              <p><strong>Contact:</strong> {patient.contact}</p>
              <p><strong>Phone:</strong> {patient.phone}</p>
              <p><strong>Address:</strong> {patient.address}</p>
              <p><strong>Status:</strong> <span className="table-status-badge" data-status={patient.status}>{getStatusLabel(patient.status)}</span></p>
            </Card>
            <Card title="Medical History" status="ACTIVE" onClick={() => {}} accentColor="var(--color-teal)">
              <p>{patient.medicalHistory || 'No medical history recorded.'}</p>
              <p><strong>Allergies:</strong> {patient.allergies || 'None'}</p>
              <p><strong>Primary Doctor:</strong> {patient.primaryDoctorId ? DUMMY_DATA.doctors.find(d => d.id === patient.primaryDoctorId)?.name : 'N/A'}</p>
            </Card>
            <Card title="Documents" status="ACTIVE" onClick={() => {}} accentColor="var(--color-indigo)">
              {patient.documents && patient.documents.length > 0 ? (
                <ul>
                  {patient.documents.map((doc, index) => (
                    <li key={index} style={{ marginBottom: 'var(--spacing-xs)' }}>
                      {doc.name} ({doc.type})
                      <button className="button outline" onClick={(e) => { e.stopPropagation(); handleViewDocument(doc); }} style={{ marginLeft: 'var(--spacing-sm)' }}>
                        <FaEye /> View
                      </button>
                    </li>
                  ))}
                </ul>
              ) : <p>No documents uploaded.</p>}
            </Card>
          </div>

          <h3 className="mt-lg mb-md">Appointments
            {(canAccess('data', 'Appointment', 'create') && (userRole !== ROLES.PATIENT || isPatientOwner)) && (
              <button className="button primary" onClick={handleAddAppointment} style={{ marginLeft: 'var(--spacing-md)' }}>
                <FaPlus /> Request New
              </button>
            )}
          </h3>
          <div className="data-table-container">
            {patientAppointments.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Doctor</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patientAppointments.map(app => (
                    <tr key={app.id}>
                      <td>{app.id}</td>
                      <td>{app.date}</td>
                      <td>{app.doctorName}</td>
                      <td>{app.reason}</td>
                      <td><span className="table-status-badge" data-status={app.status}>{getStatusLabel(app.status)}</span></td>
                      <td className="actions">
                        {canAccess('data', 'Appointment', 'view') && <button onClick={() => navigate('AppointmentDetail', { id: app.id })}><FaEye /></button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <EmptyState message="No appointments for this patient." />}
          </div>

          <h3 className="mt-lg mb-md">Diagnoses
            {(canAccess('data', 'Diagnosis', 'create') && (userRole === ROLES.ADMIN || userRole === ROLES.DOCTOR)) && (
              <button className="button primary" onClick={handleAddDiagnosis} style={{ marginLeft: 'var(--spacing-md)' }}>
                <FaPlus /> Record New
              </button>
            )}
          </h3>
          <div className="data-table-container">
            {patientDiagnoses.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Doctor</th>
                    <th>Condition</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patientDiagnoses.map(diag => (
                    <tr key={diag.id}>
                      <td>{diag.id}</td>
                      <td>{diag.date}</td>
                      <td>{diag.doctorName}</td>
                      <td>{diag.condition}</td>
                      <td><span className="table-status-badge" data-status={diag.status}>{getStatusLabel(diag.status)}</span></td>
                      <td className="actions">
                        {canAccess('data', 'Diagnosis', 'view') && <button onClick={() => navigate('DiagnosisDetail', { id: diag.id })}><FaEye /></button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <EmptyState message="No diagnoses for this patient." />}
          </div>

          <h3 className="mt-lg mb-md">Medications</h3>
          <div className="data-table-container">
            {patientMedications.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Medication Name</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Prescribed Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patientMedications.map(med => (
                    <tr key={med.id}>
                      <td>{med.id}</td>
                      <td>{med.medicationName}</td>
                      <td>{med.dosage}</td>
                      <td>{med.frequency}</td>
                      <td>{med.prescribedDate}</td>
                      <td><span className="table-status-badge" data-status={med.status}>{getStatusLabel(med.status)}</span></td>
                      <td className="actions">
                        {canAccess('data', 'Medication', 'view') && <button onClick={() => navigate('MedicationDetail', { id: med.id })}><FaEye /></button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <EmptyState message="No medications prescribed for this patient." />}
          </div>
        </div>
      )}
      {modalDocument && <DocumentModal document={modalDocument} onClose={() => setModalDocument(null)} />}
    </div>
  );
};

const DoctorDetailScreen = ({ doctor, goBack, updateRecord }) => {
  const { userRole, canAccess, loggedInUser } = useContext(AuthContext);
  const { navigate } = useContext(NavigationContext);
  const { patients, appointments, diagnoses } = useContext(DataContext);
  const [isEditing, setIsEditing] = useState(false);

  if (!doctor) return <EmptyState message="Doctor Not Found" />;

  const assignedPatients = patients.filter(p => p.primaryDoctorId === doctor.id);
  const doctorAppointments = appointments.filter(app => app.doctorId === doctor.id);
  const doctorDiagnoses = diagnoses.filter(diag => diag.doctorId === doctor.id);

  const handleSave = (updatedDoctor) => {
    updateRecord('doctors', updatedDoctor);
    setIsEditing(false);
  };

  const isDoctorOwner = userRole === ROLES.DOCTOR && loggedInUser?.id === doctor.id;
  const canEdit = (userRole === ROLES.ADMIN && canAccess('data', 'Doctor', 'edit')) || (isDoctorOwner && canAccess('data', 'Doctor', 'edit'));

  return (
    <div className="full-screen-container">
      <div className="full-screen-header">
        <button onClick={goBack}><FaArrowLeft /></button>
        <h2>Doctor: {doctor.name}</h2>
        {canEdit && !isEditing && (
          <button className="button primary" onClick={() => setIsEditing(true)} style={{ marginLeft: 'auto' }}>
            <FaEdit /> Edit Doctor
          </button>
        )}
      </div>

      {isEditing ? (
        <DoctorForm doctor={doctor} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <div className="detail-content p-lg">
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <Card title="Doctor Details" status={doctor.status} onClick={() => {}} accentColor="var(--color-accent)">
              <p><strong>Specialty:</strong> {doctor.specialty}</p>
              <p><strong>Contact:</strong> {doctor.contact}</p>
              <p><strong>Phone:</strong> {doctor.phone}</p>
              <p><strong>Joined:</strong> {doctor.joinedDate}</p>
              <p><strong>Status:</strong> <span className="table-status-badge" data-status={doctor.status}>{getStatusLabel(doctor.status)}</span></p>
            </Card>
            <Card title="Biography" status="ACTIVE" onClick={() => {}} accentColor="var(--color-teal)">
              <p>{doctor.bio || 'No biography provided.'}</p>
            </Card>
          </div>

          <h3 className="mt-lg mb-md">Assigned Patients</h3>
          <div className="data-table-container">
            {assignedPatients.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>DOB</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedPatients.map(patient => (
                    <tr key={patient.id}>
                      <td>{patient.id}</td>
                      <td>{patient.name}</td>
                      <td>{patient.dob}</td>
                      <td><span className="table-status-badge" data-status={patient.status}>{getStatusLabel(patient.status)}</span></td>
                      <td className="actions">
                        {canAccess('data', 'Patient', 'view') && <button onClick={() => navigate('PatientDetail', { id: patient.id })}><FaEye /></button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <EmptyState message="No patients currently assigned to this doctor." />}
          </div>

          <h3 className="mt-lg mb-md">Upcoming Appointments</h3>
          <div className="data-table-container">
            {doctorAppointments.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorAppointments.map(app => (
                    <tr key={app.id}>
                      <td>{app.id}</td>
                      <td>{app.date}</td>
                      <td>{app.patientName}</td>
                      <td>{app.reason}</td>
                      <td><span className="table-status-badge" data-status={app.status}>{getStatusLabel(app.status)}</span></td>
                      <td className="actions">
                        {canAccess('data', 'Appointment', 'view') && <button onClick={() => navigate('AppointmentDetail', { id: app.id })}><FaEye /></button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <EmptyState message="No upcoming appointments for this doctor." />}
          </div>

          <h3 className="mt-lg mb-md">Diagnoses Recorded</h3>
          <div className="data-table-container">
            {doctorDiagnoses.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Condition</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorDiagnoses.map(diag => (
                    <tr key={diag.id}>
                      <td>{diag.id}</td>
                      <td>{diag.date}</td>
                      <td>{diag.patientName}</td>
                      <td>{diag.condition}</td>
                      <td><span className="table-status-badge" data-status={diag.status}>{getStatusLabel(diag.status)}</span></td>
                      <td className="actions">
                        {canAccess('data', 'Diagnosis', 'view') && <button onClick={() => navigate('DiagnosisDetail', { id: diag.id })}><FaEye /></button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <EmptyState message="No diagnoses recorded by this doctor." />}
          </div>
        </div>
      )}
    </div>
  );
};

const WorkflowTracker = ({ workflowHistory, currentStatus, slaStatus }) => {
  const workflowStages = {
    REQUESTED: { icon: <FaCalendarAlt />, order: 1 },
    PENDING: { icon: <FaClock />, order: 2 },
    APPROVED: { icon: <FaCheckCircle />, order: 3 },
    COMPLETED: { icon: <FaCheck />, order: 4 },
    CANCELLED: { icon: <FaTimesCircle />, order: 99 }, // Special terminal state
    REJECTED: { icon: <FaTimesCircle />, order: 98 } // Special terminal state
  };

  const sortedHistory = [...workflowHistory].sort((a, b) => {
    const stageA = workflowStages[a.status]?.order || 100;
    const stageB = workflowStages[b.status]?.order || 100;
    return stageA - stageB;
  });

  const uniqueWorkflow = [];
  const addedStatuses = new Set();
  for (const entry of sortedHistory) {
    if (!addedStatuses.has(entry.status)) {
      uniqueWorkflow.push(entry);
      addedStatuses.add(entry.status);
    }
  }

  const finalWorkflow = uniqueWorkflow.filter(step => workflowStages[step.status]);
  const currentStatusOrder = workflowStages[currentStatus]?.order || 0;

  return (
    <div className="workflow-tracker">
      {finalWorkflow.map((step, index) => {
        const isCompleted = workflowStages[step.status]?.order < currentStatusOrder || step.status === currentStatus;
        const isCurrent = step.status === currentStatus;
        const isTerminal = ['CANCELLED', 'REJECTED'].includes(currentStatus);

        const progressWidth = isCompleted ? (index / (finalWorkflow.length - 1)) * 100 : 0;

        return (
          <React.Fragment key={step.status}>
            <div className={`workflow-step ${isCompleted ? 'completed' : ''} ${isCurrent && !isTerminal ? 'current' : ''}`}>
              <div className="workflow-step-icon">
                {workflowStages[step.status]?.icon}
              </div>
              <div className="workflow-step-label">{getStatusLabel(step.status)}</div>
              <div className="workflow-step-date">{step.date ? formatDateTime(new Date(step.date)) : ''}</div>
              {slaStatus === 'SLA_BREACH' && isCurrent && <FaExclamationTriangle style={{ color: 'var(--status-red)', marginTop: 'var(--spacing-xs)' }} />}
            </div>
            {index < finalWorkflow.length - 1 && (
              <div className="workflow-line">
                <div className="workflow-line-progress" style={{ width: isCompleted ? '100%' : '0%' }}></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const AppointmentDetailScreen = ({ appointment, goBack, updateRecord }) => {
  const { userRole, canAccess } = useContext(AuthContext);
  const { showToast, navigate } = useContext(NavigationContext);
  const [isEditing, setIsEditing] = useState(false);

  if (!appointment) return <EmptyState message="Appointment Not Found" />;

  const handleSave = (updatedAppointment) => {
    updateRecord('appointments', {
      ...updatedAppointment,
      workflowHistory: [...updatedAppointment.workflowHistory, { status: updatedAppointment.status, date: formatDateTime(new Date()) }]
    });
    showToast('success', 'Appointment Updated', `Appointment ${updatedAppointment.id} status changed to ${getStatusLabel(updatedAppointment.status)}.`);
    setIsEditing(false);
  };

  const handleAction = (actionType) => {
    let newStatus = appointment.status;
    if (actionType === 'approve') newStatus = 'APPROVED';
    if (actionType === 'reject') newStatus = 'REJECTED';
    if (actionType === 'complete') newStatus = 'COMPLETED';

    updateRecord('appointments', {
      ...appointment,
      status: newStatus,
      workflowHistory: [...appointment.workflowHistory, { status: newStatus, date: formatDateTime(new Date()) }]
    });
    showToast('success', 'Appointment Action', `Appointment ${appointment.id} ${actionType}d.`);
    goBack(); // Go back to list after action
  };

  const canApprove = canAccess('workflowActions', 'Appointment', 'approve') && appointment.status === 'REQUESTED';
  const canReject = canAccess('workflowActions', 'Appointment', 'reject') && appointment.status === 'REQUESTED';
  const canComplete = canAccess('workflowActions', 'Appointment', 'complete') && appointment.status === 'APPROVED' && userRole === ROLES.DOCTOR;
  const canEdit = canAccess('data', 'Appointment', 'edit') && appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && appointment.status !== 'REJECTED';


  return (
    <div className="full-screen-container">
      <div className="full-screen-header">
        <button onClick={goBack}><FaArrowLeft /></button>
        <h2>Appointment: {appointment.id}</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-md)' }}>
          {canEdit && !isEditing && (
            <button className="button primary" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Appointment
            </button>
          )}
          {canApprove && (
            <button className="button primary" onClick={() => handleAction('approve')}>
              <FaCheckCircle /> Approve
            </button>
          )}
          {canReject && (
            <button className="button destructive" onClick={() => handleAction('reject')}>
              <FaTimesCircle /> Reject
            </button>
          )}
          {canComplete && (
            <button className="button primary" onClick={() => handleAction('complete')}>
              <FaCheck /> Mark Completed
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <AppointmentForm appointment={appointment} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <div className="detail-content p-lg">
          <WorkflowTracker workflowHistory={appointment.workflowHistory} currentStatus={appointment.status} slaStatus={appointment.slaStatus} />

          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <Card title="Appointment Info" status={appointment.status} onClick={() => {}} accentColor="var(--color-accent)">
              <p><strong>Patient:</strong> <button className="button outline" onClick={() => navigate('PatientDetail', { id: appointment.patientId })}>{appointment.patientName}</button></p>
              <p><strong>Doctor:</strong> <button className="button outline" onClick={() => navigate('DoctorDetail', { id: appointment.doctorId })}>{appointment.doctorName}</button></p>
              <p><strong>Date:</strong> {appointment.date}</p>
              <p><strong>Reason:</strong> {appointment.reason}</p>
              <p><strong>Status:</strong> <span className="table-status-badge" data-status={appointment.status}>{getStatusLabel(appointment.status)}</span></p>
              {appointment.slaStatus === 'SLA_BREACH' && <p style={{ color: 'var(--status-red)' }}><FaExclamationTriangle /> SLA BREACH</p>}
            </Card>
            <Card title="Notes" status="ACTIVE" onClick={() => {}} accentColor="var(--color-teal)">
              <p>{appointment.notes || 'No notes available.'}</p>
            </Card>
            <Card title="Audit Trail" status="ACTIVE" onClick={() => {}} accentColor="var(--status-indigo)">
              {appointment.workflowHistory && appointment.workflowHistory.length > 0 ? (
                <ul>
                  {[...appointment.workflowHistory].reverse().map((entry, index) => (
                    <li key={index} style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                      <strong>{getStatusLabel(entry.status)}</strong> on {formatDateTime(new Date(entry.date))}
                    </li>
                  ))}
                </ul>
              ) : <p>No audit trail entries.</p>}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

const DiagnosisDetailScreen = ({ diagnosis, goBack, updateRecord }) => {
  const { userRole, canAccess } = useContext(AuthContext);
  const { navigate } = useContext(NavigationContext);
  const { medications } = useContext(DataContext);
  const [isEditing, setIsEditing] = useState(false);
  const [modalDocument, setModalDocument] = useState(null);

  if (!diagnosis) return <EmptyState message="Diagnosis Not Found" />;

  const diagnosisMedications = medications.filter(med => med.diagnosisId === diagnosis.id);

  const handleSave = (updatedDiagnosis) => {
    updateRecord('diagnoses', updatedDiagnosis);
    setIsEditing(false);
  };

  const handleViewDocument = (doc) => {
    setModalDocument(doc);
  };

  const canEdit = canAccess('data', 'Diagnosis', 'edit') && (userRole === ROLES.ADMIN || (userRole === ROLES.DOCTOR && diagnosis.doctorId === loggedInUser?.id));

  return (
    <div className="full-screen-container">
      <div className="full-screen-header">
        <button onClick={goBack}><FaArrowLeft /></button>
        <h2>Diagnosis: {diagnosis.id}</h2>
        {canEdit && !isEditing && (
          <button className="button primary" onClick={() => setIsEditing(true)} style={{ marginLeft: 'auto' }}>
            <FaEdit /> Edit Diagnosis
          </button>
        )}
      </div>

      {isEditing ? (
        <DiagnosisForm diagnosis={diagnosis} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <div className="detail-content p-lg">
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <Card title="Diagnosis Info" status={diagnosis.status} onClick={() => {}} accentColor="var(--color-accent)">
              <p><strong>Patient:</strong> <button className="button outline" onClick={() => navigate('PatientDetail', { id: diagnosis.patientId })}>{diagnosis.patientName}</button></p>
              <p><strong>Doctor:</strong> <button className="button outline" onClick={() => navigate('DoctorDetail', { id: diagnosis.doctorId })}>{diagnosis.doctorName}</button></p>
              <p><strong>Date:</strong> {diagnosis.date}</p>
              <p><strong>Condition:</strong> {diagnosis.condition}</p>
              <p><strong>Status:</strong> <span className="table-status-badge" data-status={diagnosis.status}>{getStatusLabel(diagnosis.status)}</span></p>
            </Card>
            <Card title="Details" status="ACTIVE" onClick={() => {}} accentColor="var(--color-teal)">
              <p>{diagnosis.diagnosisDetails || 'No details provided.'}</p>
            </Card>
            <Card title="Attachments" status="ACTIVE" onClick={() => {}} accentColor="var(--color-indigo)">
              {diagnosis.attachments && diagnosis.attachments.length > 0 ? (
                <ul>
                  {diagnosis.attachments.map((doc, index) => (
                    <li key={index} style={{ marginBottom: 'var(--spacing-xs)' }}>
                      {doc.name} ({doc.type})
                      <button className="button outline" onClick={(e) => { e.stopPropagation(); handleViewDocument(doc); }} style={{ marginLeft: 'var(--spacing-sm)' }}>
                        <FaEye /> View
                      </button>
                    </li>
                  ))}
                </ul>
              ) : <p>No attachments.</p>}
            </Card>
          </div>

          <h3 className="mt-lg mb-md">Prescribed Medications</h3>
          <div className="data-table-container">
            {diagnosisMedications.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Medication Name</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnosisMedications.map(med => (
                    <tr key={med.id}>
                      <td>{med.id}</td>
                      <td>{med.medicationName}</td>
                      <td>{med.dosage}</td>
                      <td>{med.frequency}</td>
                      <td><span className="table-status-badge" data-status={med.status}>{getStatusLabel(med.status)}</span></td>
                      <td className="actions">
                        {canAccess('data', 'Medication', 'view') && <button onClick={() => navigate('MedicationDetail', { id: med.id })}><FaEye /></button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <EmptyState message="No medications prescribed for this diagnosis." />}
          </div>
        </div>
      )}
      {modalDocument && <DocumentModal document={modalDocument} onClose={() => setModalDocument(null)} />}
    </div>
  );
};

const MedicationDetailScreen = ({ medication, goBack }) => {
  const { navigate } = useContext(NavigationContext);

  if (!medication) return <EmptyState message="Medication Not Found" />;

  return (
    <div className="full-screen-container">
      <div className="full-screen-header">
        <button onClick={goBack}><FaArrowLeft /></button>
        <h2>Medication: {medication.medicationName}</h2>
      </div>

      <div className="detail-content p-lg">
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <Card title="Medication Details" status={medication.status} onClick={() => {}} accentColor="var(--color-accent)">
            <p><strong>Name:</strong> {medication.medicationName}</p>
            <p><strong>Dosage:</strong> {medication.dosage}</p>
            <p><strong>Frequency:</strong> {medication.frequency}</p>
            <p><strong>Prescribed Date:</strong> {medication.prescribedDate}</p>
            <p><strong>Status:</strong> <span className="table-status-badge" data-status={medication.status}>{getStatusLabel(medication.status)}</span></p>
          </Card>
          <Card title="Patient Info" status="ACTIVE" onClick={() => {}} accentColor="var(--color-teal)">
            <p><strong>Patient:</strong> <button className="button outline" onClick={() => navigate('PatientDetail', { id: medication.patientId })}>{medication.patientName}</button></p>
            <p><strong>Prescribing Doctor:</strong> <button className="button outline" onClick={() => navigate('DoctorDetail', { id: medication.doctorId })}>{medication.doctorName}</button></p>
            <p><strong>Related Diagnosis:</strong> <button className="button outline" onClick={() => navigate('DiagnosisDetail', { id: medication.diagnosisId })}>{medication.diagnosisId}</button></p>
          </Card>
          <Card title="Notes" status="ACTIVE" onClick={() => {}} accentColor="var(--color-indigo)">
            <p>{medication.notes || 'No additional notes.'}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

const AuditLogDetailScreen = ({ log, goBack }) => {
  if (!log) return <EmptyState message="Audit Log Entry Not Found" />;
  return (
    <div className="full-screen-container">
      <div className="full-screen-header">
        <button onClick={goBack}><FaArrowLeft /></button>
        <h2>Audit Log Entry: {log.id}</h2>
      </div>

      <div className="detail-content p-lg">
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <Card title="Log Details" status="ACTIVE" onClick={() => {}} accentColor="var(--color-accent)">
            <p><strong>Timestamp:</strong> {log.timestamp}</p>
            <p><strong>User:</strong> {log.user}</p>
            <p><strong>Action:</strong> {log.action}</p>
            <p><strong>Entity Type:</strong> {log.entityType}</p>
            <p><strong>Entity ID:</strong> {log.entityId}</p>
          </Card>
          <Card title="Description" status="ACTIVE" onClick={() => {}} accentColor="var(--color-teal)">
            <p>{log.details}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- List Screens ---
const PatientsList = ({ goBack, navigate, patients, updateRecord }) => {
  const { userRole, canAccess } = useContext(AuthContext);
  const [modalDocument, setModalDocument] = useState(null);

  const filteredPatients = (userRole === ROLES.DOCTOR && canAccess('data', 'Patient', 'view'))
    ? patients.filter(p => p.primaryDoctorId === loggedInUser?.id)
    : patients;

  if (filteredPatients.length === 0) {
    return <EmptyState message="No Patients Found" actionText="Add New Patient" onAction={() => navigate('PatientForm')} />;
  }

  const handleViewDocument = (patient, doc) => {
    setModalDocument(doc);
  };

  return (
    <div className="card-grid">
      {filteredPatients.map(patient => (
        <Card
          key={patient.id}
          title={patient.name}
          status={patient.status}
          meta={patient.dob}
          description={`Primary Doctor: ${DUMMY_DATA.doctors.find(d => d.id === patient.primaryDoctorId)?.name || 'N/A'}`}
          onClick={() => navigate('PatientDetail', { id: patient.id })}
        >
          {patient.documents && patient.documents.length > 0 && (
            <div style={{ marginTop: 'var(--spacing-sm)' }}>
              <strong>Documents: </strong>
              {patient.documents.map((doc, index) => (
                <button key={index} className="button outline" style={{padding: 'var(--spacing-xxs) var(--spacing-xs)', fontSize: 'var(--font-size-sm)', margin: '0 var(--spacing-xxs)'}}
                        onClick={(e) => { e.stopPropagation(); handleViewDocument(patient, doc); }}>
                  <FaEye /> {doc.name}
                </button>
              ))}
            </div>
          )}
        </Card>
      ))}
      {modalDocument && <DocumentModal document={modalDocument} onClose={() => setModalDocument(null)} />}
    </div>
  );
};

const DoctorsList = ({ goBack, navigate, doctors, updateRecord }) => {
  if (doctors.length === 0) {
    return <EmptyState message="No Doctors Found" actionText="Add New Doctor" onAction={() => navigate('DoctorForm')} />;
  }
  return (
    <div className="card-grid">
      {doctors.map(doctor => (
        <Card
          key={doctor.id}
          title={doctor.name}
          status={doctor.status}
          meta={doctor.specialty}
          description={doctor.bio}
          onClick={() => navigate('DoctorDetail', { id: doctor.id })}
        />
      ))}
    </div>
  );
};

const AppointmentsList = ({ goBack, navigate, appointments, updateRecord }) => {
  const { userRole, canAccess, loggedInUser } = useContext(AuthContext);

  const filteredAppointments = appointments.filter(app => {
    if (userRole === ROLES.ADMIN) return true;
    if (userRole === ROLES.DOCTOR) return app.doctorId === loggedInUser?.id;
    if (userRole === ROLES.PATIENT) return app.patientId === loggedInUser?.id;
    return false;
  });

  if (filteredAppointments.length === 0) {
    if (userRole === ROLES.PATIENT) {
      return <EmptyState message="No Appointments Requested" actionText="Request New Appointment" onAction={() => navigate('AppointmentForm')} />;
    } else {
      return <EmptyState message="No Appointments Found" actionText="Create New Appointment" onAction={() => navigate('AppointmentForm')} />;
    }
  }

  return (
    <div className="card-grid">
      {filteredAppointments.map(app => (
        <Card
          key={app.id}
          title={`Appt. with ${app.doctorName}`}
          status={app.status}
          meta={`Patient: ${app.patientName} | Date: ${app.date}`}
          description={app.reason}
          onClick={() => navigate('AppointmentDetail', { id: app.id })}
        >
          {app.slaStatus === 'SLA_BREACH' && (
            <div style={{ color: 'var(--status-red)', marginTop: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
              <FaExclamationTriangle /> SLA BREACH
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

const DiagnosesList = ({ goBack, navigate, diagnoses, updateRecord }) => {
  const { userRole, canAccess, loggedInUser } = useContext(AuthContext);

  const filteredDiagnoses = diagnoses.filter(diag => {
    if (userRole === ROLES.ADMIN) return true;
    if (userRole === ROLES.DOCTOR) return diag.doctorId === loggedInUser?.id;
    if (userRole === ROLES.PATIENT) return diag.patientId === loggedInUser?.id;
    return false;
  });

  if (filteredDiagnoses.length === 0) {
    if (userRole === ROLES.DOCTOR) {
      return <EmptyState message="No Diagnoses Recorded" actionText="Record New Diagnosis" onAction={() => navigate('DiagnosisForm')} />;
    } else {
      return <EmptyState message="No Diagnoses Found" />;
    }
  }

  return (
    <div className="card-grid">
      {filteredDiagnoses.map(diag => (
        <Card
          key={diag.id}
          title={`Diagnosis: ${diag.condition}`}
          status={diag.status}
          meta={`Patient: ${diag.patientName} | Doctor: ${diag.doctorName}`}
          description={diag.diagnosisDetails}
          onClick={() => navigate('DiagnosisDetail', { id: diag.id })}
        />
      ))}
    </div>
  );
};

const MedicationsList = ({ goBack, navigate, medications, updateRecord }) => {
  const { userRole, loggedInUser } = useContext(AuthContext);

  const filteredMedications = medications.filter(med => {
    if (userRole === ROLES.ADMIN || userRole === ROLES.DOCTOR) return true; // Doctors see all, Admins too
    if (userRole === ROLES.PATIENT) return med.patientId === loggedInUser?.id;
    return false;
  });

  if (filteredMedications.length === 0) {
    return <EmptyState message="No Medications Prescribed" />;
  }

  return (
    <div className="card-grid">
      {filteredMedications.map(med => (
        <Card
          key={med.id}
          title={med.medicationName}
          status={med.status}
          meta={`For: ${med.patientName} | By: ${med.doctorName}`}
          description={`Dosage: ${med.dosage}, Frequency: ${med.frequency}`}
          onClick={() => navigate('MedicationDetail', { id: med.id })}
        />
      ))}
    </div>
  );
};

const AuditLogsList = ({ goBack, navigate, auditLogs }) => {
  return (
    <div className="card-grid">
      {auditLogs.map(log => (
        <Card
          key={log.id}
          title={log.action}
          status="REVIEWED" // Audit logs are usually 'reviewed' or 'completed' conceptually
          meta={`User: ${log.user} | Entity: ${log.entityType} ${log.entityId}`}
          description={log.details}
          onClick={() => navigate('AuditLogDetail', { id: log.id })}
        />
      ))}
    </div>
  );
};

// --- Dashboards ---
const AdminDashboard = ({ navigate, patients, doctors, appointments }) => {
  const totalPatients = patients.length;
  const activeDoctors = doctors.filter(d => d.status === 'ACTIVE').length;
  const pendingAppointments = appointments.filter(a => a.status === 'REQUESTED' || a.status === 'PENDING').length;
  const slaBreaches = appointments.filter(a => a.slaStatus === 'SLA_BREACH').length;

  return (
    <div className="p-lg">
      <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Admin Overview</h1>
      <div className="kpi-grid">
        <KPI title="Total Patients" value={totalPatients} subtext="Currently registered" color="var(--status-teal)" />
        <KPI title="Active Doctors" value={activeDoctors} subtext="Currently on staff" color="var(--status-blue)" />
        <KPI title="Pending Appointments" value={pendingAppointments} subtext="Action Required" color="var(--status-orange)" />
        <KPI title="SLA Breaches" value={slaBreaches} subtext="Overdue items" color="var(--status-red)" />
      </div>

      <h2 className="mb-md">Operational Insights</h2>
      <div className="card-grid">
        <ChartPlaceholder title="Appointments by Status" type="Donut" />
        <ChartPlaceholder title="Patient Registrations Trend" type="Line" />
        <ChartPlaceholder title="Doctor Workload" type="Bar" />
      </div>

      <h2 className="mb-md mt-xl">Recent Activity</h2>
      <div className="card-grid" style={{ gridTemplateColumns: '1fr' }}>
        {DUMMY_DATA.auditLogs.slice(0, 5).map(log => (
          <Card
            key={log.id}
            title={log.action}
            status="REVIEWED"
            meta={`${log.user} on ${log.timestamp}`}
            description={log.details}
            onClick={() => navigate('AuditLogDetail', { id: log.id })}
          />
        ))}
      </div>
    </div>
  );
};

const DoctorDashboard = ({ navigate, loggedInUser, appointments, patients, diagnoses }) => {
  const myAppointments = appointments.filter(app => app.doctorId === loggedInUser?.id);
  const myPatients = patients.filter(p => p.primaryDoctorId === loggedInUser?.id);
  const pendingDiagnoses = diagnoses.filter(d => d.doctorId === loggedInUser?.id && (d.status === 'DRAFT' || d.status === 'PENDING_REVIEW')).length;

  const upcomingAppointments = myAppointments.filter(app => new Date(app.date) > new Date() && app.status === 'APPROVED').sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
  const recentDiagnoses = diagnoses.filter(d => d.doctorId === loggedInUser?.id).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="p-lg">
      <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Welcome, {loggedInUser?.name}!</h1>
      <div className="kpi-grid">
        <KPI title="My Patients" value={myPatients.length} subtext="Assigned to you" color="var(--status-blue)" />
        <KPI title="Upcoming Appointments" value={upcomingAppointments.length} subtext="In the next 7 days" color="var(--status-teal)" />
        <KPI title="Pending Diagnoses" value={pendingDiagnoses} subtext="Awaiting your review" color="var(--status-orange)" />
      </div>

      <h2 className="mb-md">Your Upcoming Appointments</h2>
      <div className="card-grid">
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map(app => (
            <Card
              key={app.id}
              title={`Appt. with ${app.patientName}`}
              status={app.status}
              meta={`Date: ${app.date}`}
              description={app.reason}
              onClick={() => navigate('AppointmentDetail', { id: app.id })}
            />
          ))
        ) : <EmptyState message="No upcoming appointments." actionText="View All Appointments" onAction={() => navigate('AppointmentsList')} />}
      </div>

      <h2 className="mb-md mt-xl">Recent Diagnoses You Recorded</h2>
      <div className="card-grid">
        {recentDiagnoses.length > 0 ? (
          recentDiagnoses.map(diag => (
            <Card
              key={diag.id}
              title={`Diagnosis: ${diag.condition}`}
              status={diag.status}
              meta={`Patient: ${diag.patientName} | Date: ${formatDate(new Date(diag.date))}`}
              description={diag.diagnosisDetails}
              onClick={() => navigate('DiagnosisDetail', { id: diag.id })}
            />
          ))
        ) : <EmptyState message="No recent diagnoses recorded." actionText="Record New Diagnosis" onAction={() => navigate('DiagnosisForm')} />}
      </div>
    </div>
  );
};

const PatientDashboard = ({ navigate, loggedInUser, appointments, diagnoses, medications }) => {
  const myAppointments = appointments.filter(app => app.patientId === loggedInUser?.id);
  const myDiagnoses = diagnoses.filter(d => d.patientId === loggedInUser?.id);
  const myMedications = medications.filter(m => m.patientId === loggedInUser?.id);

  const upcomingAppointments = myAppointments.filter(app => new Date(app.date) > new Date() && app.status === 'APPROVED').sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
  const recentDiagnoses = myDiagnoses.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const activeMedications = myMedications.filter(m => m.status === 'ACTIVE').length;

  return (
    <div className="p-lg">
      <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Welcome, {loggedInUser?.name}!</h1>
      <div className="kpi-grid">
        <KPI title="Upcoming Appointments" value={upcomingAppointments.length} subtext="Confirmed & scheduled" color="var(--status-blue)" />
        <KPI title="Total Diagnoses" value={myDiagnoses.length} subtext="Your health history" color="var(--status-teal)" />
        <KPI title="Active Medications" value={activeMedications} subtext="Currently prescribed" color="var(--status-indigo)" />
        <KPI title="Request Appointment" value={<FaPlus />} subtext="Click to request" color="var(--status-orange)" />
      </div>

      <h2 className="mb-md">Your Upcoming Appointments
        <button className="button primary" onClick={() => navigate('AppointmentForm')} style={{ marginLeft: 'var(--spacing-md)' }}>
          <FaPlus /> Request New
        </button>
      </h2>
      <div className="card-grid">
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map(app => (
            <Card
              key={app.id}
              title={`Appt. with ${app.doctorName}`}
              status={app.status}
              meta={`Date: ${app.date}`}
              description={app.reason}
              onClick={() => navigate('AppointmentDetail', { id: app.id })}
            />
          ))
        ) : <EmptyState message="No upcoming appointments." actionText="View All Appointments" onAction={() => navigate('AppointmentsList')} />}
      </div>

      <h2 className="mb-md mt-xl">Your Recent Diagnoses</h2>
      <div className="card-grid">
        {recentDiagnoses.length > 0 ? (
          recentDiagnoses.map(diag => (
            <Card
              key={diag.id}
              title={`Diagnosis: ${diag.condition}`}
              status={diag.status}
              meta={`Doctor: ${diag.doctorName} | Date: ${formatDate(new Date(diag.date))}`}
              description={diag.diagnosisDetails}
              onClick={() => navigate('DiagnosisDetail', { id: diag.id })}
            />
          ))
        ) : <EmptyState message="No recent diagnoses." actionText="View All Diagnoses" onAction={() => navigate('DiagnosesList')} />}
      </div>
    </div>
  );
};


// --- Main App Component ---
export const App = () => {
  const [userRole, setUserRole] = useState(null); // 'Admin', 'Doctor', 'Patient'
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [screenHistory, setScreenHistory] = useState([{ name: 'Login', params: {} }]);
  const [toasts, setToasts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data states
  const [patients, setPatients] = useState(DUMMY_DATA.patients);
  const [doctors, setDoctors] = useState(DUMMY_DATA.doctors);
  const [appointments, setAppointments] = useState(DUMMY_DATA.appointments);
  const [diagnoses, setDiagnoses] = useState(DUMMY_DATA.diagnoses);
  const [medications, setMedications] = useState(DUMMY_DATA.medications);
  const [auditLogs, setAuditLogs] = useState(DUMMY_DATA.auditLogs);

  const showToast = (type, title, message) => {
    const id = generateId();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5300); // Allow animation to complete
  };

  const login = (role) => {
    setUserRole(role);
    switch (role) {
      case ROLES.ADMIN:
        setLoggedInUser({ id: 'ADMIN001', name: 'Admin User', role: ROLES.ADMIN });
        setCurrentScreen('AdminDashboard');
        setScreenHistory([{ name: 'AdminDashboard', params: {} }]);
        break;
      case ROLES.DOCTOR:
        const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
        setLoggedInUser({ id: randomDoctor.id, name: randomDoctor.name, role: ROLES.DOCTOR });
        setCurrentScreen('DoctorDashboard');
        setScreenHistory([{ name: 'DoctorDashboard', params: {} }]);
        break;
      case ROLES.PATIENT:
        const randomPatient = patients[Math.floor(Math.random() * patients.length)];
        setLoggedInUser({ id: randomPatient.id, name: randomPatient.name, role: ROLES.PATIENT });
        setCurrentScreen('PatientDashboard');
        setScreenHistory([{ name: 'PatientDashboard', params: {} }]);
        break;
      default:
        setCurrentScreen('Login');
        setScreenHistory([{ name: 'Login', params: {} }]);
        break;
    }
    showToast('success', 'Login Successful', `Logged in as ${role}`);
  };

  const logout = () => {
    setUserRole(null);
    setLoggedInUser(null);
    setCurrentScreen('Login');
    setScreenHistory([{ name: 'Login', params: {} }]);
    showToast('info', 'Logout', 'You have been logged out.');
  };

  const navigate = (screenName, params = {}) => {
    const lastScreen = screenHistory[screenHistory.length - 1];
    if (lastScreen.name === screenName && JSON.stringify(lastScreen.params) === JSON.stringify(params)) {
      // Don't navigate if already on the same screen with same params
      return;
    }
    setScreenHistory(prev => [...prev, { name: screenName, params }]);
    setCurrentScreen(screenName);
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      setScreenHistory(prev => prev.slice(0, -1));
      const previousScreen = screenHistory[screenHistory.length - 2];
      setCurrentScreen(previousScreen.name);
    } else {
      // If only one screen left (e.g., dashboard), prevent going back to login unless explicitly logging out
      if (userRole) {
        switch (userRole) {
          case ROLES.ADMIN: setCurrentScreen('AdminDashboard'); break;
          case ROLES.DOCTOR: setCurrentScreen('DoctorDashboard'); break;
          case ROLES.PATIENT: setCurrentScreen('PatientDashboard'); break;
          default: setCurrentScreen('Login'); break;
        }
      } else {
        setCurrentScreen('Login');
      }
    }
  };

  const getScreenTitle = (screenName) => {
    switch (screenName) {
      case 'AdminDashboard': return 'Admin Dashboard';
      case 'DoctorDashboard': return 'Doctor Dashboard';
      case 'PatientDashboard': return 'Patient Dashboard';
      case 'PatientsList': return 'Patients';
      case 'PatientDetail': return 'Patient Details';
      case 'PatientForm': return 'Patient Form';
      case 'DoctorsList': return 'Doctors';
      case 'DoctorDetail': return 'Doctor Details';
      case 'DoctorForm': return 'Doctor Form';
      case 'AppointmentsList': return 'Appointments';
      case 'AppointmentDetail': return 'Appointment Details';
      case 'AppointmentForm': return 'Appointment Form';
      case 'DiagnosesList': return 'Diagnoses';
      case 'DiagnosisDetail': return 'Diagnosis Details';
      case 'DiagnosisForm': return 'Diagnosis Form';
      case 'MedicationsList': return 'Medications';
      case 'MedicationDetail': return 'Medication Details';
      case 'AuditLogsList': return 'Audit Logs';
      case 'AuditLogDetail': return 'Audit Log Entry';
      default: return 'Hospital Management System';
    }
  };

  const canAccess = (type, entityOrAction, permission) => {
    if (!userRole) return false;
    if (type === 'dashboards') return PERMISSIONS[userRole]?.dashboards.includes(entityOrAction);
    if (type === 'screens') return PERMISSIONS[userRole]?.screens.includes(entityOrAction);
    if (type === 'data') return PERMISSIONS[userRole]?.data[entityOrAction]?.[permission];
    if (type === 'actions') return PERMISSIONS[userRole]?.actions.includes(entityOrAction);
    if (type === 'workflowActions') return PERMISSIONS[userRole]?.workflowActions[entityOrAction]?.includes(permission);
    return false;
  };

  const updateRecord = (entityType, updatedRecord) => {
    let dataset;
    let setter;
    switch (entityType) {
      case 'patients': dataset = patients; setter = setPatients; break;
      case 'doctors': dataset = doctors; setter = setDoctors; break;
      case 'appointments': dataset = appointments; setter = setAppointments; break;
      case 'diagnoses': dataset = diagnoses; setter = setDiagnoses; break;
      case 'medications': dataset = medications; setter = setMedications; break;
      case 'auditLogs': dataset = auditLogs; setter = setAuditLogs; break;
      default: return;
    }

    const index = dataset.findIndex(rec => rec.id === updatedRecord.id);
    if (index !== -1) {
      setter(prev => {
        const newState = [...prev];
        newState[index] = updatedRecord;
        return newState;
      });
      showToast('success', 'Update Successful', `${updatedRecord.id} updated.`);
      goBack();
    } else {
      // Add new record
      const newRecord = { ...updatedRecord, id: updatedRecord.id || generateId() };
      setter(prev => [...prev, newRecord]);
      showToast('success', 'Creation Successful', `${newRecord.id} created.`);
      if (currentScreen.endsWith('Form')) {
        goBack(); // Return from form after creation
      } else {
        navigate(currentScreen); // Stay on list view, it will update
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const renderContent = () => {
    const screenInfo = screenHistory[screenHistory.length - 1];
    const screenName = screenInfo.name;
    const params = screenInfo.params || {};

    if (!userRole && screenName !== 'Login') {
      return <LoginScreen login={login} />;
    }

    if (!canAccess('screens', screenName) && !canAccess('dashboards', screenName) && screenName !== 'Login') {
      return (
        <div className="content-area">
          <EmptyState message="Access Denied" actionText="Go to Dashboard" onAction={() => navigate(`${userRole}Dashboard`)} />
        </div>
      );
    }

    // Full-screen details/forms
    if (screenName.includes('Detail') || screenName.includes('Form')) {
      const entityId = params.id;
      const patientId = params.patientId; // For AppointmentForm/DiagnosisForm init
      let dataRecord;

      if (screenName === 'PatientDetail') dataRecord = patients.find(p => p.id === entityId);
      if (screenName === 'DoctorDetail') dataRecord = doctors.find(d => d.id === entityId);
      if (screenName === 'AppointmentDetail') dataRecord = appointments.find(a => a.id === entityId);
      if (screenName === 'DiagnosisDetail') dataRecord = diagnoses.find(d => d.id === entityId);
      if (screenName === 'MedicationDetail') dataRecord = medications.find(m => m.id === entityId);
      if (screenName === 'AuditLogDetail') dataRecord = auditLogs.find(l => l.id === entityId);

      if (screenName === 'PatientForm') return <PatientForm patient={dataRecord} onSave={updateRecord} onCancel={goBack} />;
      if (screenName === 'DoctorForm') return <DoctorForm doctor={dataRecord} onSave={updateRecord} onCancel={goBack} />;
      if (screenName === 'AppointmentForm') return <AppointmentForm appointment={dataRecord || (patientId ? { patientId } : {})} onSave={updateRecord} onCancel={goBack} />;
      if (screenName === 'DiagnosisForm') return <DiagnosisForm diagnosis={dataRecord || (patientId ? { patientId } : {})} onSave={updateRecord} onCancel={goBack} />;

      if (!dataRecord && !screenName.includes('Form')) { // If it's a detail screen and data not found
        return (
          <div className="full-screen-container">
            <div className="full-screen-header"><button onClick={goBack}><FaArrowLeft /></button><h2>Record Not Found</h2></div>
            <EmptyState message="The requested record could not be found." />
          </div>
        );
      }

      switch (screenName) {
        case 'PatientDetail': return <PatientDetailScreen patient={dataRecord} goBack={goBack} updateRecord={updateRecord} />;
        case 'DoctorDetail': return <DoctorDetailScreen doctor={dataRecord} goBack={goBack} updateRecord={updateRecord} />;
        case 'AppointmentDetail': return <AppointmentDetailScreen appointment={dataRecord} goBack={goBack} updateRecord={updateRecord} />;
        case 'DiagnosisDetail': return <DiagnosisDetailScreen diagnosis={dataRecord} goBack={goBack} updateRecord={updateRecord} />;
        case 'MedicationDetail': return <MedicationDetailScreen medication={dataRecord} goBack={goBack} />;
        case 'AuditLogDetail': return <AuditLogDetailScreen log={dataRecord} goBack={goBack} />;
        default: return null;
      }
    }

    // List/Dashboard screens
    return (
      <div className="content-area">
        {(() => {
          switch (screenName) {
            case 'AdminDashboard': return <AdminDashboard navigate={navigate} patients={patients} doctors={doctors} appointments={appointments} />;
            case 'DoctorDashboard': return <DoctorDashboard navigate={navigate} loggedInUser={loggedInUser} appointments={appointments} patients={patients} diagnoses={diagnoses} />;
            case 'PatientDashboard': return <PatientDashboard navigate={navigate} loggedInUser={loggedInUser} appointments={appointments} diagnoses={diagnoses} medications={medications} />;
            case 'PatientsList': return <PatientsList goBack={goBack} navigate={navigate} patients={patients} updateRecord={updateRecord} />;
            case 'DoctorsList': return <DoctorsList goBack={goBack} navigate={navigate} doctors={doctors} updateRecord={updateRecord} />;
            case 'AppointmentsList': return <AppointmentsList goBack={goBack} navigate={navigate} appointments={appointments} updateRecord={updateRecord} />;
            case 'DiagnosesList': return <DiagnosesList goBack={goBack} navigate={navigate} diagnoses={diagnoses} updateRecord={updateRecord} />;
            case 'MedicationsList': return <MedicationsList goBack={goBack} navigate={navigate} medications={medications} updateRecord={updateRecord} />;
            case 'AuditLogsList': return <AuditLogsList goBack={goBack} navigate={navigate} auditLogs={auditLogs} />;
            case 'Login': return <LoginScreen login={login} />;
            default: return <EmptyState message="Page Not Found" actionText="Go to Dashboard" onAction={() => navigate(`${userRole}Dashboard`)} />;
          }
        })()}
      </div>
    );
  };

  const loginScreenTitle = "Welcome to Hospital Management System";
  const currentTitle = userRole ? getScreenTitle(currentScreen) : loginScreenTitle;

  return (
    <AuthContext.Provider value={{ userRole, loggedInUser, canAccess, login, logout }}>
      <NavigationContext.Provider value={{ navigate, goBack, screenHistory, showToast }}>
        <DataContext.Provider value={{ patients, doctors, appointments, diagnoses, medications, auditLogs, updateRecord }}>
          <ToastContext.Provider value={{ showToast }}>
            <div className="app-container">
              {userRole && (
                <>
                  <Sidebar
                    userRole={userRole}
                    currentScreen={currentScreen}
                    navigate={navigate}
                    logout={logout}
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                  />
                  <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
                </>
              )}
              <div className="main-content">
                {userRole && <Header title={currentTitle} userRole={userRole} currentScreen={currentScreen} navigate={navigate} goBack={goBack} screenHistory={screenHistory} toggleSidebar={toggleSidebar} />}
                {renderContent()}
              </div>
              <div className="toast-container">
                {toasts.map(toast => (
                  <Toast key={toast.id} type={toast.type} title={toast.title} message={toast.message} />
                ))}
              </div>
            </div>
          </ToastContext.Provider>
        </DataContext.Provider>
      </NavigationContext.Provider>
    </AuthContext.Provider>
  );
};

const LoginScreen = ({ login }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'var(--color-background)',
    flexDirection: 'column',
    textAlign: 'center'
  }}>
    <div style={{
      backgroundColor: 'var(--color-surface)',
      padding: 'var(--spacing-2xl)',
      borderRadius: 'var(--border-radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      maxWidth: '500px',
      width: '90%'
    }}>
      <h1 style={{ color: 'var(--color-accent)', marginBottom: 'var(--spacing-lg)' }}>Hospital Management System</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)' }}>Select a role to login:</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <button className="button primary" onClick={() => login(ROLES.ADMIN)}>
          <FaCog style={{ marginRight: 'var(--spacing-sm)' }} /> Login as Admin
        </button>
        <button className="button primary" onClick={() => login(ROLES.DOCTOR)}>
          <FaUserMd style={{ marginRight: 'var(--spacing-sm)' }} /> Login as Doctor
        </button>
        <button className="button primary" onClick={() => login(ROLES.PATIENT)}>
          <FaUsers style={{ marginRight: 'var(--spacing-sm)' }} /> Login as Patient
        </button>
      </div>
    </div>
  </div>
);

export default App;