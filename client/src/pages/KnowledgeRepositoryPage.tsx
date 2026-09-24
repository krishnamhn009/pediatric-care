import React, { useState } from "react";
import { usePediatric } from "../context/PediatricContext";
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  Database,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const KnowledgeRepositoryPage: React.FC = () => {
  const { cases } = usePediatric();
  const [searchTerm, setSearchTerm] = useState("");

  // Phase 2: Only show closed, consented cases that have been de-identified
  const publishedCases = cases
    .filter(c => c.currentStage === 10)
    .map(c => ({
      ...c,
      // De-identification simulation
      patientName: "[REDACTED]",
      patientId: c.patientId.replace(/PT-/g, "ANON-"),
      dob: "[REDACTED]",
      ageText: c.ageText, // Age is retained
      guardianName: "[REDACTED]",
      guardianPhone: "[REDACTED]",
    }));

  const filteredCases = publishedCases.filter(
    c =>
      c.primaryCondition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.assignedSpecialistName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            Institutional Knowledge Repository
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            De-identified clinical history, outcomes, and intelligence for
            medical education.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden group border-primary/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary/10 p-2 text-primary rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <CardTitle>Curated Teaching Sets</CardTitle>
            </div>
            <CardDescription className="leading-relaxed">
              Standardized case collections designed for residents and junior
              doctors. Contains annotated timelines, diagnostic branching logic,
              and peer-reviewed treatment paths.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge variant="secondary">Congenital Heart Defects</Badge>
              <Badge variant="secondary">PICU Triage</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group border-border">
          <div className="absolute top-0 right-0 w-32 h-32 bg-muted rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-muted p-2 text-primary rounded-lg">
                <Database className="w-5 h-5" />
              </div>
              <CardTitle>Rare-Case Collections</CardTitle>
            </div>
            <CardDescription className="leading-relaxed">
              High-complexity, multi-disciplinary cases isolated for
              institutional review. Fully de-identified and approved by Clinical
              Governance for academic publication.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge variant="secondary">Neuromuscular</Badge>
              <Badge variant="secondary">Neonatal Surgery</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by diagnosis, symptom, or procedure..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </div>

          <div className="space-y-4">
            {filteredCases.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium text-foreground">
                  No closed cases available for the repository yet.
                </p>
                <p className="text-sm mt-1">
                  Complete a clinical case to Stage 10 to publish it here.
                </p>
              </div>
            ) : (
              filteredCases.map(c => (
                <div
                  key={c.id}
                  className="border rounded-lg p-5 hover:border-primary/50 hover:shadow-sm transition-all bg-card"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          variant="secondary"
                          className="font-mono text-primary bg-primary/10 hover:bg-primary/10"
                        >
                          {c.patientId}
                        </Badge>
                        <span className="text-sm font-medium text-muted-foreground">
                          Age: {c.ageText} • {c.ward}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold">
                        {c.primaryCondition}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Chief Complaint: {c.chiefComplaint}
                      </p>
                    </div>
                    <Button variant="secondary" className="gap-2 shrink-0">
                      <FileText className="h-4 w-4" /> View Full Case
                    </Button>
                  </div>

                  <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="block text-muted-foreground font-semibold text-xs uppercase mb-1">
                        Treated By
                      </span>
                      <span className="font-medium">
                        {c.assignedSpecialistName || "Unknown"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-muted-foreground font-semibold text-xs uppercase mb-1">
                        Risk Category
                      </span>
                      <Badge variant="outline">{c.urgency}</Badge>
                    </div>
                    <div className="md:col-span-2">
                      <span className="block text-muted-foreground font-semibold text-xs uppercase mb-1">
                        Resolution Note
                      </span>
                      <span className="font-medium italic">
                        "
                        {c.stageHistory.find(h => h.stageNumber === 10)?.note ||
                          "Case successfully resolved and closed."}
                        "
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
