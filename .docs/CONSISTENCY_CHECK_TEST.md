# How to Test Consistency Check Feature

## Quick Test (Without Resume Analysis)

1. **Go to Consistency Check tab** in your browser at http://localhost:3000

2. **Add a Q&A pair:**
   - **Question:** "Tell me about a project you led"
   - **Answer:** "I led a team of 5 developers to build an e-commerce platform. We completed it in 3 months and increased sales by 40%."

3. **Click "+ Add Another Q&A"**

4. **Add second Q&A:**
   - **Question:** "How many people were on your team?"
   - **Answer:** "I worked with a team of 3 developers on that project."
   
   (Notice the contradiction: first answer says 5, second says 3)

5. **Click "Check Consistency"** button

6. **You should see:**
   - Overall consistency score
   - Contradictions detected between the two answers
   - Analysis of the inconsistency

## Full Test (With Resume Analysis)

### Step 1: Analyze a Resume First
1. Go to **"Resume Analysis"** tab
2. Upload any PDF resume
3. Paste any job description (50+ characters)
4. Click "Analyze Resume"
5. Wait for results

### Step 2: Check Consistency
1. Go to **"Consistency Check"** tab
2. Add interview Q&As that relate to your resume
3. Click "Check Consistency"
4. See how your answers align with resume claims

## Sample Test Data

### Sample Interview Q&A #1:
**Q:** What was your role in your last project?
**A:** I was the lead developer managing a team of 5 engineers.

### Sample Interview Q&A #2:
**Q:** How long have you been coding?
**A:** I have 3 years of professional experience in software development.

### Sample Interview Q&A #3:
**Q:** What's your biggest achievement?
**A:** I built a mobile app that got 10,000 downloads in the first month.

## What to Expect

### Good Consistency (80-100%)
- ✅ No contradictions found
- ✅ Claims match across answers
- ✅ Timeline is consistent
- ✅ Numbers and metrics align

### Medium Consistency (60-79%)
- ⚠️ Minor inconsistencies
- ⚠️ Some weak claims
- ⚠️ Areas needing clarification

### Poor Consistency (<60%)
- ❌ Clear contradictions
- ❌ Timeline issues
- ❌ Conflicting numbers/facts
- ❌ Red flags for recruiters

## Troubleshooting

### "Failed to check consistency"
- ✅ Backend is running on port 8000
- ✅ Check browser console (F12) for errors
- ✅ Make sure you filled in both question and answer fields

### Empty Results
- Make sure you clicked "Check Consistency" button
- Check that you have at least one complete Q&A pair
- Look at browser console for error messages

### Button Not Working
- Refresh the page (F5)
- Make sure at least one Q&A has text in both fields
- Check if backend shows any errors in terminal

## Current Status
✅ Backend running on http://localhost:8000
✅ Frontend running on http://localhost:3000  
✅ Consistency Check now works with OR without resume analysis
✅ All text is visible in dark theme

---

**Just refresh your browser and try it now!** 🚀
