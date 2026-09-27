import React from "react";
import { VaccinationRecord } from "../context/PediatricContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Shield, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";

interface VaccinationScheduleProps {
  records: VaccinationRecord[];
}

export function VaccinationSchedule({ records }: VaccinationScheduleProps) {
  if (!records || records.length === 0) {
    return (
      <Card className="rounded-none shadow-none border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center">
            <Shield className="w-5 h-5 mr-2 text-primary" />
            Vaccination Record
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No vaccination records available.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-600 mr-2" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-600 mr-2" />;
      case "Overdue":
        return <AlertCircle className="w-4 h-4 text-red-600 mr-2" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 rounded-none"
          >
            Completed
          </Badge>
        );
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 rounded-none"
          >
            Pending
          </Badge>
        );
      case "Overdue":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 rounded-none"
          >
            Overdue
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="rounded-none shadow-none border-border">
      <CardHeader className="pb-2 border-b border-border">
        <CardTitle className="text-lg font-bold flex items-center">
          <Shield className="w-5 h-5 mr-2 text-primary" />
          Vaccination Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {records.map(record => (
            <div
              key={record.id}
              className="p-4 flex justify-between items-center bg-background hover:bg-muted/50 transition-colors"
            >
              <div>
                <div className="font-semibold text-sm text-foreground flex items-center">
                  {getStatusIcon(record.status)}
                  {record.vaccineName}
                </div>
                <div className="text-xs text-muted-foreground mt-1 ml-6">
                  {record.status === "Completed" ? (
                    <span>
                      Given on{" "}
                      {new Date(record.dateGiven!).toLocaleDateString()}
                    </span>
                  ) : (
                    <span>
                      Due by {new Date(record.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div>{getStatusBadge(record.status)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
