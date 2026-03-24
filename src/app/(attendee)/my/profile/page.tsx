import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Profile</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Manage your account details.</p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-5">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-primary-100 text-primary-700 text-xl font-bold">AH</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-neutral-900">Ahmad Hafiz</p>
            <p className="text-sm text-neutral-400">ahmad@example.com</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="border-neutral-200 text-xs">Change Photo</Button>
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-neutral-900">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-neutral-700">First Name</Label>
            <Input defaultValue="Ahmad" className="h-10 border-neutral-200" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-neutral-700">Last Name</Label>
            <Input defaultValue="Hafiz" className="h-10 border-neutral-200" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-neutral-700">Email Address</Label>
          <Input type="email" defaultValue="ahmad@example.com" className="h-10 border-neutral-200" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-neutral-700">Phone Number</Label>
          <Input type="tel" defaultValue="+60 12-345 6789" className="h-10 border-neutral-200" />
        </div>
        <Button className="gradient-primary text-white border-0 font-semibold">Save Changes</Button>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-neutral-900">Change Password</h3>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-neutral-700">Current Password</Label>
          <Input type="password" placeholder="••••••••" className="h-10 border-neutral-200" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-neutral-700">New Password</Label>
          <Input type="password" placeholder="••••••••" className="h-10 border-neutral-200" />
        </div>
        <Button variant="outline" className="border-neutral-200">Update Password</Button>
      </div>

      {/* Danger zone */}
      <div className="bg-danger-50 border border-danger-100 rounded-2xl p-5">
        <h3 className="font-semibold text-danger-700 mb-1">Delete Account</h3>
        <p className="text-sm text-danger-600/80 mb-3">Permanently delete your account and all associated data. This cannot be undone.</p>
        <Button size="sm" variant="outline" className="border-danger-200 text-danger-600 hover:bg-danger-100 text-xs">
          Delete My Account
        </Button>
      </div>
    </div>
  );
}
