
import { toast } from "sonner";

// Interface for database connection
export interface DbConnectionConfig {
  server: string;
  database: string;
  authentication: "windows" | "sql";
  username?: string;
  password?: string;
}

// Mock function to simulate testing database connection
export const testConnection = async (
  config: DbConnectionConfig
): Promise<boolean> => {
  console.log("Testing connection to:", config);
  
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Always succeed in this mock
  return true;
};

// Mock function to get all tables in a database
export const getTables = async (
  config: DbConnectionConfig
): Promise<Array<{ name: string; size: number; recordCount: number }>> => {
  console.log("Fetching tables from:", config.database);
  
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Return mock data
  return [
    { name: "Customers", size: 256, recordCount: 1053 },
    { name: "Orders", size: 512, recordCount: 5127 },
    { name: "Products", size: 128, recordCount: 412 },
    { name: "Employees", size: 96, recordCount: 87 },
    { name: "Suppliers", size: 120, recordCount: 45 },
    { name: "Categories", size: 32, recordCount: 18 },
    { name: "Payments", size: 256, recordCount: 4891 },
    { name: "Shipments", size: 320, recordCount: 4213 },
  ];
};

// Mock function to get the structure of a table
export const getTableStructure = async (
  config: DbConnectionConfig,
  tableName: string
): Promise<Array<{
  name: string;
  dataType: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  referencedTable?: string;
}>> => {
  console.log(`Fetching structure for table: ${tableName} in ${config.database}`);
  
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // This would be replaced with actual API calls to the SQL Server
  // For now, return mock data based on the table name
  const mockStructures: Record<string, any[]> = {
    "Customers": [
      { name: "CustomerID", dataType: "int", nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: "CompanyName", dataType: "varchar(100)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "ContactName", dataType: "varchar(100)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "ContactTitle", dataType: "varchar(50)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "Address", dataType: "varchar(255)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "City", dataType: "varchar(50)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "Region", dataType: "varchar(50)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "PostalCode", dataType: "varchar(20)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "Country", dataType: "varchar(50)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "Phone", dataType: "varchar(20)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "Fax", dataType: "varchar(20)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "IsActive", dataType: "bit", nullable: false, isPrimaryKey: false, isForeignKey: false },
    ],
    "Orders": [
      { name: "OrderID", dataType: "int", nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: "CustomerID", dataType: "int", nullable: false, isPrimaryKey: false, isForeignKey: true, referencedTable: "Customers" },
      { name: "EmployeeID", dataType: "int", nullable: false, isPrimaryKey: false, isForeignKey: true, referencedTable: "Employees" },
      { name: "OrderDate", dataType: "datetime", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "RequiredDate", dataType: "datetime", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "ShippedDate", dataType: "datetime", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "ShipVia", dataType: "int", nullable: true, isPrimaryKey: false, isForeignKey: true, referencedTable: "Shippers" },
      { name: "Freight", dataType: "decimal(10,2)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "ShipName", dataType: "varchar(100)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "ShipAddress", dataType: "varchar(255)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "ShipCity", dataType: "varchar(50)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "ShipRegion", dataType: "varchar(50)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "ShipPostalCode", dataType: "varchar(20)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "ShipCountry", dataType: "varchar(50)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "Status", dataType: "varchar(20)", nullable: false, isPrimaryKey: false, isForeignKey: false },
    ],
    // Add more tables as needed
  };
  
  return mockStructures[tableName] || [];
};

// Mock function to get referenced data for foreign keys (for populating selects)
export const getForeignKeyData = async (
  config: DbConnectionConfig,
  tableName: string,
  displayFields: string[] = ["id", "name"]
): Promise<Array<Record<string, any>>> => {
  console.log(`Fetching foreign key data from ${tableName} using fields: ${displayFields.join(", ")}`);
  
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  // Mock data for different tables
  const mockData: Record<string, any[]> = {
    "Customers": [
      { id: 1, name: "Acme Inc.", code: "ACME", country: "USA" },
      { id: 2, name: "Globex Corporation", code: "GLOB", country: "USA" },
      { id: 3, name: "Soylent Corp", code: "SOYL", country: "Canada" },
    ],
    "Employees": [
      { id: 1, name: "John Doe", title: "Sales Manager", department: "Sales" },
      { id: 2, name: "Jane Smith", title: "Developer", department: "IT" },
      { id: 3, name: "Bob Johnson", title: "CEO", department: "Executive" },
    ],
    "Suppliers": [
      { id: 1, name: "Supplier A", contactName: "Contact A", country: "USA" },
      { id: 2, name: "Supplier B", contactName: "Contact B", country: "Mexico" },
      { id: 3, name: "Supplier C", contactName: "Contact C", country: "Canada" },
    ],
    "Categories": [
      { id: 1, name: "Beverages", description: "Soft drinks, coffees, teas, beers, and ales" },
      { id: 2, name: "Condiments", description: "Sweet and savory sauces, relishes, spreads, and seasonings" },
      { id: 3, name: "Confections", description: "Desserts, candies, and sweet breads" },
    ],
  };
  
  return mockData[tableName] || [];
};

// Function to calculate DIAN verification digit for Colombian NIT
export const calculateDianVerificationDigit = (nit: string): number => {
  if (!nit || !/^\d+$/.test(nit)) {
    toast.error("NIT must contain only digits");
    return -1;
  }
  
  // DIAN algorithm
  const factors = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  let sum = 0;
  
  // Pad with leading zeros if necessary
  const paddedNit = nit.padStart(15, '0');
  
  // Calculate the sum
  for (let i = 0; i < paddedNit.length; i++) {
    sum += parseInt(paddedNit.charAt(i)) * factors[i];
  }
  
  // Calculate the digit
  const remainder = sum % 11;
  return remainder > 1 ? 11 - remainder : remainder;
};

// Function to generate a stored procedure for CRUD operations
export const generateCrudStoredProcedure = (
  tableName: string,
  columns: Array<{
    name: string;
    dataType: string;
    nullable: boolean;
    isPrimaryKey: boolean;
  }>
): string => {
  const primaryKey = columns.find(col => col.isPrimaryKey);
  if (!primaryKey) {
    return "-- Error: No primary key found in table";
  }
  
  const paramList = columns
    .map(col => `@${col.name} ${col.dataType}${col.nullable ? ' = NULL' : ''}`)
    .join(',\n    ');
  
  const insertColumns = columns
    .map(col => col.name)
    .join(', ');
  
  const insertValues = columns
    .map(col => `@${col.name}`)
    .join(', ');
  
  const updateSetClause = columns
    .filter(col => !col.isPrimaryKey)
    .map(col => `${col.name} = @${col.name}`)
    .join(',\n        ');
  
  const selectClause = columns
    .map(col => col.name)
    .join(', ');
  
  return `CREATE OR ALTER PROCEDURE [dbo].[sp_${tableName}_CRUD]
    @Action NVARCHAR(10),
    ${paramList}
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Create operation
    IF @Action = 'CREATE'
    BEGIN
        INSERT INTO [${tableName}] (${insertColumns})
        VALUES (${insertValues});
        
        -- Return the new record
        SELECT ${selectClause}
        FROM [${tableName}]
        WHERE ${primaryKey.name} = SCOPE_IDENTITY();
    END
    
    -- Read operation
    ELSE IF @Action = 'READ'
    BEGIN
        -- Get a specific record by primary key
        IF @${primaryKey.name} IS NOT NULL
        BEGIN
            SELECT ${selectClause}
            FROM [${tableName}]
            WHERE ${primaryKey.name} = @${primaryKey.name};
        END
        -- Get all records
        ELSE
        BEGIN
            SELECT ${selectClause}
            FROM [${tableName}];
        END
    END
    
    -- Update operation
    ELSE IF @Action = 'UPDATE'
    BEGIN
        UPDATE [${tableName}]
        SET ${updateSetClause}
        WHERE ${primaryKey.name} = @${primaryKey.name};
        
        -- Return the updated record
        SELECT ${selectClause}
        FROM [${tableName}]
        WHERE ${primaryKey.name} = @${primaryKey.name};
    END
    
    -- Delete operation
    ELSE IF @Action = 'DELETE'
    BEGIN
        DELETE FROM [${tableName}]
        WHERE ${primaryKey.name} = @${primaryKey.name};
        
        -- Return success status
        SELECT 'Record deleted successfully' AS Result;
    END
    
    ELSE
    BEGIN
        RAISERROR('Invalid action specified. Use CREATE, READ, UPDATE, or DELETE.', 16, 1);
    END
END`;
};
