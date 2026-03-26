# QuickBite - Use Case Diagram (Clean Version for Word)

## UML Use Case Diagram - Portrait Format

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                          QUICKBITE FOOD DELIVERY SYSTEM                            │
│                                                                                    │
│                                                                                    │
│      CUSTOMER                         USE CASES                           ADMIN    │
│         O                                                                   O      │
│        /|\                                                                 /|\     │
│        / \                                                                 / \     │
│          │                                                                   │     │
│          │         ╭─────────────────────────────────╮                       │     │
│          ├────────►│         Register/Login          │◄──────────────────────┤     │
│          │         ╰─────────────────────────────────╯                       │     │
│          │                                                                   │     │
│          │         ╭─────────────────────────────────╮                       │     │
│          ├────────►│       Browse Restaurants        │                       │     │
│          │         ╰─────────────────────────────────╯                       │     │
│          │                                                                   │     │
│          │         ╭─────────────────────────────────╮                       │     │
│          ├────────►│        Search Menu Items        │                       │     │
│          │         ╰─────────────────────────────────╯                       │     │
│          │                                                                   │     │
│          │         ╭─────────────────────────────────╮                       │     │
│          ├────────►│          Add to Cart            │                       │     │
│          │         ╰─────────────────────────────────╯                       │     │
│          │                                                                   │     │
│          │         ╭─────────────────────────────────╮                       │     │
│          ├────────►│          Place Order            │                       │     │
│          │         ╰───────────────┬─────────────────╯                       │     │
│          │                         │ <<include>>                             │     │
│          │         ╭───────────────▼─────────────────╮                       │     │
│          ├────────►│         Make Payment            │                       │     │
│          │         ╰─────────────────────────────────╯                       │     │
│          │                                                                   │     │
│          │         ╭─────────────────────────────────╮                       │     │
│          ├────────►│       Track Order Status        │◄──────────────────────┤     │
│          │         ╰─────────────────────────────────╯                       │     │
│          │                                                                   │     │
│          │         ╭─────────────────────────────────╮                       │     │
│          ├────────►│       View Order History        │                       │     │
│          │         ╰─────────────────────────────────╯                       │     │
│          │                                                                   │     │
│          │         ╭─────────────────────────────────╮                       │     │
│          ├────────►│       Rate & Review Order       │                       │     │
│          │         ╰─────────────────────────────────╯                       │     │
│          │                                                                   │     │
│          │         ╭─────────────────────────────────╮                       │     │
│          └────────►│    Manage Profile/Addresses     │                       │     │
│                    ╰─────────────────────────────────╯                       │     │
│                                                                              │     │
│                    ╭─────────────────────────────────╮                       │     │
│                    │        Manage Customers         │◄──────────────────────┤     │
│                    ╰─────────────────────────────────╯                       │     │
│                                                                              │     │
│                    ╭─────────────────────────────────╮                       │     │
│                    │       Manage Restaurants        │◄──────────────────────┤     │
│                    ╰─────────────────────────────────╯                       │     │
│                                                                              │     │
│                    ╭─────────────────────────────────╮                       │     │
│                    │  Approve/Reject Registrations   │◄──────────────────────┤     │
│                    ╰─────────────────────────────────╯                       │     │
│                                                                              │     │
│                    ╭─────────────────────────────────╮                       │     │
│                    │    Manage Delivery Personnel    │◄──────────────────────┤     │
│                    ╰─────────────────────────────────╯                       │     │
│                                                                              │     │
│                    ╭─────────────────────────────────╮                       │     │
│                    │        View Analytics           │◄──────────────────────┤     │
│                    ╰─────────────────────────────────╯                       │     │
│                                                                              │     │
│                    ╭─────────────────────────────────╮                       │     │
│                    │      Approve/Manage Payouts     │◄──────────────────────┘     │
│                    ╰─────────────────────────────────╯                             │
│                                                                                    │
│  ════════════════════════════════════════════════════════════════════════════════  │
│                                                                                    │
│   RESTAURANT                                                          DELIVERY    │
│     OWNER                                                               BOY       │
│       O                                                                  O        │
│      /|\                                                                /|\       │
│      / \                                                                / \       │
│        │                                                                  │       │
│        │           ╭─────────────────────────────────╮                    │       │
│        ├──────────►│         Register/Login          │◄───────────────────┤       │
│        │           ╰─────────────────────────────────╯                    │       │
│        │                                                                  │       │
│        │           ╭─────────────────────────────────╮                    │       │
│        ├──────────►│       View Incoming Orders      │                    │       │
│        │           ╰─────────────────────────────────╯                    │       │
│        │                                                                  │       │
│        │           ╭─────────────────────────────────╮                    │       │
│        ├──────────►│       Accept/Reject Order       │                    │       │
│        │           ╰─────────────────────────────────╯                    │       │
│        │                                                                  │       │
│        │           ╭─────────────────────────────────╮                    │       │
│        ├──────────►│       Update Order Status       │◄───────────────────┤       │
│        │           ╰─────────────────────────────────╯                    │       │
│        │                                                                  │       │
│        │           ╭─────────────────────────────────╮                    │       │
│        ├──────────►│    Manage Menu (CRUD Items)     │                    │       │
│        │           ╰─────────────────────────────────╯                    │       │
│        │                                                                  │       │
│        │           ╭─────────────────────────────────╮                    │       │
│        ├──────────►│     View Dashboard/Analytics    │                    │       │
│        │           ╰─────────────────────────────────╯                    │       │
│        │                                                                  │       │
│        │           ╭─────────────────────────────────╮                    │       │
│        ├──────────►│       View Earnings/Payouts     │◄───────────────────┤       │
│        │           ╰─────────────────────────────────╯                    │       │
│        │                                                                  │       │
│        │           ╭─────────────────────────────────╮                    │       │
│        └──────────►│         Request Payout          │                    │       │
│                    ╰─────────────────────────────────╯                    │       │
│                                                                           │       │
│                    ╭─────────────────────────────────╮                    │       │
│                    │     View Available Deliveries   │◄───────────────────┤       │
│                    ╰─────────────────────────────────╯                    │       │
│                                                                           │       │
│                    ╭─────────────────────────────────╮                    │       │
│                    │      Accept/Pickup Delivery     │◄───────────────────┤       │
│                    ╰─────────────────────────────────╯                    │       │
│                                                                           │       │
│                    ╭─────────────────────────────────╮                    │       │
│                    │      Navigate to Location       │◄───────────────────┤       │
│                    ╰─────────────────────────────────╯                    │       │
│                                                                           │       │
│                    ╭─────────────────────────────────╮                    │       │
│                    │        Complete Delivery        │◄───────────────────┤       │
│                    ╰─────────────────────────────────╯                    │       │
│                                                                           │       │
│                    ╭─────────────────────────────────╮                    │       │
│                    │       Update Availability       │◄───────────────────┘       │
│                    ╰─────────────────────────────────╯                            │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘

