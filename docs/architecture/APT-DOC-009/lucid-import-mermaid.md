# APT-DOC-009 — Architecture diagrams for Lucid import

Paste each block below into Lucid via **Insert → More shapes / Import → Mermaid** (or the Mermaid import panel), one diagram at a time.

---

## Figure 1 — System Context

```mermaid
flowchart TB
    subgraph DEVICE["Medical Device Domain (Class A device - black box to Aptium)"]
        DEV["MultiScan4D Scanner (Class A medical device)"]
        PIPE["Scan Processing Pipeline (opaque upstream)"]
        DEV --> PIPE
    end

    subgraph APTIUM["Aptium Portal System (Class A, built to Class C process)"]
        BE["Back-end Service / API (TypeScript, Express)"]
        FE["Web Portal front-end (Next.js 16, React 19, TypeScript)"]
        RFS["Rust File Service - object storage via AWS SDK (S3)"]
        DB[("Per-tenant MySQL databases (segregated)")]
    end

    CLIN["Tenant User / Clinician"]
    ADMIN["Tenant Administrator"]
    SUPP["Support / Quality Reviewer"]
    PADMIN["Platform Administrator"]
    EMAIL["Email / SMS Service"]
    MAPS["Google Places API"]
    CREDITS["Credits / Token System"]

    PIPE -->|"scan + metadata"| BE
    BE <--> DB
    BE <--> RFS
    BE -->|"REST + WebSocket, cookie session"| FE
    CLIN -->|HTTPS| FE
    ADMIN -->|HTTPS| FE
    SUPP -->|HTTPS| FE
    PADMIN -->|HTTPS| FE
    BE <--> EMAIL
    FE <--> MAPS
    BE <--> CREDITS
```

---

## Figure 2 — Container / Component Decomposition

```mermaid
flowchart TB
    USER["Authenticated User (browser, desktop only)"]

    subgraph FE["Front-end - Next.js 16 / React 19 (SI-FE)"]
        ROUTES["App Router - public & secure route groups"]
        GUARDS["Security Guards - LoggedIn, AccessLevel, FeatureFlag, Wip, DesktopOnly"]
        FEAT["Feature Modules - login/2FA, scans+viewer, forms, admin, tenant"]
        SVC["Services Layer - useFetchApi (credentials: include)"]
        STATE["State - Zustand stores"]
        PROV["Providers - Tenant, Ticket"]
        UIKIT["ui-kit + three.js viewer - IndexedDB cache (500MB LRU)"]
    end

    subgraph BE["Back-end - TypeScript / Express (SI-BE)"]
        API["REST API - versioned endpoints, HTTP-only cookie"]
        WS["Real-time Scan Channel - WebSocket users/client/scans/list (PLANNED APT-439)"]
        AUTH["Auth & Session - cookies, 2FA (PLANNED)"]
        TEN["Tenancy & Access Control - device-tenant-user ownership"]
        RFS["Rust File Service - signed-URL issuer, AWS SDK"]
    end

    DBS[("Per-tenant MySQL")]
    OBJ[("Object Storage S3")]
    EMAIL["Email / SMS Service"]

    USER -->|HTTPS| ROUTES
    ROUTES --> GUARDS --> FEAT
    FEAT --> SVC
    FEAT --> STATE
    FEAT --> UIKIT
    SVC -->|REST| API
    UIKIT -.->|subscribe| WS
    API --> AUTH
    API --> TEN
    API --> RFS
    AUTH <--> EMAIL
    TEN <--> DBS
    RFS <--> OBJ
```

---

## Figure 3 — Scan Data Flow

```mermaid
sequenceDiagram
    autonumber
    participant D as MultiScan4D (Class A device)
    participant P as Scan Pipeline (black box)
    participant BE as Back-end API (TS/Express)
    participant FS as Rust File Service (S3)
    participant DB as Per-tenant MySQL
    participant FE as Portal FE (Next.js)
    participant U as Clinician

    D->>P: Capture 3D scan + metadata (scan_id, user_id, device_id)
    P->>BE: Deliver processed scan payload
    BE->>FS: Store 3D model (PLY/OBJ/STL) + raw archive
    BE->>DB: Write scan metadata to owning tenant DB
    U->>FE: Sign in (cookie) + 2FA
    FE->>BE: Request / subscribe scan list (cookie session)
    BE->>DB: Query tenant-scoped scans
    DB-->>BE: rows
    BE-->>FE: Scan list (metadata + signed url)
    FE-->>U: Render scan list
    U->>FE: Open scan in 3D viewer
    FE->>FS: GET signed model URL
    FS-->>FE: Model file bytes
    FE-->>U: Interactive 3D model (three.js, IndexedDB cache)
    U->>FE: Download / export
    FE->>BE: Request export + consume credit
    BE->>DB: Decrement credit balance
    BE-->>FE: Signed download URL
    FE-->>U: File download
```

---

## Figure 4 — Deployment / Availability View

```mermaid
flowchart TB
    USER["Clinical / Admin Users (HTTPS)"]

    subgraph NEXTDC["NextDC - Primary Site (LIVE) - ISO 27001, SOC 2 Type II, Tier IV"]
        WEB["Web Application Tier - Next.js FE + Express BE, GPU-backed"]
        MYSQL[("Per-tenant MySQL")]
        STORE[("Object Storage S3 via Rust File Service")]
    end

    subgraph AWS["AWS - Secondary / Failover (PLANNED - not provisioned)"]
        WEB2["Standby Web / API Tier"]
        REPL[("Replicated Data Stores")]
    end

    USER -->|HTTPS| WEB
    WEB <--> MYSQL
    WEB <--> STORE
    MYSQL -.->|replication PLANNED| REPL
    STORE -.->|replication PLANNED| REPL
    WEB -.->|DNS cutover / warm standby PLANNED| WEB2
```

> Recovery baseline (company DR plan v1.2): RTO 72h, RPO 24h. No automated failover today; relies on NextDC resilience + backups. Deployment runbook: APT-45.
