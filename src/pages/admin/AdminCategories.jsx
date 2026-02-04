import { useState, useEffect } from "react";
import { getStorage, setStorage, STORAGE_KEYS } from "../../utils/storage";
import { generateId } from "../../utils/formatters";
import LoadingSpinner from "../../components/LoadingSpinner";

/**
 * Admin categories - Midnight Ivory theme
 */
const inputClass = "w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", slug: "", isActive: true });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const cats = getStorage(STORAGE_KEYS.CATEGORIES) || [];
    setCategories(cats);
    setLoading(false);
  };

  const openAdd = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", isActive: true });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-"),
      isActive: cat.isActive !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-");
    const catData = {
      id: editingCategory?.id || "cat_" + generateId(),
      name: formData.name,
      slug,
      isActive: formData.isActive,
    };

    const cats = getStorage(STORAGE_KEYS.CATEGORIES) || [];
    if (editingCategory) {
      const idx = cats.findIndex((c) => c.id === editingCategory.id);
      cats[idx] = catData;
    } else {
      cats.push(catData);
    }
    setStorage(STORAGE_KEYS.CATEGORIES, cats);
    loadData();
    setShowModal(false);
  };

  const deleteCategory = (id) => {
    if (window.confirm("Delete this category?")) {
      const cats = getStorage(STORAGE_KEYS.CATEGORIES) || [];
      setStorage(STORAGE_KEYS.CATEGORIES, cats.filter((c) => c.id !== id));
      loadData();
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-2xl font-semibold text-textDark">Categories</h1>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all"
        >
          Add Category
        </button>
      </div>

      <div className="bg-gradient-card rounded-xl shadow-card overflow-hidden border border-border/50">
        <table className="min-w-full">
          <thead className="bg-surface">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-surface/50 transition-colors">
                <td className="px-6 py-4 font-medium text-textDark">{cat.name}</td>
                <td className="px-6 py-4 text-muted">{cat.slug}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-xl text-xs font-medium ${
                      cat.isActive !== false ? "bg-success/10 text-success" : "bg-muted/20 text-muted"
                    }`}
                  >
                    {cat.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openEdit(cat)}
                    className="text-primary hover:underline mr-4 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="text-danger hover:underline font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-textDark/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-card rounded-xl max-w-md w-full border border-border shadow-softHover">
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="font-serif text-xl font-semibold text-textDark mb-4">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="catActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="catActive" className="text-sm text-textDark">Active</label>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all"
                >
                  {editingCategory ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border border-border rounded-xl hover:bg-surface transition-all"
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
