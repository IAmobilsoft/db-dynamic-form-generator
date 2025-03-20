
import React, { useState } from 'react';
import { ConnectionDetails } from './ConnectionForm';
import Sidebar from './Sidebar';
import DataDictionary from './DataDictionary';
import TableStructure from './TableStructure';
import DynamicFormGenerator, { FormConfig } from './DynamicFormGenerator';
import { useToast } from "@/components/ui/use-toast";

interface DashboardProps {
  connectionDetails: ConnectionDetails;
  onDisconnect: () => void;
}

// Mock data for table structure
const MOCK_COLUMNS = {
  'Customers': [
    { name: 'CustomerID', dataType: 'int', nullable: false, isPrimaryKey: true, isForeignKey: false },
    { name: 'CompanyName', dataType: 'varchar(100)', nullable: false, isPrimaryKey: false, isForeignKey: false },
    { name: 'ContactName', dataType: 'varchar(100)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'ContactTitle', dataType: 'varchar(50)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'Address', dataType: 'varchar(255)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'City', dataType: 'varchar(50)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'Region', dataType: 'varchar(50)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'PostalCode', dataType: 'varchar(20)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'Country', dataType: 'varchar(50)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'Phone', dataType: 'varchar(20)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'Fax', dataType: 'varchar(20)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'IsActive', dataType: 'bit', nullable: false, isPrimaryKey: false, isForeignKey: false },
  ],
  'Orders': [
    { name: 'OrderID', dataType: 'int', nullable: false, isPrimaryKey: true, isForeignKey: false },
    { name: 'CustomerID', dataType: 'int', nullable: false, isPrimaryKey: false, isForeignKey: true, referencedTable: 'Customers' },
    { name: 'EmployeeID', dataType: 'int', nullable: false, isPrimaryKey: false, isForeignKey: true, referencedTable: 'Employees' },
    { name: 'OrderDate', dataType: 'datetime', nullable: false, isPrimaryKey: false, isForeignKey: false },
    { name: 'RequiredDate', dataType: 'datetime', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'ShippedDate', dataType: 'datetime', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'ShipVia', dataType: 'int', nullable: true, isPrimaryKey: false, isForeignKey: true, referencedTable: 'Shippers' },
    { name: 'Freight', dataType: 'decimal(10,2)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'ShipName', dataType: 'varchar(100)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'ShipAddress', dataType: 'varchar(255)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'ShipCity', dataType: 'varchar(50)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'ShipRegion', dataType: 'varchar(50)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'ShipPostalCode', dataType: 'varchar(20)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'ShipCountry', dataType: 'varchar(50)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'Status', dataType: 'varchar(20)', nullable: false, isPrimaryKey: false, isForeignKey: false },
  ],
  'Products': [
    { name: 'ProductID', dataType: 'int', nullable: false, isPrimaryKey: true, isForeignKey: false },
    { name: 'ProductName', dataType: 'varchar(100)', nullable: false, isPrimaryKey: false, isForeignKey: false },
    { name: 'SupplierID', dataType: 'int', nullable: true, isPrimaryKey: false, isForeignKey: true, referencedTable: 'Suppliers' },
    { name: 'CategoryID', dataType: 'int', nullable: true, isPrimaryKey: false, isForeignKey: true, referencedTable: 'Categories' },
    { name: 'QuantityPerUnit', dataType: 'varchar(50)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'UnitPrice', dataType: 'decimal(10,2)', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'UnitsInStock', dataType: 'int', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'UnitsOnOrder', dataType: 'int', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'ReorderLevel', dataType: 'int', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { name: 'Discontinued', dataType: 'bit', nullable: false, isPrimaryKey: false, isForeignKey: false },
  ]
};

const Dashboard: React.FC<DashboardProps> = ({ connectionDetails, onDisconnect }) => {
  const [tableStructureOpen, setTableStructureOpen] = useState(false);
  const [formGeneratorOpen, setFormGeneratorOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [savedForms, setSavedForms] = useState<FormConfig[]>([]);
  const { toast } = useToast();
  
  const handleViewStructure = (tableName: string) => {
    setSelectedTable(tableName);
    setTableStructureOpen(true);
  };
  
  const handleGenerateForm = (tableName: string) => {
    setSelectedTable(tableName);
    setFormGeneratorOpen(true);
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
  
  // Convert the saved forms to the format expected by Sidebar
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
        <DataDictionary 
          databaseName={connectionDetails.database}
          onViewStructure={handleViewStructure}
          onGenerateForm={handleGenerateForm}
          onAddGuide={handleAddGuide}
        />
        
        {/* Modals/Dialogs */}
        <TableStructure 
          isOpen={tableStructureOpen}
          onClose={() => setTableStructureOpen(false)}
          tableName={selectedTable}
          columns={MOCK_COLUMNS[selectedTable as keyof typeof MOCK_COLUMNS] || []}
        />
        
        <DynamicFormGenerator 
          isOpen={formGeneratorOpen}
          onClose={() => setFormGeneratorOpen(false)}
          tableName={selectedTable}
          tableColumns={MOCK_COLUMNS[selectedTable as keyof typeof MOCK_COLUMNS] || []}
          onSaveForm={handleSaveForm}
        />
      </main>
    </div>
  );
};

export default Dashboard;
