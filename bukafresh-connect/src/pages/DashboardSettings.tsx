import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Bell, 
  Shield,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { mockAddresses } from '@/data/mockUser';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const DashboardSettings = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('profile');
  
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [notifications, setNotifications] = useState({
    deliveryUpdates: true,
    promotions: false,
    weeklyNewsletter: true,
    smsAlerts: true,
  });

  const handleProfileSave = async () => {
    await updateProfile(profile);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Navigation */}
          <nav className="lg:w-64 shrink-0">
            <div className="bg-card rounded-xl border border-border p-2 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1">
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
                  <p className="text-sm text-muted-foreground">Update your personal details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Button variant="hero" onClick={handleProfileSave}>
                  Save Changes
                </Button>
              </div>
            )}

            {/* Addresses Section */}
            {activeSection === 'addresses' && (
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Delivery Addresses</h2>
                    <p className="text-sm text-muted-foreground">Manage your delivery locations</p>
                  </div>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockAddresses.map((address) => (
                    <div 
                      key={address.id}
                      className={cn(
                        "p-4 rounded-xl border flex items-start justify-between",
                        address.isDefault ? "border-primary bg-primary/5" : "border-border"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{address.label}</p>
                            {address.isDefault && (
                              <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {address.street}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.city}, {address.state}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Section */}
            {activeSection === 'payment' && (
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Payment Method</h2>
                  <p className="text-sm text-muted-foreground">Manage your payment preferences</p>
                </div>

                <div className="p-4 rounded-xl border border-primary bg-primary/5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Direct Debit</p>
                        <p className="text-sm text-muted-foreground">GTBank ****4567</p>
                        <p className="text-xs text-muted-foreground">John Doe</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span className="text-sm text-primary font-medium">Active</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">
                    Your bank account is set up for automatic monthly debits. 
                    To change your payment method, please contact support via WhatsApp.
                  </p>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
                  <p className="text-sm text-muted-foreground">Choose what updates you receive</p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'deliveryUpdates', label: 'Delivery Updates', description: 'Get notified about your delivery status' },
                    { key: 'promotions', label: 'Promotions & Offers', description: 'Receive special offers and discounts' },
                    { key: 'weeklyNewsletter', label: 'Weekly Newsletter', description: 'Recipe ideas and grocery tips' },
                    { key: 'smsAlerts', label: 'SMS Alerts', description: 'Important updates via SMS' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, [item.key]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
                  <p className="text-sm text-muted-foreground">Manage your account security</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-border flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Change Password</p>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline">
                      Change
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  <div className="p-4 rounded-xl border border-border flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">
                      Enable
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-destructive">Delete Account</p>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                      </div>
                      <Button variant="outline" className="text-destructive hover:text-destructive">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardSettings;
