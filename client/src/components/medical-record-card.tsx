import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Check, X, Coins, Shield, Lock } from "lucide-react";

interface Patient {
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

interface MedicalRecordCardProps {
  patient: Patient;
  index: number;
}

export default function MedicalRecordCard({ patient, index }: MedicalRecordCardProps) {
  const isAccessible = patient.allowed;
  
  return (
    <Card className={`${!isAccessible ? "opacity-60" : ""}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isAccessible ? "bg-primary/10" : "bg-muted/50"
            }`}>
              <User className={`text-xl ${isAccessible ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <h4 className={`text-lg font-semibold ${isAccessible ? "text-foreground" : "text-muted-foreground"}`} 
                  data-testid={`text-patient-name-${index}`}>
                {patient.name}
              </h4>
              <p className="text-sm text-muted-foreground" data-testid={`text-patient-id-${index}`}>
                Patient ID: {patient.id}
              </p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <Badge 
              variant={isAccessible ? "secondary" : "destructive"}
              data-testid={`badge-access-status-${index}`}
            >
              {isAccessible ? (
                <>
                  <Check className="mr-1 h-3 w-3" />
                  Access Granted
                </>
              ) : (
                <>
                  <X className="mr-1 h-3 w-3" />
                  Access Denied
                </>
              )}
            </Badge>
            {isAccessible && (
              <div className={`text-xs font-medium ${patient.rewardGiven ? "text-accent" : "text-muted-foreground"}`}
                   data-testid={`text-reward-status-${index}`}>
                {patient.rewardGiven ? (
                  <>
                    <Coins className="inline mr-1 h-3 w-3" />
                    +$0.50 Reward Given
                  </>
                ) : (
                  "Daily reward limit reached"
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-muted-foreground">Age</label>
            <p className={`font-medium ${isAccessible ? "text-foreground" : "text-muted-foreground"}`}
               data-testid={`text-patient-age-${index}`}>
              {isAccessible ? (patient.age || "Not specified") : "***"}
            </p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Gender</label>
            <p className={`font-medium ${isAccessible ? "text-foreground" : "text-muted-foreground"}`}
               data-testid={`text-patient-gender-${index}`}>
              {isAccessible ? (patient.gender || "Not specified") : "***"}
            </p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Contact</label>
            <p className={`font-medium ${isAccessible ? "text-foreground" : "text-muted-foreground"}`}
               data-testid={`text-patient-contact-${index}`}>
              {isAccessible ? (patient.contact || "Not provided") : "*** *** ****"}
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="text-xs text-muted-foreground">Medical Condition</label>
          {isAccessible ? (
            <p className="text-foreground mt-1 medical-data" data-testid={`text-patient-problem-${index}`}>
              {patient.problem}
            </p>
          ) : (
            <div className="mt-1 p-3 bg-muted/50 rounded-lg border-2 border-dashed border-muted">
              <p className="text-muted-foreground text-center" data-testid={`text-access-denied-${index}`}>
                <Lock className="inline mr-2 h-4 w-4" />
                Patient has not granted access to this hospital
              </p>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Access attempted: <span className="font-medium">Just now</span>
          </div>
          <div className="flex items-center space-x-4">
            {patient.relevanceScore > 0 && (
              <div className="text-xs text-muted-foreground">
                Relevance: <span className="font-medium text-foreground">{patient.relevanceScore}%</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-xs">
              <Shield className={`h-4 w-4 ${isAccessible ? "text-secondary" : "text-muted-foreground"}`} />
              <span className="text-muted-foreground">
                Blockchain {isAccessible ? "verified" : "protected"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
