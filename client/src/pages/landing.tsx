import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-provider";
import { Shield, Brain, Coins, UserCheck, Hospital, Lock, Circle, ArrowRight, CheckCircle, Star, Zap, Users, Globe } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">SecureHealth</h1>
                <p className="text-xs text-muted-foreground">Blockchain + AI Medical Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="trust-indicator hidden sm:flex">
                <Lock className="w-3 h-3 mr-1" />
                <span className="text-xs">End-to-End Encrypted</span>
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Badge variant="outline" className="status-success animate-scale-in">
                <CheckCircle className="w-3 h-3 mr-1" />
                HIPAA Compliant
              </Badge>
              <Badge variant="outline" className="status-info">
                <Star className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="status-warning">
                <Zap className="w-3 h-3 mr-1" />
                Blockchain Secured
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="text-gradient">Secure Medical Data</span>
                <br />
                <span className="text-foreground">Sharing Revolution</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                The future of healthcare data is here. <span className="text-primary font-semibold">Blockchain security</span>, 
                <span className="text-secondary font-semibold"> AI-powered search</span>, and 
                <span className="text-accent font-semibold">patient-controlled access</span> in one revolutionary platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link href="/patient/register">
                <Button size="lg" className="group relative overflow-hidden gradient-primary text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6 interactive-hover" data-testid="button-hero-patient">
                  <UserCheck className="mr-2 h-5 w-5" />
                  Start as Patient
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/hospital/login">
                <Button size="lg" variant="outline" className="group border-2 hover:bg-secondary hover:border-secondary hover:text-white transition-all duration-300 text-lg px-8 py-6 interactive-hover" data-testid="button-hero-hospital">
                  <Hospital className="mr-2 h-5 w-5" />
                  Hospital Access
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 animate-slide-up">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Data Security</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">AI-Powered</div>
                <div className="text-sm text-muted-foreground">Smart Matching</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">Patient-First</div>
                <div className="text-sm text-muted-foreground">Control & Rewards</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose SecureHealth?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the next generation of medical data sharing with cutting-edge technology and uncompromising security.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="medical-card group cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Blockchain Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Military-grade cryptographic hashing ensures complete data integrity, immutable records, and patient ownership verification.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-secondary font-medium">256-bit Encryption</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="medical-card group cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">AI-Powered Search</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced machine learning algorithms intelligently match hospitals with relevant patient cases using semantic analysis.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-secondary font-medium">Smart Matching</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="medical-card group cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Coins className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Reward Ecosystem</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Patients earn valuable rewards for sharing data responsibly while maintaining complete control over access permissions.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-secondary font-medium">0.5 Points/Access</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Trusted by Healthcare Professionals
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of patients and healthcare providers who trust SecureHealth for secure, 
                efficient medical data sharing with blockchain security and AI intelligence.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">10,000+</div>
                    <div className="text-sm text-muted-foreground">Active Patients</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Hospital className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">50+</div>
                    <div className="text-sm text-muted-foreground">Partner Hospitals</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Global</div>
                    <div className="text-sm text-muted-foreground">Blockchain Network</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">100%</div>
                    <div className="text-sm text-muted-foreground">Secure Transactions</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="glass-effect rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Real-time Blockchain Validation</div>
                    <div className="text-sm text-muted-foreground">Every transaction verified instantly</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Advanced AI Matching</div>
                    <div className="text-sm text-muted-foreground">Intelligent case similarity detection</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Patient-Controlled Access</div>
                    <div className="text-sm text-muted-foreground">You decide who sees your data</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Portal
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started with SecureHealth today. Select your role to access the appropriate portal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Patient Portal */}
            <Card className="medical-card group relative overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="relative p-10">
                <div className="space-y-8">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <UserCheck className="text-white w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">Patient Portal</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Take control of your medical data. Create your secure profile, manage access permissions, 
                        and earn rewards for sharing data responsibly.
                      </p>
                    </div>
                    
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>Simple Patient Numbers (e.g., Patient #123)</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>Blockchain Security & Data Ownership</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>Earn 0.5 Rewards per Hospital Access</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Link href="/patient/register">
                      <Button size="lg" className="w-full group gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 interactive-press" data-testid="button-patient-register">
                        <UserCheck className="mr-2 h-5 w-5" />
                        Create Patient Account
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link href="/patient/login">
                      <Button size="lg" variant="outline" className="w-full border-2 hover:bg-primary/5 interactive-hover" data-testid="button-patient-login">
                        <Lock className="mr-2 h-5 w-5" />
                        Patient Login
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hospital Portal */}
            <Card className="medical-card group relative overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="relative p-10">
                <div className="space-y-8">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 gradient-secondary rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Hospital className="text-white w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">Hospital Portal</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Access authorized patient data with our advanced AI search engine. 
                        Find relevant cases quickly while respecting patient privacy.
                      </p>
                    </div>
                    
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>AI-Powered Medical Search</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>Real-time Authorization Checks</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>Comprehensive Audit Trail</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Link href="/hospital/login">
                      <Button size="lg" className="w-full group gradient-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300 interactive-press" data-testid="button-hospital-login">
                        <Hospital className="mr-2 h-5 w-5" />
                        Hospital Access
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <div className="text-center">
                      <Badge variant="outline" className="text-xs">
                        Available: Hospital1, Hospital2
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card/50 backdrop-blur-sm border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gradient">SecureHealth</h3>
                  <p className="text-xs text-muted-foreground">Blockchain + AI Medical Portal</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                Revolutionizing healthcare data sharing with blockchain security, AI-powered intelligence, 
                and patient-controlled access. Join the future of medical data management.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="status-success">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  HIPAA Compliant
                </Badge>
                <Badge variant="outline" className="status-info">
                  <Zap className="w-3 h-3 mr-1" />
                  Blockchain Secured
                </Badge>
                <Badge variant="outline" className="status-warning">
                  <Star className="w-3 h-3 mr-1" />
                  AI-Enhanced
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-6">Platform Features</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Blockchain Data Integrity</span>
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-secondary" />
                  <span>AI-Powered Search</span>
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-accent" />
                  <span>End-to-End Encryption</span>
                </li>
                <li className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-accent" />
                  <span>Patient Reward System</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-6">System Status</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Blockchain Network</span>
                  <span className="text-secondary flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-current" />
                    <span className="font-medium">Online</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">AI Search Engine</span>
                  <span className="text-secondary flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-current" />
                    <span className="font-medium">Active</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Security Layer</span>
                  <span className="text-secondary flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-current" />
                    <span className="font-medium">Protected</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Data Privacy</span>
                  <span className="text-secondary flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-current" />
                    <span className="font-medium">Secured</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border/50 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                &copy; 2024 SecureHealth. Transforming healthcare data with blockchain and AI technology.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Security</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
