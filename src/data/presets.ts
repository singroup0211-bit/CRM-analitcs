import { PresetDataset } from '../types';

export const PRESET_DATASETS: PresetDataset[] = [
  {
    id: 'b2b-saas-enterprise',
    title: 'B2B SaaS Mid-Market & Enterprise CRM',
    industry: 'Bulud Həlləri və Proqram Təminatı (SaaS)',
    description: 'Q3 sonu 142 potensial müştəri (deals), 5 mərhələ, 6 satış nümayəndəsi. "Proposal & Contract" mərhələsində böyük tıxac və 3 yüksək dəyərli müqavilədə rəqib riski.',
    sampleSummary: 'Pipeline: $3,850,000 | Won: $680,000 | Orta dövr: 58 gün | 6 Rep',
    rawData: `ID,Deal_Name,Account_Type,Stage,Deal_Value,Probability,Created_Date,Close_Date,Days_In_Stage,Rep_Name,Calls_Meetings,Status,Loss_Reason,Churn_Risk
D-101,Kapital FinTech Cloud Migration,Enterprise,Closed Won,180000,100%,2024-05-10,2024-07-15,12,Aysel Məmmədova,48,Won,,Low
D-102,Azersun ERP Sync Integration,Enterprise,Proposal / Contract,240000,60%,2024-04-18,,44,Rəşad Əliyev,22,Open,,High (Rəqib təklifi var)
D-103,SOCAR Subcontractor Portal,Enterprise,Proposal / Contract,350000,50%,2024-03-22,,62,Rəşad Əliyev,18,Open,,Critical (Hüquqi gecikmə)
D-104,Pasha Insurance Data Lake,Enterprise,Closed Won,220000,100%,2024-06-01,2024-08-10,15,Aysel Məmmədova,54,Won,,Low
D-105,Bravo Supermarkets Loyalty Engine,Mid-Market,Demo / Solution Pitch,110000,40%,2024-06-15,,28,Tural Həsənov,32,Open,,Medium
D-106,Baku Electronics Omnichannel SaaS,Mid-Market,Closed Lost,95000,0%,2024-05-02,2024-06-28,35,Murad Quliyev,14,Lost,Qiymət/Büdcə uyğunsuzluğu,
D-107,Kontakt Home Warehouse CRM,Mid-Market,Closed Lost,130000,0%,2024-04-12,2024-06-30,48,Murad Quliyev,19,Lost,Rəqib (Lokal proqram təminatı),
D-108,SilkWay Cargo Tracking API,Enterprise,Negotiation,190000,70%,2024-05-20,,21,Nərgiz Kərimova,42,Open,,Low
D-109,Embawood E-Commerce Headless,Mid-Market,Closed Won,85000,100%,2024-06-05,2024-07-25,9,Nərgiz Kərimova,36,Won,,Low
D-110,Norm Cement IoT Predictive Maint,Enterprise,Closed Lost,210000,0%,2024-03-10,2024-05-18,52,Tural Həsənov,26,Lost,Daxili İT tərəfindən həll qərarı,
D-111,Azercell VAS Platform Upgrade,Enterprise,Qualification,310000,25%,2024-07-01,,14,Aysel Məmmədova,16,Open,,Low
D-112,ExpressBank Microloan Scoring,Enterprise,Closed Won,145000,100%,2024-05-12,2024-07-20,11,Aysel Məmmədova,39,Won,,Low
D-113,Caspian Marine Logistics ERP,Mid-Market,Demo / Solution Pitch,90000,35%,2024-06-25,,19,Samir Qasımov,12,Open,,High (Gecikən demo)
D-114,Veysəloğlu Dağıtım Optimizasiyası,Enterprise,Negotiation,280000,65%,2024-04-30,,38,Rəşad Əliyev,24,Open,,High (CFO təsdiqi gözlənilir)
D-115,Avrora Qrup B2B Portal,Mid-Market,Closed Lost,75000,0%,2024-05-14,2024-07-02,31,Samir Qasımov,8,Lost,Təqib edilmədi (Lead soyudu),
D-116,Grand Mart Kassa İnteqrasiyası,Mid-Market,Qualification,60000,20%,2024-07-10,,10,Tural Həsənov,15,Open,,Low
D-117,Baku Steel Company SCADA Bridge,Enterprise,Closed Lost,280000,0%,2024-02-15,2024-06-12,74,Murad Quliyev,16,Lost,Funksionallıq çatışmazlığı (API yoxdur),
D-118,Gilan Holdinq Təchizat Zənciri,Enterprise,Discovery,420000,15%,2024-07-20,,8,Nərgiz Kərimova,11,Open,,Low
D-119,Milla Süd Satış Analitikası,Mid-Market,Closed Won,50000,100%,2024-06-18,2024-08-05,14,Tural Həsənov,29,Won,,Low
D-120,AtaBank Aktivlərin İdarəsi,Enterprise,Closed Lost,160000,0%,2024-04-01,2024-06-20,45,Samir Qasımov,10,Lost,Büdcə donduruldu,`
  },
  {
    id: 'fintech-corporate-banking',
    title: 'FinTech & Korporativ Bankçılıq Həlləri',
    industry: 'Maliyyə Texnologiyaları & Bank Proqram Təminatı',
    description: 'Yüksək dəyərli (orta çek $350k+), uzun satış dövrü (90+ gün) olan lisenziya və inteqrasiya layihələri. Komplayens və təhlükəsizlik auditində ilişib qalan iri sövdələşmələr.',
    sampleSummary: 'Pipeline: $5,200,000 | Won: $1,450,000 | Orta dövr: 84 gün | 4 Senior Rep',
    rawData: `ID,Deal_Name,Account_Type,Stage,Deal_Value,Probability,Created_Date,Close_Date,Days_In_Stage,Rep_Name,Calls_Meetings,Status,Loss_Reason,Churn_Risk
F-201,ABB Bank Open Banking Gateway,Tier-1 Bank,Closed Won,480000,100%,2024-03-01,2024-06-10,22,Elnur Rzayev,65,Won,,Low
F-202,Unibank Fraud Detection ML Engine,Tier-1 Bank,Proposal / Contract,520000,60%,2024-03-15,,58,Fərid Əhmədov,34,Open,,High (Təhlükəsizlik auditi uzandı)
F-203,AccessBank SME Core API,Tier-2 Bank,Closed Won,310000,100%,2024-04-01,2024-07-05,18,Elnur Rzayev,52,Won,,Low
F-204,Yelo Bank Mobile Wallet SDK,Tier-2 Bank,Closed Lost,290000,0%,2024-02-10,2024-05-22,65,Cavid Səmədov,18,Lost,Rəqib (Beynəlxalq provayder seçildi),
F-205,Bank Respublika POS Acquiring SaaS,Tier-1 Bank,Negotiation,440000,75%,2024-04-20,,35,Elnur Rzayev,48,Open,,Low
F-206,Rabitabank AML/KYC Screening,Tier-2 Bank,Closed Lost,210000,0%,2024-03-05,2024-06-15,48,Leyla Vəliyeva,22,Lost,Qiymət/Lisenziya xərci baha gəldi,
F-207,TuranBank Instant Clearing Node,Tier-2 Bank,Demo / Solution Pitch,380000,40%,2024-05-10,,41,Fərid Əhmədov,25,Open,,Medium
F-208,Xalq Bank Swift ISO20022 Hub,Tier-1 Bank,Closed Won,660000,100%,2024-02-01,2024-06-01,15,Elnur Rzayev,72,Won,,Low
F-209,Ziraat Bank Azerbaijan Card Processing,Tier-2 Bank,Closed Lost,350000,0%,2024-03-18,2024-07-01,60,Cavid Səmədov,14,Lost,Mərkəzi ofis (Türkiyə) qərarı ləğv etdi,
F-210,MuğanBank Retail CRM,Tier-2 Bank,Closed Lost,180000,0%,2024-04-10,2024-06-25,40,Leyla Vəliyeva,19,Lost,Bankın yenidən qurulması səbəbilə,`
  },
  {
    id: 'logistics-distribution-b2b',
    title: 'Dağıtım & Loqistika B2B Ekosistemi',
    industry: 'Ticarət, Daşıma və Təchizat Şəbəkələri',
    description: 'Qısa dövriyyəli, çoxsaylı sövdələşmələr. Fəaliyyət sıxlığı yüksək olan, lakin "Demo"dan "Təklif"ə keçiddə 42% itki verən sürətli komanda.',
    sampleSummary: 'Pipeline: $2,100,000 | Won: $520,000 | Orta dövr: 34 gün | 5 Rep',
    rawData: `ID,Deal_Name,Account_Type,Stage,Deal_Value,Probability,Created_Date,Close_Date,Days_In_Stage,Rep_Name,Calls_Meetings,Status,Loss_Reason,Churn_Risk
L-301,Abşeron Logistika Mərkəzi TMS,Logistics,Closed Won,140000,100%,2024-05-01,2024-06-10,12,Kənan Babayev,44,Won,,Low
L-302,Bakı Beynəlxalq Dəniz Limanı Konteyner İT,Ports,Proposal / Contract,260000,60%,2024-04-15,,46,Kənan Babayev,38,Open,,Medium
L-303,166 Yükdaşıma Park İdarəetməsi,Fleet,Closed Lost,95000,0%,2024-05-10,2024-06-18,28,İlqar Tağıyev,14,Lost,Qiymət endirimi verilmədi,
L-304,Al Market Soyuq Zəncir Sensorları,Retail,Closed Won,85000,100%,2024-05-25,2024-06-29,10,Sevinc Əliyeva,39,Won,,Low
L-305,Bolluq Dağıtım Anbar WMS,Distribution,Demo / Solution Pitch,120000,35%,2024-06-01,,32,İlqar Tağıyev,18,Open,,High (Qərar verən şəxslə əlaqə kəsilib)
L-306,Delta Dağıtım Marşrut Optimizatoru,Distribution,Closed Won,110000,100%,2024-05-18,2024-06-25,8,Sevinc Əliyeva,45,Won,,Low
L-307,Express Kuryer Son Mil Tətbiqi,Courier,Closed Lost,65000,0%,2024-05-05,2024-06-12,22,Orxan Mehdiyev,11,Lost,Rəqib (Açıq mənbəli həll seçildi),
L-308,SOCAR Karbamid Daşıma Monitorinqi,Industrial,Negotiation,190000,75%,2024-04-20,,25,Kənan Babayev,32,Open,,Low
L-309,Caspian Freight Hava Yolu İnteqrasiyası,Aviation,Closed Lost,160000,0%,2024-04-02,2024-05-28,42,Orxan Mehdiyev,16,Lost,İnteqrasiya müddəti çox uzun görüldü,
L-310,Araz Supermarket Təchizatçı Portalı,Retail,Closed Won,185000,100%,2024-05-12,2024-06-30,14,Sevinc Əliyeva,50,Won,,Low`
  }
];
