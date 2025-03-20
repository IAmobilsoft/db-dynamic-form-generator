
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, PlusCircle, Trash2, Users } from 'lucide-react';
import { toast } from "sonner";
import Sidebar from '@/components/Sidebar';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

interface Profile {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const MOCK_USERS: User[] = [
  { id: 'u1', username: 'johndoe', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
  { id: 'u2', username: 'janedoe', name: 'Jane Doe', email: 'jane@example.com', role: 'Editor', status: 'active' },
  { id: 'u3', username: 'bobsmith', name: 'Bob Smith', email: 'bob@example.com', role: 'Viewer', status: 'inactive' },
];

const MOCK_PROFILES: Profile[] = [
  { id: 'p1', name: 'Administrator', description: 'Full system access', permissions: ['read', 'write', 'delete', 'admin'], userCount: 1 },
  { id: 'p2', name: 'Editor', description: 'Can edit but not delete', permissions: ['read', 'write'], userCount: 1 },
  { id: 'p3', name: 'Viewer', description: 'Read-only access', permissions: ['read'], userCount: 1 },
];

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
  
  const [newUser, setNewUser] = useState<Partial<User>>({
    username: '',
    name: '',
    email: '',
    role: 'Viewer',
    status: 'active',
  });
  
  const [newProfile, setNewProfile] = useState<Partial<Profile>>({
    name: '',
    description: '',
    permissions: [],
  });
  
  const handleAddUser = () => {
    if (!newUser.username || !newUser.name || !newUser.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const user: User = {
      id: `u${Date.now()}`,
      username: newUser.username!,
      name: newUser.name!,
      email: newUser.email!,
      role: newUser.role || 'Viewer',
      status: newUser.status as 'active' | 'inactive' || 'active',
    };
    
    setUsers([...users, user]);
    setNewUser({ username: '', name: '', email: '', role: 'Viewer', status: 'active' });
    toast.success("User added successfully");
  };
  
  const handleAddProfile = () => {
    if (!newProfile.name) {
      toast.error("Please enter a profile name");
      return;
    }
    
    const profile: Profile = {
      id: `p${Date.now()}`,
      name: newProfile.name!,
      description: newProfile.description || '',
      permissions: newProfile.permissions || [],
      userCount: 0,
    };
    
    setProfiles([...profiles, profile]);
    setNewProfile({ name: '', description: '', permissions: [] });
    toast.success("Profile added successfully");
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold">User Management</h1>
          </div>
          <p className="text-muted-foreground mt-1">Manage users and permission profiles</p>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="profiles">Profiles</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-6">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl">Add New User</CardTitle>
                  <CardDescription>Create a new user account with role-based permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        value={newUser.username} 
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={newUser.name} 
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={newUser.email} 
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select 
                        value={newUser.role} 
                        onValueChange={(value) => setNewUser({...newUser, role: value})}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Administrator</SelectItem>
                          <SelectItem value="Editor">Editor</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleAddUser}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </CardFooter>
              </Card>
              
              <h2 className="text-xl font-semibold mb-4">User Accounts</h2>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
            
            <TabsContent value="profiles" className="space-y-6">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl">Create Permission Profile</CardTitle>
                  <CardDescription>Define user roles and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="profileName">Profile Name</Label>
                      <Input 
                        id="profileName" 
                        value={newProfile.name} 
                        onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileDescription">Description</Label>
                      <Input 
                        id="profileDescription" 
                        value={newProfile.description} 
                        onChange={(e) => setNewProfile({...newProfile, description: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleAddProfile}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Profile
                  </Button>
                </CardFooter>
              </Card>
              
              <h2 className="text-xl font-semibold mb-4">Permission Profiles</h2>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profile Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">{profile.name}</TableCell>
                        <TableCell>{profile.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {profile.permissions.map((permission, i) => (
                              <span 
                                key={i}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{profile.userCount}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {profiles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No profiles found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
