
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Eye, FileEdit, Image, Info, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getTables } from '@/utils/databaseUtils';
import { ConnectionDetails } from './ConnectionForm';

interface TableInfo {
  id: string;
  name: string;
  sizeKB: number;
  recordCount: number;
  description: string;
  guidePath?: string;
}

interface DataDictionaryProps {
  databaseName: string;
  onViewStructure: (tableName: string) => void;
  onGenerateForm: (tableName: string) => void;
  onAddGuide: (tableName: string, guidePath: string, description: string) => void;
}

const DataDictionary: React.FC<DataDictionaryProps> = ({ 
  databaseName, 
  onViewStructure, 
  onGenerateForm, 
  onAddGuide 
}) => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null);
  const [description, setDescription] = useState('');
  const [guidePath, setGuidePath] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Cargar las tablas cuando el componente se monta
  useEffect(() => {
    const loadTables = async () => {
      try {
        setIsLoading(true);
        // Simulamos la conexión a la base de datos
        const tablesData = await getTables({
          server: '145.223.75.189,1433',
          database: 'Mobilpos',
          authentication: 'sql',
          username: 'sa',
          password: 'D3v3l0p3r2024$'
        });
        
        // Convertir los datos al formato esperado por el componente
        const formattedTables = tablesData.map((table, index) => ({
          id: index.toString(),
          name: table.name,
          sizeKB: table.size,
          recordCount: table.recordCount,
          description: `${table.name} table`
        }));
        
        setTables(formattedTables);
      } catch (error) {
        console.error("Error loading tables:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTables();
  }, [databaseName]);
  
  // Filter tables based on search term
  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddGuide = () => {
    if (selectedTable) {
      onAddGuide(selectedTable.name, guidePath, description);
      
      // Update the table in our local state
      setTables(prevTables => 
        prevTables.map(table => 
          table.id === selectedTable.id 
            ? { ...table, guidePath, description } 
            : table
        )
      );
      
      setSelectedTable(null);
      setGuidePath('');
      setDescription('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-1">Data Dictionary: <span className="text-primary">{databaseName}</span></h2>
        <p className="text-sm text-muted-foreground mb-4">View and manage database tables</p>
        <Input
          placeholder="Search tables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading tables...</p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-14 text-center">#</TableHead>
                <TableHead>Table Name</TableHead>
                <TableHead className="text-right">Size (KB)</TableHead>
                <TableHead className="text-right">Records</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Guide Image</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTables.map((table, index) => (
                <TableRow 
                  key={table.id}
                  className="transition-colors duration-200 hover:bg-muted/40"
                >
                  <TableCell className="text-center font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    {table.name}
                  </TableCell>
                  <TableCell className="text-right">{table.sizeKB.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{table.recordCount.toLocaleString()}</TableCell>
                  <TableCell className="max-w-[250px] truncate">
                    {table.description}
                  </TableCell>
                  <TableCell>
                    {table.guidePath ? (
                      <div className="flex items-center gap-2">
                        <Image className="h-4 w-4 text-primary" />
                        <span className="text-xs">Added</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => onViewStructure(table.name)}
                              className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-primary/5"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Table Structure</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => onGenerateForm(table.name)}
                              className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-primary/5"
                            >
                              <FileEdit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Generate Dynamic Form</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <Dialog>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => setSelectedTable(table)}
                                  className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-primary/5"
                                >
                                  <Image className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add Design Guide</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Add Design Guide for {selectedTable?.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Description
                              </label>
                              <Input
                                placeholder="Enter table description"
                                value={description || selectedTable?.description || ''}
                                onChange={(e) => setDescription(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Guide Image URL
                              </label>
                              <Input
                                placeholder="Enter image URL or path"
                                value={guidePath}
                                onChange={(e) => setGuidePath(e.target.value)}
                              />
                            </div>
                            
                            <div className="flex justify-end">
                              <Button onClick={handleAddGuide}>
                                Save Guide
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredTables.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Info className="h-8 w-8" />
                      <p>No tables found matching "{searchTerm}"</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </ScrollArea>
    </div>
  );
};

export default DataDictionary;

