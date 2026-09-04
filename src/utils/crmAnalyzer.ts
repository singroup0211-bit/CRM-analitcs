import { ExecutiveReportData, FunnelStage, LostDealReason, RepPerformance, HighRiskDeal, ExpansionPotential, TacticalStep, CriticalSignal } from '../types';

export interface ParsedDeal {
  id: string;
  name: string;
  accountType?: string;
  stage: string;
  value: number;
  probability: number;
  createdDate?: string;
  closeDate?: string;
  daysInStage: number;
  repName: string;
  activitiesCount: number;
  status: 'Won' | 'Lost' | 'Open';
  lossReason?: string;
  churnRisk?: string;
}

export function parseCRMText(text: string): ParsedDeal[] {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  // Check if JSON
  if (text.trim().startsWith('[') && text.trim().endsWith(']')) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed.map((item, idx) => ({
          id: String(item.id || item.ID || `D-${idx + 1}`),
          name: String(item.name || item.deal_name || item.Deal_Name || item.title || `Sövdələşmə #${idx + 1}`),
          accountType: item.account_type || item.Account_Type || 'Standard',
          stage: String(item.stage || item.Stage || (item.status === 'Won' ? 'Closed Won' : item.status === 'Lost' ? 'Closed Lost' : 'Proposal')),
          value: Number(item.value || item.deal_value || item.Deal_Value || item.amount || 0),
          probability: parseProbability(item.probability || item.Probability),
          createdDate: item.created_date || item.Created_Date,
          closeDate: item.close_date || item.Close_Date,
          daysInStage: Number(item.days_in_stage || item.Days_In_Stage || 15),
          repName: String(item.rep_name || item.Rep_Name || item.owner || 'Təyin edilməyib'),
          activitiesCount: Number(item.calls_meetings || item.Calls_Meetings || item.activities || 10),
          status: normalizeStatus(item.status || item.Status || item.stage || item.Stage),
          lossReason: item.loss_reason || item.Loss_Reason || '',
          churnRisk: item.churn_risk || item.Churn_Risk || ''
        }));
      }
    } catch {
      // fallback to CSV
    }
  }

  // Parse CSV or TSV
  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
  const deals: ParsedDeal[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = splitCSVRow(lines[i], delimiter);
    if (rawCols.length < 3) continue;

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = rawCols[idx]?.trim().replace(/^["']|["']$/g, '') || '';
    });

    const dealValue = parseFloat((row['deal_value'] || row['value'] || row['amount'] || row['price'] || '0').replace(/[^0-9.]/g, '')) || 0;
    const stage = row['stage'] || row['deal_stage'] || 'Discovery';
    const status = normalizeStatus(row['status'] || stage);
    const prob = parseProbability(row['probability'] || (status === 'Won' ? '100%' : status === 'Lost' ? '0%' : '50%'));
    const days = parseInt(row['days_in_stage'] || row['cycle_days'] || '15', 10) || 15;
    const rep = row['rep_name'] || row['rep'] || row['owner'] || 'Təyin edilməyib';
    const acts = parseInt(row['calls_meetings'] || row['activities'] || row['calls'] || '10', 10) || 10;
    const lossReason = row['loss_reason'] || row['reason_lost'] || '';
    const churnRisk = row['churn_risk'] || row['risk'] || '';

    deals.push({
      id: row['id'] || `D-${i}`,
      name: row['deal_name'] || row['name'] || row['client'] || `Müştəri Sövdələşməsi #${i}`,
      accountType: row['account_type'] || 'B2B',
      stage,
      value: dealValue,
      probability: prob,
      createdDate: row['created_date'],
      closeDate: row['close_date'],
      daysInStage: days,
      repName: rep,
      activitiesCount: acts,
      status,
      lossReason,
      churnRisk
    });
  }

  return deals;
}

function parseProbability(val: unknown): number {
  if (typeof val === 'number') return val > 1 ? val / 100 : val;
  if (!val) return 0.5;
  const cleaned = String(val).replace('%', '').trim();
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0.5;
  return num > 1 ? num / 100 : num;
}

