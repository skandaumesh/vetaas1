"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    highlightsUrl: "",
    registrationUrl: "",
    status: "upcoming"
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

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
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) {
      alert("Please fill in required fields.");
      return;
    }

    setUploading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        const storageRef = ref(storage, `events/${Date.now()}_${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(imageUrl);
            }
          );
        });
      }

      const eventData = {
        ...formData,
        image: imageUrl,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "events"), eventData);
      
      // Reset form
      setFormData({
        title: "",
        date: "",
        location: "",
        highlightsUrl: "",
        registrationUrl: "",
        status: "upcoming"
      });
      setImageFile(null);
      // reset file input visually
      const fileInput = document.getElementById('image') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      fetchEvents();
      alert("Event added successfully!");
    } catch (error) {
      console.error("Error adding event: ", error);
      alert("Failed to add event.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await deleteDoc(doc(db, "events", id));
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "upcoming" ? "completed" : "upcoming";
      await updateDoc(doc(db, "events", id), { status: newStatus });
      fetchEvents();
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[calc(var(--header-height)+3rem)] pb-20 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Form Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Event</h1>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CB0D8] outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CB0D8] outline-none" />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select id="status" name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CB0D8] outline-none">
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CB0D8] outline-none" placeholder="e.g. Virtual, JP Nagar" />
            </div>

            <div>
              <label htmlFor="highlightsUrl" className="block text-sm font-medium text-gray-700 mb-1">Highlights URL</label>
              <input type="url" id="highlightsUrl" name="highlightsUrl" value={formData.highlightsUrl} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CB0D8] outline-none" placeholder="https://..." />
            </div>

            <div>
              <label htmlFor="registrationUrl" className="block text-sm font-medium text-gray-700 mb-1">Registration URL (e.g. Google Form)</label>
              <input type="url" id="registrationUrl" name="registrationUrl" value={formData.registrationUrl} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CB0D8] outline-none" placeholder="https://..." />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
              <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0CB0D8]/10 file:text-[#0CB0D8] hover:file:bg-[#0CB0D8]/20" />
            </div>

            <button type="submit" disabled={uploading} className="w-full py-3 bg-[#0CB0D8] text-white rounded-lg font-semibold hover:bg-[#0aa0c5] transition-colors disabled:opacity-50">
              {uploading ? "Uploading & Saving..." : "Save Event"}
            </button>
          </form>
        </div>

        {/* List Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Events</h2>
          
          {loading ? (
            <p className="text-gray-500">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-500">No events found.</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="w-16 h-16 object-cover rounded-lg" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">No Img</div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {event.date} • {event.location}
                      {event.registrationUrl && (
                        <span className="block text-xs text-blue-500 font-medium mt-1 truncate">
                          Reg: {event.registrationUrl}
                        </span>
                      )}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${event.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {event.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button onClick={() => handleToggleStatus(event.id, event.status)} className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition">
                      Toggle Status
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="text-xs px-3 py-1 bg-red-50 hover:bg-red-100 rounded text-red-600 transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
