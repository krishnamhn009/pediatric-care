import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CreditCard,
  DollarSign,
  Activity,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  HeartPulse,
  Shield,
  Bell,
  BedDouble,
} from "lucide-react";
import { usePediatric, ExecutiveAlert } from "../context/PediatricContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart } from "recharts";

interface WardData {
  id: string;
  name: string;
  short: string;
  occupancy: number;
  capacity: number;
  occupiedBeds: number;
  status: "Low" | "Moderate" | "High" | "Critical";
  note: string;
  color: string;
  trend: "up" | "down" | "stable";
  activePatients: Array<{
    name: string;
    id: string;
    acuity: string;
    wait: string;
  }>;
}

const INITIAL_WARDS: WardData[] = [
  {
    id: "picu",
    name: "Pediatric Intensive Care (PICU)",
    short: "PICU",
    occupancy: 92,
    capacity: 25,
    occupiedBeds: 23,
    status: "Critical",
    note: "2 beds available \u00b7 Cardiac & Neuro intensive monitoring",
    color: "#dc2626",
    trend: "up",
    activePatients: [
      {
        name: "Ishaan Menon",
        id: "PT-1001",
        acuity: "Critical \u00b7 Cardiac VSD",
        wait: "Stage 9",
      },
      {
        name: "Anaya Rao",
        id: "PT-1002",
        acuity: "Urgent \u00b7 Post-Op Fever",
        wait: "Stage 8",
      },
      {
        name: "Rehan Sharma",
        id: "PT-1003",
        acuity: "Critical \u00b7 Status Epilepticus",
        wait: "Stage 5",
      },
    ],
  },
  {
    id: "nicu",
    name: "Neonatal Intensive Care (NICU)",
    short: "NICU",
    occupancy: 74,
    capacity: 19,
    occupiedBeds: 14,
    status: "High",
    note: "3 step-down candidates identified for ward transfer",
    color: "#f59e0b",
    trend: "stable",
    activePatients: [
      {
        name: "Baby Aarohi M.",
        id: "PT-1008",
        acuity: "High \u00b7 Preterm 28wk",
        wait: "Stage 7",
      },
      {
        name: "Baby Dev N.",
        id: "PT-1009",
        acuity: "Moderate \u00b7 Respiratory",
        wait: "Stage 8",
      },
    ],
  },
  {
    id: "emergency",
    name: "Emergency & Triage Unit",
    short: "ER",
    occupancy: 78,
    capacity: 27,
    occupiedBeds: 21,
    status: "High",
    note: "2 red-tag patients \u00b7 Active specialist dispatch",
    color: "#38bdf8",
    trend: "up",
    activePatients: [
      {
        name: "Niya Patel",
        id: "PT-1011",
        acuity: "Red Tag \u00b7 Respiratory",
        wait: "12m",
      },
      {
        name: "Arjun V.",
        id: "PT-1012",
        acuity: "Amber Tag \u00b7 Trauma",
        wait: "18m",
      },
    ],
  },
  {
    id: "opd",
    name: "Pediatric OPD & Consult",
    short: "OPD",
    occupancy: 61,
    capacity: 62,
    occupiedBeds: 38,
    status: "Moderate",
    note: "Steady flow \u00b7 4 specialty consult rooms active",
    color: "#22c55e",
    trend: "down",
    activePatients: [
      {
        name: "Kabir Joshi",
        id: "PT-1005",
        acuity: "Moderate \u00b7 VSD Consult",
        wait: "Stage 4",
      },
      {
        name: "Tara S.",
        id: "PT-1014",
        acuity: "Routine \u00b7 Follow-up",
        wait: "15m",
      },
    ],
  },
  {
    id: "wards",
    name: "General Pediatric Wards",
    short: "Wards",
    occupancy: 48,
    capacity: 118,
    occupiedBeds: 56,
    status: "Low",
    note: "Capacity available \u00b7 8 discharges projected today",
    color: "#22c55e",
    trend: "down",
    activePatients: [
      {
        name: "Myra Joseph",
        id: "PT-1004",
        acuity: "Moderate \u00b7 Bronchiolitis",
        wait: "Stage 9",
      },
      {
        name: "Vihaan S.",
        id: "PT-1016",
        acuity: "Low \u00b7 Observation",
        wait: "Stage 8",
      },
    ],
  },
];

