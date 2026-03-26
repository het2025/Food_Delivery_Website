# QuickBite - Use Case Diagram

## UML Use Case Diagram (Portrait Format)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                 │
│                                    QUICKBITE FOOD DELIVERY SYSTEM                               │
│                                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                                           │  │
│  │                                    <<System Boundary>>                                    │  │
│  │                                                                                           │  │
│  │     ╭─────────────────╮         ╭──────────────────────╮         ╭─────────────────╮      │  │
│  │     │    Register/    │         │   Manage Restaurant  │         │     Login/      │      │  │
│  │     │     Login       │         │     Registration     │         │   Authenticate  │      │  │
│  │     ╰────────┬────────╯         ╰──────────┬───────────╯         ╰────────┬────────╯      │  │
│  │              │                             │                              │               │  │
│  │              │                             │                              │               │  │
│  │   O          │                             │                              │         O     │  │
│  │  /|\─────────┼─────────────────────────────┼──────────────────────────────┼────────/|\    │  │
│  │  / \         │                             │                              │        / \    │  │
│  │              │                             │                              │               │  │
│  │ CUSTOMER     │         ╭──────────────────────────────────╮               │     ADMIN     │  │
│  │              │         │                                  │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              ├─────────┼───►│   Browse Restaurants │      │               │               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │                                  │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              ├─────────┼───►│   Search Menu Items  │      │               │               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │                                  │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              ├─────────┼───►│    Add to Cart       │      │               │               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │                                  │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              ├─────────┼───►│     Place Order      │◄─────┼───────────────┤               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │              │                   │               │               │  │
│  │              │         │              │ <<include>>       │               │               │  │
│  │              │         │              ▼                   │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              ├─────────┼───►│    Make Payment      │      │               │               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │                                  │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              ├─────────┼───►│  Track Order Status  │◄─────┼───────────────┤               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │                                  │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              ├─────────┼───►│  View Order History  │      │               │               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │                                  │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              ├─────────┼───►│ Rate & Review Order  │      │               │               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │                                  │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              └─────────┼───►│   Manage Profile/    │◄─────┼───────────────┘               │  │
│  │                        │    │     Addresses        │      │                               │  │
│  │                        │    ╰──────────────────────╯      │                               │  │
│  │                        │                                  │                               │  │
│  │                        └──────────────────────────────────┘                               │  │
│  │                                                                                           │  │
│  │  ════════════════════════════════════════════════════════════════════════════════════════ │  │
│  │                                                                                           │  │
│  │                        ┌──────────────────────────────────┐                               │  │
│  │                        │                                  │                               │  │
│  │                        │    ╭──────────────────────╮      │               │               │  │
│  │              ┌─────────┼───►│ View Incoming Orders │◄─────┼───────────────┤               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │                                  │               │               │  │
│  │   O          │         │    ╭──────────────────────╮      │               │         O     │  │
│  │  /|\─────────┤         ├───►│  Accept/Reject Order │      │               ├────────/|\    │  │
│  │  / \         │         │    ╰──────────────────────╯      │               │        / \    │  │
│  │              │         │                                  │               │               │  │
│  │RESTAURANT    │         │    ╭──────────────────────╮      │               │    DELIVERY   │  │
│  │  OWNER       │         ├───►│   Update Order       │◄─────┼───────────────┤      BOY      │  │
│  │              │         │    │     Status           │      │               │               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │                                  │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              ├─────────┼───►│    Manage Menu       │      │               │               │  │
│  │              │         │    │  (Add/Edit/Delete)   │      │               │               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │                                  │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              ├─────────┼───►│   View Dashboard/    │      │               │               │  │
│  │              │         │    │     Analytics        │      │               │               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │                                  │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              ├─────────┼───►│   View Earnings/     │◄─────┼───────────────┤               │  │
│  │              │         │    │     Payouts          │      │               │               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │                                  │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              ├─────────┼───►│   Request Payout     │      │               │               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │                                  │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              │         │    │  Accept/Pickup       │◄─────┼───────────────┤               │  │
│  │              │         │    │     Delivery         │      │               │               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │                                  │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              │         │    │ Navigate to Location │◄─────┼───────────────┤               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │                                  │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              │         │    │  Complete Delivery   │◄─────┼───────────────┤               │  │
│  │              │         │    ╰──────────────────────╯      │               │               │  │
│  │              │         │                                  │               │               │  │
│  │              │         │    ╭──────────────────────╮      │               │               │  │
│  │              │         │    │ Update Availability  │◄─────┼───────────────┘               │  │
│  │              │         │    ╰──────────────────────╯      │                               │  │
│  │              │         │                                  │                               │  │
│  │              │         └──────────────────────────────────┘                               │  │
│  │              │                                                                            │  │
│  │              │                                                                            │  │
│  │  ════════════════════════════════════════════════════════════════════════════════════════ │  │
│  │                                                                                           │  │
│  │                                    ADMIN USE CASES                                        │  │
│  │                                                                                           │  │
│  │                        ┌──────────────────────────────────┐               │               │  │
│  │                        │                                  │               │               │  │
│  │                        │    ╭──────────────────────╮      │               │         O     │  │
│  │                        │    │   Manage Users       │◄─────┼───────────────┼────────/|\    │  │
│  │                        │    │    (Customers)       │      │               │        / \    │  │
│  │                        │    ╰──────────────────────╯      │               │               │  │
│  │                        │                                  │               │     ADMIN     │  │
│  │                        │    ╭──────────────────────╮      │               │               │  │
│  │                        │    │ Manage Restaurants   │◄─────┼───────────────┤               │  │
│  │                        │    ╰──────────────────────╯      │               │               │  │
│  │                        │                                  │               │               │  │
│  │                        │    ╭──────────────────────╮      │               │               │  │
│  │                        │    │ Approve/Reject       │◄─────┼───────────────┤               │  │
│  │                        │    │ Restaurant Requests  │      │               │               │  │
│  │                        │    ╰──────────────────────╯      │               │               │  │
│  │                        │                                  │               │               │  │
│  │                        │    ╭──────────────────────╮      │               │               │  │
│  │                        │    │ Manage Delivery      │◄─────┼───────────────┤               │  │
│  │                        │    │      Personnel       │      │               │               │  │
│  │                        │    ╰──────────────────────╯      │               │               │  │
│  │                        │                                  │               │               │  │
│  │                        │    ╭──────────────────────╮      │               │               │  │
│  │                        │    │   Manage Orders      │◄─────┼───────────────┤               │  │
│  │                        │    ╰──────────────────────╯      │               │               │  │
│  │                        │                                  │               │               │  │
│  │                        │    ╭──────────────────────╮      │               │               │  │
│  │                        │    │  View Analytics/     │◄─────┼───────────────┤               │  │
│  │                        │    │     Reports          │      │               │               │  │
│  │                        │    ╰──────────────────────╯      │               │               │  │
│  │                        │                                  │               │               │  │
│  │                        │    ╭──────────────────────╮      │               │               │  │
│  │                        │    │ Approve/Manage       │◄─────┼───────────────┘               │  │
│  │                        │    │    Payouts           │      │                               │  │
│  │                        │    ╰──────────────────────╯      │                               │  │
│  │                        │                                  │                               │  │
│  │                        └──────────────────────────────────┘                               │  │
│  │                                                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Legend (UML Use Case Diagram Notation)

