
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, Key, Link as LinkIcon } from 'lucide-react';

interface ColumnInfo {
  name: string;
  dataType: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  referencedTable?: string;
}

interface TableStructureProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  columns: ColumnInfo[];
}

const TableStructure: React.FC<TableStructureProps> = ({
  isOpen,
  onClose,
  tableName,
  columns,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Table Structure: {tableName}
          </DialogTitle>
          <DialogDescription>
            View the columns and relationships for this table
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 mt-4">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[180px]">Column Name</TableHead>
                <TableHead>Data Type</TableHead>
                <TableHead className="w-[100px] text-center">Nullable</TableHead>
                <TableHead className="w-[100px] text-center">Key Type</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {columns.map((column, index) => (
                <TableRow key={index} className={column.isPrimaryKey ? "bg-primary/5" : ""}>
                  <TableCell className="font-medium">
                    {column.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {column.dataType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {column.nullable ? 
                      <span className="text-muted-foreground">Yes</span> : 
                      <span className="text-muted-foreground">No</span>
                    }
                  </TableCell>
                  <TableCell className="text-center">
                    {column.isPrimaryKey && (
                      <Badge variant="default" className="bg-primary/80 hover:bg-primary">
                        <div className="flex items-center gap-1">
                          <Key className="h-3 w-3" />
                          <span>PK</span>
                        </div>
                      </Badge>
                    )}
                    {column.isForeignKey && (
                      <Badge variant="secondary">
                        <div className="flex items-center gap-1">
                          <LinkIcon className="h-3 w-3" />
                          <span>FK</span>
                        </div>
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {column.isForeignKey && column.referencedTable ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{column.referencedTable}</span>
                        <LinkIcon className="h-3 w-3 text-muted-foreground" />
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
              
              {columns.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No columns found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        
        <DialogFooter className="mt-4">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableStructure;