const MiniSparkline = ({
  data,
  positive,
}: {
  data: number[];
  color: string;
  positive: boolean;
}) => {
  const chartData = data.map((value, index) => ({ value, index }));
  const strokeColor = positive ? "oklch(0.985 0 0)" : "oklch(0.708 0 0)";
  const chartConfig = {
    value: {
      label: "Value",
      color: strokeColor,
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-12 w-full">
      <AreaChart
        data={chartData}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient
            id={`gradient-${positive ? "neutral" : "muted"}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={strokeColor}
          strokeWidth={1.5}
          fill={`url(#gradient-${positive ? "neutral" : "muted"})`}
          dot={false}
        />
        <ChartTooltip
          content={<ChartTooltipContent hideLabel indicator="dot" />}
        />
      </AreaChart>
    </ChartContainer>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; border: string }> = {
    Critical: {
      bg: "bg-muted",
      text: "text-foreground",
      border: "border-border",
    },
    High: {
      bg: "bg-muted",
      text: "text-foreground",
      border: "border-border",
    },
    Moderate: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      border: "border-border",
    },
    Low: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      border: "border-border",
    },
  };
  const c = config[status] || {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
  };

  return (
    <Badge
      variant="outline"
      className={`${c.bg} ${c.text} ${c.border} text-[10px] font-semibold`}
    >
      {status}
    </Badge>
  );
};

const TrendIndicator = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  if (trend === "up")
    return <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />;
  if (trend === "down")
    return <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />;
  return <div className="h-3.5 w-3.5 rounded-full bg-muted-foreground/30" />;
};

const AlertIcon = ({ severity }: { severity: string }) => {
  switch (severity) {
    case "critical":
      return <AlertTriangle className="h-4 w-4 text-foreground" />;
    case "amber":
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Info className="h-4 w-4 text-muted-foreground" />;
  }
};

