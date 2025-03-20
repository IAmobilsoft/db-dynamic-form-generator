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
  
  // Return mock data matching the expected tables
  return [
    { name: "App_Forms", size: 64, recordCount: 12 },
    { name: "cio_customers", size: 256, recordCount: 853 },
    { name: "Con_Cuentas", size: 128, recordCount: 423 },
    { name: "Con_InterfazContable", size: 96, recordCount: 215 },
    { name: "Gen_ActividadComercial", size: 48, recordCount: 32 },
    { name: "Gen_Ciudades", size: 72, recordCount: 1124 },
    { name: "Gen_CodigosCIIU", size: 82, recordCount: 472 },
    { name: "Gen_Departamentos", size: 36, recordCount: 32 },
    { name: "Gen_Empresas", size: 128, recordCount: 76 },
    { name: "Gen_TipoContribuyente", size: 24, recordCount: 18 },
    { name: "Gen_TipoDocumento", size: 32, recordCount: 12 },
    { name: "Gen_TipoRegimen", size: 24, recordCount: 8 },
    { name: "gen_usuarios", size: 96, recordCount: 45 },
    { name: "Inv_categorias", size: 64, recordCount: 128 },
    { name: "Inv_lineas", size: 48, recordCount: 87 },
    { name: "Inv_Productos", size: 384, recordCount: 2431 },
    { name: "Inv_sublineas", size: 56, recordCount: 173 },
    { name: "Inv_UniMedidas", size: 24, recordCount: 28 },
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
    "cio_customers": [
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
      { name: "NIT", dataType: "varchar(20)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "TipoDocumento", dataType: "int", nullable: true, isPrimaryKey: false, isForeignKey: true, referencedTable: "Gen_TipoDocumento" },
    ],
    "Gen_TipoDocumento": [
      { name: "TipoDocumentoID", dataType: "int", nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: "Codigo", dataType: "varchar(5)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "Descripcion", dataType: "varchar(50)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "RequiereDigitoVerificacion", dataType: "bit", nullable: false, isPrimaryKey: false, isForeignKey: false },
    ],
    "Inv_Productos": [
      { name: "ProductoID", dataType: "int", nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: "Codigo", dataType: "varchar(20)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "Nombre", dataType: "varchar(100)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "Descripcion", dataType: "text", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "CategoriaID", dataType: "int", nullable: false, isPrimaryKey: false, isForeignKey: true, referencedTable: "Inv_categorias" },
      { name: "LineaID", dataType: "int", nullable: false, isPrimaryKey: false, isForeignKey: true, referencedTable: "Inv_lineas" },
      { name: "SublineaID", dataType: "int", nullable: true, isPrimaryKey: false, isForeignKey: true, referencedTable: "Inv_sublineas" },
      { name: "UnidadMedidaID", dataType: "int", nullable: false, isPrimaryKey: false, isForeignKey: true, referencedTable: "Inv_UniMedidas" },
      { name: "PrecioCompra", dataType: "decimal(18,2)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "PrecioVenta", dataType: "decimal(18,2)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "Existencia", dataType: "decimal(18,2)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "ExistenciaMinima", dataType: "decimal(18,2)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "Activo", dataType: "bit", nullable: false, isPrimaryKey: false, isForeignKey: false },
    ],
    "Inv_categorias": [
      { name: "CategoriaID", dataType: "int", nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: "Nombre", dataType: "varchar(50)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "Descripcion", dataType: "varchar(255)", nullable: true, isPrimaryKey: false, isForeignKey: false },
    ],
    "Inv_lineas": [
      { name: "LineaID", dataType: "int", nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: "Nombre", dataType: "varchar(50)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "Descripcion", dataType: "varchar(255)", nullable: true, isPrimaryKey: false, isForeignKey: false },
    ],
    "Inv_sublineas": [
      { name: "SublineaID", dataType: "int", nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: "LineaID", dataType: "int", nullable: false, isPrimaryKey: false, isForeignKey: true, referencedTable: "Inv_lineas" },
      { name: "Nombre", dataType: "varchar(50)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "Descripcion", dataType: "varchar(255)", nullable: true, isPrimaryKey: false, isForeignKey: false },
    ],
    "Inv_UniMedidas": [
      { name: "UnidadMedidaID", dataType: "int", nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: "Codigo", dataType: "varchar(10)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "Nombre", dataType: "varchar(50)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "Simbolo", dataType: "varchar(10)", nullable: true, isPrimaryKey: false, isForeignKey: false },
    ],
    "gen_usuarios": [
      { name: "UsuarioID", dataType: "int", nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: "Nombre", dataType: "varchar(100)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "Usuario", dataType: "varchar(50)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "Clave", dataType: "varchar(255)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "EmpresaID", dataType: "int", nullable: true, isPrimaryKey: false, isForeignKey: true, referencedTable: "Gen_Empresas" },
      { name: "Activo", dataType: "bit", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "Email", dataType: "varchar(100)", nullable: true, isPrimaryKey: false, isForeignKey: false },
    ],
  };
  
  // Para las tablas que no tienen estructura definida, crear una estructura básica
  if (!mockStructures[tableName]) {
    return [
      { name: "ID", dataType: "int", nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: "Nombre", dataType: "varchar(100)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "Descripcion", dataType: "varchar(255)", nullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: "Activo", dataType: "bit", nullable: false, isPrimaryKey: false, isForeignKey: false }
    ];
  }
  
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
    "Gen_TipoDocumento": [
      { id: 1, Codigo: "CC", Descripcion: "Cédula de Ciudadanía" },
      { id: 2, Codigo: "CE", Descripcion: "Cédula de Extranjería" },
      { id: 3, Codigo: "TI", Descripcion: "Tarjeta de Identidad" },
      { id: 4, Codigo: "NIT", Descripcion: "Número de Identificación Tributaria", RequiereDigitoVerificacion: true },
      { id: 31, Codigo: "NIT", Descripcion: "NIT", RequiereDigitoVerificacion: true },
    ],
    "Inv_categorias": [
      { id: 1, Nombre: "Alimentos", Descripcion: "Productos alimenticios" },
      { id: 2, Nombre: "Bebidas", Descripcion: "Bebidas de todo tipo" },
      { id: 3, Nombre: "Limpieza", Descripcion: "Productos de limpieza" },
    ],
    "Inv_lineas": [
      { id: 1, Nombre: "Lácteos", Descripcion: "Productos lácteos" },
      { id: 2, Nombre: "Carnes", Descripcion: "Carnes y embutidos" },
      { id: 3, Nombre: "Frutas", Descripcion: "Frutas frescas" },
    ],
    "Inv_sublineas": [
      { id: 1, LineaID: 1, Nombre: "Quesos", Descripcion: "Quesos de todo tipo" },
      { id: 2, LineaID: 1, Nombre: "Yogurt", Descripcion: "Yogures y derivados" },
      { id: 3, LineaID: 2, Nombre: "Res", Descripcion: "Carnes de res" },
    ],
    "Inv_UniMedidas": [
      { id: 1, Codigo: "UND", Nombre: "Unidad", Simbolo: "und" },
      { id: 2, Codigo: "KG", Nombre: "Kilogramo", Simbolo: "kg" },
      { id: 3, Codigo: "LT", Nombre: "Litro", Simbolo: "l" },
    ],
    "Gen_Empresas": [
      { id: 1, Nombre: "Empresa A", NIT: "900123456" },
      { id: 2, Nombre: "Empresa B", NIT: "900789012" },
      { id: 3, Nombre: "Empresa C", NIT: "901234567" },
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
