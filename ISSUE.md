# Description
Create Reviewer Status card, showing review history for a submission.

PUT IMAGE HERE

# Todos
These are implementation suggestions. Developers are encouraged to discuss improvements.  
- [ ] Create a `ReviewerAssignment` table linked to a submission
- [ ] Add fields for reviewer name, email, status (invited / accepted / in progress / complete / declined), last updated at
- [ ] Create backend helper get_reviewer_assignments(submission_id) that fetches all reviewer assignments for a submission
- [ ] Group reviewer assignments by status before rendering card
- [ ] Build `ReviewerStatus` component with invited, accepted, in progress, completed columns
- [ ] Make declined portion collapsible
- [ ] Fill in with data from backend
- [ ] Style according to Figma

# Useful Links
* [PRD](https://docs.google.com/document/d/18EcTpBz2-W4_biBhKvTe7vhTkfdQRVhMzRl3Fj0GmlE/edit?tab=t.0)
* [Figma](https://www.figma.com/design/bd8WMp9IP3uovrzVE1b04r/Tech-Lead-Take-Home---Kotahi-Draft--Sp26-?node-id=2508-3200)

# Time Estimate
Dev fill this in
