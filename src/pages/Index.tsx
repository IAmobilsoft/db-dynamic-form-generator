
import React, { useState } from 'react';
import ConnectionForm, { ConnectionDetails } from '@/components/ConnectionForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | null>(null);
  
  const handleConnect = (details: ConnectionDetails) => {
    setConnectionDetails(details);
    setIsConnected(true);
  };
  
  const handleDisconnect = () => {
    setConnectionDetails(null);
    setIsConnected(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {!isConnected ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">DB Dynamic Form Generator</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Connect to your SQL Server database and generate dynamic forms based on your database structure.
            </p>
          </div>
          <ConnectionForm onConnect={handleConnect} />
        </div>
      ) : (
        connectionDetails && <Dashboard 
          connectionDetails={connectionDetails} 
          onDisconnect={handleDisconnect} 
        />
      )}
    </div>
  );
};

export default Index;
