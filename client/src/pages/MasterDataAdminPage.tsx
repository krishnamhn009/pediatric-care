import React, { useState } from "react";
import { usePediatric, Specialist } from "../context/PediatricContext";
import { ShieldCheck, Plus, Pencil, Trash2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const MasterDataAdminPage: React.FC = () => {
  const { specialists, addSpecialist, removeSpecialist } = usePediatric();
  const [showAddModal, setShowAddModal] = useState(false);

  const [newSpec, setNewSpec] = useState<Partial<Specialist>>({
    name: "Dr. ",
    title: "Senior Pediatrician",
    specialty: "Cardiology",
    subSpecialty: "",
    experienceYears: 10,
    activeCasesCount: 0,
    maxCapacity: 10,
    responseSlaMinutes: 30,
    matchScoreDefault: 80,
    status: "Available",
    hospitalAffiliation: "Main Network Hospital",
    avatar:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
  });

  const handleAdd = () => {
    addSpecialist(newSpec as Omit<Specialist, "id">);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Master Data Administration
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage the clinical specialist directory and recommendation engine
            weights.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Specialist
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-muted/50 border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-muted-foreground" />
            Specialist Directory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold text-foreground">
                  Name & Title
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Specialty
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Base Match Score
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  SLA (Mins)
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specialists.map(s => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={s.avatar}
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                        alt=""
                      />
                      <div>
                        <div className="font-bold">{s.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {s.title}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{s.specialty}</div>
                    <div className="text-xs text-muted-foreground">
                      {s.subSpecialty}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-primary">
                    {s.matchScoreDefault}%
                  </TableCell>
                  <TableCell className="font-semibold">
                    {s.responseSlaMinutes} m
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpecialist(s.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Specialist</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={newSpec.name}
                onChange={e => setNewSpec({ ...newSpec, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Specialty</Label>
              <Select
                value={newSpec.specialty}
                onValueChange={(val: any) =>
                  setNewSpec({ ...newSpec, specialty: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="Pediatric Surgery">
                    Pediatric Surgery
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Base Match Score (Recommendation Engine)</Label>
              <Input
                type="number"
                value={newSpec.matchScoreDefault}
                onChange={e =>
                  setNewSpec({
                    ...newSpec,
                    matchScoreDefault: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Save Specialist</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
