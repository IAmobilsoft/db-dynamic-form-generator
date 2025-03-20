
import React, { useState } from 'react';
import ConnectionForm, { ConnectionDetails } from '@/components/ConnectionForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | null>({
    server: '145.223.75.189,1433',
    database: 'Mobilpos',
    authentication: 'sql',
    username: 'sa',
    password: 'D3v3l0p3r2024$'
  });
  
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
          <ConnectionForm onConnect={handleConnect} defaultValues={connectionDetails} />
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
