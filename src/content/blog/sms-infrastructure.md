---
title: "National Telecom SMS Switching & Aggregator Infrastructure"
description: "Architectural breakdown of domestic SMS routing ecosystems, SMPP 3.4 session lifecycle management, sliding-window flow controls, and GSM-7 vs. UCS-2 encoding constraints."
pubDate: 2026-09-30
category: "network-infrastructure"
technologies: ["Architecture", "Whitepaper", "Telecom", "SMPP 3.4", "Infrastructure"]
metric: "50,000+ TPS National Telecom SMS Burst"
---

A rigorous architectural breakdown of the Iranian domestic SMS routing ecosystem. Examines direct Mobile Network Operator (MNO) interconnection, the state-mandated wholesale aggregator hierarchy, SMPP 3.4 session lifecycle management, sliding-window flow controls, and the systemic architectural overhead triggered by regulatory filtering of Rich Communication Services (RCS) and Multimedia Messaging Service (MMS).

## Key Operational Metrics

- **Peak National Throughput:** 50,000+ TPS Aggregate MNO Burst Capacity
- **SMPP Window Size:** 16 - 64 PDU In-Flight Unacknowledged Bound
- **Persian UCS-2 Limit:** 70 / 67 Chars Single / Concatenated Segment
- **RCS / MMS Availability:** 0.0 % (100% Traffic Shifted to SMS)

---

## 01 // Macro Topology: The Domestic Aggregation Model

The telecommunications landscape in Iran operates under a rigid, state-supervised aggregation hierarchy. Unlike western ecosystems where Communication Platforms as a Service (CPaaS) vendors like Twilio integrate via cloud-native APIs, Iranian enterprise traffic routes through licensed wholesale aggregators under state telecommunications oversight.

The primary underlying carriers:
- **MCI (Hamrah-e Aval / Mobile Telecommunication Company of Iran):** Dominant subscriber share (~65M connections), largest internal Short Message Service Center (SMSC) pool.
- **MTN Irancell:** Modernized IP-centric infrastructure, primary provider for sub-10 second transactional banking OTPs.
- **RighTel:** Third mobile operator, historically optimized for high-speed packet data.

```
ARCHITECTURAL REALITY:
Due to structural sanctions and national cyber governance mandates, global CPaaS providers do not route inside Iranian IP boundaries. High-throughput platforms must interface directly via bare-metal SMPP 3.4 TCP socket pipelines into licensed domestic aggregators.
```

---

## 02 // Network Hierarchy & Shortcode Prefix Partitioning

Every programmatic SMS in Iran is routed through an explicit numeric prefix. This prefix dictates the underlying wholesale aggregator, the physical SMSC bridge, delivery latency SLAs, and filtering rules:

| Prefix Band | Primary Operator / Aggregator | Protocol Interface | Throughput Ceiling (Per Binding) | Typical Target Application |
| :--- | :--- | :--- | :--- | :--- |
| **1000 Series** | Rahyab Rayaneh Gostar (MCI Direct) | SMPP 3.4 / REST SOAP | 150 - 300 TPS | Commercial Bulk, Tier-2 Marketing, Retail CRM Alerts |
| **2000 Series** | Asre Danesh Afzar / Danestan | SMPP 3.4 / Proprietary HTTP | 100 - 250 TPS | Corporate Portals, High-Volume Marketing Campaigns |
| **3000 Series** | Magfa (State Aggregator) | SMPP 3.4 Sockets | 300 - 800 TPS | Banking Infrastructure, Government Alerts, Enterprise OTP |
| **5000 Series** | Asanak / Rayegan | REST API / SMPP 3.4 | 100 - 400 TPS | SMB Notifications, Web-to-SMS, Promotional Gateways |
| **021 / 026 Series** | Asanak Fixed-Line Gateway | HTTP / SMPP | 50 - 150 TPS | Local Business Inquiries, Branch-Specific Two-Way Messaging |