```
    O        = Actor (Stick Figure)
   /|\
   / \

╭──────────╮
│ Use Case │  = Use Case (Oval/Ellipse)
╰──────────╯

──────────►   = Association (Actor to Use Case)

- - - - - ►   = Include/Extend Relationship
 <<include>>

┌──────────┐
│          │  = System Boundary (Rectangle)
└──────────┘
```

---

## Actor Descriptions

| Actor | Description |
|-------|-------------|
| **Customer** | End user who browses restaurants, places orders, makes payments, and tracks deliveries |
| **Restaurant Owner** | Business owner who manages their restaurant profile, menu items, and incoming orders |
| **Delivery Boy** | Delivery personnel who accepts delivery requests, picks up orders, and delivers to customers |
| **Admin** | System administrator who manages users, restaurants, orders, analytics, and payouts |

---

## Use Case Summary by Actor

### CUSTOMER Use Cases
1. Register/Login
2. Browse Restaurants
3. Search Menu Items
4. Add to Cart
5. Place Order
6. Make Payment
7. Track Order Status
8. View Order History
9. Rate & Review Order
10. Manage Profile/Addresses

### RESTAURANT OWNER Use Cases
1. Register/Login
2. View Incoming Orders
3. Accept/Reject Order
4. Update Order Status
5. Manage Menu (Add/Edit/Delete)
6. View Dashboard/Analytics
7. View Earnings/Payouts
8. Request Payout

### DELIVERY BOY Use Cases
1. Register/Login
2. View Available Orders
3. Accept/Pickup Delivery
4. Navigate to Location
5. Update Order Status
6. Complete Delivery
7. View Earnings
8. Update Availability

### ADMIN Use Cases
1. Login
2. Manage Users (Customers)
3. Manage Restaurants
4. Approve/Reject Restaurant Requests
5. Manage Delivery Personnel
6. Manage Orders
7. View Analytics/Reports
8. Approve/Manage Payouts

---

## Relationships

| Relationship | From | To | Type |
|--------------|------|-----|------|
| Place Order | Customer | Make Payment | <<include>> |
| Track Order Status | Customer, Delivery Boy | Update Order Status | shared |
| Update Order Status | Restaurant Owner, Delivery Boy | - | shared |
| View Earnings | Restaurant Owner, Delivery Boy | - | shared |
| Manage Orders | Admin | View Incoming Orders | <<extend>> |

---

## Notes for Word Documentation

**To create this diagram in Microsoft Word:**

1. **Using SmartArt/Shapes:**
   - Go to Insert → Shapes
   - Use Ovals for Use Cases
   - Use Lines for Associations
   - Use Rectangles for System Boundary
   - Draw stick figures manually using lines

2. **Recommended Tools:**
   - Microsoft Visio (Professional UML diagrams)
   - draw.io (Free online tool - export as image)
   - Lucidchart (Online diagramming)
   - StarUML (Free UML software)

3. **Color Coding Suggestion:**
   - Customer Use Cases: Light Blue
   - Restaurant Owner Use Cases: Light Green
   - Delivery Boy Use Cases: Light Orange
   - Admin Use Cases: Light Purple
   - System Boundary: Light Gray

---

**Project:** QuickBite - Food Delivery Platform
**Diagram Type:** UML Use Case Diagram
**Version:** 1.0
**Date:** March 2026
