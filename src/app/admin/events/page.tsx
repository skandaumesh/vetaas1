"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  LogOut, 
  Lock, 
  Mail, 
  Loader2, 
  Sparkles, 
  AlertCircle, 
  X,
  PlusCircle,
  Calendar,
  MapPin,
  Link2,
  Image as ImageIcon,
  ExternalLink,
  Trash2,
  Edit2,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

export default function AdminEventsPage() {
  // Authentication states
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Events & logic states
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    endDate: "",
    timeSlot: "",
    location: "",
    highlightsUrl: "",
    registrationUrl: "",
    manualImageUrl: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Custom alert/toast states
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Custom confirmation modal states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Custom highlights editing state
  const [editingHighlightsId, setEditingHighlightsId] = useState<string | null>(null);

  // Monitor Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch events only if authenticated
  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter both email and password.", "error");
      return;
    }
    setLoggingIn(true);
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast("Welcome back, Administrator!", "success");
    } catch (err: any) {
      console.error("Login error: ", err);
      let friendlyMessage = "Invalid credentials. Please try again.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        friendlyMessage = "Incorrect email or password.";
      } else if (err.code === "auth/too-many-requests") {
        friendlyMessage = "Too many failed attempts. Try again later.";
      }
      setLoginError(friendlyMessage);
      showToast(friendlyMessage, "error");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast("Signed out successfully.", "info");
    } catch (err) {
      console.error("Logout error: ", err);
      showToast("Failed to sign out.", "error");
    }
  };

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by date descending
      eventsData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events: ", error);
      showToast("Failed to fetch events list.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) {
      showToast("Please fill in required fields.", "error");
      return;
    }

    setUploading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        // Since Firebase Storage is blocked, we will compress the image and convert it to Base64 
        // to store it directly in Firestore (limit is 1MB per document).
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(imageFile);
          reader.onload = (event) => {
            const img = new window.Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const MAX_WIDTH = 800;
              const MAX_HEIGHT = 800;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                // Compress to 70% quality JPEG to ensure it fits well under Firestore's 1MB limit
                const base64Url = canvas.toDataURL("image/jpeg", 0.7);
                resolve(base64Url);
              } else {
                resolve(event.target?.result as string);
              }
            };
            img.onerror = (err) => reject(err);
          };
          reader.onerror = (err) => reject(err);
        });
      } else if (formData.manualImageUrl) {
        imageUrl = formData.manualImageUrl;
      }

      const getComputedStatus = (startDate: string, endDateStr?: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = endDateStr || startDate;
        if (!checkDate) return "upcoming";
        try {
          const eventDate = new Date(checkDate);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate < today ? "completed" : "upcoming";
        } catch {
          return "upcoming";
        }
      };

      const computedStatus = getComputedStatus(formData.date, formData.endDate);

      const eventData: any = {
        title: formData.title,
        date: formData.date,
        endDate: formData.endDate || "",
        timeSlot: formData.timeSlot || "",
        location: formData.location,
        highlightsUrl: formData.highlightsUrl,
        registrationUrl: formData.registrationUrl,
        status: computedStatus,
      };

      if (imageUrl) {
        eventData.image = imageUrl;
      }

      if (editingEventId) {
        // Update existing event
        await updateDoc(doc(db, "events", editingEventId), eventData);
        showToast("Event updated successfully!", "success");
      } else {
        // Create new event
        eventData.createdAt = new Date().toISOString();
        if (!imageUrl) eventData.image = ""; // Default empty string for new events without image
        await addDoc(collection(db, "events"), eventData);
        showToast("Event added successfully!", "success");
      }
      
      // Reset form
      setFormData({
        title: "",
        date: "",
        endDate: "",
        timeSlot: "",
        location: "",
        highlightsUrl: "",
        registrationUrl: "",
        manualImageUrl: ""
      });
      setEditingEventId(null);
      setImageFile(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      // reset file input visually
      const fileInput = document.getElementById('image') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      fetchEvents();
      showToast("Event added successfully!", "success");
    } catch (error: any) {
      console.error("Error adding event: ", error);
      showToast(`Failed to add event: ${error.message || "Unknown error"}`, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleEditClick = (event: any) => {
    setEditingEventId(event.id);
    setFormData({
      title: event.title || "",
      date: event.date || "",
      endDate: event.endDate || "",
      timeSlot: event.timeSlot || "",
      location: event.location || "",
      highlightsUrl: event.highlightsUrl || "",
      registrationUrl: event.registrationUrl || "",
      manualImageUrl: event.image || ""
    });
    if (event.image) {
      setImagePreview(event.image);
    } else {
      setImagePreview(null);
    }
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    
    try {
      await deleteDoc(doc(db, "events", deleteConfirmId));
      fetchEvents();
      showToast("Event deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting event: ", error);
      showToast("Failed to delete event.", "error");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Automated status update handles completion status based on current date

  const handleUpdateHighlights = async (id: string, highlightsUrl: string) => {
    try {
      await updateDoc(doc(db, "events", id), { highlightsUrl });
      fetchEvents();
      showToast("Highlights Reel URL updated successfully!", "success");
    } catch (error) {
      console.error("Error updating highlights: ", error);
      showToast("Failed to update highlights URL.", "error");
    }
  };

  // Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center pt-[var(--header-height)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#00CDBA] animate-spin" />
          <p className="text-gray-500 font-semibold animate-pulse">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated Login Panel
  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center py-12 px-6 pt-[calc(var(--header-height)+2rem)] relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#00CDBA]/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FF5C7A]/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-[#00CDBA]/15 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#00CDBA] to-[#FF5C7A]" />
          
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-20 h-20 mb-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex items-center justify-center">
              <Image
                src="/logo.webp"
                alt="Vetaas Logo"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 font-headline">Admin Portal</h2>
            <p className="text-gray-500 text-sm mt-1 text-center font-body">
              Please sign in to manage events & highlights
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-600 font-medium leading-relaxed">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-headline">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00CDBA] focus:border-[#00CDBA] outline-none text-sm transition"
                  placeholder="admin@vetaas.org"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 font-headline">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00CDBA] focus:border-[#00CDBA] outline-none text-sm transition animate-pulse-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 bg-[#00CDBA] hover:bg-[#00b0a0] text-white rounded-xl font-bold transition shadow-lg shadow-[#00CDBA]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:-translate-y-0.5 duration-200"
            >
              {loggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Toast Container Layer */}
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="pointer-events-auto"
              >
                <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-lg border backdrop-blur-md ${
                  toast.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                    : toast.type === "error"
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-600"
                    : "bg-blue-500/10 border-blue-500/20 text-blue-600"
                }`}>
                  {toast.type === "success" && <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />}
                  {toast.type === "error" && <XCircle className="w-5 h-5 shrink-0 text-rose-500" />}
                  {toast.type === "info" && <AlertCircle className="w-5 h-5 shrink-0 text-blue-500" />}
                  
                  <p className="text-sm font-semibold flex-1 leading-snug">{toast.message}</p>
                  
                  <button
                    onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                    className="text-gray-400 hover:text-gray-600 transition shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Authenticated Admin Panel
  return (
    <div className="min-h-screen bg-[#faf9f7] pt-[calc(var(--header-height)+3rem)] pb-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#00CDBA]/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[#FF5C7A]/5 blur-[130px] pointer-events-none -z-10" />

      {/* Toast Notification Layer */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="pointer-events-auto"
            >
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-lg border backdrop-blur-md ${
                toast.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                  : toast.type === "error"
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-600"
                  : "bg-blue-500/10 border-blue-500/20 text-blue-600"
              }`}>
                {toast.type === "success" && <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />}
                {toast.type === "error" && <XCircle className="w-5 h-5 shrink-0 text-rose-500" />}
                {toast.type === "info" && <AlertCircle className="w-5 h-5 shrink-0 text-blue-500" />}
                
                <p className="text-sm font-semibold flex-1 leading-snug">{toast.message}</p>
                
                <button
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="text-gray-400 hover:text-gray-600 transition shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-white rounded-3xl shadow-xl border border-slate-100 p-6 w-full max-w-md overflow-hidden z-10"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4 relative">
                  <span className="absolute inset-0 rounded-full bg-rose-400/20 animate-ping opacity-75" />
                  <AlertTriangle className="w-7 h-7 relative z-10" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-headline">Delete Event?</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed font-body">
                  Are you sure you want to delete this event? This action is permanent and cannot be undone.
                </p>
                
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition duration-200 cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 py-3 px-4 bg-[#FF5C7A] hover:bg-[#e04b68] text-white font-semibold rounded-xl shadow-lg shadow-rose-600/20 transition duration-200 cursor-pointer text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        
        {/* Admin Dashboard Subheader */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#00CDBA]/10 pb-6 mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight font-headline">Events Dashboard</h1>
            <p className="text-gray-500 mt-1.5 font-body text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00CDBA] inline-block animate-pulse" />
              Authenticated as <span className="font-semibold text-gray-700">{user.email}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#FF5C7A]/25 text-[#FF5C7A] hover:bg-[#FF5C7A] hover:text-white rounded-2xl text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Form Section */}
          <div className="lg:col-span-5 bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#00CDBA]/15 shadow-[0_10px_30px_rgba(54,186,152,0.04)] h-fit lg:sticky lg:top-28">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900 font-headline flex items-center gap-2 text-[#00CDBA]">
                {editingEventId ? <Edit2 className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />} 
                {editingEventId ? "Edit Event" : "Add New Event"}
              </h2>
              {editingEventId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingEventId(null);
                    setFormData({
                      title: "", date: "", endDate: "", timeSlot: "", location: "", highlightsUrl: "", registrationUrl: "", manualImageUrl: ""
                    });
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="text-xs font-bold text-gray-500 hover:text-rose-500 transition-colors uppercase tracking-wider bg-gray-100 px-3 py-1.5 rounded-full"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 font-body">
              <div>
                <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-headline">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00CDBA] focus:border-[#00CDBA] outline-none text-sm transition-all duration-200 bg-white"
                  placeholder="e.g. Creative Play Workshop"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-headline">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00CDBA] focus:border-[#00CDBA] outline-none text-sm transition-all duration-200 bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-headline">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00CDBA] focus:border-[#00CDBA] outline-none text-sm transition-all duration-200 bg-white"
                  />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider -mt-2">
                Note: Status calculates automatically (marks completed when event dates pass).
              </p>

              <div>
                <label htmlFor="timeSlot" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-headline">
                  Time Slot (Optional)
                </label>
                <input
                  type="text"
                  id="timeSlot"
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00CDBA] focus:border-[#00CDBA] outline-none text-sm transition-all duration-200 bg-white"
                  placeholder="e.g. 10:00 AM - 1:00 PM"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-headline">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00CDBA] focus:border-[#00CDBA] outline-none text-sm transition-all duration-200 bg-white"
                  placeholder="e.g. Virtual, Bengaluru Central"
                />
              </div>

              <div>
                <label htmlFor="registrationUrl" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-headline">
                  Registration Link or Luma URL (Optional)
                </label>
                <input
                  type="text"
                  id="registrationUrl"
                  name="registrationUrl"
                  value={formData.registrationUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00CDBA] focus:border-[#00CDBA] outline-none text-sm transition-all duration-200 bg-white"
                  placeholder="e.g. https://forms.gle/... or Luma link"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5 font-headline">
                  Event Thumbnail Image (Optional)
                </label>
                
                <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <div className="w-full">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#00CDBA]/10 file:text-[#00CDBA] hover:file:bg-[#00CDBA]/20 cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-400 font-medium mt-2">Images compress dynamically and store instantly.</p>
                  </div>
                </div>
                
                <AnimatePresence>
                  {imagePreview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video group">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              if (imagePreview) {
                                URL.revokeObjectURL(imagePreview);
                                setImagePreview(null);
                              }
                              const fileInput = document.getElementById('image') as HTMLInputElement;
                              if (fileInput) fileInput.value = '';
                            }}
                            className="p-2.5 bg-[#FF5C7A] hover:bg-[#e04b68] text-white rounded-full transition shadow-lg flex items-center justify-center cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3.5 bg-[#00CDBA] hover:bg-[#00b0a0] text-white rounded-xl font-bold transition shadow-lg shadow-[#00CDBA]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:-translate-y-0.5 duration-200 text-sm mt-3"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Event...
                  </>
                ) : (
                  editingEventId ? "Update Event" : "Save Event"
                )}
              </button>
            </form>
          </div>

          {/* List Section */}
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-black text-gray-900 mb-6 font-headline flex items-center gap-2 text-[#FF5C7A]">
              <Calendar className="w-6 h-6" /> Manage Events
            </h2>
            
            {loading ? (
              <div className="flex items-center gap-2 text-gray-500 font-body py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#00CDBA]" />
                <span className="font-semibold">Loading events list...</span>
              </div>
            ) : events.length === 0 ? (
              <p className="text-gray-500 font-body py-8 text-center bg-white/60 rounded-3xl border border-dashed border-slate-200">
                No events found. Add your first event on the left!
              </p>
            ) : (
              <div className="space-y-4 font-body">
                {events.map((event) => {
                  const isPast = (() => {
                    if (!event.date) return true;
                    try {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const checkDate = event.endDate || event.date;
                      const eventDate = new Date(checkDate);
                      eventDate.setHours(0, 0, 0, 0);
                      return eventDate < today;
                    } catch {
                      return false;
                    }
                  })();
                  const computedStatus = isPast ? "completed" : "upcoming";

                  return (
                    <div
                      key={event.id}
                      className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-100 p-5 shadow-[0_4px_15px_rgba(0,0,0,0.015)] hover:shadow-md hover:border-[#00CDBA]/25 transition-all duration-300 relative overflow-hidden flex flex-col gap-4 group"
                    >
                      {/* Left indicator tag */}
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${
                        computedStatus === 'completed' ? 'bg-[#FF5C7A]' : 'bg-[#00CDBA]'
                      }`} />

                      <div className="flex gap-4 items-start pl-2">
                        {event.image ? (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gray-50 border border-slate-100 flex items-center justify-center text-gray-400 shrink-0">
                            <Calendar size={20} className="text-gray-300" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <h3 className="font-bold text-gray-900 text-base truncate flex-1 min-w-[120px] font-headline">
                              {event.title}
                            </h3>
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full leading-none shrink-0 ${
                              computedStatus === 'completed'
                                ? 'bg-[#FF5C7A]/10 text-[#FF5C7A]'
                                : 'bg-[#00CDBA]/10 text-[#2a9d7e]'
                            }`}>
                              {computedStatus}
                            </span>
                          </div>
                          
                          <div className="flex flex-col gap-1 text-[11px] text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={11} className="text-gray-400 shrink-0" />
                              <span>{event.date}{event.endDate ? ` - ${event.endDate}` : ""}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin size={11} className="text-gray-400 shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </span>
                            {event.registrationUrl && (
                              <span className="flex items-center gap-1.5 text-blue-500">
                                <Link2 size={11} className="text-blue-400 shrink-0" />
                                <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
                                  {event.registrationUrl}
                                </a>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Highlights / Reel Management block */}
                      {computedStatus === "completed" && (
                        <div className="mt-1 pl-2 border-t border-slate-100/80 pt-3">
                          {event.highlightsUrl && editingHighlightsId !== event.id ? (
                            <div className="flex items-center justify-between gap-3 bg-[#FF5C7A]/5 border border-[#FF5C7A]/10 rounded-2xl p-3">
                              <div className="flex-1 min-w-0">
                                <span className="text-[9px] font-black uppercase tracking-wider text-[#FF5C7A] block mb-0.5">Highlights Reel / Link</span>
                                <a
                                  href={event.highlightsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-bold truncate block"
                                >
                                  {event.highlightsUrl}
                                </a>
                              </div>
                              <button
                                onClick={() => setEditingHighlightsId(event.id)}
                                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-white border border-[#FF5C7A]/20 hover:bg-[#FF5C7A]/10 text-[#FF5C7A] rounded-xl transition cursor-pointer shrink-0"
                              >
                                <Edit2 size={10} /> Edit
                              </button>
                            </div>
                          ) : (
                            <div className="bg-[#faf9f7] border border-slate-200/60 rounded-2xl p-3 flex flex-col gap-2">
                              <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 block">Reel / Highlights URL</span>
                              <div className="flex items-center gap-2">
                                <input
                                  type="url"
                                  placeholder="Instagram Reel or YouTube Link"
                                  defaultValue={event.highlightsUrl || ""}
                                  id={`highlights-input-${event.id}`}
                                  className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00CDBA] outline-none bg-white"
                                />
                                <div className="flex gap-1 shrink-0">
                                  <button
                                    onClick={async () => {
                                      const val = (document.getElementById(`highlights-input-${event.id}`) as HTMLInputElement)?.value || "";
                                      await handleUpdateHighlights(event.id, val);
                                      setEditingHighlightsId(null);
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest px-3 py-2 bg-[#00CDBA] hover:bg-[#00b0a0] text-white rounded-xl transition cursor-pointer"
                                  >
                                    Save
                                  </button>
                                  {event.highlightsUrl && (
                                    <button
                                      onClick={() => setEditingHighlightsId(null)}
                                      className="text-[10px] font-black uppercase tracking-widest px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions row */}
                      <div className="flex justify-end gap-2 border-t border-slate-100/80 pt-3 pr-2 pl-2">
                          <div className="flex items-center gap-2 mt-4 ml-auto">
                            <button
                              onClick={() => handleEditClick(event)}
                              className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-xl transition duration-200 shadow-sm flex items-center justify-center cursor-pointer"
                              title="Edit Event"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(event.id)}
                              className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl transition duration-200 shadow-sm flex items-center justify-center cursor-pointer"
                              title="Delete Event"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

