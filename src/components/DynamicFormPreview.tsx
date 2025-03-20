
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormField } from './DynamicFormGenerator';

interface DynamicFormPreviewProps {
  formName: string;
  formDescription: string;
  fields: FormField[];
}

const DynamicFormPreview: React.FC<DynamicFormPreviewProps> = ({
  formName,
  formDescription,
  fields,
}) => {
  // Ensure fields are sorted by their order property
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{formName || 'Untitled Form'}</CardTitle>
        {formDescription && <CardDescription>{formDescription}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            
            {field.type === 'text' && (
              <Input id={field.id} placeholder={`Enter ${field.label.toLowerCase()}`} />
            )}
            
            {field.type === 'textarea' && (
              <Textarea id={field.id} placeholder={`Enter ${field.label.toLowerCase()}`} />
            )}
            
            {field.type === 'number' && (
              <Input id={field.id} type="number" placeholder={`Enter ${field.label.toLowerCase()}`} />
            )}
            
            {field.type === 'date' && (
              <Input id={field.id} type="date" />
            )}
            
            {field.type === 'select' && (
              <Select>
                <SelectTrigger id={field.id}>
                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option, index) => (
                    <SelectItem key={index} value={option.value}>
                      {option.label}
                    </SelectItem>
                  )) || (
                    <SelectItem value="placeholder">
                      Sample Option
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
            
            {field.type === 'switch' && (
              <div className="flex items-center space-x-2">
                <Switch id={field.id} />
                <Label htmlFor={field.id} className="cursor-pointer">
                  Enabled
                </Label>
              </div>
            )}
            
            {field.isForeignKey && (
              <div className="text-xs text-muted-foreground mt-1">
                References {field.referencedTable} ({field.foreignKeyFields?.join(', ')})
              </div>
            )}
          </div>
        ))}
        
        {sortedFields.length === 0 && (
          <div className="text-center p-10 text-muted-foreground">
            No fields configured yet
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  );
};

export default DynamicFormPreview;
