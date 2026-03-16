import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDelivery } from '../context/DeliveryContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleType: 'bike',
    vehicleNumber: '',
    drivingLicense: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useDelivery();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 text-base rounded-xl border border-gray-300 outline-none transition focus:ring-2 focus:ring-primary focus:border-transparent bg-white';
  const labelClass = 'block mb-1.5 text-sm font-medium text-gray-700';

  return (
    <div
      className="flex flex-col items-center justify-start w-full min-h-screen min-h-screen-dvh px-4 bg-gradient-to-br from-primary to-secondary sm:justify-center"
      style={{
        paddingTop: 'max(2.5rem, env(safe-area-inset-top))',
        paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))'
      }}
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-5 text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Join QuickBite</h1>
          <p className="mt-1 text-sm text-white/80">Become a Delivery Partner</p>
        </div>

        {/* Form Card */}
        <div className="p-5 bg-white rounded-2xl shadow-2xl sm:p-7">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Create Account</h2>

          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
              <span className="flex-shrink-0 mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Personal Info */}
            <p className="mb-3 text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Personal Info
            </p>
            <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={inputClass}
                  required
                  autoComplete="name"
                />
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  inputMode="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className={inputClass}
                  required
                  autoComplete="tel"
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  inputMode="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="delivery@example.com"
                  className={inputClass}
                  required
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>
            </div>

            {/* Vehicle Details */}
            <p className="mt-5 mb-3 text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Vehicle Details
            </p>
            <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
              <div>
                <label className={labelClass}>Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="car">Car</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Vehicle Number</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  placeholder="GJ01AB1234"
                  className={inputClass}
                  required
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Driving License Number</label>
                <input
                  type="text"
                  name="drivingLicense"
                  value={formData.drivingLicense}
                  onChange={handleChange}
                  placeholder="DL Number"
                  className={inputClass}
                  required
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Account Security */}
            <p className="mt-5 mb-3 text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Account Security
            </p>
            <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={inputClass}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className={labelClass}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className={inputClass}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full min-h-[52px] py-3 mt-6 text-base font-semibold text-white rounded-xl transition bg-primary hover:bg-opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Registering…
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
