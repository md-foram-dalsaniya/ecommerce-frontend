import { useState, useEffect } from "react";
import { getStorage, setStorage, STORAGE_KEYS } from "../../utils/storage";
import { generateId } from "../../utils/formatters";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Ctext fill='%239ca3af' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

const inputClass =
  "w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    categoryId: "",
    stock: "",
    isActive: true,
    images: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const prods = getStorage(STORAGE_KEYS.PRODUCTS) || [];
    const cats = getStorage(STORAGE_KEYS.CATEGORIES) || [];
    setProducts(prods);
    setCategories(cats.filter((c) => c.isActive));
    setLoading(false);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      categoryId: categories[0]?.id || "",
      stock: "",
      isActive: true,
      images: [PLACEHOLDER_IMAGE],
    });
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      originalPrice: (product.originalPrice || product.price).toString(),
      categoryId: product.categoryId || "",
      stock: product.stock.toString(),
      isActive: product.isActive !== false,
      images: product.images?.length ? product.images : [PLACEHOLDER_IMAGE],
    });
    setShowModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => {
        const current = prev.images || [];
        const withoutPlaceholder = current.filter((i) => i !== PLACEHOLDER_IMAGE);
        const newImages =
          withoutPlaceholder.length > 0 ? [...withoutPlaceholder, reader.result] : [reader.result];
        return { ...prev, images: newImages };
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === formData.categoryId);
    const productData = {
      id: editingProduct?.id || "prod_" + generateId(),
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice) || Number(formData.price),
      category: cat?.name || "",
      categoryId: formData.categoryId,
      images: formData.images.length ? formData.images : [PLACEHOLDER_IMAGE],
      stock: Number(formData.stock) || 0,
      isActive: formData.isActive,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
    };

    const prods = getStorage(STORAGE_KEYS.PRODUCTS) || [];
    if (editingProduct) {
      const idx = prods.findIndex((p) => p.id === editingProduct.id);
      prods[idx] = productData;
    } else {
      prods.push(productData);
    }
    setStorage(STORAGE_KEYS.PRODUCTS, prods);
    loadData();
    setShowModal(false);
  };

  const deleteProduct = (id) => {
    if (window.confirm("Delete this product?")) {
      const prods = getStorage(STORAGE_KEYS.PRODUCTS) || [];
      setStorage(STORAGE_KEYS.PRODUCTS, prods.filter((p) => p.id !== id));
      loadData();
    }
  };

  const toggleActive = (product) => {
    const prods = getStorage(STORAGE_KEYS.PRODUCTS) || [];
    const updated = prods.map((p) =>
      p.id === product.id ? { ...p, isActive: !p.isActive } : p
    );
    setStorage(STORAGE_KEYS.PRODUCTS, updated);
    loadData();
  };

  if (loading)
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 rounded animate-skeleton" />
        <div className="h-64 rounded-xl animate-skeleton" />
      </div>
    );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="font-serif text-2xl font-semibold text-textDark">
          Products
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`flex-1 sm:w-48 ${inputClass}`}
          />
          <button
            onClick={openAdd}
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-gradient-card rounded-xl shadow-card overflow-hidden border border-border/50">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-surface">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-surface/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={product.images?.[0] || PLACEHOLDER_IMAGE}
                      alt=""
                      className="w-12 h-12 object-cover rounded-xl"
                    />
                    <span className="font-medium text-textDark">{product.name}</span>
                  </td>
                  <td className="px-6 py-4 text-muted">{product.category}</td>
                  <td className="px-6 py-4 text-textDark">₹{product.price}</td>
                  <td className="px-6 py-4 text-textDark">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-xl text-xs font-medium ${product.isActive
                          ? "bg-success/10 text-success"
                          : "bg-muted/20 text-muted"
                        }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleActive(product)}
                      className="text-primary hover:underline mr-4 text-sm"
                    >
                      {product.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => openEdit(product)}
                      className="text-primary hover:underline mr-4 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="text-danger hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-textDark/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-softHover">
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="font-serif text-xl font-semibold text-textDark mb-4">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className={inputClass}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-textDark mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textDark mb-1">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, originalPrice: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-textDark mb-1">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                      className={inputClass}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textDark mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-sm"
                  />
                  {formData.images?.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {formData.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt=""
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                  <label htmlFor="isActive" className="text-sm text-textDark">
                    Active
                  </label>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
                >
                  {editingProduct ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border border-border rounded-xl hover:bg-surface"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
