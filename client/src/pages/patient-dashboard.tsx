import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Shield, NotebookPen, Coins, Eye, Hospital, Clock, Star, History, Edit, Box, Circle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BlockchainHash from "@/components/blockchain-hash";

interface Patient {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  contactNo: string;
  address: string;
  problemDesc: string;
  accessData: string;
  revenue: string;
  createdAt: string;
  blockchainHash?: string;
}

interface AccessLog {
  id: string;
  hospitalId: string;
  accessTime: string;
  allowed: boolean;
  rewardGiven: boolean;
  searchQuery: string;
}

export default function PatientDashboard() {
  const params = useParams();
  const patientId = params.id;

  const { data: patient, isLoading: patientLoading } = useQuery({
    queryKey: ["/api/patient/login"],
    queryFn: async () => {
      const response = await fetch("/api/patient/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      });
      if (!response.ok) throw new Error("Failed to fetch patient data");
      const result = await response.json();
      return result.patient as Patient;
    },
    enabled: !!patientId,
  });

  const { data: accessLogs = [] } = useQuery<AccessLog[]>({
    queryKey: ["/api/patient", patientId, "access-logs"],
    enabled: !!patientId,
  });

  if (patientLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Patient Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The patient ID you provided could not be found.
            </p>
            <Link href="/patient/login">
              <Button>Try Again</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allowedHospitals = patient.accessData ? patient.accessData.split(" ") : [];
  const recentRewards = accessLogs.filter((log: AccessLog) => log.rewardGiven).slice(0, 3);
  const totalAccesses = accessLogs.length;
  const lastAccess = accessLogs[0]?.accessTime;

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
                <p className="text-xs text-muted-foreground">Patient Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="trust-indicator hidden sm:flex">
                <Shield className="w-3 h-3 mr-1" />
                <span className="text-xs">Blockchain Protected</span>
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl animate-scale-in">
            <NotebookPen className="text-white w-8 h-8" />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-gradient">Welcome Back!</h1>
            <p className="text-xl text-muted-foreground">
              <span className="font-semibold text-foreground" data-testid="text-patient-name">{patient.patientName}</span>
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  <Circle className="w-3 h-3 mr-1 fill-current text-green-500" />
                  Active Profile
                </Badge>
              </div>
              <div className="text-muted-foreground">
                Patient #{patient.id ? patient.id.slice(-6) : 'N/A'}
              </div>
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-xs" data-testid="button-back">
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="medical-card group cursor-pointer transition-all duration-300 hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gradient" data-testid="text-total-rewards">
                  ${parseFloat(patient.revenue || "0").toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total Earned</div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  💰 From {recentRewards.length} recent data shares
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="medical-card group cursor-pointer transition-all duration-300 hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gradient" data-testid="text-total-accesses">{totalAccesses}</div>
                <div className="text-sm text-muted-foreground">Data Accesses</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  👁️ {lastAccess ? `Last: ${new Date(lastAccess).toLocaleDateString()}` : "No access yet"}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="medical-card group cursor-pointer transition-all duration-300 hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Hospital className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gradient" data-testid="text-authorized-hospitals">{allowedHospitals.length}</div>
                <div className="text-sm text-muted-foreground">Authorized Hospitals</div>
                <div className="text-xs text-purple-600 dark:text-purple-400">
                  🏥 Manage access permissions
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Patient Profile */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Medical Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <NotebookPen className="mr-2 text-secondary" />
                  Medical Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-foreground font-medium" data-testid="text-full-name">{patient.patientName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Age</label>
                    <p className="text-foreground font-medium" data-testid="text-age">{patient.age || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                    <p className="text-foreground font-medium" data-testid="text-gender">{patient.gender || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact</label>
                    <p className="text-foreground font-medium" data-testid="text-contact">{patient.contactNo || "Not provided"}</p>
                  </div>
                </div>
                
                {patient.address && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-foreground mt-1" data-testid="text-address">{patient.address}</p>
                  </div>
                )}
                
                <div className="mt-4">
                  <label className="text-sm font-medium text-muted-foreground">Medical Condition</label>
                  <p className="text-foreground mt-1 medical-data" data-testid="text-medical-condition">
                    {patient.problemDesc}
                  </p>
                </div>
                
                <div className="mt-4">
                  <label className="text-sm font-medium text-muted-foreground">Profile Created</label>
                  <p className="text-foreground font-medium" data-testid="text-profile-created">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Security */}
            {patient.blockchainHash && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Box className="mr-2 text-primary" />
                  Blockchain Security Hash
                </h3>
                <BlockchainHash hash={patient.blockchainHash} />
                <p className="text-xs text-muted-foreground mt-2">
                  This cryptographic hash ensures your data integrity and authenticity
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Access Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 text-accent" />
                  Access Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allowedHospitals.map((hospital) => (
                    <div key={hospital} className="flex items-center justify-between p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                      <div>
                        <div className="font-medium text-foreground" data-testid={`text-hospital-${hospital.toLowerCase()}`}>{hospital}</div>
                        <div className="text-xs text-muted-foreground">
                          {hospital === "Hospital1" ? "General Medicine" : "Specialized Care"}
                        </div>
                      </div>
                      <Badge variant="secondary">Authorized</Badge>
                    </div>
                  ))}
                  
                  {allowedHospitals.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      No hospitals authorized yet
                    </p>
                  )}
                </div>
                
                <Button variant="outline" className="w-full mt-4" data-testid="button-manage-permissions">
                  <Edit className="mr-2 h-4 w-4" />
                  Manage Permissions
                </Button>
              </CardContent>
            </Card>

            {/* Recent Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 text-accent" />
                  Recent Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentRewards.map((reward: AccessLog, index: number) => (
                    <div key={reward.id} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                      <div>
                        <div className="text-sm font-medium text-foreground" data-testid={`text-reward-hospital-${index}`}>
                          Hospital{reward.hospitalId.slice(-1)}
                        </div>
                        <div className="text-xs text-muted-foreground" data-testid={`text-reward-time-${index}`}>
                          {new Date(reward.accessTime).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-accent font-medium" data-testid={`text-reward-amount-${index}`}>+$0.50</div>
                    </div>
                  ))}
                  
                  {recentRewards.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      No rewards earned yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Access History Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="mr-2 text-muted-foreground" />
              Access History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Hospital</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Access Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {accessLogs.map((access: AccessLog, index: number) => (
                    <tr key={access.id} className="border-b border-border last:border-b-0">
                      <td className="py-3 px-4 text-sm text-foreground font-medium" data-testid={`row-hospital-${index}`}>
                        Hospital{access.hospitalId.slice(-1)}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground" data-testid={`row-time-${index}`}>
                        {new Date(access.accessTime).toLocaleString()}
                      </td>
                      <td className="py-3 px-4" data-testid={`row-status-${index}`}>
                        <Badge variant={access.allowed ? "secondary" : "destructive"}>
                          {access.allowed ? "Allowed" : "Denied"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-accent font-medium" data-testid={`row-reward-${index}`}>
                        {access.rewardGiven ? "+$0.50" : "-"}
                      </td>
                    </tr>
                  ))}
                  
                  {(accessLogs as AccessLog[]).length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground">
                        No access history yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
