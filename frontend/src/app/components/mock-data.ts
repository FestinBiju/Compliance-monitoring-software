export type RiskLevel = "low" | "medium" | "high" | "critical";
export type SourceStatus = "active" | "inactive" | "error";

export interface Source {
  id: string;
  name: string;
  url: string;
  category: string;
  lastChecked: string;
  lastChanged: string;
  status: SourceStatus;
  monitoring: boolean;
}

export interface Change {
  id: string;
  sourceId: string;
  sourceName: string;
  changeSummary: string;
  riskLevel: RiskLevel;
  detectedAt: string;
  aiSummary: string;
  recommendedAction: string;
  affectedSector: string;
  rawDiff: string;
  complianceChecklist: string[];
}

export const sources: Source[] = [
  {
    id: "src-001",
    name: "DPDP Act Portal",
    url: "https://www.meity.gov.in/dpdp-act",
    category: "DPDP",
    lastChecked: "2026-02-27T10:30:00Z",
    lastChanged: "2026-02-25T14:20:00Z",
    status: "active",
    monitoring: true,
  },
  {
    id: "src-002",
    name: "RBI Master Directions",
    url: "https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx",
    category: "RBI",
    lastChecked: "2026-02-27T10:30:00Z",
    lastChanged: "2026-02-26T09:15:00Z",
    status: "active",
    monitoring: true,
  },
  {
    id: "src-003",
    name: "SEBI Circulars",
    url: "https://www.sebi.gov.in/sebiweb/home/list/1/7/0/0/Circulars",
    category: "SEBI",
    lastChecked: "2026-02-27T10:30:00Z",
    lastChanged: "2026-02-24T16:45:00Z",
    status: "active",
    monitoring: true,
  },
  {
    id: "src-004",
    name: "IRDAI Regulations",
    url: "https://www.irdai.gov.in/regulations",
    category: "IRDAI",
    lastChecked: "2026-02-27T10:30:00Z",
    lastChanged: "2026-02-20T11:30:00Z",
    status: "active",
    monitoring: true,
  },
  {
    id: "src-005",
    name: "IT Act Amendments",
    url: "https://www.meity.gov.in/it-act",
    category: "IT Act",
    lastChecked: "2026-02-27T08:00:00Z",
    lastChanged: "2026-02-15T08:00:00Z",
    status: "error",
    monitoring: true,
  },
  {
    id: "src-006",
    name: "CERT-In Advisories",
    url: "https://www.cert-in.org.in/",
    category: "CERT-In",
    lastChecked: "2026-02-27T10:30:00Z",
    lastChanged: "2026-02-27T06:00:00Z",
    status: "active",
    monitoring: true,
  },
  {
    id: "src-007",
    name: "TRAI Regulations",
    url: "https://www.trai.gov.in/release-publication/regulations",
    category: "TRAI",
    lastChecked: "2026-02-26T22:00:00Z",
    lastChanged: "2026-02-10T10:00:00Z",
    status: "inactive",
    monitoring: false,
  },
];

