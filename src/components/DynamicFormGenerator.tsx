
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FileText, Eye, Save, MoveHorizontal, AlertCircle } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import DynamicFormPreview from './DynamicFormPreview';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  referencedTable?: string;
  foreignKeyFields?: string[];
  options?: Array<{ label: string; value: string }>;
  order: number;
}

interface DynamicFormGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  tableColumns: any[];
  onSaveForm: (formConfig: FormConfig) => void;
}

export interface FormConfig {
  id: string;
  name: string;
  tableName: string;
  description: string;
  fields: FormField[];
  version: number;
  createdAt: string;
}

const DynamicFormGenerator: React.FC<DynamicFormGeneratorProps> = ({
  isOpen,
  onClose,
  tableName,
  tableColumns,
  onSaveForm,
}) => {
  const [activeTab, setActiveTab] = useState("editor");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize form data from table columns
  useEffect(() => {
    if (tableColumns.length > 0 && isOpen) {
      const initialFormName = `${tableName} Form`;
      setFormName(initialFormName);
      
      const formattedFields = tableColumns.map((column, index) => {
        // Determine the field type based on the column data type
        let fieldType = 'text';
        if (column.dataType.includes('bit')) {
          fieldType = 'switch';
        } else if (column.dataType.includes('int')) {
          fieldType = 'number';
        } else if (column.dataType.includes('date')) {
          fieldType = 'date';
        } else if (column.dataType.includes('text') || (column.dataType.includes('varchar') && parseInt(column.dataType.match(/\d+/)?.[0] || "0") > 255)) {
          fieldType = 'textarea';
        }

        // For foreign keys, use select type
        if (column.isForeignKey) {
          fieldType = 'select';
        }
        
        return {
          id: `field-${index}`,
          name: column.name,
          label: column.name
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^\w/, c => c.toUpperCase()),
          type: fieldType,
          required: !column.nullable,
          isPrimaryKey: column.isPrimaryKey,
          isForeignKey: column.isForeignKey,
          referencedTable: column.referencedTable,
          foreignKeyFields: column.isForeignKey ? ['id', 'name'] : undefined, // Default to id and name
          order: index,
          options: column.isForeignKey ? [
            { label: 'Loading...', value: 'loading' }
          ] : undefined
        };
      });
      
      setFields(formattedFields);
    }
  }, [tableName, tableColumns, isOpen]);
  
  const handleFieldSelect = (field: FormField) => {
    setSelectedField(field);
    setIsEditing(true);
  };
  
  const handleFieldUpdate = (updatedField: Partial<FormField>) => {
    if (!selectedField) return;
    
    setFields(prevFields => 
      prevFields.map(field => 
        field.id === selectedField.id 
          ? { ...field, ...updatedField } 
          : field
      )
    );
    
    setSelectedField(prev => prev ? { ...prev, ...updatedField } : null);
  };
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update the order property of each field
    const updatedFields = items.map((field, index) => ({
      ...field,
      order: index
    }));
    
    setFields(updatedFields);
  };
  
  const handleSaveForm = () => {
    if (!formName.trim()) {
      toast.error("Please enter a form name");
      return;
    }
    
    if (fields.length === 0) {
      toast.error("Form must have at least one field");
      return;
    }
    
    const formConfig: FormConfig = {
      id: `form-${Date.now()}`,
      name: formName,
      tableName,
      description: formDescription,
      fields: fields.sort((a, b) => a.order - b.order),
      version: 1,
      createdAt: new Date().toISOString(),
    };
    
    onSaveForm(formConfig);
    toast.success("Form saved successfully");
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="h-6 w-6 text-primary" />
            Generate Dynamic Form for {tableName}
          </DialogTitle>
          <DialogDescription>
            {tableName ? `Customizing form based on table structure` : 'Configure your dynamic form'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b px-6">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="editor" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Form Editor</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="editor" className="flex-1 overflow-hidden flex flex-col mt-0 pt-0">
              <div className="grid grid-cols-3 gap-6 flex-1 overflow-hidden">
                <div className="col-span-1 p-6 border-r overflow-hidden flex flex-col">
                  <div className="space-y-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="formName">Form Name</Label>
                      <Input
                        id="formName"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Enter form name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="formDescription">Description</Label>
                      <Textarea
                        id="formDescription"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Enter form description"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">Form Fields ({fields.length})</h3>
                    {fields.some(f => f.isPrimaryKey) && (
                      <div className="flex items-center text-xs text-amber-500 gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Primary keys included</span>
                      </div>
                    )}
                  </div>
                  
                  <ScrollArea className="flex-1 pr-4">
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="fields">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                          >
                            {fields.map((field, index) => (
                              <Draggable key={field.id} draggableId={field.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`border rounded-md p-3 bg-background hover:bg-muted/50 transition-colors cursor-pointer ${
                                      selectedField?.id === field.id ? 'ring-1 ring-primary border-primary' : ''
                                    } ${field.isPrimaryKey ? 'border-amber-200 bg-amber-50' : ''}`}
                                    onClick={() => handleFieldSelect(field)}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex flex-col">
                                        <span className="font-medium text-sm">{field.label}</span>
                                        <div className="flex items-center gap-1">
                                          <span className="text-xs text-muted-foreground">{field.type}</span>
                                          {field.isPrimaryKey && (
                                            <span className="text-xs bg-amber-100 text-amber-800 px-1 rounded">PK</span>
                                          )}
                                          {field.isForeignKey && (
                                            <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">FK</span>
                                          )}
                                          {field.required && (
                                            <span className="text-xs text-destructive">*</span>
                                          )}
                                        </div>
                                      </div>
                                      <div
                                        {...provided.dragHandleProps}
                                        className="cursor-move p-1 hover:bg-muted rounded"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <MoveHorizontal className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            
                            {fields.length === 0 && (
                              <div className="text-center p-4 text-muted-foreground text-sm border rounded-md">
                                No fields available
                              </div>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </ScrollArea>
                </div>
                
                <div className="col-span-2 p-6 overflow-hidden flex flex-col">
                  {isEditing && selectedField ? (
                    <Card>
                      <CardHeader>
                        <h3 className="text-lg font-medium">Edit Field: {selectedField.label}</h3>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fieldLabel">Label</Label>
                            <Input
                              id="fieldLabel"
                              value={selectedField.label}
                              onChange={(e) => handleFieldUpdate({ label: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fieldName">Field Name</Label>
                            <Input
                              id="fieldName"
                              value={selectedField.name}
                              onChange={(e) => handleFieldUpdate({ name: e.target.value })}
                              disabled={selectedField.isPrimaryKey || selectedField.isForeignKey}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fieldType">Field Type</Label>
                            <Select
                              value={selectedField.type}
                              onValueChange={(value) => handleFieldUpdate({ type: value })}
                              disabled={selectedField.isForeignKey}
                            >
                              <SelectTrigger id="fieldType">
                                <SelectValue placeholder="Select field type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="textarea">Textarea</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="select">Dropdown</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="switch">Switch (Boolean)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2 flex items-center">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="required"
                                checked={selectedField.required}
                                onCheckedChange={(checked) => handleFieldUpdate({ required: checked })}
                              />
                              <Label htmlFor="required">Required Field</Label>
                            </div>
                          </div>
                        </div>
                        
                        {selectedField.isForeignKey && (
                          <div className="space-y-2 border-t pt-4">
                            <h4 className="text-sm font-medium mb-2">Foreign Key Configuration</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="referencedTable">Referenced Table</Label>
                                <Input
                                  id="referencedTable"
                                  value={selectedField.referencedTable || ''}
                                  disabled
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="displayFields">Display Fields</Label>
                                <Input
                                  id="displayFields"
                                  value={selectedField.foreignKeyFields?.join(', ') || ''}
                                  onChange={(e) => handleFieldUpdate({ 
                                    foreignKeyFields: e.target.value.split(',').map(f => f.trim()).filter(Boolean)
                                  })}
                                  placeholder="id, name, code"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Comma-separated field names to display in the dropdown
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedField(null);
                            setIsEditing(false);
                          }}
                        >
                          Done
                        </Button>
                      </CardFooter>
                    </Card>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <p className="text-muted-foreground">Select a field to edit its properties</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="flex-1 overflow-hidden mt-0 pt-0">
              <ScrollArea className="h-full px-6 py-4">
                <DynamicFormPreview 
                  formName={formName} 
                  formDescription={formDescription}
                  fields={fields}
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="p-6 pt-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveForm} className="gap-2">
            <Save className="h-4 w-4" />
            Save Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DynamicFormGenerator;
