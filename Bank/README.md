**Assignment 1: Password Dictionary Scraper (scrapePws.js)**

The goal of this assignment is to gather the 10,000 most common passwords from a website and create an array of alphanumeric strings. The collected passwords are stored in mcupws.json for future use. A progress bar displays the scraping progress without hindering the process. In case of interruption, progress is recorded to resume scraping from the last entry.

Deliverables:

scrapePws.js: Scrapes and filters passwords, storing them in an array and JSON file.
mcupws.json: JSON file containing the filtered password array.

**Assignment 2: Proof of Concept Part A (genHash4RandPws.js)**

In this assignment, a subset of 2,000 password hashes is generated for testing purposes. The hashes are a mix of random, empty, and alphanumeric strings. The goal is to demonstrate code functionality before handling the real password file.

Deliverables:

genHash4RandPws.js: Generates a file containing 2,000 password hashes.

**Assignment 3: Proof of Concept Part B (crackPwHashes.js)**

Building on the previous assignment, this task involves cracking password hashes using synchronous hash matching within a single thread. Passwords are matched with their respective hashes, and the results are recorded in peer.2K.hashes.answers.txt.

Deliverables:

crackPwHashes.js: Cracks password hashes and records results.
peer.2K.hashes.answers.txt: File containing cracked password hashes and their corresponding passwords.

**Assignment 4: Multi-Core Hash Cracking (BankP)**

In this assignment, password hashes are cracked using the Node.js Cluster module to leverage multi-core processing. The code utilizes multiple cores to improve efficiency and performance while cracking password hashes. The progress and utilization of each core are monitored, and the cracked hashes are recorded in hashes.answers.txt.

Deliverables:

crackMultiCore.js: Cracks password hashes using multi-core processing.
hashes.answers.txt: File containing cracked password hashes and their corresponding passwords.

**Assignment 5: Worker Threads Hash Cracking (BantT)**

Expanding on previous assignments, worker threads are used to improve hash cracking efficiency further. Hashes are matched with their passwords using worker threads, and the results are recorded in a file. The code and execution time are provided in Canvas comments.

Deliverables:

JS code files implementing hash cracking using worker threads.
File containing cracked password hashes and their corresponding passwords.
Canvas comments detailing code execution time.