export const changes: Change[] = [
  {
    id: "chg-001",
    sourceId: "src-002",
    sourceName: "RBI Master Directions",
    changeSummary:
      "Updated KYC norms for digital lending platforms with new identity verification requirements effective April 1, 2026.",
    riskLevel: "critical",
    detectedAt: "2026-02-26T09:15:00Z",
    aiSummary:
      "The Reserve Bank of India has issued an amendment to the Master Direction on KYC (Know Your Customer) guidelines, specifically targeting digital lending platforms. The update mandates enhanced identity verification protocols including video-based customer identification process (V-CIP) for all loan amounts exceeding INR 50,000. Previously, V-CIP was only required for amounts above INR 2,00,000. This change significantly expands the scope of due diligence requirements for fintech companies and digital lending NBFCs.\n\nThe amendment also introduces a new requirement for periodic re-verification of customer identity every 2 years for high-risk customers and every 5 years for low-risk customers. Non-compliance will attract monetary penalties under Section 11 of the Prevention of Money Laundering Act.",
    recommendedAction:
      "1. Review and update V-CIP integration thresholds in all digital lending workflows.\n2. Implement periodic re-verification scheduling system for existing customers.\n3. Update compliance training materials for operations team.\n4. Conduct gap analysis of current KYC processes against new requirements.\n5. Engage legal counsel to review updated compliance framework before April 1, 2026 deadline.",
    affectedSector: "Banking, Fintech, NBFCs, Digital Lending",
    rawDiff:
      '- Section 38(1): V-CIP required for loan amounts exceeding INR 2,00,000\n+ Section 38(1): V-CIP required for loan amounts exceeding INR 50,000\n\n- Section 42: Re-verification period - 10 years for low-risk, 5 years for high-risk\n+ Section 42: Re-verification period - 5 years for low-risk, 2 years for high-risk\n\n+ Section 42A (New): Digital lending platforms must maintain video records of V-CIP for minimum 8 years\n+ Section 42B (New): Quarterly compliance reporting to RBI for all regulated entities',
    complianceChecklist: [
      "Update V-CIP threshold from INR 2,00,000 to INR 50,000",
      "Implement 2-year re-verification cycle for high-risk customers",
      "Implement 5-year re-verification cycle for low-risk customers",
      "Set up video record retention for 8 years minimum",
      "Configure quarterly compliance reporting module",
      "Update staff training documentation",
      "Complete gap analysis by March 15, 2026",
    ],
  },
  {
    id: "chg-002",
    sourceId: "src-001",
    sourceName: "DPDP Act Portal",
    changeSummary:
      "New data localization requirements published for cross-border data transfers under DPDP Act Section 16.",
    riskLevel: "high",
    detectedAt: "2026-02-25T14:20:00Z",
    aiSummary:
      "The Ministry of Electronics and IT has published detailed rules under Section 16 of the Digital Personal Data Protection Act, 2023, regarding cross-border data transfers. The new rules specify a whitelist of approved countries for data transfer, along with specific conditions that must be met for transfers to non-whitelisted jurisdictions.\n\nKey changes include mandatory data impact assessments for all cross-border transfers, appointment of a data protection officer for organizations processing data of more than 10,000 individuals, and new consent requirements for transferring sensitive personal data outside India.",
    recommendedAction:
      "1. Audit all current cross-border data flows and map data transfer destinations.\n2. Verify if current transfer destinations are on the approved whitelist.\n3. Implement data impact assessment framework for cross-border transfers.\n4. Appoint Data Protection Officer if threshold criteria are met.\n5. Update privacy policies and consent mechanisms.",
    affectedSector: "Technology, BPO, Financial Services, Healthcare",
    rawDiff:
      '+ Rule 16.1: Cross-border data transfers permitted only to whitelisted countries\n+ Rule 16.2: Data impact assessment mandatory for all transfers\n+ Rule 16.3: DPO appointment required for entities processing >10,000 records\n- Previous: No specific country restrictions for data transfers\n+ Rule 16.4: Sensitive personal data requires explicit opt-in consent for transfer',
    complianceChecklist: [
      "Complete cross-border data flow audit",
      "Verify transfer destinations against whitelist",
      "Implement data impact assessment process",
      "Evaluate DPO appointment requirement",
      "Update consent management platform",
      "Review vendor agreements for data transfer clauses",
    ],
  },
  {
    id: "chg-003",
    sourceId: "src-003",
    sourceName: "SEBI Circulars",
    changeSummary:
      "SEBI introduces enhanced cybersecurity framework for market infrastructure institutions and intermediaries.",
    riskLevel: "high",
    detectedAt: "2026-02-24T16:45:00Z",
    aiSummary:
      "SEBI has released a comprehensive circular mandating enhanced cybersecurity measures for all registered market infrastructure institutions (MIIs), stock brokers, and depository participants. The circular introduces mandatory SOC 2 Type II compliance, regular penetration testing, and incident response time requirements.\n\nOrganizations must establish a dedicated Security Operations Center (SOC) or engage with a CERT-In empanelled service provider. The circular also mandates real-time threat intelligence sharing with SEBI's cybersecurity portal.",
    recommendedAction:
      "1. Assess current cybersecurity posture against new SEBI requirements.\n2. Initiate SOC 2 Type II audit preparation.\n3. Schedule quarterly penetration testing.\n4. Establish or contract Security Operations Center capabilities.\n5. Register for SEBI's threat intelligence sharing portal.",
    affectedSector: "Capital Markets, Stock Brokers, Depository Participants",
    rawDiff:
      "+ Clause 4.1: Mandatory SOC 2 Type II compliance by September 2026\n+ Clause 4.2: Penetration testing required quarterly (previously annually)\n+ Clause 5.1: Incident response time reduced to 6 hours (previously 24 hours)\n+ Clause 5.2: Mandatory real-time threat intelligence sharing",
    complianceChecklist: [
      "Initiate SOC 2 Type II audit",
      "Update penetration testing schedule to quarterly",
      "Reduce incident response time to 6 hours",
      "Set up threat intelligence sharing integration",
      "Establish or contract SOC capabilities",
    ],
  },
  {
    id: "chg-004",
    sourceId: "src-006",
    sourceName: "CERT-In Advisories",
    changeSummary:
      "New incident reporting timelines and format changes for cyber security incidents affecting critical infrastructure.",
    riskLevel: "medium",
    detectedAt: "2026-02-27T06:00:00Z",
    aiSummary:
      "CERT-In has updated its incident reporting framework with revised timelines and standardized reporting formats. The key change reduces the mandatory incident reporting window from 6 hours to 4 hours for incidents affecting critical information infrastructure. A new standardized JSON-based reporting format has been introduced to replace the previous email-based reporting system.",
    recommendedAction:
      "1. Update incident response playbooks with new 4-hour reporting timeline.\n2. Integrate with CERT-In's new JSON API for incident reporting.\n3. Test reporting workflow with sample incidents.\n4. Train incident response team on new procedures.",
    affectedSector: "All Sectors with Critical Infrastructure",
    rawDiff:
      "- Reporting timeline: 6 hours for critical infrastructure incidents\n+ Reporting timeline: 4 hours for critical infrastructure incidents\n+ New: JSON-based reporting format via API\n- Deprecated: Email-based incident reporting",
    complianceChecklist: [
      "Update incident response timeline to 4 hours",
      "Implement JSON API integration for reporting",
      "Deprecate email-based reporting workflow",
      "Conduct incident response drill with new timeline",
    ],
  },
  {
    id: "chg-005",
    sourceId: "src-004",
    sourceName: "IRDAI Regulations",
    changeSummary:
      "Minor updates to policyholder data retention guidelines - extended retention period from 5 to 7 years.",
    riskLevel: "low",
    detectedAt: "2026-02-20T11:30:00Z",
    aiSummary:
      "IRDAI has issued a minor amendment extending the mandatory data retention period for policyholder records from 5 years to 7 years post-policy termination. This aligns with the broader data governance framework being implemented across financial regulators in India. The change affects all general and life insurance companies.",
    recommendedAction:
      "1. Update data retention policies to reflect 7-year retention period.\n2. Modify data archival systems to extend retention windows.\n3. Review storage capacity and cost implications.",
    affectedSector: "Insurance",
    rawDiff:
      "- Data retention period: 5 years post-policy termination\n+ Data retention period: 7 years post-policy termination",
    complianceChecklist: [
      "Update data retention policy documentation",
      "Modify archival system retention settings",
      "Review storage infrastructure capacity",
    ],
  },
];

export const riskColors: Record<RiskLevel, { bg: string; text: string; dot: string }> = {
  low: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  high: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  critical: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

export const statusColors: Record<SourceStatus, { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  inactive: { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
  error: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};
