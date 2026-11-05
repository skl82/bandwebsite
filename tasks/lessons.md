# Lessons

## Don't call an external service "broken" without testing it

2026-11-05: the code review reported the Google Calendar link as unreadable by Google because
`T18000000` has two extra digits. Sebastian tested it and it worked (6pm show → 6pm event).
Google tolerates the malformed time. The code smell was real; the user-facing claim was a guess.

- Label findings as "verified" (I ran or measured it) vs "from reading the code".
- For third-party behavior (Google, Mailchimp, Spotify…), test it or say it's untested.
