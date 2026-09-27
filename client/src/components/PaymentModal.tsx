import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { usePediatric } from "../context/PediatricContext";
import { CreditCard, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  amount: number;
  description: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  patientId,
  amount,
  description,
}: PaymentModalProps) {
  const { processPayment } = usePediatric();
  const [isProcessing, setIsProcessing] = useState(false);
  const [method, setMethod] = useState("Credit Card");

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      await processPayment({
        patientId,
        amount,
        currency: "INR", // Mock default
        description,
        paymentMethod: method as any,
      });
      alert("Payment successful!");
      onClose();
    } catch (error) {
      alert("Payment failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" /> Make a Payment
          </DialogTitle>
          <DialogDescription>
            Complete your payment for the consultation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="bg-muted p-4 border border-border text-center rounded-md mb-2">
            <div className="text-sm text-muted-foreground uppercase">
              {description}
            </div>
            <div className="text-3xl font-bold text-foreground mt-1">
              ₹{amount.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="method" className="text-right">
              Method
            </Label>
            <div className="col-span-3">
              <Select
                value={method}
                onValueChange={val => setMethod(val || "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit Card">Credit/Debit Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="International Wire">
                    International Wire (USD)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {method === "Credit Card" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="card" className="text-right">
                Card No
              </Label>
              <Input
                id="card"
                placeholder="**** **** **** 1234"
                className="col-span-3"
              />
            </div>
          )}
          {method === "UPI" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="upi" className="text-right">
                UPI ID
              </Label>
              <Input id="upi" placeholder="user@upi" className="col-span-3" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handlePay} disabled={isProcessing} className="w-24">
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Pay Now"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
