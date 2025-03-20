
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ConnectionFormProps {
  onConnect: (connectionDetails: ConnectionDetails) => void;
  defaultValues?: ConnectionDetails | null;
}

export interface ConnectionDetails {
  server: string;
  database: string;
  authentication: "windows" | "sql";
  username?: string;
  password?: string;
}

const ConnectionForm: React.FC<ConnectionFormProps> = ({ onConnect, defaultValues }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails>({
    server: '',
    database: '',
    authentication: 'windows',
    username: '',
    password: '',
  });

  useEffect(() => {
    if (defaultValues) {
      setConnectionDetails(defaultValues);
    }
  }, [defaultValues]);

  const handleChange = (field: keyof ConnectionDetails, value: string) => {
    setConnectionDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connectionDetails.server || !connectionDetails.database) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (connectionDetails.authentication === 'sql' && 
        (!connectionDetails.username || !connectionDetails.password)) {
      toast.error("Username and password are required for SQL Server authentication");
      return;
    }

    setIsConnecting(true);
    
    try {
      // In a real implementation, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Connected successfully");
      onConnect(connectionDetails);
    } catch (error) {
      toast.error("Connection failed. Please check your details and try again.");
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-soft border-opacity-40 overflow-hidden transition-all duration-500 animate-scale-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Connect to Database</CardTitle>
          <CardDescription>
            Enter your SQL Server connection details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="server">Server</Label>
                <Input 
                  id="server"
                  placeholder="localhost\\SQLSERVER2022"
                  value={connectionDetails.server}
                  onChange={(e) => handleChange('server', e.target.value)}
                  className="transition-all duration-200"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="database">Database</Label>
                <Input 
                  id="database"
                  placeholder="master"
                  value={connectionDetails.database}
                  onChange={(e) => handleChange('database', e.target.value)}
                  className="transition-all duration-200"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="authentication">Authentication</Label>
                <Select 
                  value={connectionDetails.authentication}
                  onValueChange={(value) => handleChange('authentication', value as "windows" | "sql")}
                >
                  <SelectTrigger id="authentication">
                    <SelectValue placeholder="Select authentication method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="windows">Windows Authentication</SelectItem>
                    <SelectItem value="sql">SQL Server Authentication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {connectionDetails.authentication === 'sql' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username"
                      placeholder="sa"
                      value={connectionDetails.username}
                      onChange={(e) => handleChange('username', e.target.value)}
                      className="transition-all duration-200 animate-fade-in"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={connectionDetails.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="transition-all duration-200 animate-fade-in"
                      required
                    />
                  </div>
                </>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full group relative overflow-hidden"
            disabled={isConnecting}
            onClick={handleSubmit}
          >
            <span className="relative z-10">
              {isConnecting ? 'Connecting...' : 'Connect'}
            </span>
            <span className="absolute inset-0 bg-primary-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-soft-spring"></span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConnectionForm;
