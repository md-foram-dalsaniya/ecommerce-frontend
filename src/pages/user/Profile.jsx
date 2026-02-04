import { useState } from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

/**
 * Profile - Address management (add, edit, delete)
 */
export default function Profile() {
  const { user, updateUserProfile, addAddress, editAddress, deleteAddress } =
    useAuth();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [editingAddr, setEditingAddr] = useState(null);
  const [addrForm, setAddrForm] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [showAddAddr, setShowAddAddr] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUserProfile(formData);
    setEditing(false);
    addToast("Profile updated");
  };

  const handleAddAddress = () => {
    if (!addrForm.street || !addrForm.city || !addrForm.state || !addrForm.pincode) {
      addToast("Fill all address fields", "error");
      return;
    }
    addAddress(addrForm);
    setAddrForm({ street: "", city: "", state: "", pincode: "" });
    setShowAddAddr(false);
    addToast("Address added");
  };

  const handleEditAddress = (addr) => {
    setEditingAddr(addr);
    if (addr.street && addr.city) {
      setAddrForm({
        street: addr.street || "",
        city: addr.city || "",
        state: addr.state || "",
        pincode: addr.pincode || "",
      });
    } else if (addr.full) {
      const parts = addr.full.split(", ");
      const last = parts[parts.length - 1] || "";
      setAddrForm({
        street: parts[0] || "",
        city: parts[1] || "",
        state: last.split(" - ")[0] || "",
        pincode: last.split(" - ")[1] || "",
      });
    }
  };

  const handleSaveEditAddress = () => {
    if (!editingAddr || !addrForm.street || !addrForm.city) {
      addToast("Fill all fields", "error");
      return;
    }
    editAddress(editingAddr.id, {
      ...addrForm,
      full: `${addrForm.street}, ${addrForm.city}, ${addrForm.state} - ${addrForm.pincode}`,
    });
    setEditingAddr(null);
    setAddrForm({ street: "", city: "", state: "", pincode: "" });
    addToast("Address updated");
  };

  const handleDeleteAddress = (addrId) => {
    if (window.confirm("Delete this address?")) {
      deleteAddress(addrId);
      addToast("Address removed");
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-2xl font-semibold text-textDark mb-2">
          My Profile
        </h1>
        <div className="h-px w-16 bg-gold mb-8" />

        <div className="bg-gradient-card rounded-xl shadow-card p-6 border border-border/50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textDark mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editing}
                className={`${inputClass} disabled:bg-surface disabled:text-textDark`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textDark mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className={`${inputClass} bg-surface text-muted`}
              />
              <p className="text-xs text-muted mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-textDark mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editing}
                className={`${inputClass} disabled:bg-surface disabled:text-textDark`}
                placeholder="9876543210"
              />
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setFormData({
                      name: user?.name,
                      email: user?.email,
                      phone: user?.phone,
                    });
                    setEditing(false);
                  }}
                  className="px-6 py-2.5 border border-border rounded-xl hover:bg-surface"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Saved Addresses */}
          <div className="mt-10 pt-8 border-t border-border">
            <h3 className="font-serif font-semibold text-textDark mb-4">
              Saved Addresses
            </h3>
            <div className="space-y-4">
              {user?.addresses?.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 bg-surface rounded-xl border border-border/50"
                >
                  {editingAddr?.id === addr.id ? (
                    <div className="space-y-3">
                      <input
                        placeholder="Street"
                        value={addrForm.street}
                        onChange={(e) =>
                          setAddrForm({ ...addrForm, street: e.target.value })
                        }
                        className={inputClass}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          placeholder="City"
                          value={addrForm.city}
                          onChange={(e) =>
                            setAddrForm({ ...addrForm, city: e.target.value })
                          }
                          className={inputClass}
                        />
                        <input
                          placeholder="State"
                          value={addrForm.state}
                          onChange={(e) =>
                            setAddrForm({ ...addrForm, state: e.target.value })
                          }
                          className={inputClass}
                        />
                      </div>
                      <input
                        placeholder="Pincode"
                        value={addrForm.pincode}
                        onChange={(e) =>
                          setAddrForm({ ...addrForm, pincode: e.target.value })
                        }
                        className={inputClass}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEditAddress}
                          className="px-4 py-2 bg-primary text-white rounded-xl text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingAddr(null);
                            setAddrForm({
                              street: "",
                              city: "",
                              state: "",
                              pincode: "",
                            });
                          }}
                          className="px-4 py-2 border rounded-xl text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-textDark">{addr.full}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditAddress(addr)}
                          className="text-sm text-primary hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-sm text-danger hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            {showAddAddr ? (
              <div className="mt-4 p-4 bg-surface rounded-xl space-y-3">
                <input
                  placeholder="Street"
                  value={addrForm.street}
                  onChange={(e) =>
                    setAddrForm({ ...addrForm, street: e.target.value })
                  }
                  className={inputClass}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="City"
                    value={addrForm.city}
                    onChange={(e) =>
                      setAddrForm({ ...addrForm, city: e.target.value })
                    }
                    className={inputClass}
                  />
                  <input
                    placeholder="State"
                    value={addrForm.state}
                    onChange={(e) =>
                      setAddrForm({ ...addrForm, state: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <input
                  placeholder="Pincode"
                  value={addrForm.pincode}
                  onChange={(e) =>
                    setAddrForm({ ...addrForm, pincode: e.target.value })
                  }
                  className={inputClass}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddAddress}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-sm"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddAddr(false);
                      setAddrForm({ street: "", city: "", state: "", pincode: "" });
                    }}
                    className="px-4 py-2 border rounded-xl text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddAddr(true)}
                className="mt-4 px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-surface"
              >
                + Add Address
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
