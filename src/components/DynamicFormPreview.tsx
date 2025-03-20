
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormField } from './DynamicFormGenerator';
import { calculateDianVerificationDigit } from '@/utils/databaseUtils';
import { Badge } from "@/components/ui/badge";

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
  
  // Special handling for NIT fields with TipoDocumento = 31
  const hasNITField = sortedFields.some(field => 
    field.name.toLowerCase().includes('nit') || 
    field.label.toLowerCase().includes('nit')
  );
  
  const hasVerificationDigit = sortedFields.some(field => 
    field.name.toLowerCase().includes('digitoverificacion') || 
    field.label.toLowerCase().includes('dígito de verificación') ||
    field.label.toLowerCase().includes('digito verificacion') ||
    field.label.toLowerCase().includes('verification digit')
  );

  const documentTypeField = sortedFields.find(field => 
    field.name.toLowerCase().includes('tipodocumento') || 
    field.label.toLowerCase().includes('tipo de documento')
  );
  
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
              {field.isForeignKey && (
                <Badge variant="outline" className="ml-2 text-xs">FK</Badge>
              )}
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
                    <>
                      <SelectItem value="placeholder">Sample Option 1</SelectItem>
                      <SelectItem value="placeholder2">Sample Option 2</SelectItem>
                      <SelectItem value="placeholder3">Sample Option 3</SelectItem>
                    </>
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
        
        {/* NIT Verification Digit Field (only show if hasNITField is true, documentTypeField exists, and hasVerificationDigit is false) */}
        {hasNITField && documentTypeField && !hasVerificationDigit && (
          <div className="space-y-2 border-t pt-4 mt-4">
            <Label htmlFor="dv" className="flex items-center gap-1">
              Dígito de Verificación (DV)
              <Badge variant="outline" className="ml-2 text-xs">Auto</Badge>
            </Label>
            <div className="flex gap-2 items-center">
              <Input id="dv" className="w-20 text-center" readOnly value="0" />
              <p className="text-xs text-muted-foreground">
                El dígito de verificación se calculará automáticamente cuando el tipo de documento sea NIT (31)
              </p>
            </div>
          </div>
        )}
        
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

