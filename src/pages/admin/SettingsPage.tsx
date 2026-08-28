import { useEffect, useState } from "react";
import {
  CalendarClock,
  KeyRound,
  Loader2,
  RefreshCw,
  Save,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { useSite } from "../../hooks/SiteContext";
import type { SchedulingPlatform } from "../../types";
import { useSchedulingAdmin } from "../../features/admin/settings/settingsHooks";
import { useAppDispatch } from "../../store/hooks";
import { useAuth } from "../../features/auth/authHooks";
import {
  changePasswordRequest,
  updateCurrentUserRequest,
} from "../../features/auth/authApi";
import { updateAuthUser } from "../../features/auth/authSlice";

const inputClass =
  "w-full px-3 py-2.5 border border-slate-200 rounded-sm text-[14px] text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/30 focus:border-[#38BDF8] transition-colors";
const labelClass = "block text-[13px] font-semibold text-slate-700 mb-1.5";
const panelClass =
  "bg-white rounded-sm border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-6";
const tabs = ["Scheduling", "Profile Info", "Account Update"] as const;
type SettingsTab = (typeof tabs)[number];

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const { user, logout } = useAuth();
  const { applyScheduling } = useSite();
  const {
    form,
    previewUrl,
    isLoading,
    isSaving,
    error,
    saveError,
    saveSuccessMessage,
    loadSettings,
    saveSettings,
    updateForm,
    changePlatform,
    clearMessages,
  } = useSchedulingAdmin();
  const [activeTab, setActiveTab] = useState<SettingsTab>("Scheduling");
  const [profileForm, setProfileForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
  });
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    loadSettings().catch(() => undefined);
  }, [loadSettings]);

  useEffect(() => {
    setProfileForm({
      name: user?.name ?? "",
      email: user?.email ?? "",
    });
  }, [user]);

  const handleSaveScheduling = async () => {
    clearMessages();
    try {
      const result = await saveSettings();
      applyScheduling(result.settings);
    } catch {
      // saveError is set in the slice
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) {
      setProfileError("You must be signed in to update your profile.");
      return;
    }

    setProfileError(null);
    setProfileSuccess(null);
    setProfileSaving(true);

    try {
      const payload: { name?: string; email?: string } = {};
      if (profileForm.name.trim()) payload.name = profileForm.name.trim();
      if (profileForm.email.trim())
        payload.email = profileForm.email.trim().toLowerCase();

      if (!Object.keys(payload).length) {
        setProfileError("At least one field is required.");
        return;
      }

      const response = await updateCurrentUserRequest(payload);
      const responseBody = response as {
        data?: { data?: Record<string, unknown> };
      };
      const updatedUser =
        (responseBody.data && "data" in responseBody.data
          ? (responseBody.data.data as Record<string, unknown> | undefined)
          : undefined) ??
        (responseBody.data as Record<string, unknown> | undefined) ??
        user;
      const normalizedUser = (updatedUser ?? user) as Partial<{
        name: string;
        email: string;
      }>;
      dispatch(updateAuthUser(normalizedUser));
      setProfileForm({
        name: String(normalizedUser.name ?? user?.name ?? ""),
        email: String(normalizedUser.email ?? user?.email ?? ""),
      });
      setProfileSuccess("Profile updated successfully.");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Unable to update your profile right now.";
      setProfileError(message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError("Current password and new password are required.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirm password must match.");
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError(
        "New password must be different from the current password.",
      );
      return;
    }

    setPasswordSaving(true);

    try {
      await changePasswordRequest({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      setPasswordSuccess(
        "Password changed successfully. Please sign in again.",
      );
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      await logout();
      window.location.href = "/admin/login";
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Unable to change your password right now.";
      setPasswordError(message);
    } finally {
      setPasswordSaving(false);
    }
  };

  const tabButtonClass = (tab: SettingsTab) =>
    `px-4 py-2.5 text-[13px] font-semibold rounded-sm border transition-colors cursor-pointer ${
      activeTab === tab
        ? "border-[#38BDF8] bg-[#38BDF8]/10 text-[#0F172A]"
        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
    }`;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-6 h-6 text-[#38BDF8] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-4">
        <div className="p-4 rounded-sm text-[14px] border bg-red-50 text-red-800 border-red-200">
          {error}
        </div>
        <button
          type="button"
          onClick={() => void loadSettings()}
          className="inline-flex items-center gap-2 px-4 py-2 text-[14px] font-semibold text-slate-700 border border-slate-200 rounded-sm hover:bg-slate-50 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const message = saveSuccessMessage
    ? { type: "success" as const, text: saveSuccessMessage }
    : saveError
      ? { type: "error" as const, text: saveError }
      : null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-[26px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-[14px] text-slate-500 mt-1">
          Manage your scheduling configuration and account details.
        </p>
      </div>

      <div className="border-b border-slate-200 pb-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={tabButtonClass(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Scheduling" && (
        <div className={panelClass}>
          {message && (
            <div
              className={`p-4 rounded-sm text-[14px] border ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-sm border border-slate-100">
            <div>
              <h2 className="text-[15px] font-semibold text-slate-900">
                Enable Scheduling
              </h2>
              <p className="text-[13px] text-slate-500 mt-0.5">
                Turn booking functionality on or off across the site
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateForm({ isEnabled: !form.isEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                form.isEnabled ? "bg-[#38BDF8]" : "bg-slate-300"
              }`}
              aria-pressed={form.isEnabled}
              aria-label="Toggle scheduling"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.isEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            <div className="sm:w-48 sm:shrink-0">
              <label className={labelClass}>Booking Platform</label>
              <select
                value={form.platform}
                onChange={(e) =>
                  changePlatform(e.target.value as SchedulingPlatform)
                }
                className={inputClass}
              >
                <option value="calendly">Calendly</option>
                <option value="calcom">Cal.com</option>
                <option value="savvycal">SavvyCal</option>
                <option value="acuity">Acuity Scheduling</option>
                <option value="custom">Custom Link</option>
              </select>
            </div>

            <div className="sm:flex-1 sm:min-w-0">
              {form.platform === "calendly" && (
                <div>
                  <label className={labelClass}>Calendly URL</label>
                  <input
                    type="url"
                    value={form.calendlyUrl || ""}
                    onChange={(e) =>
                      updateForm({ calendlyUrl: e.target.value })
                    }
                    placeholder="https://calendly.com/your-username"
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-[12px] text-slate-500">
                    Your Calendly booking page URL
                  </p>
                </div>
              )}

              {form.platform === "calcom" && (
                <div>
                  <label className={labelClass}>Cal.com Username</label>
                  <input
                    type="text"
                    value={form.calComUsername || ""}
                    onChange={(e) =>
                      updateForm({ calComUsername: e.target.value })
                    }
                    placeholder="your-username"
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-[12px] text-slate-500">
                    e.g. &quot;john&quot; for cal.com/john
                  </p>
                </div>
              )}

              {form.platform === "savvycal" && (
                <div>
                  <label className={labelClass}>SavvyCal Username</label>
                  <input
                    type="text"
                    value={form.savvyCalUsername || ""}
                    onChange={(e) =>
                      updateForm({ savvyCalUsername: e.target.value })
                    }
                    placeholder="your-username"
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-[12px] text-slate-500">
                    e.g. &quot;john&quot; for savvycal.com/john
                  </p>
                </div>
              )}

              {form.platform === "acuity" && (
                <div>
                  <label className={labelClass}>Acuity User ID</label>
                  <input
                    type="text"
                    value={form.acuityUserId || ""}
                    onChange={(e) =>
                      updateForm({ acuityUserId: e.target.value })
                    }
                    placeholder="your-user-id"
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-[12px] text-slate-500">
                    Your Acuity Scheduling user ID
                  </p>
                </div>
              )}

              {form.platform === "custom" && (
                <div>
                  <label className={labelClass}>Custom Booking Link</label>
                  <input
                    type="url"
                    value={form.customLink || ""}
                    onChange={(e) => updateForm({ customLink: e.target.value })}
                    placeholder="https://example.com/book-appointment"
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-[12px] text-slate-500">
                    Any http(s) booking page URL
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h2 className="text-[15px] font-semibold text-slate-900">
              Button Customization
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
              <div className="sm:w-48 sm:shrink-0">
                <label className={labelClass}>Button Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.buttonColor || "#2563eb"}
                    onChange={(e) =>
                      updateForm({ buttonColor: e.target.value })
                    }
                    className="w-11 h-11 p-1 border border-slate-200 rounded-sm cursor-pointer bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={form.buttonColor || ""}
                    onChange={(e) =>
                      updateForm({ buttonColor: e.target.value })
                    }
                    placeholder="#2563eb"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="sm:flex-1 sm:min-w-0">
                <label className={labelClass}>Button Text</label>
                <input
                  type="text"
                  value={form.buttonText}
                  onChange={(e) => updateForm({ buttonText: e.target.value })}
                  placeholder="Book Now"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-[15px] font-semibold text-slate-900 mb-4">
              Preview
            </h2>
            <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 space-y-3">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-600">
                <p>
                  Platform:{" "}
                  <span className="font-semibold text-slate-900 capitalize">
                    {form.platform}
                  </span>
                </p>
                <p>
                  Status:{" "}
                  <span
                    className={
                      form.isEnabled
                        ? "font-semibold text-emerald-600"
                        : "font-semibold text-red-600"
                    }
                  >
                    {form.isEnabled ? "Active" : "Disabled"}
                  </span>
                </p>
              </div>
              {previewUrl && (
                <p className="text-[12px] text-slate-500 break-all">
                  Booking URL:{" "}
                  <span className="text-slate-700">{previewUrl}</span>
                </p>
              )}
              <div className="flex items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 text-slate-500 text-[13px]">
                  <CalendarClock className="w-4 h-4 shrink-0" />
                  <span>Live booking button</span>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 text-white text-[13px] font-semibold rounded-sm transition-opacity"
                  style={{
                    backgroundColor: form.buttonColor || "#2563eb",
                    opacity: form.isEnabled ? 1 : 0.5,
                    cursor: form.isEnabled ? "pointer" : "not-allowed",
                  }}
                  disabled={!form.isEnabled || !previewUrl}
                  onClick={() => {
                    if (previewUrl)
                      window.open(previewUrl, "_blank", "noopener,noreferrer");
                  }}
                >
                  {form.buttonText || "Book Now"}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleSaveScheduling()}
            disabled={isSaving}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#38BDF8] hover:bg-[#20B0F0] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-sm transition-colors cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      )}

      {activeTab === "Profile Info" && (
        <div className={panelClass}>
          <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center justify-center h-11 w-11 rounded-full bg-sky-50 text-[#0F172A]">
              <UserCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-900">
                Profile Information
              </h2>
              <p className="text-[13px] text-slate-500">
                Read-only account summary
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-sm p-4">
              <p className="text-[12px] uppercase tracking-[0.08em] text-slate-500">
                Full name
              </p>
              <p className="mt-2 text-[15px] font-semibold text-slate-900">
                {user?.name || "—"}
              </p>
            </div>
            <div className="border border-slate-200 rounded-sm p-4">
              <p className="text-[12px] uppercase tracking-[0.08em] text-slate-500">
                Email address
              </p>
              <p className="mt-2 text-[15px] font-semibold text-slate-900">
                {user?.email || "—"}
              </p>
            </div>
            <div className="border border-slate-200 rounded-sm p-4">
              <p className="text-[12px] uppercase tracking-[0.08em] text-slate-500">
                Role
              </p>
              <p className="mt-2 text-[15px] font-semibold text-slate-900">
                {user?.role || "ADMIN"}
              </p>
            </div>
            <div className="border border-slate-200 rounded-sm p-4">
              <p className="text-[12px] uppercase tracking-[0.08em] text-slate-500">
                User ID
              </p>
              <p className="mt-2 text-[15px] font-semibold text-slate-900 break-all">
                {user?.id || "—"}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Account Update" && (
        <div className={panelClass}>
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-sm p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 text-slate-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-900">
                    Edit Profile / Info
                  </h2>
                  <p className="text-[13px] text-slate-500">
                    Update your public admin profile details.
                  </p>
                </div>
              </div>

              {profileError && (
                <div className="mb-4 p-3 rounded-sm border border-red-200 bg-red-50 text-[13px] text-red-800">
                  {profileError}
                </div>
              )}
              {profileSuccess && (
                <div className="mb-4 p-3 rounded-sm border border-emerald-200 bg-emerald-50 text-[13px] text-emerald-800">
                  {profileSuccess}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Full name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className={labelClass}>Email address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handleProfileUpdate()}
                disabled={profileSaving}
                className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#38BDF8] hover:bg-[#20B0F0] disabled:opacity-60 text-white text-[13px] font-semibold rounded-sm transition-colors cursor-pointer"
              >
                {profileSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Profile
                  </>
                )}
              </button>
            </div>

            <div className="border border-slate-200 rounded-sm p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 text-slate-700">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-900">
                    Change Password
                  </h2>
                  <p className="text-[13px] text-slate-500">
                    Update your account credentials securely.
                  </p>
                </div>
              </div>

              {passwordError && (
                <div className="mb-4 p-3 rounded-sm border border-red-200 bg-red-50 text-[13px] text-red-800">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="mb-4 p-3 rounded-sm border border-emerald-200 bg-emerald-50 text-[13px] text-emerald-800">
                  {passwordSuccess}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Current password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className={labelClass}>New password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className={labelClass}>Confirm new password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handlePasswordChange()}
                disabled={passwordSaving}
                className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-[13px] font-semibold rounded-sm transition-colors cursor-pointer"
              >
                {passwordSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
