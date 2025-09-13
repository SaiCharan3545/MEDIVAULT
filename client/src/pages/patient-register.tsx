import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { ArrowLeft, UserPlus, NotebookPen, Shield, Box, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  patientName: z.string().min(1, "Full name is required"),
  age: z.string().optional(),
  gender: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
  problemDesc: z.string().min(10, "Please provide a detailed description of your medical condition"),
  accessData: z.array(z.string()).min(1, "Please select at least one hospital"),
});

type FormData = z.infer<typeof formSchema>;

export default function PatientRegister() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    patientId: string;
    patientNumber: number;
    blockchainHash: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      age: "",
      gender: "",
      contactNo: "",
      address: "",
      problemDesc: "",
      accessData: [],
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        age: data.age ? parseInt(data.age) : null,
        accessData: data.accessData.join(" "),
      };
      
      const response = await apiRequest("POST", "/api/patient/register", payload);
      return response.json();
    },
    onSuccess: (data) => {
      // Enhanced success animation with delayed state update
      setTimeout(() => {
        setRegistrationSuccess({
          patientId: data.patientId,
          patientNumber: data.patientNumber,
          blockchainHash: data.blockchainHash,
        });
      }, 200);
      
      toast({
        title: "🎉 Registration Successful!",
        description: "Your secure medical profile has been created with blockchain protection.",
        duration: 4000,
      });
    },
    onError: (error) => {
      toast({
        title: "❌ Registration Failed",
        description: `Unable to create your profile: ${error.message}. Please try again.`,
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const onSubmit = (data: FormData) => {
    registerMutation.mutate(data);
  };

  const copyPatientNumber = async () => {
    if (registrationSuccess?.patientNumber) {
      try {
        await navigator.clipboard.writeText(registrationSuccess.patientNumber.toString());
        setCopied(true);
        toast({
          title: "Patient Number Copied!",
          description: "Patient Number has been copied to your clipboard",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast({
          title: "Copy Failed",
          description: "Please manually copy your Patient Number",
          variant: "destructive",
        });
      }
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="text-primary-foreground text-sm" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">SecureHealth</h1>
                  <p className="text-xs text-muted-foreground">Blockchain + AI Data Portal</p>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <UserPlus className="text-secondary text-2xl" />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-foreground">Registration Successful!</h1>
                <p className="text-muted-foreground mt-2">Your secure medical profile has been created</p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2">Your Patient Number</h3>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-4xl font-bold text-primary flex-1" data-testid="text-patient-number">
                    #{registrationSuccess.patientNumber}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyPatientNumber}
                    className="shrink-0"
                    data-testid="button-copy-patient-number"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    ✅ Much easier to remember!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    • Simply remember your Patient Number: #{registrationSuccess.patientNumber}
                    <br />
                    • To log in, use your Patient Number + Contact Number
                    <br />
                    • Much simpler than complex IDs!
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 mb-3">
                  <p className="text-xs text-muted-foreground">
                    <strong>For reference:</strong> Your unique Patient ID is {registrationSuccess.patientId}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Forgot your Patient Number? Use the "Forgot Patient Number?" link on the login page
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2 flex items-center">
                  <Box className="mr-2 h-4 w-4 text-primary" />
                  Blockchain Security Hash
                </h4>
                <p className="text-xs font-mono text-muted-foreground break-all" data-testid="text-blockchain-hash">
                  {registrationSuccess.blockchainHash}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This cryptographic hash ensures your data integrity and authenticity
                </p>
              </div>

              <div className="space-y-3">
                <Link href={`/patient/dashboard/${registrationSuccess.patientId}`}>
                  <Button className="w-full" data-testid="button-view-dashboard">
                    View My Dashboard
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full" data-testid="button-back-home">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 relative overflow-hidden">
      {/* Enhanced background with medical theme */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">SecureHealth</h1>
                <p className="text-xs text-muted-foreground">Secure Patient Registration</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="text-center space-y-6 mb-12">
          <div className="w-20 h-20 gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl animate-scale-in">
            <NotebookPen className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-3">Create Your Medical Profile</h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Join the future of secure healthcare data sharing with blockchain protection and AI-powered matching
            </p>
          </div>
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-8 h-0.5 bg-primary" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-8 h-0.5 bg-primary" />
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Complete Your Medical Profile</p>
        </div>

        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-border/50">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <UserPlus className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="patientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} data-testid="input-patient-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Age" {...field} data-testid="input-age" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-gender">
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Phone number" {...field} data-testid="input-contact" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your complete address" 
                            className="resize-none" 
                            {...field}
                            data-testid="textarea-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                    <NotebookPen className="inline mr-2 text-secondary" />
                    Medical Information
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="problemDesc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Condition / Problem Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your medical condition, symptoms, diagnosis, etc." 
                            className="resize-none min-h-[100px]" 
                            {...field}
                            data-testid="textarea-problem-desc"
                          />
                        </FormControl>
                        <FormDescription>
                          Provide detailed information about your medical condition
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Access Control */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                    <Shield className="inline mr-2 text-accent" />
                    Data Access Permissions
                  </h3>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Select which hospitals can access your medical data. You can change these permissions later.
                    </p>
                    
                    <FormField
                      control={form.control}
                      name="accessData"
                      render={() => (
                        <FormItem>
                          <div className="space-y-3">
                            {["Hospital1", "Hospital2"].map((hospital) => (
                              <FormField
                                key={hospital}
                                control={form.control}
                                name="accessData"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={hospital}
                                      className="flex flex-row items-start space-x-3 space-y-0 p-3 bg-card border border-border rounded-lg"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(hospital)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, hospital])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== hospital
                                                  )
                                                )
                                          }}
                                          data-testid={`checkbox-${hospital.toLowerCase()}`}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none flex-1">
                                        <FormLabel className="font-medium text-foreground">
                                          {hospital} - {hospital === "Hospital1" ? "General Medicine" : "Specialized Care"}
                                        </FormLabel>
                                        <p className="text-sm text-muted-foreground">
                                          {hospital === "Hospital1" 
                                            ? "Specialized in internal medicine and general healthcare"
                                            : "Advanced diagnostics and specialized treatments"
                                          }
                                        </p>
                                      </div>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Blockchain Security Notice */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Box className="text-primary mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">Blockchain Security</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your data will be secured with cryptographic hashing. A unique blockchain record will be created 
                        to ensure data integrity and verify access permissions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-gradient-to-r from-primary via-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl group relative overflow-hidden" 
                    disabled={registerMutation.isPending}
                    data-testid="button-submit-registration"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    {registerMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        <span className="animate-pulse">Creating Your Secure Profile...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span>Create Secure Profile</span>
                        <Shield className="ml-3 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
