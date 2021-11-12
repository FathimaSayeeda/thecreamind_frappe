# Library and Activities Center
This document serves as the rule book for the app. It contains general information about the app, and the management flow for the library and the activities.

## Doctypes
- `Registration Request`  
When somebody makes an entry in https://thecreamind.com/registration-form, a new Registration Request is created.
- `Membership Plan`  
List of all available plans in The CreaMind. Some plans `has_activity_access` & `has_library_access`.
- `Crea Mind Kid`  
List of all kids registered in The CreaMind. Memberships are made against a Kid.
- `Kid Membership`
List of all memberships made against a Kid. Each membership has a `from_date` and `to_date`. On renewal, a new `Kid Membership` Entry will be made.
- `Library Transaction`  
Book transactions at the Library
- `Activity Transaction`  
Activity Transactions at the Activity Center
- `Caution Deposit Entry`  
All Caution deposit entries will come up here
- `Book Delivery Request`  
Made over a phone call or from the website through member's Cart
- `Crea Mind Settings`  
General Knobs like Caution Deposit to be collected and Fines to be collected.

## Reports
- `Expiring Kid Memberships` (with duration filters)
- `Pending Books`


All possible interactions with the system is listed below.

## Registrations & Membership
- Registering a new Kid who is not physically present at the Library  
The kids' parent will be asked to goto the `registration-form` on the website and fill in the details. Once done, a new entry in `Registration Request` will be created. The Admin will then make a call to the provided mobile number when free to further carry out the membership process. They will decide on a `Membership Plan` and the parent will be asked for CautionDeposit and MembershipFee and once the payment is done, the admin will click `Create Membership` on the `Registration Request` page. A dialog will open up asking for the `Membership Plan` decided, MembershipFee collected and CautionDeposit collected. Once successful, this will create a `Crea Mind Kid` entry and a `Kid Membership` entry.

- Registering a new Kid who is physically present at the Library  
A Tablet will be provided to the accompanying guardian showing the same `registration-form` which will create `Registration Request` entry. The Admin will discuss the plans and will continue same as above to make `Crea Mind Kid` & `Kid Membership` entry.

- Renewal of a Kid's Membership  
The Admin will know when a Kid's membership is about to expire from the report `Expiring Kid Memberships`. The renewal could be done over a Call or when the Parent comes next time to the Library. The Admin will goto the respective `Crea Mind Kid` and click on `Renew Membership`. A warning will be shown if there exists an Active Membership. The plan to renew, with their dates and membership-fee will be discussed and reported in the system to complete renewal. This will make another `Kid Membership` entry.

- When a Kid who has no Membership wants to get in for Activities and Library without having a commitment  
A simple `Activity Transaction` will be made to accommodate the Kid on an hourly basis

- Renewing a Membership after a long time (more than a year)  
`TODO`

- Closing a Membership & Refunding Caution Deposit  
`TODO`

### Caution Deposits
Library Caution Deposit: 1700/-  
Activities Caution Deposit: 1000/-  
Maximum Caution Deposit that will be collected: 1700/-

## Library Management
- Issue a Book from Library physically  
The admin could goto `Library Transaction` and make a new entry against the book selected. If the Kids current membership has free books left for the active time period, the amount will be zero. Otherwise it will be `CreaMindSettings.book_issue_charge`. The said amount will be collected from the Kid beforehand.
- Return a Book to Library physically  
The admin could goto `Library Transaction` and make new entry against the book selected. If there is any damage to the book, details of the damage could be entered in remarks section and amount specified in `CreaMindSettings.book_damage_fine` will be collected from the Kid.
- When a Lost Book was reported

### Fines
- Book damaged

## Activity Management
### Fines
- Activity / Book Damaged

## Book Delivery
- Making a Delivery Request for a Book


## Accounting Expenses and Income for the Business
- ERPNext Integration  
`TODO`
