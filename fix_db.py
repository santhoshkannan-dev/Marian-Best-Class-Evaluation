import sqlite3

conn = sqlite3.connect('backend/db.sqlite3')
cur = conn.cursor()

# Get mapping from title to new ID
cur.execute('SELECT id, title FROM users_criteriaitem')
items = cur.fetchall()
title_to_new_id = {title: id for id, title in items}

# Get mapping from old ID to title
old_id_to_title = {
    101: "S Grade Course",
    102: "A+ Grade Course",
    103: "A Grade Course",
    104: "Failed Course",
    105: "Class Pass Percentage",
    201: "NPTEL Course Completed",
    202: "MOOC Course Completed",
    203: "Other Recognized Online Course",
    301: "Offline Internship",
    302: "Online Internship",
    401: "JRF Qualified",
    402: "NET Qualified",
    403: "SET Qualified",
    501: "International Scholarship",
    502: "National Scholarship",
    503: "State Scholarship",
    601: "Research Publication",
    602: "Patent Filed or Published",
    603: "Funded or Approved Student Project",
    701: "Outside College Individual First Prize",
    702: "Outside College Individual Second Prize",
    703: "Outside College Individual Third Prize",
    704: "Outside College Group First Prize",
    705: "Outside College Group Second Prize",
    706: "Outside College Group Third Prize",
    707: "Inside College Individual First Prize",
    708: "Inside College Individual Second Prize",
    709: "Inside College Individual Third Prize",
    710: "Inside College Group First Prize",
    711: "Inside College Group Second Prize",
    712: "Inside College Group Third Prize",
    801: "Class Representative",
    802: "Association or Club Office Bearer",
    803: "Event Coordinator Role",
    901: "Department Level Program Organized",
    902: "Interdepartment Program Organized",
    903: "State or National Level Program Organized",
    1001: "NSS/NCC/Service Activity Participation",
    1002: "Community Outreach Activity",
    1003: "Blood Donation or Health Camp Participation",
    1101: "Placement Offer Received",
    1102: "Higher Studies Admission Secured",
    1103: "Professional Certification Completed",
    1104: "Career Workshop Participation",
    1201: "Complete Best Class File Submitted",
    1202: "Valid Proof Uploaded for All Claims",
    1203: "Late or Incomplete Documentation"
}

cur.execute('SELECT id, criteria_id FROM users_submission')
subs = cur.fetchall()

updated = 0
for sub_id, criteria_id in subs:
    try:
        title = old_id_to_title.get(int(criteria_id))
        if title:
            new_id = title_to_new_id.get(title)
            if new_id:
                cur.execute('UPDATE users_submission SET criteria_id = ? WHERE id = ?', (new_id, sub_id))
                updated += 1
    except:
        pass

conn.commit()
conn.close()
print(f"Updated {updated} submissions successfully.")
