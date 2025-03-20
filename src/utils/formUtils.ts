
import { FormConfig, FormField } from "@/components/DynamicFormGenerator";
import { calculateDianVerificationDigit } from "./databaseUtils";

// Function to validate a Colombian NIT
export const validateNit = (nit: string, documentType: string): { isValid: boolean; verificationDigit?: number } => {
  // Only validate NIT with document type 31 (Colombian tax ID)
  if (documentType !== '31') {
    return { isValid: true };
  }
  
  // Basic validation
  if (!nit || !/^\d+$/.test(nit)) {
    return { isValid: false };
  }
  
  // Calculate verification digit
  const digit = calculateDianVerificationDigit(nit);
  
  return {
    isValid: digit >= 0,
    verificationDigit: digit
  };
};

// Function to generate React code for a dynamic form
export const generateFormCode = (formConfig: FormConfig): string => {
  const imports = `import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';`;

  // Generate zod validation schema
  const validationSchema = formConfig.fields.map(field => {
    let validation = '';
    
    if (field.type === 'text' || field.type === 'textarea') {
      validation = `${field.name}: z.string()${field.required ? '' : '.optional()'}`;
    } else if (field.type === 'number') {
      validation = `${field.name}: z.number()${field.required ? '' : '.optional()'}`;
    } else if (field.type === 'select') {
      validation = `${field.name}: z.string()${field.required ? '' : '.optional()'}`;
    } else if (field.type === 'date') {
      validation = `${field.name}: z.string()${field.required ? '' : '.optional()'}`;
    } else if (field.type === 'switch') {
      validation = `${field.name}: z.boolean().default(false)`;
    }
    
    return validation;
  }).join(',\n  ');

  // Generate form fields
  const formFields = formConfig.fields.map(field => {
    let fieldCode = '';
    
    if (field.type === 'text') {
      fieldCode = `<FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <FormControl>
                <Input placeholder="${field.label}" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;
    } else if (field.type === 'textarea') {
      fieldCode = `<FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <FormControl>
                <Textarea placeholder="${field.label}" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;
    } else if (field.type === 'number') {
      fieldCode = `<FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <FormControl>
                <Input type="number" placeholder="${field.label}" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;
    } else if (field.type === 'select') {
      fieldCode = `<FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ${field.label.toLowerCase()}" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {${field.name}Options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />`;
    } else if (field.type === 'date') {
      fieldCode = `<FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;
    } else if (field.type === 'switch') {
      fieldCode = `<FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">${field.label}</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />`;
    }
    
    return fieldCode;
  }).join('\n\n        ');

  // Define foreign key option variables
  const foreignKeyOptions = formConfig.fields
    .filter(field => field.isForeignKey && field.type === 'select')
    .map(field => `const [${field.name}Options, set${field.name.charAt(0).toUpperCase() + field.name.slice(1)}Options] = useState([]);`)
    .join('\n  ');

  // Define useEffect to load foreign key data
  const loadForeignKeyData = formConfig.fields
    .filter(field => field.isForeignKey && field.type === 'select')
    .map(field => {
      return `useEffect(() => {
    // Load ${field.referencedTable} data for the dropdown
    const loadOptions = async () => {
      try {
        // Replace with actual API call
        const response = await fetch(\`/api/${field.referencedTable.toLowerCase()}\`);
        const data = await response.json();
        
        set${field.name.charAt(0).toUpperCase() + field.name.slice(1)}Options(
          data.map(item => ({
            value: item.id.toString(),
            label: ${field.foreignKeyFields?.map(f => `item.${f}`).join(' + " - " + ')}
          }))
        );
      } catch (error) {
        console.error("Error loading ${field.referencedTable} data:", error);
        toast.error("Failed to load ${field.label} options");
      }
    };
    
    loadOptions();
  }, []);`;
    }).join('\n\n  ');

  return `${imports}

export const ${formConfig.name.replace(/\s+/g, '')} = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  ${foreignKeyOptions}
  
  // Define the form schema
  const formSchema = z.object({
    ${validationSchema}
  });
  
  // Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Initialize form values
    },
  });
  
  // Load data for foreign key dropdowns
  ${loadForeignKeyData}
  
  useEffect(() => {
    // If editing an existing record, load its data
    if (id) {
      const loadData = async () => {
        setLoading(true);
        try {
          // Replace with actual API call
          const response = await fetch(\`/api/${formConfig.tableName.toLowerCase()}/$\{id\}\`);
          const data = await response.json();
          
          // Set form values
          form.reset(data);
        } catch (error) {
          console.error("Error loading record:", error);
          toast.error("Failed to load record");
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }
  }, [id, form]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Determine if this is a create or update operation
      const method = id ? 'PUT' : 'POST';
      const url = id 
        ? \`/api/${formConfig.tableName.toLowerCase()}/$\{id\}\` 
        : \`/api/${formConfig.tableName.toLowerCase()}\`;
      
      // Submit the form data
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save record');
      }
      
      toast.success(\`Record $\{id ? 'updated' : 'created'\} successfully\`);
      
      // Optionally redirect or reset form after success
    } catch (error) {
      console.error("Error saving record:", error);
      toast.error("Failed to save record");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">${formConfig.name}</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          ${formFields}
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : id ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
`;
};

// Function to save form configuration to the database
export const saveFormConfig = async (formConfig: FormConfig): Promise<boolean> => {
  try {
    // In a real app, this would be an API call to save to the database
    console.log("Saving form configuration:", formConfig);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error("Error saving form configuration:", error);
    return false;
  }
};

// Function to load saved form configurations
export const loadFormConfigs = async (): Promise<FormConfig[]> => {
  try {
    // In a real app, this would be an API call to load from the database
    console.log("Loading form configurations");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data
    return [];
  } catch (error) {
    console.error("Error loading form configurations:", error);
    return [];
  }
};
