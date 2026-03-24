"use client";

import { useState } from "react";
import {
  Upload, Plus, Trash2, Save, Globe, Mail, Phone, MapPin,
  Star, Package, Video, Image, CheckCircle2, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const initProducts = [
  { id: 1, name: "SmartHub Pro X1", desc: "AI-powered IoT gateway for smart offices", price: "RM 1,299", category: "Hardware" },
  { id: 2, name: "ConnectOS Dashboard", desc: "Real-time device monitoring platform", price: "RM 89/mo", category: "Software" },
  { id: 3, name: "EdgeSense Kit", desc: "Sensor starter pack with 6-month warranty", price: "RM 449", category: "Hardware" },
];

type Tab = "info" | "products" | "media";

export default function BoothPage() {
  const [tab, setTab] = useState<Tab>("info");
  const [products, setProducts] = useState(initProducts);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    company: "TechGear Co.",
    tagline: "Smart solutions for smarter workspaces",
    bio: "TechGear Co. is a leading provider of IoT and smart office hardware and software solutions. We help businesses automate and modernize their workspaces.",
    website: "https://techgear.example.com",
    email: "sales@techgear.example.com",
    phone: "+60 3-1234 5678",
    boothNo: "B-14",
    hall: "Hall B",
    featured: true,
    visible: true,
    categories: ["Technology", "IoT", "Smart Office"],
  });

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function removeProduct(id: number) {
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">My Booth</h1>
          <p className="text-neutral-500 mt-0.5">Manage your booth profile, products, and media.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <ExternalLink className="w-4 h-4" /> Preview
          </Button>
          <Button className="gradient-primary text-white gap-2" onClick={save}>
            {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl w-fit">
        {(["info", "products", "media"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "text-sm font-medium px-4 py-2 rounded-lg capitalize transition-all",
              tab === t ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            {t === "info" ? "Booth Info" : t === "products" ? "Products" : "Media"}
          </button>
        ))}
      </div>

      {/* Booth Info */}
      {tab === "info" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Company Details</h2>

            {/* Banner / Logo */}
            <div className="mb-6">
              <div className="h-28 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center mb-3 relative group cursor-pointer hover:opacity-90 transition-opacity">
                <div className="text-center text-white">
                  <Upload className="w-6 h-6 mx-auto mb-1 opacity-80" />
                  <p className="text-sm font-medium opacity-80">Upload Banner</p>
                  <p className="text-xs opacity-60">1200 × 300px recommended</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center cursor-pointer hover:border-primary-400 transition-colors">
                  <Upload className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-700">Company Logo</p>
                  <p className="text-xs text-neutral-400">Square, min 256×256px</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label>Company Name</Label>
                <Input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Tagline</Label>
                <Input value={form.tagline} onChange={e => setForm(p => ({ ...p, tagline: e.target.value }))} placeholder="One-line pitch..." />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Bio / Description</Label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Website</Label>
                <Input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Contact Email</Label>
                <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</Label>
                <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Booth Location</Label>
                <div className="flex gap-2">
                  <Input value={form.hall} onChange={e => setForm(p => ({ ...p, hall: e.target.value }))} placeholder="Hall" className="w-28" />
                  <Input value={form.boothNo} onChange={e => setForm(p => ({ ...p, boothNo: e.target.value }))} placeholder="Booth #" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Visibility Settings</h2>
            {[
              { key: "visible", label: "Show Booth in Event Directory", desc: "Attendees can find and visit your booth page" },
              { key: "featured", label: "Request Featured Placement", desc: "Appear at the top of the exhibitor list (subject to organizer approval)" },
            ].map((s) => (
              <div key={s.key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900 text-sm">{s.label}</p>
                  <p className="text-xs text-neutral-400">{s.desc}</p>
                </div>
                <Switch
                  checked={form[s.key as "visible" | "featured"]}
                  onCheckedChange={v => setForm(p => ({ ...p, [s.key]: v }))}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {tab === "products" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button className="gradient-primary text-white gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </div>
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-neutral-900">{p.name}</p>
                    <p className="text-sm text-neutral-500 mt-0.5">{p.desc}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs bg-primary-50 text-primary-700 border border-primary-100 px-2 py-0.5 rounded-full">{p.category}</span>
                      <span className="text-sm font-bold text-neutral-900">{p.price}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-danger-500 hover:text-danger-700" onClick={() => removeProduct(p.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-neutral-100">
              <Package className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
              <p className="font-medium text-neutral-500">No products added yet</p>
            </div>
          )}
        </div>
      )}

      {/* Media */}
      {tab === "media" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
            <h2 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <Video className="w-4 h-4" /> Intro Video
            </h2>
            <div className="h-40 bg-neutral-100 rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary-400 transition-colors">
              <Video className="w-8 h-8 text-neutral-300" />
              <p className="text-sm font-medium text-neutral-500">Upload a 60-second intro video</p>
              <p className="text-xs text-neutral-400">MP4, up to 100MB</p>
              <Button variant="outline" size="sm" className="mt-1"><Upload className="w-4 h-4 mr-2" /> Choose File</Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
            <h2 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <Image className="w-4 h-4" /> Photo Gallery
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-neutral-100 rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center cursor-pointer hover:border-primary-400 transition-colors">
                  <Plus className="w-6 h-6 text-neutral-300" />
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-400 mt-3">Add up to 8 photos. PNG/JPG, max 5MB each.</p>
          </div>
        </div>
      )}
    </div>
  );
}
