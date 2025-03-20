import React, { useState, useEffect } from 'react';
import { ConnectionDetails } from './ConnectionForm';
import Sidebar from './Sidebar';
import DataDictionary from './DataDictionary';
import TableStructure from './TableStructure';
import DynamicFormGenerator, { FormConfig } from './DynamicFormGenerator';
import { useToast } from "@/components/ui/use-toast";
import { getTables, getTableStructure } from '@/utils/databaseUtils';
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardProps {
  connectionDetails: ConnectionDetails;
  onDisconnect: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ connectionDetails, onDisconnect }) => {
  const [tableStructureOpen, setTableStructureOpen] = useState(false);
  const [formGeneratorOpen, setFormGeneratorOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [savedForms, setSavedForms] = useState<FormConfig[]>([]);
  const [tables, setTables] = useState<Array<{ name: string; size: number; recordCount: number }>>([]);
  const [tableColumns, setTableColumns] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setIsLoading(true);
        const tablesData = await getTables({
          server: connectionDetails.server,
          database: connectionDetails.database,
          authentication: connectionDetails.authentication,
          username: connectionDetails.username,
          password: connectionDetails.password
        });
        setTables(tablesData);
      } catch (error) {
        console.error("Error fetching tables:", error);
        toast({
          title: "Error",
          description: "Failed to fetch database tables",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTables();
  }, [connectionDetails]);
  
  const handleViewStructure = async (tableName: string) => {
    setSelectedTable(tableName);
    
    if (!tableColumns[tableName]) {
      try {
        const columns = await getTableStructure({
          server: connectionDetails.server,
          database: connectionDetails.database,
          authentication: connectionDetails.authentication,
          username: connectionDetails.username,
          password: connectionDetails.password
        }, tableName);
        
        setTableColumns(prev => ({
          ...prev,
          [tableName]: columns
        }));
      } catch (error) {
        console.error(`Error fetching columns for ${tableName}:`, error);
        toast({
          title: "Error",
          description: `Failed to fetch columns for ${tableName}`,
          variant: "destructive"
        });
      }
    }
    
    setTableStructureOpen(true);
  };
  
  const handleGenerateForm = async (tableName: string) => {
    setSelectedTable(tableName);
    
    if (!tableColumns[tableName]) {
      try {
        const columns = await getTableStructure({
          server: connectionDetails.server,
          database: connectionDetails.database,
          authentication: connectionDetails.authentication,
          username: connectionDetails.username,
          password: connectionDetails.password
        }, tableName);
        
        setTableColumns(prev => ({
          ...prev,
          [tableName]: columns
        }));
      } catch (error) {
        console.error(`Error fetching columns for ${tableName}:`, error);
        toast({
          title: "Error",
          description: `Failed to fetch columns for ${tableName}`,
          variant: "destructive"
        });
      }
    }
    
    setTimeout(() => {
      setFormGeneratorOpen(true);
    }, 100);
  };
  
  const handleAddGuide = (tableName: string, guidePath: string, description: string) => {
    toast({
      title: "Guide Added",
      description: `Guide for ${tableName} has been saved.`,
    });
  };
  
  const handleSaveForm = (formConfig: FormConfig) => {
    setSavedForms(prev => [...prev, formConfig]);
    toast({
      title: "Form Saved",
      description: `${formConfig.name} has been saved successfully.`,
    });
  };
  
  const dynamicFormsForSidebar = savedForms.map(form => ({
    id: form.id,
    title: form.name,
    tableName: form.tableName,
  }));
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        dynamicForms={dynamicFormsForSidebar} 
        connectionInfo={{
          server: connectionDetails.server,
          database: connectionDetails.database,
        }}
      />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1">
          <DataDictionary 
            databaseName={connectionDetails.database}
            onViewStructure={handleViewStructure}
            onGenerateForm={handleGenerateForm}
            onAddGuide={handleAddGuide}
          />
        </ScrollArea>
        
        <TableStructure 
          isOpen={tableStructureOpen}
          onClose={() => setTableStructureOpen(false)}
          tableName={selectedTable}
          columns={tableColumns[selectedTable] || []}
        />
        
        <DynamicFormGenerator 
          isOpen={formGeneratorOpen}
          onClose={() => setFormGeneratorOpen(false)}
          tableName={selectedTable}
          tableColumns={tableColumns[selectedTable] || []}
          onSaveForm={handleSaveForm}
        />
      </main>
    </div>
  );
};

export default Dashboard;