LEGEND:
═══════
    O
   /|\    = Actor (Stick Figure)
   / \

╭────────╮
│Use Case│ = Use Case (Oval/Ellipse)
╰────────╯

────────► = Association Line

┌────────┐
│ System │ = System Boundary
└────────┘
```

---

## Summary Table: Actors and Use Cases

| # | CUSTOMER | RESTAURANT OWNER | DELIVERY BOY | ADMIN |
|---|----------|------------------|--------------|-------|
| 1 | Register/Login | Register/Login | Register/Login | Login |
| 2 | Browse Restaurants | View Incoming Orders | View Available Deliveries | Manage Customers |
| 3 | Search Menu Items | Accept/Reject Order | Accept/Pickup Delivery | Manage Restaurants |
| 4 | Add to Cart | Update Order Status | Navigate to Location | Approve/Reject Registrations |
| 5 | Place Order | Manage Menu (CRUD) | Update Order Status | Manage Delivery Personnel |
| 6 | Make Payment | View Dashboard | Complete Delivery | Manage Orders |
| 7 | Track Order Status | View Earnings/Payouts | View Earnings | View Analytics/Reports |
| 8 | View Order History | Request Payout | Update Availability | Approve/Manage Payouts |
| 9 | Rate & Review Order | - | - | Track Order Status |
| 10 | Manage Profile | - | - | - |

---

## Relationships Summary

| Type | Description |
|------|-------------|
| **<<include>>** | Place Order includes Make Payment |
| **Shared** | Track Order Status (Customer, Admin) |
| **Shared** | Update Order Status (Restaurant Owner, Delivery Boy) |
| **Shared** | View Earnings (Restaurant Owner, Delivery Boy) |
| **Shared** | Register/Login (Customer, Restaurant Owner, Delivery Boy) |
