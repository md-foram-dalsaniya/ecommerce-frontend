import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getStorage, setStorage, STORAGE_KEYS } from "../../utils/storage";
import PriceDisplay from "../../components/PriceDisplay";

const SHIPPING_CHARGE = 50;
const TAX_RATE = 0.05;

const STEPS = [
  { id: 1, label: "Address" },
  { id: 2, label: "Summary" },
  { id: 3, label: "Confirm" },
];

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, addAddress, editAddress, deleteAddress } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const addresses = user?.addresses || [];
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [step, setStep] = useState(1);
  const [editingAddr, setEditingAddr] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (addresses.length && !selectedAddress) {
      setSelectedAddress(addresses[0].id);
    }
  }, [addresses.length]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : SHIPPING_CHARGE;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const addNewAddress = () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      addToast("Please fill all address fields", "error");
      return;
    }
    const addr = addAddress(newAddress);
    if (addr) {
      setSelectedAddress(addr.id);
      setNewAddress({ street: "", city: "", state: "", pincode: "" });
      addToast("Address added");
    }
  };

  const handleEditAddress = (addr) => {
    setEditingAddr(addr);
    if (addr.street && addr.city) {
      setNewAddress({
        street: addr.street || "",
        city: addr.city || "",
        state: addr.state || "",
        pincode: addr.pincode || "",
      });
    } else if (addr.full) {
      const parts = addr.full.split(", ");
      const last = parts[parts.length - 1] || "";
      const [statePincode] = last.split(" - ");
      setNewAddress({
        street: parts[0] || "",
        city: parts[1] || "",
        state: statePincode || "",
        pincode: last.split(" - ")[1] || "",
      });
    } else {
      setNewAddress({ street: "", city: "", state: "", pincode: "" });
    }
  };

  const saveEditAddress = () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      addToast("Please fill all fields", "error");
      return;
    }
    editAddress(editingAddr.id, { ...newAddress, full: `${newAddress.street}, ${newAddress.city}, ${newAddress.state} - ${newAddress.pincode}` });
    setEditingAddr(null);
    setNewAddress({ street: "", city: "", state: "", pincode: "" });
    addToast("Address updated");
  };

  const handleDeleteAddress = (addrId) => {
    deleteAddress(addrId);
    const remaining = addresses.filter((a) => a.id !== addrId);
    if (selectedAddress === addrId) setSelectedAddress(remaining[0]?.id);
    addToast("Address removed");
  };

  const handlePlaceOrder = () => {
    const address = addresses.find((a) => a.id === selectedAddress) || addresses[0];
    if (!address) {
      addToast("Please add/select a delivery address", "error");
      return;
    }

    const order = {
      id: "ORD_" + Date.now(),
      userId: user.id,
      items: cartItems,
      subtotal,
      shipping,
      tax,
      total,
      address: address.full,
      status: "Placed",
      paymentMethod: "COD",
      createdAt: new Date().toISOString(),
    };

    const orders = getStorage(STORAGE_KEYS.ORDERS) || [];
    orders.unshift(order);
    setStorage(STORAGE_KEYS.ORDERS, orders);
    clearCart();
    addToast("Order placed successfully!");
    navigate(`/order-success/${order.id}`);
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const inputClass = "w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background";

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-2xl font-semibold text-textDark mb-2">
          Checkout
        </h1>
        <div className="h-px w-16 bg-gold mb-8" />

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => setStep(s.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${step >= s.id ? "bg-primary text-white" : "bg-surface text-muted"
                  }`}
              >
                {s.label}
              </button>
              {i < STEPS.length - 1 && (
                <span className="mx-2 text-muted">→</span>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <div className="bg-gradient-card rounded-xl shadow-card p-6 border border-border/50">
                <h2 className="font-serif font-semibold text-lg text-textDark mb-4">
                  Delivery Address
                </h2>
                {addresses.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-4 rounded-xl border transition-all ${selectedAddress === addr.id
                            ? "border-gold bg-gold/5"
                            : "border-border"
                          }`}
                      >
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddress === addr.id}
                            onChange={() => setSelectedAddress(addr.id)}
                            className="mt-1"
                          />
                          <span className="text-sm text-textDark flex-1">
                            {addr.full}
                          </span>
                        </label>
                        <div className="flex gap-2 mt-2 ml-6">
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
                      </div>
                    ))}
                  </div>
                )}
                {editingAddr ? (
                  <div className="space-y-3 p-4 bg-surface rounded-xl">
                    <input
                      placeholder="Street"
                      value={newAddress.street}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, street: e.target.value })
                      }
                      className={inputClass}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        className={inputClass}
                      />
                      <input
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, state: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <input
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, pincode: e.target.value })
                      }
                      className={inputClass}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEditAddress}
                        className="px-4 py-2 bg-primary text-white rounded-xl text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingAddr(null);
                          setNewAddress({ street: "", city: "", state: "", pincode: "" });
                        }}
                        className="px-4 py-2 border border-border rounded-xl text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-border pt-4">
                    <h3 className="font-medium text-textDark mb-2">Add New Address</h3>
                    <div className="space-y-3">
                      <input
                        placeholder="Street"
                        value={newAddress.street}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, street: e.target.value })
                        }
                        className={inputClass}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, city: e.target.value })
                          }
                          className={inputClass}
                        />
                        <input
                          placeholder="State"
                          value={newAddress.state}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, state: e.target.value })
                          }
                          className={inputClass}
                        />
                      </div>
                      <input
                        placeholder="Pincode"
                        value={newAddress.pincode}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, pincode: e.target.value })
                        }
                        className={inputClass}
                      />
                      <button
                        onClick={addNewAddress}
                        className="px-4 py-2 bg-primary text-white rounded-xl text-sm hover:bg-primary/90"
                      >
                        Add Address
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="bg-gradient-card rounded-xl shadow-card p-6 border border-border/50">
                <h2 className="font-serif font-semibold text-lg text-textDark mb-4">
                  Order Summary
                </h2>
                <p className="text-muted text-sm mb-2">
                  Delivery to:
                </p>
                <p className="text-textDark font-medium mb-4">
                  {addresses.find((a) => a.id === selectedAddress)?.full || "—"}
                </p>
                <p className="text-sm text-muted">
                  Review your order in the summary panel and click Continue to confirm.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="bg-gradient-card rounded-xl shadow-card p-6 border border-border/50">
                <h2 className="font-serif font-semibold text-lg text-textDark mb-4">
                  Confirm Order
                </h2>
                <p className="text-muted text-sm mb-2">Delivery to:</p>
                <p className="text-textDark font-medium mb-4">
                  {addresses.find((a) => a.id === selectedAddress)?.full || "—"}
                </p>
                <p className="text-sm text-muted">
                  Payment: Cash on Delivery (COD). Click Place Order to complete.
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="bg-gradient-card rounded-xl shadow-card p-6 sticky top-24 border border-border/50">
              <h2 className="font-serif font-semibold text-lg text-textDark mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-textDark"
                  >
                    <span className="truncate flex-1">
                      {item.name} × {item.quantity}
                    </span>
                    <span>
                      <PriceDisplay amount={item.price * item.quantity} />
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span><PriceDisplay amount={subtotal} /></span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span>{shipping === 0 ? "Free" : <PriceDisplay amount={shipping} />}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Tax (5%)</span>
                  <span><PriceDisplay amount={tax} /></span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 p-2 bg-gold/10 rounded-xl">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm font-medium">Cash on Delivery (COD)</span>
              </div>
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex justify-between font-bold text-lg text-textDark">
                  <span>Total</span>
                  <span className="text-primary">
                    <PriceDisplay amount={total} />
                  </span>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 && (!selectedAddress || addresses.length === 0)}
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
                  >
                    Place Order
                  </button>
                )}
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-3 border border-border rounded-xl hover:bg-surface"
                  >
                    Back
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
