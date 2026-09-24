import React from "react";
import { PaymentTransaction } from "../context/PediatricContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  CreditCard,
  CheckCircle,
  RefreshCcw,
  XCircle,
  FileText,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface PaymentHistoryProps {
  payments: PaymentTransaction[];
  patientId: string;
}

export function PaymentHistory({ payments, patientId }: PaymentHistoryProps) {
  const patientPayments = payments.filter(p => p.patientId === patientId);

  if (!patientPayments || patientPayments.length === 0) {
    return (
      <Card className="rounded-none shadow-none border-border mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-primary" />
            Billing & Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No transaction history available.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-600 mr-2" />;
      case "Refunded":
        return <RefreshCcw className="w-4 h-4 text-orange-500 mr-2" />;
      case "Failed":
        return <XCircle className="w-4 h-4 text-red-600 mr-2" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-500 mr-2" />;
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
            Paid
          </Badge>
        );
      case "Refunded":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200 rounded-none"
          >
            Refunded
          </Badge>
        );
      case "Failed":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 rounded-none"
          >
            Failed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200 rounded-none"
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card className="rounded-none shadow-none border-border mt-6">
      <CardHeader className="pb-2 border-b border-border flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-primary" />
          Billing & Invoices
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
          {patientPayments.map(txn => (
            <div
              key={txn.id}
              className="p-4 flex justify-between items-center bg-background hover:bg-muted/50 transition-colors"
            >
              <div>
                <div className="font-semibold text-sm text-foreground flex items-center">
                  {getStatusIcon(txn.status)}
                  {txn.description}
                </div>
                <div className="text-xs text-muted-foreground mt-1 ml-6 space-x-2">
                  <span>{new Date(txn.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{txn.paymentMethod}</span>
                  <span>•</span>
                  <span>ID: {txn.id}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="font-bold text-base">
                  {txn.currency === "USD" ? "$" : "₹"}
                  {txn.amount.toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(txn.status)}
                  {txn.status === "Completed" && txn.receiptUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => alert("Downloading receipt...")}
                    >
                      <FileText className="w-3 h-3 mr-1" /> Receipt
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
