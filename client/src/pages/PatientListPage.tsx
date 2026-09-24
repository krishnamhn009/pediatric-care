import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Activity, FileHeart } from "lucide-react";
import { usePediatric } from "../context/PediatricContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const PatientListPage: React.FC = () => {
  const { patients, cases } = usePediatric();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(
    patient =>
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileHeart className="w-8 h-8 text-primary" /> Patient Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Search and access longitudinal Master Health Records for all
            registered patients.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold text-foreground">
                  Patient ID
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Name & Age
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Risk Level
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Active Stage
                </TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map(patient => {
                const activeCase = cases.find(c => c.patientId === patient.id);
                return (
                  <TableRow key={patient.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {patient.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-foreground">
                        {patient.fullName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {patient.ageYears} yrs {patient.ageMonths} mo
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          patient.riskCategory === "Critical"
                            ? "destructive"
                            : patient.riskCategory === "High"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          patient.riskCategory === "High"
                            ? "bg-muted text-primary hover:bg-muted"
                            : patient.riskCategory === "Moderate"
                              ? "border-border text-primary bg-muted"
                              : ""
                        }
                      >
                        {patient.riskCategory}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {activeCase ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                          <Activity className="w-3.5 h-3.5" /> Stage{" "}
                          {activeCase.currentStage}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No active cases
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="link"
                        size="sm"
                        render={<Link to={`/patients/${patient.id}`} />}
                        className="p-0"
                      >
                        View Record &rarr;
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredPatients.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No patients found matching "{searchTerm}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
