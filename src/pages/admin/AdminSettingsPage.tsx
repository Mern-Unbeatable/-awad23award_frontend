import React, { useState, useEffect } from 'react';

interface SchedulingSettings {
  id?: string;
  platform: 'calendly' | 'calcom' | 'savvycal' | 'acuity' | 'custom';
  isEnabled: boolean;
  calendlyUrl?: string;
  calComUsername?: string;
  savvyCalUsername?: string;
  acuityUserId?: string;
  customLink?: string;
  buttonText: string;
  buttonColor?: string;
}

export const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<SchedulingSettings>({
    platform: 'calendly',
    isEnabled: true,
    buttonText: 'Book Now',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Fetch existing settings on load
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/scheduling');
      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setSettings(data);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch('/api/admin/scheduling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      setMessage({ type: 'success', text: 'Settings saved successfully!' });

      // Refresh settings after save
      await fetchSettings();
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to save settings. Please try again.',
      });
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handlePlatformChange = (platform: SchedulingSettings['platform']) => {
    setSettings({
      ...settings,
      platform,
      // Clear platform-specific fields when switching
      calendlyUrl: undefined,
      calComUsername: undefined,
      savvyCalUsername: undefined,
      acuityUserId: undefined,
      customLink: undefined,
    });
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-gray-500'>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Scheduling Settings
        </h1>
        <p className='text-gray-600 mt-2'>
          Configure your booking platform and scheduling preferences.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <div className='space-y-6'>
          {/* Enable/Disable Toggle */}
          <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
            <div>
              <h3 className='font-medium text-gray-900'>Enable Scheduling</h3>
              <p className='text-sm text-gray-500'>
                Turn booking functionality on or off
              </p>
            </div>
            <button
              onClick={() =>
                setSettings({ ...settings, isEnabled: !settings.isEnabled })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.isEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Platform Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Booking Platform
            </label>
            <select
              value={settings.platform}
              onChange={(e) =>
                handlePlatformChange(
                  e.target.value as SchedulingSettings['platform'],
                )
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='calendly'>Calendly</option>
              <option value='calcom'>Cal.com</option>
              <option value='savvycal'>SavvyCal</option>
              <option value='acuity'>Acuity Scheduling</option>
              <option value='custom'>Custom Link</option>
            </select>
          </div>

          {/* Platform-specific Configuration */}
          <div className='space-y-4'>
            {settings.platform === 'calendly' && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Calendly URL
                </label>
                <input
                  type='url'
                  value={settings.calendlyUrl || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, calendlyUrl: e.target.value })
                  }
                  placeholder='https://calendly.com/your-username'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
                <p className='mt-1 text-sm text-gray-500'>
                  Your Calendly booking page URL
                </p>
              </div>
            )}

            {settings.platform === 'calcom' && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Cal.com Username
                </label>
                <input
                  type='text'
                  value={settings.calComUsername || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, calComUsername: e.target.value })
                  }
                  placeholder='your-username'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
                <p className='mt-1 text-sm text-gray-500'>
                  Your Cal.com username (e.g., &quot;john&quot; for
                  cal.com/john)
                </p>
              </div>
            )}

            {settings.platform === 'savvycal' && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  SavvyCal Username
                </label>
                <input
                  type='text'
                  value={settings.savvyCalUsername || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      savvyCalUsername: e.target.value,
                    })
                  }
                  placeholder='your-username'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
                <p className='mt-1 text-sm text-gray-500'>
                  Your SavvyCal username (e.g., &quot;john&quot; for
                  savvycal.com/john)
                </p>
              </div>
            )}

            {settings.platform === 'acuity' && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Acuity User ID
                </label>
                <input
                  type='text'
                  value={settings.acuityUserId || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, acuityUserId: e.target.value })
                  }
                  placeholder='your-user-id'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
                <p className='mt-1 text-sm text-gray-500'>
                  Your Acuity Scheduling user ID
                </p>
              </div>
            )}

            {settings.platform === 'custom' && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Custom Booking Link
                </label>
                <input
                  type='url'
                  value={settings.customLink || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, customLink: e.target.value })
                  }
                  placeholder='https://example.com/book-appointment'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
                <p className='mt-1 text-sm text-gray-500'>
                  Enter a custom URL for your booking page
                </p>
              </div>
            )}
          </div>

          {/* Button Customization */}
          <div className='border-t border-gray-200 pt-6'>
            <h3 className='text-sm font-medium text-gray-900 mb-4'>
              Button Customization
            </h3>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Button Text
                </label>
                <input
                  type='text'
                  value={settings.buttonText}
                  onChange={(e) =>
                    setSettings({ ...settings, buttonText: e.target.value })
                  }
                  placeholder='Book Now'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Button Color (Optional)
                </label>
                <div className='flex items-center space-x-3'>
                  <input
                    type='color'
                    value={settings.buttonColor || '#2563eb'}
                    onChange={(e) =>
                      setSettings({ ...settings, buttonColor: e.target.value })
                    }
                    className='w-12 h-12 p-1 border border-gray-300 rounded-lg cursor-pointer'
                  />
                  <input
                    type='text'
                    value={settings.buttonColor || ''}
                    onChange={(e) =>
                      setSettings({ ...settings, buttonColor: e.target.value })
                    }
                    placeholder='#2563eb'
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <p className='mt-1 text-sm text-gray-500'>
                  Enter a hex color code or use the color picker
                </p>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className='border-t border-gray-200 pt-6'>
            <h3 className='text-sm font-medium text-gray-900 mb-4'>Preview</h3>
            <div className='p-4 bg-gray-50 rounded-lg'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>
                    Platform:{' '}
                    <span className='font-medium capitalize'>
                      {settings.platform}
                    </span>
                  </p>
                  <p className='text-sm text-gray-600'>
                    Status:{' '}
                    <span
                      className={
                        settings.isEnabled ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {settings.isEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </p>
                </div>
                <button
                  className='px-4 py-2 text-white rounded-lg transition-colors'
                  style={{
                    backgroundColor: settings.buttonColor || '#2563eb',
                    opacity: settings.isEnabled ? 1 : 0.5,
                    cursor: settings.isEnabled ? 'pointer' : 'not-allowed',
                  }}
                  disabled={!settings.isEnabled}
                  onClick={() => {
                    // Test the URL in preview
                    const url = getSchedulingUrl(settings);
                    if (url) window.open(url, '_blank');
                  }}
                >
                  {settings.buttonText || 'Book Now'}
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className='pt-4'>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg transition-colors ${
                saving
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
              }`}
            >
              {saving ? (
                <span className='flex items-center justify-center'>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get scheduling URL
function getSchedulingUrl(settings: SchedulingSettings): string | null {
  if (!settings.isEnabled) return null;

  switch (settings.platform) {
    case 'calendly':
      return settings.calendlyUrl || null;
    case 'calcom':
      return settings.calComUsername
        ? `https://cal.com/${settings.calComUsername}`
        : null;
    case 'savvycal':
      return settings.savvyCalUsername
        ? `https://savvycal.com/${settings.savvyCalUsername}`
        : null;
    case 'acuity':
      return settings.acuityUserId
        ? `https://acuityscheduling.com/schedule.php?owner=${settings.acuityUserId}`
        : null;
    case 'custom':
      return settings.customLink || null;
    default:
      return null;
  }
}
