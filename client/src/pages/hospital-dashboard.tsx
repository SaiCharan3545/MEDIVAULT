import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Shield, Brain, Search, Check, X, Coins, Circle, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import SearchInterface from "@/components/search-interface";
import MedicalRecordCard from "@/components/medical-record-card";

interface Hospital {
  id: string;
  name: string;
}

interface HospitalSession {
  authenticated: boolean;
  hospital: Hospital;
}

interface SearchResult {
  id: string;
  name: string;
  age: number | null;
  gender: string | null;
  contact: string | null;
  problem: string;
  allowed: boolean;
  rewardGiven: boolean;
  revenue: number;
  relevanceScore: number;
}

export default function HospitalDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentQuery, setCurrentQuery] = useState("");

  // Check hospital session
  const { data: session, isLoading: sessionLoading, error: sessionError } = useQuery<HospitalSession>({
    queryKey: ["/api/hospital/session"],
    retry: false,
  });

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/hospital/search", { query });
      return response.json();
    },
    onSuccess: (data) => {
      setSearchResults(data.results);
      setCurrentQuery(data.query);
      toast({
        title: "Search Complete",
        description: `Found ${data.results.length} matching records`,
      });
    },
    onError: (error) => {
      toast({
        title: "Search Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/hospital/logout", {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      setLocation("/hospital/login");
    },
    onError: (error) => {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!sessionLoading && (!session?.authenticated || sessionError)) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the hospital dashboard",
        variant: "destructive",
      });
      setLocation("/hospital/login");
    }
  }, [session, sessionLoading, sessionError, setLocation, toast]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      searchMutation.mutate(query.trim());
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying hospital session...</p>
        </div>
      </div>
    );
  }

  if (!session?.authenticated) {
    return null; // Will redirect via useEffect
  }

  const hospital = session.hospital;

  const allowedResults = searchResults.filter(r => r.allowed);
  const deniedResults = searchResults.filter(r => !r.allowed);
  const rewardedToday = searchResults.filter(r => r.rewardGiven).length;

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
            <Button variant="outline" onClick={handleLogout} disabled={logoutMutation.isPending}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/">
              <Button variant="ghost" className="inline-flex items-center mb-2" data-testid="button-back">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Hospital Dashboard</h1>
            <p className="text-muted-foreground">Logged in as <span className="font-medium" data-testid="text-hospital-name">{hospital.name}</span></p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Active Session</div>
            <div className="flex items-center space-x-2 text-secondary">
              <Circle className="w-2 h-2 fill-current" />
              <span className="font-medium">Connected</span>
            </div>
          </div>
        </div>

        {/* AI Search Interface */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 ai-processing rounded-full flex items-center justify-center">
                <Brain className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">AI-Powered Patient Search</h2>
                <p className="text-muted-foreground">Search for patient records using intelligent medical term matching</p>
              </div>
            </div>
            
            <SearchInterface 
              onSearch={handleSearch}
              isLoading={searchMutation.isPending}
            />
          </CardContent>
        </Card>

        {/* Search Results */}
        {(searchResults.length > 0 || currentQuery) && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground flex items-center">
                <Search className="mr-2 text-muted-foreground" />
                Search Results
              </h3>
              <div className="text-sm text-muted-foreground">
                {currentQuery && (
                  <span>Showing results for: <span className="font-medium text-foreground" data-testid="text-search-query">"{currentQuery}"</span></span>
                )}
              </div>
            </div>

            {searchResults.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No patients found matching your search criteria.</p>
                  <p className="text-sm text-muted-foreground mt-2">Try using different medical terms or conditions.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {searchResults.map((patient, index) => (
                  <MedicalRecordCard 
                    key={patient.id}
                    patient={patient}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Access Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Searches Today</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-searches-today">
                    {currentQuery ? "1" : "0"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Search className="text-primary text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Authorized Access</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-authorized-access">
                    {allowedResults.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Check className="text-secondary text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Access Denied</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-access-denied">
                    {deniedResults.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                  <X className="text-destructive text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