export const ExecutiveDashboard: React.FC = () => {
  const { cases, alerts, acknowledgeAlert, payments } = usePediatric();
  const [wards] = useState<WardData[]>(INITIAL_WARDS);
  const [selectedWardId, setSelectedWardId] = useState<string>("picu");
  const [acknowledgeModalAlert, setAcknowledgeModalAlert] =
    useState<ExecutiveAlert | null>(null);
  const [actionInput, setActionInput] = useState("");

  const activeCasesCount = cases.filter(c => c.currentStage < 10).length;
  const criticalCasesCount = cases.filter(
    c => c.urgency === "Critical" && c.currentStage < 10
  ).length;
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const selectedWard = wards.find(w => w.id === selectedWardId) || wards[0];

  const handleAcknowledge = () => {
    if (!acknowledgeModalAlert || !actionInput.trim()) return;
    acknowledgeAlert(acknowledgeModalAlert.id, actionInput.trim());
    setAcknowledgeModalAlert(null);
    setActionInput("");
  };

  const kpis = [
    {
      label: "Active Cases",
      value: activeCasesCount + 14,
      subtext: "Children under care",
      variance: "+8.6%",
      positive: true,
      chartData: [10, 11, 14, 13, 15, 15, activeCasesCount + 14],
      icon: Users,
    },
    {
      label: "Avg Match Time",
      value: "16.4 m",
      subtext: "SLA target < 30m",
      variance: "-18%",
      positive: true,
      chartData: [24, 22, 23, 19, 18, 17, 16.4],
      icon: Clock,
    },
    {
      label: "Critical Cases",
      value: criticalCasesCount + 2,
      subtext: "PICU / ER priority",
      variance: "High",
      positive: false,
      chartData: [4, 5, 3, 2, 4, 3, criticalCasesCount + 2],
      icon: HeartPulse,
    },
    {
      label: "Continuity Rate",
      value: "94.2%",
      subtext: "10-Stage Compliance",
      variance: "+1.2%",
      positive: true,
      chartData: [89, 90, 92, 91, 93, 94, 94.2],
      icon: Shield,
    },
    {
      label: "Open Alerts",
      value: unacknowledgedAlerts.length,
      subtext: "Action required",
      variance: unacknowledgedAlerts.length === 0 ? "Clear" : "Action",
      positive: unacknowledgedAlerts.length === 0,
      chartData: [6, 4, 5, 3, 2, 1, unacknowledgedAlerts.length],
      icon: Bell,
    },
    {
      label: "Specialist On-call",
      value: "100%",
      subtext: "Coverage Active",
      variance: "6/6",
      positive: true,
      chartData: [85, 90, 100, 100, 100, 100, 100],
      icon: Activity,
    },
    {
      label: "Today's Revenue",
      value:
        "₹" +
        (
          payments.reduce(
            (acc, p) =>
              acc +
              (p.currency === "INR" && p.status === "Completed" ? p.amount : 0),
            0
          ) / 1000
        ).toFixed(1) +
        "k",
      subtext: "Online Payments",
      variance: "+12%",
      positive: true,
      chartData: [40, 45, 55, 65, 60, 75, 80],
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header — Solaris */}
      <motion.header
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" as any }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" as any }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Activity className="h-4 w-4" /> Command Center
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Executive Dashboard
            </h1>
            <Select defaultValue="all">
              <SelectTrigger className="w-64 bg-white/[0.04] border-white/10 rounded-full">
                <SelectValue placeholder="Select Facility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Consolidated Network View</SelectItem>
                <SelectItem value="main">Main Hospital</SelectItem>
                <SelectItem value="north">North Clinic</SelectItem>
                <SelectItem value="south">South Campus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          render={<Link to="/intake" className="gap-2" />}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          New Patient Intake
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </motion.header>

      {/* KPI Cards — stagger */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <Card className="group relative overflow-hidden solaris-card solaris-glow rounded-2xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-medium uppercase text-muted-foreground">
                      {kpi.label}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tracking-tight count-up">
                    {kpi.value}
                  </div>
                  <div className="h-12 mt-3 w-full">
                    <MiniSparkline
                      data={kpi.chartData}
                      color={
                        kpi.positive ? "oklch(0.985 0 0)" : "oklch(0.708 0 0)"
                      }
                      positive={kpi.positive}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{kpi.subtext}</span>
                    <span
                      className={`flex items-center gap-1 font-semibold ${
                        kpi.positive
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {kpi.positive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {kpi.variance}
                    </span>
                  </div>
                </CardContent>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Ward Capacity & Detail */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Ward List */}
        <section className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-20"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-foreground"></span>
            </span>
            <h2 className="text-lg font-semibold tracking-tight">
              Live Ward Capacity
            </h2>
          </div>

          <div className="space-y-3">
            {wards.map(ward => {
              const isSelected = ward.id === selectedWardId;
              return (
                <Card
                  key={ward.id}
                  className={`cursor-pointer transition-all duration-500 solaris-card solaris-glow rounded-2xl ${
                    isSelected
                      ? "border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                      : "hover:border-primary/30 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedWardId(ward.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold">{ward.name}</h3>
                          <TrendIndicator trend={ward.trend} />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {ward.occupiedBeds} of {ward.capacity} Beds
                        </span>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={ward.status} />
                        <div className="text-lg font-bold mt-1">
                          {Math.round(ward.occupancy)}%
                        </div>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out bg-foreground"
                        style={{
                          width: `${Math.min(100, ward.occupancy)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {ward.note}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Ward Detail Panel */}
        <section className="lg:col-span-7">
          {selectedWard && (
            <Card className="h-full solaris-card rounded-2xl">
              <CardHeader className="border-b border-border/50">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold">
                      {selectedWard.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedWard.note}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <BedDouble className="h-5 w-5 text-muted-foreground" />
                      <span className="block text-3xl font-bold text-foreground">
                        {selectedWard.occupiedBeds}
                      </span>
                    </div>
                    <span className="text-xs font-medium uppercase text-muted-foreground">
                      Active Patients
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {selectedWard.activePatients.map(pt => (
                    <div
                      key={pt.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div>
                        <div className="font-medium">{pt.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-mono border-border/50"
                          >
                            {pt.id}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {pt.acuity}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">
                          {pt.wait}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          render={<Link to={`/patients/${pt.id}`} />}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      </div>

      {/* Decision Support / Alerts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            Decision Support
          </h2>
          {unacknowledgedAlerts.length > 0 && (
            <Badge
              variant="outline"
              className="bg-muted text-foreground border-border"
            >
              {unacknowledgedAlerts.length} Action Items
            </Badge>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {alerts.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground border border-border/50 rounded-xl bg-card">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium">All systems nominal</p>
              <p className="text-sm mt-1">No active alerts</p>
            </div>
          ) : (
            alerts.map(alert => {
              const isCritical = alert.severity === "critical";
              const isAmber = alert.severity === "amber";

              return (
                <Card
                  key={alert.id}
                  className={`flex flex-col justify-between transition-all duration-500 solaris-card solaris-glow rounded-2xl ${
                    alert.acknowledged
                      ? "opacity-60"
                      : "hover:border-foreground/20 hover:shadow-md border-l-2 border-l-border"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {!alert.acknowledged && (
                          <AlertIcon severity={alert.severity} />
                        )}
                        {!alert.acknowledged ? (
                          <Badge
                            variant="outline"
                            className="bg-muted text-foreground border-border"
                          >
                            {alert.severity}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-muted text-muted-foreground border-border gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Resolved
                          </Badge>
                        )}
                      </div>
                      {alert.patientName && (
                        <span className="text-xs font-mono text-muted-foreground">
                          {alert.patientId}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-sm">{alert.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
                      {alert.detail}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                      {alert.acknowledged ? (
                        <span className="text-xs text-muted-foreground">
                          By {alert.acknowledgedBy}
                        </span>
                      ) : (
                        <Button
                          variant="link"
                          size="sm"
                          className="px-0 gap-1"
                          onClick={() => setAcknowledgeModalAlert(alert)}
                        >
                          Acknowledge <ArrowRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </section>

      {/* Financial Monitoring */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            Financial Monitoring
          </h2>
        </div>

        <Card className="solaris-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-3 font-semibold">Transaction ID</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Description</th>
                  <th className="px-6 py-3 font-semibold">Method</th>
                  <th className="px-6 py-3 font-semibold">Amount</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {payments.slice(0, 5).map(txn => (
                  <tr key={txn.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium">{txn.id}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(txn.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {txn.description}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {txn.paymentMethod}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {txn.currency === "USD" ? "$" : "₹"}
                      {txn.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={
                          txn.status === "Completed"
                            ? "bg-muted text-foreground border-border"
                            : txn.status === "Refunded"
                              ? "bg-muted text-muted-foreground border-border"
                              : "bg-muted text-muted-foreground border-border"
                        }
                      >
                        {txn.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Acknowledge Modal */}
      <Dialog
        open={!!acknowledgeModalAlert}
        onOpenChange={open => !open && setAcknowledgeModalAlert(null)}
      >
        <DialogContent className="w-full max-w-lg bg-card border-border/50">
          <DialogHeader>
            <DialogTitle>Acknowledge Alert</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Document clinical action for audit trail
            </p>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
              <div className="font-semibold text-sm">
                {acknowledgeModalAlert?.title}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {acknowledgeModalAlert?.detail}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="action">Action Taken</Label>
              <Textarea
                id="action"
                rows={3}
                placeholder="Enter actions taken to resolve this alert..."
                value={actionInput}
                onChange={e => setActionInput(e.target.value)}
                className="bg-background border-border/50"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setAcknowledgeModalAlert(null);
                  setActionInput("");
                }}
                className="border-border/50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAcknowledge}
                disabled={!actionInput.trim()}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <CheckCircle2 className="h-4 w-4" /> Acknowledge & Record
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
