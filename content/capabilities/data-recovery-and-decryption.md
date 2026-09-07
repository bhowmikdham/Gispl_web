---
title: Data recovery & decryption
label: Data recovery & decryption
practice: cyber-forensics-and-investigations
order: 6
tagline: Data recovered from failed, wiped, encrypted or damaged media — forensically, so what comes back can be trusted and, where needed, used as evidence.
summary: Forensic data recovery from failed drives, deleted and formatted volumes, damaged devices, corrupted databases and ransomware-encrypted systems — with decryption where keys or flaws allow, and evidence integrity maintained throughout.
icon: database
status: published
facts:
- label: Media
  value: HDD, SSD and NVMe, RAID and NAS arrays, mobile devices, memory cards, virtual disks, cloud snapshots, tapes and legacy media, databases and application stores
- label: Scenarios
  value: Hardware failure, accidental or deliberate deletion, formatting and wiping, corruption, ransomware encryption, forgotten or lost credentials, damaged and water-affected devices
- label: Method
  value: Forensic imaging before any recovery attempt; clean-room and firmware-level recovery where needed; decryption via recovered keys, known-flaw decryptors or lawful access; integrity verified by hash
- label: Applies to
  value: Businesses that have lost operational data, investigations that need deleted data, and organisations recovering from ransomware
appliesTo:
- A server, array or laptop has failed and the data on it was not backed up — or the backup has failed too.
- An employee deleted or wiped data, deliberately or not, and it is needed for operations or as evidence.
- Ransomware has encrypted systems and you need to know what can be recovered without paying.
- A database or application store is corrupted and the vendor's tools cannot repair it.
- A device is physically damaged — dropped, burnt, water-affected — and holds data that matters.
- Encrypted files or devices are locked behind credentials that are lost, or held by a former employee.
stakes:
- Recovery attempted by IT before forensic imaging often destroys what could have been recovered.
- Operational data lost is business stopped; the recovery window is measured in hours.
- Deleted evidence in an investigation is the evidence that matters most — deletion is itself informative.
- Paying a ransom for data that could have been recovered is money and a lesson wasted.
- Recovered data of unknown integrity is unusable for operations and inadmissible as evidence.
- Devices sent to non-forensic recovery services return without chain of custody and sometimes without the data.
steps:
- title: Assess and preserve
  text: The media received under chain of custody, its condition assessed, and a forensic image taken before any recovery is attempted — so nothing is lost by the attempt.
- title: Recover
  text: Logical recovery of deleted and formatted data; firmware and clean-room recovery for failed hardware; reconstruction of arrays and virtual disks; repair of corrupted databases and stores.
- title: Decrypt
  text: Where encryption is involved, recovery of keys from memory, configuration or backups; use of known-flaw decryptors for ransomware families that have them; lawful access to credentials where authorised.
- title: Verify
  text: Recovered data validated for integrity and completeness, hashed, and reconciled against what was expected.
- title: Deliver
  text: Data returned on clean media with a recovery report; where the matter is evidential, the forensic report and chain of custody accompany it.
- title: Prevent
  text: The cause established and the backup, retention or access control that would have prevented the loss recommended.
deliverables:
- title: Chain-of-custody and condition record
  text: For every item received.
- title: Forensic image
  text: Preserved before recovery, retained as required.
- title: Recovered data
  text: On clean media, verified and hashed.
- title: Recovery report
  text: What was recovered, what was not, and why.
- title: Evidential report where needed
  text: For investigations and proceedings.
- title: Prevention recommendations
  text: So the loss does not recur.
faq:
- q: Can you decrypt ransomware?
  a: Sometimes. Some ransomware families have flaws or leaked keys for which decryptors exist; some leave keys in memory or configuration that can be recovered if systems are preserved rather than rebuilt; and often, files the ransomware missed or partially encrypted can be recovered. We assess honestly before you consider paying — and we do not promise what the cryptography does not allow.
- q: What should we not do?
  a: Do not run recovery software on the failed media, do not reboot repeatedly, do not open a failed drive, do not rebuild a server that may hold evidence, and do not send media to a non-forensic recovery service if the matter may become legal. Image first, or call us before doing anything.
- q: Can you recover deliberately wiped data?
  a: Depending on the method. Simple deletion and formatting are usually recoverable; secure wiping less so, though traces — of the wiping itself, and of data in other locations — often remain and are themselves evidence. On SSDs, TRIM limits recovery, which is why speed matters.
- q: Is recovered data usable in court?
  a: If it is recovered forensically — imaged first, chain of custody maintained, integrity verified by hash, method documented. That is how we work whether or not the matter is initially legal, because it often becomes so.
- q: How fast?
  a: Assessment within a day of receipt; logical recovery in days; hardware and clean-room recovery longer depending on damage. Operational emergencies are prioritised.
related:
- digital-forensics
- ransomware-detection-and-response
- bcp-dr-and-mock-drills
industries:
- bfsi
- manufacturing
- pharma-healthcare
- government
- education-hospitality
insights:
- after-the-breach-what-digital-forensics-actually-recovers
seo:
  title: Forensic data recovery and decryption — GISPL
  description: Forensic recovery from failed, deleted, wiped, damaged or ransomware-encrypted media — imaged first, integrity verified, usable as evidence.
  noindex: false
---

Data is lost in predictable ways: a drive fails and the backup was never tested; an employee deletes what they should not, by accident or on purpose; a device is dropped, burnt or drowned; a database corrupts beyond the vendor's repair tools; ransomware encrypts everything it can reach. In each case the question is whether the data can come back, and the answer depends heavily on what happens in the first hours — because recovery attempted by well-meaning IT on the original media is the most common reason data that could have been recovered is not.

Forensic data recovery begins by imaging the media before any recovery is attempted, so that nothing is lost by the attempt and the original is preserved. Recovery then proceeds at whatever level the damage requires: logical recovery of deleted and formatted data, firmware-level and clean-room recovery for failed hardware, reconstruction of RAID arrays and virtual disks, repair of corrupted databases. Where encryption is involved, keys are recovered from memory, configuration or backups where they exist, decryptors are applied for ransomware families that have flaws or leaked keys, and lawful access is used where credentials are held by a former employee and the organisation is entitled to them. Everything recovered is verified for integrity and hashed.

## Recovery as evidence

Because GISPL's recovery practice sits within forensics, recovered data is handled as evidence whether or not the matter is initially legal — it often becomes so. Chain of custody is maintained, the method documented, and the recovery report can be accompanied by a forensic report when deletion, wiping or encryption is itself the subject of an investigation. The deleted spreadsheet is often the most important document in a fraud case, and the fact of its deletion is informative in itself. For ransomware victims, the assessment of what can be recovered without paying is made honestly and before the payment decision — and the cause of every loss is established, so that the backup, retention or control that would have prevented it is recommended rather than discovered again.