### Commercial vs. Service Line Classification
1. **Commercial Lines (خطوط تبلیغاتی):** Subject to the national Do-Not-Disturb blacklist (*800#). If an end-user dials *800# to mute SMS advertisements, the operator drops commercial messages at the SMSC without refunding transmission fees.
2. **Service Lines (خطوط خدماتی):** Exempt from the *800# DND blacklist. Strictly restricted to transactional receipts, authentication OTPs, and urgent service alerts. Unauthorized promotional broadcasts on service lines result in immediate regulatory revocation and severe financial penalties.

---

## 03 // Low-Level Protocol Engineering: SMPP 3.4 Mechanics

While international systems abstract transmission behind HTTP/2 or HTTP/3 REST APIs, high-throughput enterprise gateways interfacing with domestic aggregators must maintain persistent, bi-directional TCP socket connections using the Short Message Peer-to-Peer (SMPP 3.4) protocol.

### Binding Session Topology
Enterprise clients bind as an External Short Message Entity (ESME) using three distinct connection modes:
- **Transmitter (TX):** Dedicated exclusively to issuing `submit_sm` PDUs.
- **Receiver (RX):** Dedicated exclusively to consuming inbound delivery receipts (`deliver_sm` PDUs) and user responses.
- **Transceiver (TRX):** Bi-directional full-duplex session handling submission and receipt acknowledgement simultaneously.

### Sliding Window & Backpressure
To prevent socket buffer overflow and aggregator SMSC queuing saturation, gateways enforce a sliding window flow control algorithm:
- The ESME maintains an in-memory queue of transmitted `submit_sm` PDUs waiting for a corresponding `submit_sm_resp`.
- The sliding window size is bounded between 16 and 64 unacknowledged requests.
- If the unacknowledged queue fills to capacity, the gateway stops transmission until the oldest PDU is acknowledged.
- Breaching the aggregator rate threshold returns an immediate error: `ESME_RTHROTTLED` (`0x00000058`).

### Heartbeat & Session Health
To prevent intermediate stateful firewalls from terminating idle TCP sockets, the gateway emits periodic `enquire_link` keep-alive PDUs every 30 to 60 seconds. A missing `enquire_link_resp` within 10 seconds triggers immediate socket reset and failover to secondary bindings.

---

## 04 // Protocol Encoding: GSM-7 vs. UCS-2

Because Rich Communication Services (RCS) and MMS are blocked at national network gateways, all enterprise communication is forced into standard SMS text channels. This triggers severe character encoding constraints:

| Encoding Scheme | Single Segment Limit | Concatenated Segment Limit | Use Case |
| :--- | :--- | :--- | :--- |
| **GSM-7 (Latin / English)** | 160 Characters | 153 Characters / Part | English technical notifications, basic alphanumeric codes |
| **UCS-2 (Persian / UTF-16)** | 70 Characters | 67 Characters / Part | Persian transactional texts, customer support receipts |

```
COST & CAPACITY PENALTY:
A 140-character Persian message exceeds the 70-character single-segment ceiling, splitting into three billable concatenated segments (67 + 67 + 6 characters). This triples infrastructural costs and increases delivery failure probability by 300% across carrier boundaries.
```

---

## 05 // Delivery Telemetry & State Machines

When an enterprise submits a `submit_sm` PDU, the aggregator returns a `message_id` in the synchronous `submit_sm_resp`. This only confirms aggregator buffer receipt, not device delivery.

Final delivery status returns asynchronously via `deliver_sm` PDUs:
- `DELIVRD`: Successfully delivered to mobile terminal.
- `EXPIRED`: Message validity period elapsed before handset reconnect.
- `DELETED`: Message purged by carrier routing policy.
- `UNDELIV`: Destination terminal unreachable or subscriber line suspended.
- `REJECTD`: Aggregator dropped message due to DND blacklist or content violation.
