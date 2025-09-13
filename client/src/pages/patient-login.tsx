import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { ArrowLeft, LogIn, Shield, Search, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const numberLoginSchema = z.object({
  patientNumber: z.string().min(1, "Patient number is required"),
  contactNo: z.string().min(1, "Contact number is required"),
});

const uuidLoginSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
});

const lookupSchema = z.object({
  patientName: z.string().min(1, "Full name is required"),
  contactNo: z.string().min(1, "Contact number is required"),
});

type NumberLoginData = z.infer<typeof numberLoginSchema>;
type UuidLoginData = z.infer<typeof uuidLoginSchema>;
type LookupData = z.infer<typeof lookupSchema>;

export default function PatientLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loginMethod, setLoginMethod] = useState<'number' | 'uuid'>('number');
  const [showLookup, setShowLookup] = useState(false);
  const [foundPatient, setFoundPatient] = useState<{ patientId: string; patientNumber: number } | null>(null);

  const numberForm = useForm<NumberLoginData>({
    resolver: zodResolver(numberLoginSchema),
    defaultValues: {
      patientNumber: "",
      contactNo: "",
    },
  });

  const uuidForm = useForm<UuidLoginData>({
    resolver: zodResolver(uuidLoginSchema),
    defaultValues: {
      patientId: "",
    },
  });

  const lookupForm = useForm<LookupData>({
    resolver: zodResolver(lookupSchema),
    defaultValues: {
      patientName: "",
      contactNo: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: NumberLoginData | UuidLoginData) => {
      const response = await apiRequest("POST", "/api/patient/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        setLocation(`/patient/dashboard/${data.patient.id}`);
      }
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const lookupMutation = useMutation({
    mutationFn: async (data: LookupData) => {
      const response = await apiRequest("POST", "/api/patient/lookup", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.patientId && data.patientNumber) {
        setFoundPatient({ patientId: data.patientId, patientNumber: data.patientNumber });
        if (loginMethod === 'number') {
          numberForm.setValue("patientNumber", data.patientNumber.toString());
        } else {
          uuidForm.setValue("patientId", data.patientId);
        }
        setShowLookup(false);
        toast({
          title: "Patient Found!",
          description: `Patient #${data.patientNumber} found! Login information has been filled in.`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Patient Not Found",
        description: "No patient found with the provided information. Please check your details.",
        variant: "destructive",
      });
    },
  });

  const onNumberSubmit = (data: NumberLoginData) => {
    loginMutation.mutate(data);
  };

  const onUuidSubmit = (data: UuidLoginData) => {
    loginMutation.mutate(data);
  };

  const onLookupSubmit = (data: LookupData) => {
    lookupMutation.mutate(data);
  };

  const useFoundPatient = () => {
    if (foundPatient) {
      if (loginMethod === 'number') {
        numberForm.setValue("patientNumber", foundPatient.patientNumber.toString());
      } else {
        uuidForm.setValue("patientId", foundPatient.patientId);
      }
      setFoundPatient(null);
    }
  };

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

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-4 mb-8">
          <Link href="/">
            <Button variant="ghost" className="inline-flex items-center" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Patient Login</h1>
          <p className="text-muted-foreground">Access your medical profile and view rewards</p>
        </div>

        <Card>
          <CardContent className="p-8">
            {/* Login Method Toggle */}
            <div className="mb-6">
              <div className="flex rounded-lg border border-border p-1 bg-muted/50">
                <button
                  type="button"
                  onClick={() => setLoginMethod('number')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    loginMethod === 'number'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid="button-login-method-number"
                >
                  Patient Number
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('uuid')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    loginMethod === 'uuid'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid="button-login-method-uuid"
                >
                  Advanced (UUID)
                </button>
              </div>
            </div>

            {/* Patient Number + Contact Login Form */}
            {loginMethod === 'number' && (
              <div>
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 text-center">
                    ✨ Simple login with your Patient Number + Contact
                  </p>
                </div>
                <Form {...numberForm}>
                  <form onSubmit={numberForm.handleSubmit(onNumberSubmit)} className="space-y-4">
                    <FormField
                      control={numberForm.control}
                      name="patientNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., 123" 
                              {...field} 
                              data-testid="input-patient-number"
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            The simple number you received when registering (e.g., #123)
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={numberForm.control}
                      name="contactNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your contact number" 
                              {...field} 
                              data-testid="input-contact-number"
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            The contact number you used during registration
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                      data-testid="button-login-number"
                    >
                      {loginMutation.isPending ? (
                        "Accessing Profile..."
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Access My Profile
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            )}

            {/* UUID Login Form */}
            {loginMethod === 'uuid' && (
              <div>
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                    🔧 Advanced: Login with your original Patient ID
                  </p>
                </div>
                <Form {...uuidForm}>
                  <form onSubmit={uuidForm.handleSubmit(onUuidSubmit)} className="space-y-4">
                    <FormField
                      control={uuidForm.control}
                      name="patientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient ID</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your Patient ID" 
                              {...field} 
                              data-testid="input-patient-id"
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            Use the long Patient ID provided during registration
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                      data-testid="button-login-uuid"
                    >
                      {loginMutation.isPending ? (
                        "Accessing Profile..."
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Access My Profile
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            )}
            
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowLookup(!showLookup)}
                  className="text-sm text-primary hover:underline"
                  data-testid="button-forgot-patient-number"
                >
                  Forgot your Patient Number?
                </button>
              </div>

              {showLookup && (
                <div className="border border-border rounded-lg p-4 bg-muted/30">
                  <h3 className="font-medium text-foreground mb-3 flex items-center">
                    <Search className="mr-2 h-4 w-4" />
                    Patient ID Lookup
                  </h3>
                  <Form {...lookupForm}>
                    <form onSubmit={lookupForm.handleSubmit(onLookupSubmit)} className="space-y-3">
                      <FormField
                        control={lookupForm.control}
                        name="patientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full name (exact match)" 
                                {...field} 
                                data-testid="input-lookup-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={lookupForm.control}
                        name="contactNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Contact Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your contact number" 
                                {...field} 
                                data-testid="input-lookup-contact"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-2">
                        <Button 
                          type="submit" 
                          size="sm" 
                          disabled={lookupMutation.isPending}
                          data-testid="button-lookup-submit"
                        >
                          {lookupMutation.isPending ? "Searching..." : "Find My Patient ID"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowLookup(false)}
                          data-testid="button-lookup-cancel"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  Don't have an account? <Link href="/patient/register" className="text-primary hover:underline">Register here</Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