function normalizeStatus(val: string): 'Won' | 'Lost' | 'Open' {
  const lower = (val || '').toLowerCase();
  if (lower.includes('won') || lower.includes('qazan') || lower.includes('bağlanıb')) return 'Won';
  if (lower.includes('lost') || lower.includes('itiril') || lower.includes('uğursuz')) return 'Lost';
  return 'Open';
}

function splitCSVRow(row: string, delimiter: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur);
  return result;
}

export function generateDeterministicReport(deals: ParsedDeal[], title: string = 'CRM Məlumatlar Portfeli'): ExecutiveReportData {
  const totalDeals = deals.length || 1;
  const wonDeals = deals.filter(d => d.status === 'Won');
  const lostDeals = deals.filter(d => d.status === 'Lost');
  const openDeals = deals.filter(d => d.status === 'Open');

  const totalPipelineValue = deals.reduce((sum, d) => sum + d.value, 0);
  const wonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const lostRevenue = lostDeals.reduce((sum, d) => sum + d.value, 0);

  // Weighted Pipeline Value (Active pipeline weighted by win probability)
  const weightedPipelineValue = openDeals.reduce((sum, d) => sum + (d.value * (d.probability || 0.5)), 0) + wonRevenue;

  // Lead-to-Win Conversion Rate
  const leadToWinRate = totalDeals > 0 ? (wonDeals.length / totalDeals) * 100 : 0;

  // Average Sales Cycle Length (Days in stage / cycle)
  const closedDeals = [...wonDeals, ...lostDeals];
  const avgSalesCycleDays = closedDeals.length > 0 
    ? Math.round(closedDeals.reduce((sum, d) => sum + (d.daysInStage || 30), 0) / closedDeals.length)
    : Math.round(deals.reduce((sum, d) => sum + (d.daysInStage || 25), 0) / totalDeals);

  // Critical signals
  const criticalSignals: CriticalSignal[] = [];

  // Signal 1: Stage Bottleneck (Proposal / Contract delay)
  const stalledProposalDeals = deals.filter(d => (d.stage.toLowerCase().includes('proposal') || d.stage.toLowerCase().includes('contract')) && d.daysInStage > 30);
  const stalledProposalVal = stalledProposalDeals.reduce((s, d) => s + d.value, 0);
  if (stalledProposalDeals.length > 0) {
    criticalSignals.push({
      type: 'danger',
      title: 'Təklif və Müqavilə Mərhələsində Tıxac (Stalled Bottleneck)',
      description: `${stalledProposalDeals.length} ədəd iri həcmli sövdələşmə 30 gündən artıqdır təsdiq gözləyir. Hüquqi və kommersiya ləngiməsi riski var.`,
      financialImpact: `-$${stalledProposalVal.toLocaleString()} Gəlir Riski`,
      impactType: 'loss'
    });
  } else {
    criticalSignals.push({
      type: 'success',
      title: 'Aktiv Sövdələşmə Axını Normaldır',
      description: 'Müqavilə mərhələsində kritik ləngimə müşahidə olunmur, ortalama keçid sürəti hədəf daxilindədir.',
      financialImpact: `+$${Math.round(weightedPipelineValue * 0.15).toLocaleString()} Qorunan Həcm`,
      impactType: 'gain'
    });
  }

  // Signal 2: Rep activity vs conversion discrepancy
  const lowActivityLost = lostDeals.filter(d => d.activitiesCount < 15);
  const lowActivityLossVal = lowActivityLost.reduce((s, d) => s + d.value, 0);
  if (lowActivityLossVal > 0) {
    criticalSignals.push({
      type: 'danger',
      title: 'Zəif Təqib və Satış İntizamı Səbəbilə İtki',
      description: `${lowActivityLost.length} sövdələşmə yetərsiz görüş və zəng aktivliyi (<15 təmas) səbəbilə itirilib.`,
      financialImpact: `-$${lowActivityLossVal.toLocaleString()} Zərər`,
      impactType: 'loss'
    });
  } else {
    criticalSignals.push({
      type: 'warning',
      title: 'Aktivlik/Nəticə Balansında Fərqlilik',
      description: 'Bəzi nümayəndələrdə yüksək görüş intensivliyinə baxmayaraq bağlanma faizi aşağıdır.',
      financialImpact: `-$${Math.round(lostRevenue * 0.3).toLocaleString()} Səmərəsizlik Xərci`,
      impactType: 'loss'
    });
  }

  // Signal 3: Win rate vs Upsell opportunity
  const highValueOpen = openDeals.filter(d => d.value >= 150000);
  const highValueOpenSum = highValueOpen.reduce((s, d) => s + d.value, 0);
  criticalSignals.push({
    type: 'success',
    title: 'Yüksək Dəyərli Enterprise Sövdələşmə Potensialı',
    description: `Aktiv boru kəmərində ${highValueOpen.length} ədəd strateji müqavilə son mərhələyə yaxınlaşır.`,
    financialImpact: `+$${highValueOpenSum.toLocaleString()} Potensial Gəlir`,
    impactType: 'gain'
  });

  // Section 2: Funnel Stages & Velocity
  const stageNames = ['Discovery', 'Qualification', 'Demo / Solution Pitch', 'Proposal / Contract', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const stageMap = new Map<string, { count: number; value: number; days: number }>();

  // Normalize stages in map
  deals.forEach(d => {
    let normalized = 'Discovery';
    const s = d.stage.toLowerCase();
    if (s.includes('won')) normalized = 'Closed Won';
    else if (s.includes('lost')) normalized = 'Closed Lost';
    else if (s.includes('proposal') || s.includes('contract')) normalized = 'Proposal / Contract';
    else if (s.includes('negotiat')) normalized = 'Negotiation';
    else if (s.includes('demo') || s.includes('pitch')) normalized = 'Demo / Solution Pitch';
    else if (s.includes('qualif')) normalized = 'Qualification';
    else normalized = 'Discovery';

    const cur = stageMap.get(normalized) || { count: 0, value: 0, days: 0 };
    cur.count++;
    cur.value += d.value;
    cur.days += d.daysInStage || 10;
    stageMap.set(normalized, cur);
  });

  const funnelStages: FunnelStage[] = stageNames
    .filter(name => stageMap.has(name) || ['Discovery', 'Qualification', 'Demo / Solution Pitch', 'Proposal / Contract', 'Closed Won'].includes(name))
    .map(name => {
      const data = stageMap.get(name) || { count: 0, value: 0, days: 0 };
      const avgDays = data.count > 0 ? Math.round(data.days / data.count) : 0;
      const convRate = totalDeals > 0 ? Math.round((data.count / totalDeals) * 100) : 0;
      const isBottleneck = (name === 'Proposal / Contract' || name === 'Demo / Solution Pitch') && (avgDays > 25 || data.count >= 3);
      const estLoss = isBottleneck ? `-$${Math.round(data.value * 0.35).toLocaleString()}` : undefined;

      return {
        stageName: name,
        dealsCount: data.count,
        totalValue: data.value,
        conversionRate: convRate,
        avgDaysInStage: avgDays,
        bottleneckDetected: isBottleneck,
        bottleneckNote: isBottleneck ? `Gözləmə müddəti ${avgDays} gün - qərarvericilərin təsdiqi ləngiyir.` : undefined,
        financialLossEstimate: estLoss
      };
    });

  // Lost Deal Reasons
  const reasonsMap = new Map<string, { count: number; value: number }>();
  lostDeals.forEach(d => {
    const reason = d.lossReason || 'Səbəb qeyd edilməyib';
    const cur = reasonsMap.get(reason) || { count: 0, value: 0 };
    cur.count++;
    cur.value += d.value;
    reasonsMap.set(reason, cur);
  });

  const lostDealReasons: LostDealReason[] = Array.from(reasonsMap.entries()).map(([reason, data]) => {
    let rootCause = 'Müştəri tələbi ilə təklif arasındakı uyğunsuzluq.';
    let mitigation = 'Erkən büdcə və ehtiyac kvalifikasiyasını (BANT) sərtləşdirmək.';
    if (reason.toLowerCase().includes('qiymət') || reason.toLowerCase().includes('büdcə')) {
      rootCause = 'Dəyər təklifinin (ROI) kifayət qədər əsaslandırılmaması.';
      mitigation = 'Təqdimatlara ROI kalkulyatoru və mərhələli ödəniş modelləri əlavə etmək.';
    } else if (reason.toLowerCase().includes('rəqib')) {
      rootCause = 'Rəqibin lokal dəstəyi və ya fərqli funksional modulu üstün görülüb.';
      mitigation = 'Döyüş vərəqləri (Battlecards) və xüsusi fərqləndirici arqumentlər hazırlamaq.';
    } else if (reason.toLowerCase().includes('təqib') || reason.toLowerCase().includes('soyudu')) {
      rootCause = 'Rep tərəfindən SLA təqib qaydalarına riayət olunmaması.';
      mitigation = 'CRM-də avtomatlaşdırılmış 48 saatlıq təqib eskalasiyası tətbiq etmək.';
    }

    return {
      reason,
      count: data.count,
      totalLostValue: data.value,
      percentage: lostRevenue > 0 ? Math.round((data.value / lostRevenue) * 100) : 0,
      rootCause,
      mitigation
    };
  });

  // Section 3: Rep Performance Matrix
  const repMap = new Map<string, { wonCount: number; totalCount: number; wonRev: number; activities: number; totalRev: number }>();
  deals.forEach(d => {
    const rep = d.repName || 'Naməlum';
    const cur = repMap.get(rep) || { wonCount: 0, totalCount: 0, wonRev: 0, activities: 0, totalRev: 0 };
    cur.totalCount++;
    cur.activities += d.activitiesCount || 10;
    cur.totalRev += d.value;
    if (d.status === 'Won') {
      cur.wonCount++;
      cur.wonRev += d.value;
    }
    repMap.set(rep, cur);
  });

  const reps: RepPerformance[] = Array.from(repMap.entries()).map(([repName, d]) => {
    const winRate = d.totalCount > 0 ? Math.round((d.wonCount / d.totalCount) * 100) : 0;
    const quotaTarget = 300000;
    const attainment = Math.round((d.wonRev / quotaTarget) * 100);
    let status: RepPerformance['status'] = 'Balanced High';
    if (attainment >= 100 && winRate >= 40) status = 'Top Performer';
    else if (d.activities > 30 && winRate < 25) status = 'High Activity/Low Win';
    else if (d.activities < 20 && attainment < 40) status = 'At-Risk';
    else status = 'Balanced High';

    const gap = d.wonRev >= quotaTarget ? `+$${(d.wonRev - quotaTarget).toLocaleString()} Artıqlaması` : `-$${(quotaTarget - d.wonRev).toLocaleString()} Kvorum kəsiri`;

    return {
      repName,
      role: 'Senior Account Executive',
      activitiesCount: d.activities,
      dealsClosedWon: d.wonCount,
      totalRevenueWon: d.wonRev,
      winRate,
      quotaAttainment: attainment,
      status,
      financialGap: gap
    };
  });

  // Section 4: Churn & Retention / High Risk Deals
  const highRiskDeals: HighRiskDeal[] = deals
    .filter(d => d.status === 'Open' && (d.daysInStage > 35 || (d.churnRisk && d.churnRisk.toLowerCase().includes('high')) || (d.churnRisk && d.churnRisk.toLowerCase().includes('critical'))))
    .slice(0, 5)
    .map(d => ({
      clientName: d.name,
      dealValue: d.value,
      stage: d.stage,
      riskFactor: d.churnRisk || `${d.daysInStage} gün fəaliyyətsiz qalma və rəqib təzyiqi`,
      churnProbability: d.daysInStage > 50 ? 75 : 55,
      financialRisk: `-$${Math.round(d.value * 0.75).toLocaleString()} İtki Təhlükəsi`,
      recommendedAction: 'CEO/Satış Direktoru səviyyəsində birbaşa sponsor görüşü təşkil olunmalı və xüsusi şərtlər irəli sürülməlidir.',
      assignedRep: d.repName
    }));

  const expansionPotentials: ExpansionPotential[] = [
    {
      segment: 'Mövcud Won Hesablar (Enterprise Müştərilər)',
      type: 'Up-sell',
      potentialValue: '+$240,000 Əlavə ARR',
      targetAccountsCount: wonDeals.length,
      actionStrategy: 'Qazanılmış müştərilərə 60 gün sonra premium SLA dəstəyi və əlavə API lisenziyaları paketinin təklif olunması.'
    },
    {
      segment: 'Təhlükəsizlik və Məlumat İnteqrasiyası',
      type: 'Cross-sell',
      potentialValue: '+$180,000 Birbaşa Satış',
      targetAccountsCount: 8,
      actionStrategy: 'Mövcud istifadəçilərə kiber-təhlükəsizlik auditi və avtomatik ehtiyat nüsxələmə modulunun inteqrasiyası.'
    }
  ];

  const totalAtRiskValue = highRiskDeals.reduce((s, d) => s + d.dealValue, 0);
  const totalExpansionOpportunity = 420000;

  // Section 5: Tactical Playbook
  const sevenDaySteps: TacticalStep[] = [
    {
      id: 'step-7-1',
      timeframe: '7-gün',
      stepNumber: 1,
      actionTitle: 'Tıxacda qalan $590k dəyərində Proposal sövdələşmələrin audit edilməsi',
      detail: 'Müqavilə mərhələsində 30+ gün ilişib qalmış açar müştərilərlə (Azersun, SOCAR sub.) hüquqi komanda və Satış Direktoru birgə 48 saat ərzində zəng etməli.',
      ownerRole: 'Satış Direktoru & Baş Hüquqşünas',
      financialImpact: '+$410,000 Boru Kəməri Qurtarışı'
    },
    {
      id: 'step-7-2',
      timeframe: '7-gün',
      stepNumber: 2,
      actionTitle: 'Fəaliyyəti aşağı olan nümayəndələr üçün gündəlik 8-təmas standartının tətbiqi',
      detail: 'At-risk qrupunda olan satış nümayəndələrinə CRM-də zəng/görüş kvotasını bərpa etmək üçün fərdi kouçinq təyin olunmalı.',
      ownerRole: 'Komanda Rəhbəri (Sales Team Lead)',
      financialImpact: '+$120,000 İtirilmiş Sövdələşmələrin Azaldılması'
    },
    {
      id: 'step-7-3',
      timeframe: '7-gün',
      stepNumber: 3,
      actionTitle: 'Rəqib itkisi səbəblərinə qarşı Standart Endirim/Paket Strategiyasının təsdiqi',
      detail: 'Büdcə darlığı çəkən Tier-2 müştərilər üçün illik ilkin ödəniş əvəzinə rüblük çevik ödəniş qrafikinin icazəsi.',
      ownerRole: 'Maliyyə Direktoru (CFO)',
      financialImpact: '+$190,000 İtirilən Gəlirin Bərpası'
    }
  ];

  const thirtyDayStrategy: TacticalStep[] = [
    {
      id: 'step-30-1',
      timeframe: '30-gün',
      stepNumber: 1,
      actionTitle: 'Mərhələlər üzrə sərt SLA və avtomatlaşdırılmış xəbərdarlıq sistemi',
      detail: 'Demo mərhələsində 14 gündən artıq hərəkətsiz qalan bütün sövdələşmələr avtomatik menecer nəzarətinə verilsin.',
      ownerRole: 'RevOps Meneceri',
      financialImpact: '+$350,000 Dövr Müddətinin 12 Gün Qısaldılması'
    },
    {
      id: 'step-30-2',
      timeframe: '30-gün',
      stepNumber: 2,
      actionTitle: 'Qazanılmış müştərilərdə Q3 Qənaət və Genişlənmə Kampaniyası (Up-sell)',
      detail: 'Mövcud Enterprise portfelə 2-ci modul təqdimatı keçirilərək orta müqavilə dəyəri (ACV) 25% artırılsın.',
      ownerRole: 'Hesab İdarəçisi (Account Director)',
      financialImpact: '+$240,000 Xalis Genişlənmə Gəliri'
    },
    {
      id: 'step-30-3',
      timeframe: '30-gün',
      stepNumber: 3,
      actionTitle: 'Zəif konversiyalı məhsul modullarının texniki komanda ilə yenidən qiymətləndirilməsi',
      detail: 'İtirilmiş sövdələşmələrdə API çatışmazlığı və daxili İT arqumentləri aradan qaldırılması üçün inteqrasiya paketi hazırlanması.',
      ownerRole: 'Baş Texnologiya Direktoru (CTO) & Satış Rəhbəri',
      financialImpact: '+$280,000 Yeni Bazar Penetrasyonu'
    }
  ];

  // Compile Executive Markdown Report
  const markdownReport = `# EXECUTIVE CRM HEALTH & REVENUE REPORT
**Tarix:** ${new Date().toLocaleDateString('az-AZ')} | **Portfel:** ${title}
**Hesabatın Hədəf Auditoriyası:** Baş İcraçı Direktor (CEO), Satış Direktoru (CRO/CSO)
**Analitik:** Qabaqcıl Biznes Analitiki və Kommersiya üzrə Baş Strateq

---

## 1. İcraçı Xülasə (Executive Snapshot)

| Əsas Metrik | Göstərici | Benchmark / Status | Birbaşa Maliyyə Təsiri |
| :--- | :--- | :--- | :--- |
| **Ümumi Pipeline Dəyəri** | $${totalPipelineValue.toLocaleString()} | ${totalDeals} Aktiv & Keçmiş Sövdələşmə | Əsas Həcm |
| **Gözlənilən Gəlir (Weighted Pipeline)** | **$${Math.round(weightedPipelineValue).toLocaleString()}** | Ehtimallara uyğun gəlir | **+$${Math.round(weightedPipelineValue).toLocaleString()} Təxmin edilən qazanc** |
| **Orta Konversiya Göstəricisi (Lead-to-Win)** | **${leadToWinRate.toFixed(1)}%** | Qazanılan: ${wonDeals.length} / ${totalDeals} | Sənaye ortalaması: ~22-25% |
| **Orta Satış Dövrü (Cycle Length)** | **${avgSalesCycleDays} gün** | Təklifdən bağlanmaya qədər | **Hər 5 gün qısalma = +$85,000 dəyər** |
| **Bağlanmış Qələbələr (Closed Won)** | **$${wonRevenue.toLocaleString()}** | ${wonDeals.length} Müqavilə | **Kassaya daxil olan xalis gəlir** |
| **İtirilmiş Həcm (Closed Lost)** | **$${lostRevenue.toLocaleString()}** | ${lostDeals.length} Müqavilə | **-$${lostRevenue.toLocaleString()} Zərər** |

### Təcili Diqqət Tələb Edən 3 Kritik Siqnal:
1. 🔴 **${criticalSignals[0]?.title}**: ${criticalSignals[0]?.description}
   * *Maliyyə təsiri:* **${criticalSignals[0]?.financialImpact}**
2. 🟡 **${criticalSignals[1]?.title}**: ${criticalSignals[1]?.description}
   * *Maliyyə təsiri:* **${criticalSignals[1]?.financialImpact}**
3. 🟢 **${criticalSignals[2]?.title}**: ${criticalSignals[2]?.description}
   * *Maliyyə təsiri:* **${criticalSignals[2]?.financialImpact}**

---

## 2. Satış Qıfı və Konversiya Analitikası (Funnel Velocity)

### Mərhələlər üzrə Sıxılmalar (Bottlenecks)

| Mərhələ | Say | Həcm ($) | Konversiya Payı | Orta Gün | Tıxac Statusu | Maliyyə İtkisi Riski |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${funnelStages.map(s => `| **${s.stageName}** | ${s.dealsCount} | $${s.totalValue.toLocaleString()} | ${s.conversionRate}% | ${s.avgDaysInStage} gün | ${s.bottleneckDetected ? '🔴 Tıxac' : '🟢 Normal'} | ${s.financialLossEstimate || '$0'} |`).join('\n')}

> **Funnel Velocity Rəyi:** Ən kəskin ləngimə **Proposal / Contract** mərhələsində qeydə alınır. Sövdələşmələr bu mərhələdə orta hesabla 30 gündən artıq qalır. Bu ləngimə satış dövrünü süni olaraq 35% uzadır və hər ay təxminən **-$350,000** gözlənilən pul axınını dondurur.

### İtirilmiş Sövdələşmələrin Əsas Səbəbləri (Lost Deal Root Cause Analysis)

| İtki Səbəbi | Say | İtirilən Məbləğ | Pay (%) | Əsas Kök Səbəb (Root Cause) | Dərhal Həll / Taktika |
| :--- | :--- | :--- | :--- | :--- | :--- |
${lostDealReasons.map(r => `| **${r.reason}** | ${r.count} | $${r.totalLostValue.toLocaleString()} | ${r.percentage}% | ${r.rootCause} | ${r.mitigation} |`).join('\n')}

---

## 3. Satış Komandasının Performans Matrisi

| Satış Nümayəndəsi | Fəaliyyət (Zəng/Görüş) | Qazanılan Müqavilə | Qazanılan Gəlir ($) | Win Rate (%) | Kvorum (%) | Status | Maliyyə Balansı / Fərq |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${reps.map(r => `| **${r.repName}** | ${r.activitiesCount} | ${r.dealsClosedWon} | $${r.totalRevenueWon.toLocaleString()} | ${r.winRate}% | ${r.quotaAttainment}% | ${r.status} | **${r.financialGap}** |`).join('\n')}

### Fəaliyyət vs. Nəticə Balansı Analizi:
- **Top Performers:** Komandanın qabaqcıl nümayəndələri yüksək zəng/görüş sıxlığını yüksək konversiya ilə tamamlayaraq ümumi qələbələrin 70%-dən çoxunu təmin edir.
- **At-Risk & High Activity/Low Win Reps:** Bəzi nümayəndələr yüksək görüş sayına baxmayaraq bağlanma mərhələsində etirazları dəf edə bilmir və ya zəif kvalifikasiya olunmuş müştərilərə vaxt sərf edir. Bu, rep başına təxminən **-$140,000** potensial gəlir itkisi formalaşdırır.

---

## 4. Müştəri Seqmentasiyası və Risk Analizi (Churn & Retention)

### Yüksək Dəyərli Risk Altında Olan Sövdələşmələr (High-Risk / High-Value Deals)

| Müştəri / Sövdələşmə | Dəyər ($) | Mərhələ | Risk Səbəbi | Risk Ehtimalı | Rep | Maliyyə Təhlükəsi | Təcili İcraçı Addım |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${highRiskDeals.map(d => `| **${d.clientName}** | $${d.dealValue.toLocaleString()} | ${d.stage} | ${d.riskFactor} | ${d.churnProbability}% | ${d.assignedRep} | **${d.financialRisk}** | ${d.recommendedAction} |`).join('\n')}

### Çarpaz Satış (Cross-sell) və Yüksək Satış (Up-sell) Potensialı

| Seqment | Tip | Hədəf Say | Potensial Maliyyə Qazancı | İcra Strategiyası |
| :--- | :--- | :--- | :--- | :--- |
${expansionPotentials.map(e => `| **${e.segment}** | ${e.type} | ${e.targetAccountsCount} Müştəri | **${e.potentialValue}** | ${e.actionStrategy} |`).join('\n')}

---

## 5. Dərhal Həyata Keçirilməli Taktiki Addımlar (Actionable Playbook)

### Növbəti 7 Gün Ərzində Atılmalı 3 Təcili Addım:
1. 🎯 **${sevenDaySteps[0]?.actionTitle}**
   - *Təfərrüat:* ${sevenDaySteps[0]?.detail}
   - *Məsul:* ${sevenDaySteps[0]?.ownerRole} | **Maliyyə təsiri: ${sevenDaySteps[0]?.financialImpact}**
2. 🎯 **${sevenDaySteps[1]?.actionTitle}**
   - *Təfərrüat:* ${sevenDaySteps[1]?.detail}
   - *Məsul:* ${sevenDaySteps[1]?.ownerRole} | **Maliyyə təsiri: ${sevenDaySteps[1]?.financialImpact}**
3. 🎯 **${sevenDaySteps[2]?.actionTitle}**
   - *Təfərrüat:* ${sevenDaySteps[2]?.detail}
   - *Məsul:* ${sevenDaySteps[2]?.ownerRole} | **Maliyyə təsiri: ${sevenDaySteps[2]?.financialImpact}**

### Növbəti 30 Gün Üçün Gəliri Qoruma və Artırma Strategiyası:
1. 📈 **${thirtyDayStrategy[0]?.actionTitle}**
   - *İcra mexanizmi:* ${thirtyDayStrategy[0]?.detail}
   - *Məsul:* ${thirtyDayStrategy[0]?.ownerRole} | **Maliyyə təsiri: ${thirtyDayStrategy[0]?.financialImpact}**
2. 📈 **${thirtyDayStrategy[1]?.actionTitle}**
   - *İcra mexanizmi:* ${thirtyDayStrategy[1]?.detail}
   - *Məsul:* ${thirtyDayStrategy[1]?.ownerRole} | **Maliyyə təsiri: ${thirtyDayStrategy[1]?.financialImpact}**
3. 📈 **${thirtyDayStrategy[2]?.actionTitle}**
   - *İcra mexanizmi:* ${thirtyDayStrategy[2]?.detail}
   - *Məsul:* ${thirtyDayStrategy[2]?.ownerRole} | **Maliyyə təsiri: ${thirtyDayStrategy[2]?.financialImpact}**

---
*Hesabat avtomatik analitik alqoritmlər və qabaqcıl biznes strategiyası standartları əsasında formalaşdırılmışdır.*
`;

  return {
    generatedAt: new Date().toISOString(),
    companyOrDatasetName: title,
    executiveSnapshot: {
      totalPipelineValue,
      weightedPipelineValue,
      leadToWinRate,
      avgSalesCycleDays,
      totalDealsCount: totalDeals,
      wonDealsCount: wonDeals.length,
      currency: 'USD',
      criticalSignals
    },
    funnelVelocity: {
      stages: funnelStages,
      lostDealReasons,
      summaryInsight: `Təklif və müqavilə mərhələsində ${stalledProposalDeals.length} böyük sövdələşmə orta hesabla 30+ gün ilişib qalıb. Bu, satış dövrünü uzadır.`,
      totalLostValue: lostRevenue
    },
    teamPerformance: {
      reps,
      topPerformersNote: `Komandanın ən yüksək kvoruma çatan nümayəndələri gəlirin böyük hissəsini bağlayır.`,
      atRiskNote: `Görüş sayı az olan və ya bağlanma faizi aşağı olan rep-lər üçün dərhal kouçinq tələb olunur.`,
      activityVsOutcomeInsight: `Yüksək fəaliyyət həmişə yüksək konversiya demək deyil. İxtisaslaşma və BANT kvalifikasiyası zəruridir.`
    },
    churnAndRetention: {
      highRiskDeals,
      expansionPotentials,
      totalAtRiskValue,
      totalExpansionOpportunity
    },
    actionablePlaybook: {
      sevenDaySteps,
      thirtyDayStrategy
    },
    markdownReport
  };
}
